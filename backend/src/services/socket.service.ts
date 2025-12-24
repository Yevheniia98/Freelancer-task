import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HTTPServer } from 'http';
import jwt from 'jsonwebtoken';
import { ChatMessage } from '../models/chat-message.model';
import { ProjectEntity } from '../models/project.entity';
import mongoose from 'mongoose';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  userEmail?: string;
  userName?: string;
}

export class SocketService {
  private io: SocketIOServer;
  private static instance: SocketService | null = null;

  constructor(server: HTTPServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3030',
        methods: ['GET', 'POST'],
        credentials: true
      },
      transports: ['websocket', 'polling']
    });

    SocketService.instance = this;
    this.initializeSocketHandlers();
    console.log('✅ Socket.IO initialized');
  }

  public static getInstance(): SocketService | null {
    return SocketService.instance;
  }

  public getIO(): SocketIOServer {
    return this.io;
  }

  private initializeSocketHandlers() {
    // Authentication middleware
    this.io.use(async (socket: AuthenticatedSocket, next) => {
      try {
        const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];

        if (!token) {
          return next(new Error('Authentication token missing'));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
        socket.userId = decoded.userId || decoded.id;
        socket.userEmail = decoded.email;
        socket.userName = decoded.name || decoded.email;

        next();
      } catch (error) {
        console.error('Socket authentication error:', error);
        next(new Error('Authentication failed'));
      }
    });

    // Connection handler
    this.io.on('connection', (socket: AuthenticatedSocket) => {
      console.log(`✅ User connected: ${socket.userId}`);

      // Join project room
      socket.on('join:project', async (projectId: string) => {
        try {
          if (!mongoose.Types.ObjectId.isValid(projectId)) {
            socket.emit('error', { message: 'Invalid project ID' });
            return;
          }

          // Verify user has access to this project
          const project = await ProjectEntity.findById(projectId);
          if (!project) {
            socket.emit('error', { message: 'Project not found' });
            return;
          }

          const isOwner = project.projectOwner?.toString() === socket.userId;
          const isTeamMember = project.teamMembers?.some(
            (member: any) => member.userId?.toString() === socket.userId
          );

          if (!isOwner && !isTeamMember) {
            socket.emit('error', { message: 'Access denied' });
            return;
          }

          socket.join(`project:${projectId}`);
          console.log(`User ${socket.userId} joined project ${projectId}`);
          
          socket.emit('joined:project', { projectId });
        } catch (error) {
          console.error('Join project error:', error);
          socket.emit('error', { message: 'Failed to join project' });
        }
      });

      // Leave project room
      socket.on('leave:project', (projectId: string) => {
        socket.leave(`project:${projectId}`);
        console.log(`User ${socket.userId} left project ${projectId}`);
      });

      // Send message
      socket.on('message:send', async (data: {
        projectId: string;
        message: string;
        fileUrl?: string;
        fileName?: string;
        fileSize?: number;
      }) => {
        try {
          const { projectId, message, fileUrl, fileName, fileSize } = data;

          if (!mongoose.Types.ObjectId.isValid(projectId)) {
            socket.emit('error', { message: 'Invalid project ID' });
            return;
          }

          if (!message || !message.trim()) {
            socket.emit('error', { message: 'Message is required' });
            return;
          }

          // Verify user has access
          const project = await ProjectEntity.findById(projectId);
          if (!project) {
            socket.emit('error', { message: 'Project not found' });
            return;
          }

          const isOwner = project.projectOwner?.toString() === socket.userId;
          const isTeamMember = project.teamMembers?.some(
            (member: any) => member.userId?.toString() === socket.userId
          );

          if (!isOwner && !isTeamMember) {
            socket.emit('error', { message: 'Access denied' });
            return;
          }

          // Create and save message
          const chatMessage = await ChatMessage.create({
            projectId,
            userId: socket.userId,
            userName: socket.userName || 'Unknown User',
            userEmail: socket.userEmail || '',
            message: message.trim(),
            fileUrl: fileUrl || null,
            fileName: fileName || null,
            fileSize: fileSize || null
          });

          // Broadcast to all users in the project room
          this.io.to(`project:${projectId}`).emit('message:new', {
            _id: chatMessage._id,
            projectId: chatMessage.projectId,
            userId: chatMessage.userId,
            userName: chatMessage.userName,
            userEmail: chatMessage.userEmail,
            message: chatMessage.message,
            fileUrl: chatMessage.fileUrl,
            fileName: chatMessage.fileName,
            fileSize: chatMessage.fileSize,
            createdAt: chatMessage.createdAt,
            updatedAt: chatMessage.updatedAt
          });

          console.log(`Message sent in project ${projectId} by user ${socket.userId}`);
        } catch (error) {
          console.error('Send message error:', error);
          socket.emit('error', { message: 'Failed to send message' });
        }
      });

      // User typing indicator
      socket.on('typing:start', (data: { projectId: string }) => {
        socket.to(`project:${data.projectId}`).emit('user:typing', {
          userId: socket.userId,
          userName: socket.userName
        });
      });

      socket.on('typing:stop', (data: { projectId: string }) => {
        socket.to(`project:${data.projectId}`).emit('user:stopped-typing', {
          userId: socket.userId
        });
      });

      // Disconnect handler
      socket.on('disconnect', () => {
        console.log(`❌ User disconnected: ${socket.userId}`);
      });
    });
  }
}
