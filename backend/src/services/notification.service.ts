import { Notification, INotification, NotificationType, NotificationPriority } from '../models/notification.entity';
import { EmailService } from './email.service';

export interface CreateNotificationDto {
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  priority?: NotificationPriority;
  metadata?: {
    projectId?: string;
    taskId?: string;
    clientId?: string;
    meetingId?: string;
    amount?: number;
    dueDate?: Date;
    actionUrl?: string;
    category?: string;
    icon?: string;
    [key: string]: any;
  };
}

export interface NotificationQueryOptions {
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
  type?: NotificationType;
  priority?: NotificationPriority;
  sortBy?: 'createdAt' | 'priority';
  sortOrder?: 'asc' | 'desc';
}

export interface NotificationStats {
  total: number;
  unread: number;
  byType: Record<NotificationType, number>;
  byPriority: Record<NotificationPriority, number>;
}

export class NotificationService {
  private static instance: NotificationService;

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  /**
   * Create a new notification
   */
  async createNotification(data: CreateNotificationDto): Promise<INotification> {
    try {
      const notification = new Notification({
        userId: data.userId,
        title: data.title,
        message: data.message,
        type: data.type,
        priority: data.priority || NotificationPriority.MEDIUM,
        metadata: data.metadata || {},
        isRead: false,
        isArchived: false
      });

      const savedNotification = await notification.save();
      
      // Optionally send email notification for high priority items
      if (data.priority === NotificationPriority.URGENT || data.priority === NotificationPriority.HIGH) {
        await this.sendEmailNotification(savedNotification);
      }

      console.log(`✅ Notification created: ${data.title} for user ${data.userId}`);
      return savedNotification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw new Error('Failed to create notification');
    }
  }

  /**
   * Get notifications for a user with pagination and filtering
   */
  async getUserNotifications(
    userId: string, 
    options: NotificationQueryOptions = {}
  ): Promise<{ notifications: INotification[]; total: number; hasMore: boolean }> {
    try {
      const {
        page = 1,
        limit = 20,
        unreadOnly = false,
        type,
        priority,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = options;

      const query: any = { 
        userId, 
        isArchived: false 
      };

      if (unreadOnly) {
        query.isRead = false;
      }

      if (type) {
        query.type = type;
      }

      if (priority) {
        query.priority = priority;
      }

      const sortOption: any = {};
      sortOption[sortBy] = sortOrder === 'desc' ? -1 : 1;

      const skip = (page - 1) * limit;

      const [notifications, total] = await Promise.all([
        Notification.find(query)
          .sort(sortOption)
          .skip(skip)
          .limit(limit)
          .lean(),
        Notification.countDocuments(query)
      ]);

      const hasMore = skip + notifications.length < total;

      return {
        notifications: notifications as INotification[],
        total,
        hasMore
      };
    } catch (error) {
      console.error('Error fetching user notifications:', error);
      throw new Error('Failed to fetch notifications');
    }
  }

  /**
   * Get notification statistics for a user
   */
  async getNotificationStats(userId: string): Promise<NotificationStats> {
    try {
      const [
        total,
        unread,
        typeStats,
        priorityStats
      ] = await Promise.all([
        Notification.countDocuments({ userId, isArchived: false }),
        Notification.countDocuments({ userId, isRead: false, isArchived: false }),
        Notification.aggregate([
          { $match: { userId, isArchived: false } },
          { $group: { _id: '$type', count: { $sum: 1 } } }
        ]),
        Notification.aggregate([
          { $match: { userId, isArchived: false } },
          { $group: { _id: '$priority', count: { $sum: 1 } } }
        ])
      ]);

      const byType = {} as Record<NotificationType, number>;
      typeStats.forEach(stat => {
        byType[stat._id as NotificationType] = stat.count;
      });

      const byPriority = {} as Record<NotificationPriority, number>;
      priorityStats.forEach(stat => {
        byPriority[stat._id as NotificationPriority] = stat.count;
      });

      return {
        total,
        unread,
        byType,
        byPriority
      };
    } catch (error) {
      console.error('Error fetching notification stats:', error);
      throw new Error('Failed to fetch notification statistics');
    }
  }

  /**
   * Mark a notification as read
   */
  async markAsRead(notificationId: string, userId: string): Promise<INotification | null> {
    try {
      const notification = await Notification.findOne({
        _id: notificationId,
        userId
      });

      if (!notification) {
        return null;
      }

      if (!notification.isRead) {
        notification.isRead = true;
        notification.readAt = new Date();
        await notification.save();
        console.log(`✅ Notification marked as read: ${notificationId}`);
      }

      return notification;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw new Error('Failed to mark notification as read');
    }
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId: string): Promise<number> {
    try {
      const result = await Notification.updateMany(
        { userId, isRead: false, isArchived: false },
        { 
          isRead: true, 
          readAt: new Date() 
        }
      );

      console.log(`✅ Marked ${result.modifiedCount} notifications as read for user ${userId}`);
      return result.modifiedCount;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw new Error('Failed to mark all notifications as read');
    }
  }

  /**
   * Delete a notification
   */
  async deleteNotification(notificationId: string, userId: string): Promise<boolean> {
    try {
      const result = await Notification.deleteOne({
        _id: notificationId,
        userId
      });

      if (result.deletedCount > 0) {
        console.log(`✅ Notification deleted: ${notificationId}`);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw new Error('Failed to delete notification');
    }
  }

  /**
   * Archive a notification
   */
  async archiveNotification(notificationId: string, userId: string): Promise<INotification | null> {
    try {
      const notification = await Notification.findOne({
        _id: notificationId,
        userId
      });

      if (!notification) {
        return null;
      }

      notification.isArchived = true;
      notification.archivedAt = new Date();
      await notification.save();

      console.log(`✅ Notification archived: ${notificationId}`);
      return notification;
    } catch (error) {
      console.error('Error archiving notification:', error);
      throw new Error('Failed to archive notification');
    }
  }

  /**
   * Clear all notifications for a user (mark as archived)
   */
  async clearAllNotifications(userId: string): Promise<number> {
    try {
      const result = await Notification.updateMany(
        { userId, isArchived: false },
        { 
          isArchived: true, 
          archivedAt: new Date() 
        }
      );

      console.log(`✅ Cleared ${result.modifiedCount} notifications for user ${userId}`);
      return result.modifiedCount;
    } catch (error) {
      console.error('Error clearing all notifications:', error);
      throw new Error('Failed to clear all notifications');
    }
  }

  /**
   * Get a single notification by ID
   */
  async getNotificationById(notificationId: string, userId: string): Promise<INotification | null> {
    try {
      const notification = await Notification.findOne({
        _id: notificationId,
        userId
      });

      return notification;
    } catch (error) {
      console.error('Error fetching notification by ID:', error);
      throw new Error('Failed to fetch notification');
    }
  }

  /**
   * Create system-wide notification for maintenance, updates, etc.
   */
  async createSystemNotification(
    title: string, 
    message: string, 
    priority: NotificationPriority = NotificationPriority.MEDIUM
  ): Promise<INotification[]> {
    try {
      // For now, we'll create for all users. In production, you might want to batch this
      // or use a more efficient approach like a system-wide notification collection
      const notifications: INotification[] = [];
      
      // This is a simplified version - in production you'd want to batch this operation
      console.log(`📢 Creating system notification: ${title}`);
      
      return notifications;
    } catch (error) {
      console.error('Error creating system notification:', error);
      throw new Error('Failed to create system notification');
    }
  }

  /**
   * Helper method to create different types of notifications
   */
  async createProjectNotification(
    userId: string,
    projectId: string,
    title: string,
    message: string,
    actionUrl?: string
  ): Promise<INotification> {
    return this.createNotification({
      userId,
      title,
      message,
      type: NotificationType.PROJECT,
      priority: NotificationPriority.MEDIUM,
      metadata: {
        projectId,
        actionUrl,
        icon: 'mdi-folder-plus',
        category: 'project'
      }
    });
  }

  async createTaskNotification(
    userId: string,
    taskId: string,
    title: string,
    message: string,
    priority: NotificationPriority = NotificationPriority.MEDIUM
  ): Promise<INotification> {
    return this.createNotification({
      userId,
      title,
      message,
      type: NotificationType.TASK,
      priority,
      metadata: {
        taskId,
        icon: 'mdi-check-circle',
        category: 'task'
      }
    });
  }

  async createBillingNotification(
    userId: string,
    amount: number,
    dueDate: Date,
    title: string,
    message: string
  ): Promise<INotification> {
    return this.createNotification({
      userId,
      title,
      message,
      type: NotificationType.BILLING,
      priority: NotificationPriority.HIGH,
      metadata: {
        amount,
        dueDate,
        icon: 'mdi-credit-card-clock',
        category: 'billing'
      }
    });
  }

  async createMeetingNotification(
    userId: string,
    meetingId: string,
    title: string,
    message: string,
    meetingDate: Date
  ): Promise<INotification> {
    return this.createNotification({
      userId,
      title,
      message,
      type: NotificationType.MEETING,
      priority: NotificationPriority.HIGH,
      metadata: {
        meetingId,
        dueDate: meetingDate,
        icon: 'mdi-calendar-plus',
        category: 'meeting'
      }
    });
  }

  /**
   * Clean up old archived notifications
   */
  async cleanupOldNotifications(daysOld: number = 30): Promise<number> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const result = await Notification.deleteMany({
        createdAt: { $lt: cutoffDate },
        isArchived: true
      });

      console.log(`🧹 Cleaned up ${result.deletedCount} old notifications`);
      return result.deletedCount;
    } catch (error) {
      console.error('Error cleaning up old notifications:', error);
      throw new Error('Failed to cleanup old notifications');
    }
  }

  /**
   * Send email notification for high priority notifications
   */
  private async sendEmailNotification(notification: INotification): Promise<void> {
    try {
      // This would integrate with your email service
      // For now, just log that we would send an email
      console.log(`📧 Would send email for high priority notification: ${notification.title}`);
      
      // Example integration with EmailService:
      // const emailService = new EmailService();
      // await emailService.sendNotificationEmail(notification);
    } catch (error) {
      console.error('Error sending email notification:', error);
      // Don't throw here as we don't want to fail notification creation due to email issues
    }
  }
}