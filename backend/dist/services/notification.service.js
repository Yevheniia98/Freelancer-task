"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const notification_entity_1 = require("../models/notification.entity");
class NotificationService {
    static getInstance() {
        if (!NotificationService.instance) {
            NotificationService.instance = new NotificationService();
        }
        return NotificationService.instance;
    }
    /**
     * Create a new notification
     */
    async createNotification(data) {
        try {
            const notification = new notification_entity_1.Notification({
                userId: data.userId,
                title: data.title,
                message: data.message,
                type: data.type,
                priority: data.priority || notification_entity_1.NotificationPriority.MEDIUM,
                metadata: data.metadata || {},
                isRead: false,
                isArchived: false
            });
            const savedNotification = await notification.save();
            // Optionally send email notification for high priority items
            if (data.priority === notification_entity_1.NotificationPriority.URGENT || data.priority === notification_entity_1.NotificationPriority.HIGH) {
                await this.sendEmailNotification(savedNotification);
            }
            console.log(`✅ Notification created: ${data.title} for user ${data.userId}`);
            return savedNotification;
        }
        catch (error) {
            console.error('Error creating notification:', error);
            throw new Error('Failed to create notification');
        }
    }
    /**
     * Get notifications for a user with pagination and filtering
     */
    async getUserNotifications(userId, options = {}) {
        try {
            const { page = 1, limit = 20, unreadOnly = false, type, priority, sortBy = 'createdAt', sortOrder = 'desc' } = options;
            const query = {
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
            const sortOption = {};
            sortOption[sortBy] = sortOrder === 'desc' ? -1 : 1;
            const skip = (page - 1) * limit;
            const [notifications, total] = await Promise.all([
                notification_entity_1.Notification.find(query)
                    .sort(sortOption)
                    .skip(skip)
                    .limit(limit)
                    .lean(),
                notification_entity_1.Notification.countDocuments(query)
            ]);
            const hasMore = skip + notifications.length < total;
            return {
                notifications: notifications,
                total,
                hasMore
            };
        }
        catch (error) {
            console.error('Error fetching user notifications:', error);
            throw new Error('Failed to fetch notifications');
        }
    }
    /**
     * Get notification statistics for a user
     */
    async getNotificationStats(userId) {
        try {
            const [total, unread, typeStats, priorityStats] = await Promise.all([
                notification_entity_1.Notification.countDocuments({ userId, isArchived: false }),
                notification_entity_1.Notification.countDocuments({ userId, isRead: false, isArchived: false }),
                notification_entity_1.Notification.aggregate([
                    { $match: { userId, isArchived: false } },
                    { $group: { _id: '$type', count: { $sum: 1 } } }
                ]),
                notification_entity_1.Notification.aggregate([
                    { $match: { userId, isArchived: false } },
                    { $group: { _id: '$priority', count: { $sum: 1 } } }
                ])
            ]);
            const byType = {};
            typeStats.forEach(stat => {
                byType[stat._id] = stat.count;
            });
            const byPriority = {};
            priorityStats.forEach(stat => {
                byPriority[stat._id] = stat.count;
            });
            return {
                total,
                unread,
                byType,
                byPriority
            };
        }
        catch (error) {
            console.error('Error fetching notification stats:', error);
            throw new Error('Failed to fetch notification statistics');
        }
    }
    /**
     * Mark a notification as read
     */
    async markAsRead(notificationId, userId) {
        try {
            const notification = await notification_entity_1.Notification.findOne({
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
        }
        catch (error) {
            console.error('Error marking notification as read:', error);
            throw new Error('Failed to mark notification as read');
        }
    }
    /**
     * Mark all notifications as read for a user
     */
    async markAllAsRead(userId) {
        try {
            const result = await notification_entity_1.Notification.updateMany({ userId, isRead: false, isArchived: false }, {
                isRead: true,
                readAt: new Date()
            });
            console.log(`✅ Marked ${result.modifiedCount} notifications as read for user ${userId}`);
            return result.modifiedCount;
        }
        catch (error) {
            console.error('Error marking all notifications as read:', error);
            throw new Error('Failed to mark all notifications as read');
        }
    }
    /**
     * Delete a notification
     */
    async deleteNotification(notificationId, userId) {
        try {
            const result = await notification_entity_1.Notification.deleteOne({
                _id: notificationId,
                userId
            });
            if (result.deletedCount > 0) {
                console.log(`✅ Notification deleted: ${notificationId}`);
                return true;
            }
            return false;
        }
        catch (error) {
            console.error('Error deleting notification:', error);
            throw new Error('Failed to delete notification');
        }
    }
    /**
     * Archive a notification
     */
    async archiveNotification(notificationId, userId) {
        try {
            const notification = await notification_entity_1.Notification.findOne({
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
        }
        catch (error) {
            console.error('Error archiving notification:', error);
            throw new Error('Failed to archive notification');
        }
    }
    /**
     * Clear all notifications for a user (mark as archived)
     */
    async clearAllNotifications(userId) {
        try {
            const result = await notification_entity_1.Notification.updateMany({ userId, isArchived: false }, {
                isArchived: true,
                archivedAt: new Date()
            });
            console.log(`✅ Cleared ${result.modifiedCount} notifications for user ${userId}`);
            return result.modifiedCount;
        }
        catch (error) {
            console.error('Error clearing all notifications:', error);
            throw new Error('Failed to clear all notifications');
        }
    }
    /**
     * Get a single notification by ID
     */
    async getNotificationById(notificationId, userId) {
        try {
            const notification = await notification_entity_1.Notification.findOne({
                _id: notificationId,
                userId
            });
            return notification;
        }
        catch (error) {
            console.error('Error fetching notification by ID:', error);
            throw new Error('Failed to fetch notification');
        }
    }
    /**
     * Create system-wide notification for maintenance, updates, etc.
     */
    async createSystemNotification(title, message, priority = notification_entity_1.NotificationPriority.MEDIUM) {
        try {
            // For now, we'll create for all users. In production, you might want to batch this
            // or use a more efficient approach like a system-wide notification collection
            const notifications = [];
            // This is a simplified version - in production you'd want to batch this operation
            console.log(`📢 Creating system notification: ${title}`);
            return notifications;
        }
        catch (error) {
            console.error('Error creating system notification:', error);
            throw new Error('Failed to create system notification');
        }
    }
    /**
     * Helper method to create different types of notifications
     */
    async createProjectNotification(userId, projectId, title, message, actionUrl) {
        return this.createNotification({
            userId,
            title,
            message,
            type: notification_entity_1.NotificationType.PROJECT,
            priority: notification_entity_1.NotificationPriority.MEDIUM,
            metadata: {
                projectId,
                actionUrl,
                icon: 'mdi-folder-plus',
                category: 'project'
            }
        });
    }
    async createTaskNotification(userId, taskId, title, message, priority = notification_entity_1.NotificationPriority.MEDIUM) {
        return this.createNotification({
            userId,
            title,
            message,
            type: notification_entity_1.NotificationType.TASK,
            priority,
            metadata: {
                taskId,
                icon: 'mdi-check-circle',
                category: 'task'
            }
        });
    }
    async createBillingNotification(userId, amount, dueDate, title, message) {
        return this.createNotification({
            userId,
            title,
            message,
            type: notification_entity_1.NotificationType.BILLING,
            priority: notification_entity_1.NotificationPriority.HIGH,
            metadata: {
                amount,
                dueDate,
                icon: 'mdi-credit-card-clock',
                category: 'billing'
            }
        });
    }
    async createMeetingNotification(userId, meetingId, title, message, meetingDate) {
        return this.createNotification({
            userId,
            title,
            message,
            type: notification_entity_1.NotificationType.MEETING,
            priority: notification_entity_1.NotificationPriority.HIGH,
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
    async cleanupOldNotifications(daysOld = 30) {
        try {
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - daysOld);
            const result = await notification_entity_1.Notification.deleteMany({
                createdAt: { $lt: cutoffDate },
                isArchived: true
            });
            console.log(`🧹 Cleaned up ${result.deletedCount} old notifications`);
            return result.deletedCount;
        }
        catch (error) {
            console.error('Error cleaning up old notifications:', error);
            throw new Error('Failed to cleanup old notifications');
        }
    }
    /**
     * Send email notification for high priority notifications
     */
    async sendEmailNotification(notification) {
        try {
            // This would integrate with your email service
            // For now, just log that we would send an email
            console.log(`📧 Would send email for high priority notification: ${notification.title}`);
            // Example integration with EmailService:
            // const emailService = new EmailService();
            // await emailService.sendNotificationEmail(notification);
        }
        catch (error) {
            console.error('Error sending email notification:', error);
            // Don't throw here as we don't want to fail notification creation due to email issues
        }
    }
}
exports.NotificationService = NotificationService;
