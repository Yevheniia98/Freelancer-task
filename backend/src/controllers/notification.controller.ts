import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { NotificationService, CreateNotificationDto, NotificationQueryOptions } from '../services/notification.service';
import { NotificationType, NotificationPriority } from '../models/notification.entity';

// Extend Request to include user info from auth middleware
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    [key: string]: any;
  };
}

export class NotificationController {
  private notificationService: NotificationService;

  constructor() {
    this.notificationService = NotificationService.getInstance();
  }

  // Helper method to handle validation errors
  private handleValidationErrors(req: Request, res: Response): boolean {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
      return true;
    }
    return false;
  }

  /**
   * Get user notifications with pagination and filtering
   * GET /api/notifications
   */
  getUserNotifications = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      const options: NotificationQueryOptions = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 20,
        unreadOnly: req.query.unreadOnly === 'true',
        type: req.query.type as NotificationType,
        priority: req.query.priority as NotificationPriority,
        sortBy: (req.query.sortBy as 'createdAt' | 'priority') || 'createdAt',
        sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc'
      };

      const result = await this.notificationService.getUserNotifications(userId, options);

      res.json({
        success: true,
        message: 'Notifications retrieved successfully',
        data: result.notifications,
        pagination: {
          page: options.page,
          limit: options.limit,
          total: result.total,
          hasMore: result.hasMore
        }
      });
    } catch (error: any) {
      console.error('Get notifications error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve notifications'
      });
    }
  };

  /**
   * Get notification statistics for the user
   * GET /api/notifications/stats
   */
  getNotificationStats = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      const stats = await this.notificationService.getNotificationStats(userId);

      res.json({
        success: true,
        message: 'Notification statistics retrieved successfully',
        data: stats
      });
    } catch (error: any) {
      console.error('Get notification stats error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve notification statistics'
      });
    }
  };

  /**
   * Create a new notification
   * POST /api/notifications
   */
  createNotification = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (this.handleValidationErrors(req, res)) return;

      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      const createNotificationDto: CreateNotificationDto = {
        userId: req.body.targetUserId || userId, // Allow creating notifications for other users if specified
        title: req.body.title,
        message: req.body.message,
        type: req.body.type,
        priority: req.body.priority || NotificationPriority.MEDIUM,
        metadata: req.body.metadata || {}
      };

      const notification = await this.notificationService.createNotification(createNotificationDto);

      res.status(201).json({
        success: true,
        message: 'Notification created successfully',
        data: notification
      });
    } catch (error: any) {
      console.error('Create notification error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to create notification'
      });
    }
  };

  /**
   * Get a specific notification by ID
   * GET /api/notifications/:id
   */
  getNotificationById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      const notificationId = req.params.id;
      const notification = await this.notificationService.getNotificationById(notificationId, userId);

      if (!notification) {
        res.status(404).json({
          success: false,
          message: 'Notification not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Notification retrieved successfully',
        data: notification
      });
    } catch (error: any) {
      console.error('Get notification by ID error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve notification'
      });
    }
  };

  /**
   * Mark a notification as read
   * PUT /api/notifications/:id/read
   */
  markAsRead = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      const notificationId = req.params.id;
      const notification = await this.notificationService.markAsRead(notificationId, userId);

      if (!notification) {
        res.status(404).json({
          success: false,
          message: 'Notification not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Notification marked as read',
        data: notification
      });
    } catch (error: any) {
      console.error('Mark as read error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to mark notification as read'
      });
    }
  };

  /**
   * Mark all notifications as read
   * PUT /api/notifications/read-all
   */
  markAllAsRead = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      const count = await this.notificationService.markAllAsRead(userId);

      res.json({
        success: true,
        message: `${count} notifications marked as read`,
        data: { count }
      });
    } catch (error: any) {
      console.error('Mark all as read error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to mark all notifications as read'
      });
    }
  };

  /**
   * Delete a notification
   * DELETE /api/notifications/:id
   */
  deleteNotification = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      const notificationId = req.params.id;
      const deleted = await this.notificationService.deleteNotification(notificationId, userId);

      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'Notification not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Notification deleted successfully'
      });
    } catch (error: any) {
      console.error('Delete notification error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to delete notification'
      });
    }
  };

  /**
   * Archive a notification
   * PUT /api/notifications/:id/archive
   */
  archiveNotification = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      const notificationId = req.params.id;
      const notification = await this.notificationService.archiveNotification(notificationId, userId);

      if (!notification) {
        res.status(404).json({
          success: false,
          message: 'Notification not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Notification archived successfully',
        data: notification
      });
    } catch (error: any) {
      console.error('Archive notification error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to archive notification'
      });
    }
  };

  /**
   * Clear all notifications (archive them)
   * POST /api/notifications/clear-all
   */
  clearAllNotifications = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      const count = await this.notificationService.clearAllNotifications(userId);

      res.json({
        success: true,
        message: `${count} notifications cleared successfully`,
        data: { count }
      });
    } catch (error: any) {
      console.error('Clear all notifications error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to clear all notifications'
      });
    }
  };

  /**
   * Create different types of notifications - helper endpoints
   */

  /**
   * Create a project notification
   * POST /api/notifications/project
   */
  createProjectNotification = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (this.handleValidationErrors(req, res)) return;

      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      const { projectId, title, message, actionUrl } = req.body;
      const notification = await this.notificationService.createProjectNotification(
        userId,
        projectId,
        title,
        message,
        actionUrl
      );

      res.status(201).json({
        success: true,
        message: 'Project notification created successfully',
        data: notification
      });
    } catch (error: any) {
      console.error('Create project notification error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to create project notification'
      });
    }
  };

  /**
   * Create a billing notification
   * POST /api/notifications/billing
   */
  createBillingNotification = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (this.handleValidationErrors(req, res)) return;

      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      const { amount, dueDate, title, message } = req.body;
      const notification = await this.notificationService.createBillingNotification(
        userId,
        amount,
        new Date(dueDate),
        title,
        message
      );

      res.status(201).json({
        success: true,
        message: 'Billing notification created successfully',
        data: notification
      });
    } catch (error: any) {
      console.error('Create billing notification error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to create billing notification'
      });
    }
  };

  /**
   * Health check endpoint
   * GET /api/notifications/health
   */
  healthCheck = async (req: Request, res: Response): Promise<void> => {
    res.json({
      success: true,
      message: 'Notification service is healthy',
      timestamp: new Date().toISOString()
    });
  };
}