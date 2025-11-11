"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notification = exports.NotificationPriority = exports.NotificationType = void 0;
const mongoose_1 = __importStar(require("mongoose"));
var NotificationType;
(function (NotificationType) {
    NotificationType["PROJECT"] = "project";
    NotificationType["TASK"] = "task";
    NotificationType["REMINDER"] = "reminder";
    NotificationType["MEETING"] = "meeting";
    NotificationType["TEAM_CHAT"] = "team_chat";
    NotificationType["BILLING"] = "billing";
    NotificationType["PAYMENT"] = "payment";
    NotificationType["GENERAL"] = "general";
    NotificationType["SYSTEM"] = "system";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
var NotificationPriority;
(function (NotificationPriority) {
    NotificationPriority["LOW"] = "low";
    NotificationPriority["MEDIUM"] = "medium";
    NotificationPriority["HIGH"] = "high";
    NotificationPriority["URGENT"] = "urgent";
})(NotificationPriority || (exports.NotificationPriority = NotificationPriority = {}));
const notificationSchema = new mongoose_1.Schema({
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
        type: mongoose_1.Schema.Types.Mixed,
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
}, {
    timestamps: true,
    toJSON: {
        transform: function (doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    }
});
// Create compound indexes for efficient queries
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, type: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, isArchived: 1, createdAt: -1 });
// Instance methods
notificationSchema.methods.markAsRead = function () {
    this.isRead = true;
    this.readAt = new Date();
    return this.save();
};
notificationSchema.methods.markAsUnread = function () {
    this.isRead = false;
    this.readAt = null;
    return this.save();
};
notificationSchema.methods.archive = function () {
    this.isArchived = true;
    this.archivedAt = new Date();
    return this.save();
};
notificationSchema.methods.unarchive = function () {
    this.isArchived = false;
    this.archivedAt = null;
    return this.save();
};
// Static methods
notificationSchema.statics.createNotification = function (data) {
    return new this(data);
};
notificationSchema.statics.findByUserId = function (userId, options = {}) {
    const query = { userId, isArchived: false };
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
notificationSchema.statics.countUnreadByUserId = function (userId) {
    return this.countDocuments({
        userId,
        isRead: false,
        isArchived: false
    });
};
notificationSchema.statics.markAllAsReadByUserId = function (userId) {
    return this.updateMany({ userId, isRead: false, isArchived: false }, {
        isRead: true,
        readAt: new Date()
    });
};
notificationSchema.statics.deleteOldNotifications = function (daysOld = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    return this.deleteMany({
        createdAt: { $lt: cutoffDate },
        isArchived: true
    });
};
exports.Notification = mongoose_1.default.model('Notification', notificationSchema);
