import { Response } from 'express';
import { AuthRequest } from '../middleware/permissions.middleware';
import { ChatMessage } from '../models/chat-message.model';
import { ProjectEntity } from '../models/project.entity';
import mongoose from 'mongoose';

export class ChatController {
  /**
   * Get chat messages for a project
   * GET /api/projects/:projectId/messages
   */
  getMessages = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { projectId } = req.params;
      const userId = (req.user as any)?._id?.toString() || req.user?.id;
      const limit = parseInt(req.query.limit as string) || 50;

      if (!mongoose.Types.ObjectId.isValid(projectId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid project ID'
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

      // Check if user is owner or team member
      const isOwner = project.projectOwner?.toString() === userId;
      const isTeamMember = project.teamMembers?.some(
        (member: any) => member.userId?.toString() === userId
      );

      if (!isOwner && !isTeamMember) {
        res.status(403).json({
          success: false,
          message: 'Access denied. You are not a member of this project.'
        });
        return;
      }

      // Get messages
      const messages = await ChatMessage.find({ projectId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();

      // Reverse to show oldest first
      messages.reverse();

      res.json({
        success: true,
        messages,
        count: messages.length
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
   * POST /api/projects/:projectId/messages
   */
  sendMessage = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { projectId } = req.params;
      const { message, fileUrl, fileName, fileSize } = req.body;
      const userId = (req.user as any)?._id?.toString() || req.user?.id;
      const userName = (req.user as any)?.name || req.user?.email || 'Unknown User';
      const userEmail = req.user?.email || '';

      if (!mongoose.Types.ObjectId.isValid(projectId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid project ID'
        });
        return;
      }

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

      // Check if user is owner or team member
      const isOwner = project.projectOwner?.toString() === userId;
      const isTeamMember = project.teamMembers?.some(
        (member: any) => member.userId?.toString() === userId
      );

      if (!isOwner && !isTeamMember) {
        res.status(403).json({
          success: false,
          message: 'Access denied. You are not a member of this project.'
        });
        return;
      }

      // Create message
      const chatMessage = await ChatMessage.create({
        projectId,
        userId,
        userName,
        userEmail,
        message: message.trim(),
        fileUrl: fileUrl || null,
        fileName: fileName || null,
        fileSize: fileSize || null
      });

      res.status(201).json({
        success: true,
        message: chatMessage
      });
    } catch (error: any) {
      console.error('Send message error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to send message'
      });
    }
  };
}
