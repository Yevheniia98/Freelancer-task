import mongoose, { Document, Schema } from 'mongoose';

export enum NotificationType {
  PROJECT = 'project',
  TASK = 'task',
  REMINDER = 'reminder',
  MEETING = 'meeting',
  TEAM_CHAT = 'team_chat',
  BILLING = 'billing',
  PAYMENT = 'payment',
  GENERAL = 'general',
  SYSTEM = 'system'
}

export enum NotificationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export interface INotification extends Document {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  isRead: boolean;
  isArchived: boolean;
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
  createdAt: Date;
  updatedAt: Date;
  readAt?: Date;
  archivedAt?: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    userId: {
      type: String,
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000
    },
    type: {
      type: String,
      enum: Object.values(NotificationType),
      required: true,
      index: true
    },
    priority: {
      type: String,
      enum: Object.values(NotificationPriority),
      default: NotificationPriority.MEDIUM
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true
    },
    isArchived: {
      type: Boolean,
      default: false,
      index: true
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {}
    },
    readAt: {
      type: Date,
      default: null
    },
    archivedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: function(doc: any, ret: any) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

// Create compound indexes for efficient queries
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, type: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, isArchived: 1, createdAt: -1 });

// Instance methods
notificationSchema.methods.markAsRead = function() {
  this.isRead = true;
  this.readAt = new Date();
  return this.save();
};

notificationSchema.methods.markAsUnread = function() {
  this.isRead = false;
  this.readAt = null;
  return this.save();
};

notificationSchema.methods.archive = function() {
  this.isArchived = true;
  this.archivedAt = new Date();
  return this.save();
};

notificationSchema.methods.unarchive = function() {
  this.isArchived = false;
  this.archivedAt = null;
  return this.save();
};

// Static methods
notificationSchema.statics.createNotification = function(data: Partial<INotification>) {
  return new this(data);
};

notificationSchema.statics.findByUserId = function(userId: string, options: any = {}) {
  const query: any = { userId, isArchived: false };
  
  if (options.unreadOnly) {
    query.isRead = false;
  }
  
  if (options.type) {
    query.type = options.type;
  }
  
  return this.find(query)
    .sort({ createdAt: -1 })
    .limit(options.limit || 50);
};

notificationSchema.statics.countUnreadByUserId = function(userId: string) {
  return this.countDocuments({ 
    userId, 
    isRead: false, 
    isArchived: false 
  });
};

notificationSchema.statics.markAllAsReadByUserId = function(userId: string) {
  return this.updateMany(
    { userId, isRead: false, isArchived: false },
    { 
      isRead: true, 
      readAt: new Date() 
    }
  );
};

notificationSchema.statics.deleteOldNotifications = function(daysOld: number = 30) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);
  
  return this.deleteMany({
    createdAt: { $lt: cutoffDate },
    isArchived: true
  });
};

export const Notification = mongoose.model<INotification>('Notification', notificationSchema);