import { Response } from 'express';
import { ProjectChatMessage } from '../models/project-chat.model';
import { ProjectEntity } from '../models/project.entity';
import { User } from '../models/user.model';
import { AuthRequest } from '../middleware/permissions.middleware';
import { SocketService } from '../services/socket.service';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

export class ProjectChatController {
  /**
   * Get chat messages for a project
   */
  getMessages = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { projectId } = req.params;
      const { limit = 50, skip = 0 } = req.query;
      const userId = req.user?.id;

      // Verify user has access to this project
      const project = await ProjectEntity.findById(projectId);
      if (!project) {
        res.status(404).json({
          success: false,
          message: 'Project not found'
        });
        return;
      }

      // Check if user is project owner or team member
      const isOwner = project.projectOwner?.toString() === userId?.toString();
      const isMember = project.teamMembers?.some(
        (member: any) => member.userId?.toString() === userId?.toString()
      );

      if (!isOwner && !isMember) {
        res.status(403).json({
          success: false,
          message: 'You do not have access to this project chat'
        });
        return;
      }

      // Get messages
      const messages = await ProjectChatMessage.find({ projectId })
        .sort({ createdAt: -1 })
        .limit(Number(limit))
        .skip(Number(skip));

      // Reverse to show oldest first
      messages.reverse();

      res.json({
        success: true,
        data: messages,
        total: await ProjectChatMessage.countDocuments({ projectId })
      });
    } catch (error: any) {
      console.error('Get messages error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to get messages'
      });
    }
  };

  /**
   * Send a chat message
   */
  sendMessage = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { projectId } = req.params;
      const { message } = req.body;
      const userId = req.user?.id;

      if (!message || !message.trim()) {
        res.status(400).json({
          success: false,
          message: 'Message is required'
        });
        return;
      }

      // Verify user has access to this project
      const project = await ProjectEntity.findById(projectId);
      if (!project) {
        res.status(404).json({
          success: false,
          message: 'Project not found'
        });
        return;
      }

      // Check if user is project owner or team member
      const isOwner = project.projectOwner?.toString() === userId?.toString();
      const isMember = project.teamMembers?.some(
        (member: any) => member.userId?.toString() === userId?.toString()
      );

      if (!isOwner && !isMember) {
        res.status(403).json({
          success: false,
          message: 'You do not have access to this project chat'
        });
        return;
      }

      // Get user info
      const user = await User.findById(userId);
      if (!user) {
        res.status(401).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      const userName = user.firstName && user.lastName
        ? `${user.firstName} ${user.lastName}`
        : user.email.split('@')[0];

      // Handle file upload if present
      let fileData = {};
      if (req.file) {
        fileData = {
          fileUrl: `/uploads/${req.file.filename}`,
          fileName: req.file.originalname,
          fileSize: req.file.size,
          fileType: req.file.mimetype
        };
      }

      // Create message
      const chatMessage = await ProjectChatMessage.create({
        projectId,
        userId: user._id,
        userName,
        userEmail: user.email,
        message: message.trim(),
        ...fileData
      });

      console.log('✅ Chat message created:', {
        projectId,
        userName,
        hasFile: !!req.file
      });

      // Broadcast to all users in the project room via Socket.IO
      const socketService = SocketService.getInstance();
      if (socketService) {
        const io = socketService.getIO();
        io.to(`project:${projectId}`).emit('message:new', chatMessage);
      }

      res.status(201).json({
        success: true,
        data: chatMessage
      });
    } catch (error: any) {
      console.error('Send message error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to send message'
      });
    }
  };

  /**
   * Delete a chat message (only own messages)
   */
  deleteMessage = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { projectId, messageId } = req.params;
      const userId = req.user?.id;

      const message = await ProjectChatMessage.findById(messageId);
      if (!message) {
        res.status(404).json({
          success: false,
          message: 'Message not found'
        });
        return;
      }

      // Check if user owns the message
      if (message.userId.toString() !== userId?.toString()) {
        res.status(403).json({
          success: false,
          message: 'You can only delete your own messages'
        });
        return;
      }

      // Delete associated file if exists
      if (message.fileUrl) {
        const filePath = path.join(__dirname, '../../', message.fileUrl);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      await ProjectChatMessage.findByIdAndDelete(messageId);

      res.json({
        success: true,
        message: 'Message deleted successfully'
      });
    } catch (error: any) {
      console.error('Delete message error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to delete message'
      });
    }
  };
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'chat-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req: any, file: any, cb: any) => {
  // Allow common file types
  const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt|zip|rar|mp4|mov|avi/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Allowed: images, PDFs, documents, videos, archives'));
  }
};

export const chatUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});
