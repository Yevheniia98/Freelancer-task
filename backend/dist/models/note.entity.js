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
exports.NoteEntity = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const NoteEntitySchema = new mongoose_1.Schema({
    clientId: {
        type: String,
        index: true
    },
    projectId: {
        type: String,
        index: true
    },
    dealId: {
        type: String,
        index: true
    },
    type: {
        type: String,
        required: [true, 'Note type is required'],
        enum: ['note', 'reminder', 'todo', 'follow_up'],
        default: 'note',
        index: true
    },
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    content: {
        type: String,
        required: [true, 'Content is required'],
        trim: true,
        maxlength: [5000, 'Content cannot exceed 5000 characters']
    },
    priority: {
        type: String,
        required: [true, 'Priority is required'],
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium',
        index: true
    },
    status: {
        type: String,
        required: [true, 'Status is required'],
        enum: ['active', 'completed', 'archived'],
        default: 'active',
        index: true
    },
    tags: [{
            type: String,
            trim: true,
            maxlength: [30, 'Tag cannot exceed 30 characters']
        }],
    reminderDate: {
        type: Date,
        index: true
    },
    reminderSent: {
        type: Boolean,
        default: false
    },
    reminderMethod: {
        type: String,
        enum: ['email', 'notification', 'both'],
        default: 'notification'
    },
    dueDate: {
        type: Date,
        index: true
    },
    completedDate: {
        type: Date
    },
    attachments: [{
            type: String,
            trim: true
        }],
    linkedTo: [{
            type: {
                type: String,
                required: true,
                enum: ['client', 'project', 'deal', 'invoice', 'communication']
            },
            id: {
                type: String,
                required: true
            }
        }],
    isPrivate: {
        type: Boolean,
        default: false,
        index: true
    },
    color: {
        type: String,
        trim: true,
        match: /^#[0-9A-F]{6}$/i, // Hex color code
        default: '#3B82F6'
    }
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: function (doc, ret) {
            ret.id = ret._id.toString();
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    }
});
// Indexes for better performance
NoteEntitySchema.index({ clientId: 1, createdAt: -1 });
NoteEntitySchema.index({ type: 1, status: 1, createdAt: -1 });
NoteEntitySchema.index({ priority: 1, dueDate: 1 });
NoteEntitySchema.index({ reminderDate: 1, reminderSent: 1 });
NoteEntitySchema.index({ tags: 1 });
NoteEntitySchema.index({ status: 1, dueDate: 1 });
NoteEntitySchema.index({
    title: 'text',
    content: 'text',
    tags: 'text'
}); // For text search
// Virtual for formatted reminder date
NoteEntitySchema.virtual('formattedReminderDate').get(function () {
    if (!this.reminderDate)
        return null;
    return this.reminderDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
});
// Virtual for formatted due date
NoteEntitySchema.virtual('formattedDueDate').get(function () {
    if (!this.dueDate)
        return null;
    return this.dueDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
});
// Virtual for is overdue
NoteEntitySchema.virtual('isOverdue').get(function () {
    if (!this.dueDate || this.status === 'completed' || this.status === 'archived') {
        return false;
    }
    return this.dueDate < new Date();
});
// Virtual for days until due
NoteEntitySchema.virtual('daysUntilDue').get(function () {
    if (!this.dueDate)
        return null;
    const today = new Date();
    const diffTime = this.dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
});
// Virtual for reminder needed
NoteEntitySchema.virtual('reminderNeeded').get(function () {
    if (!this.reminderDate || this.reminderSent || this.status !== 'active') {
        return false;
    }
    return this.reminderDate <= new Date();
});
// Virtual for priority color
NoteEntitySchema.virtual('priorityColor').get(function () {
    const colors = {
        low: '#10B981',
        medium: '#F59E0B',
        high: '#EF4444',
        urgent: '#DC2626'
    };
    return colors[this.priority] || '#6B7280';
});
// Virtual for type icon
NoteEntitySchema.virtual('typeIcon').get(function () {
    const icons = {
        note: 'mdi-note-text',
        reminder: 'mdi-bell',
        todo: 'mdi-checkbox-marked-circle',
        follow_up: 'mdi-phone-callback'
    };
    return icons[this.type] || 'mdi-note-text';
});
// Virtual for content preview
NoteEntitySchema.virtual('contentPreview').get(function () {
    const maxLength = 150;
    return this.content.length > maxLength
        ? this.content.substring(0, maxLength) + '...'
        : this.content;
});
// Pre-save middleware
NoteEntitySchema.pre('save', function (next) {
    // Normalize tags
    if (this.tags) {
        this.tags = this.tags.map(tag => tag.toLowerCase().trim()).filter(tag => tag.length > 0);
    }
    // Set completed date when status changes to completed
    if (this.isModified('status') && this.status === 'completed' && !this.completedDate) {
        this.completedDate = new Date();
    }
    // Clear completed date if status changes from completed
    if (this.isModified('status') && this.status !== 'completed' && this.completedDate) {
        this.completedDate = undefined;
    }
    // Auto-set reminder for todos and follow-ups if not set
    if ((this.type === 'todo' || this.type === 'follow_up') && !this.reminderDate && this.dueDate) {
        // Set reminder 1 day before due date
        this.reminderDate = new Date(this.dueDate.getTime() - (24 * 60 * 60 * 1000));
    }
    // Validate color format
    if (this.color && !/^#[0-9A-F]{6}$/i.test(this.color)) {
        this.color = '#3B82F6'; // Default blue
    }
    next();
});
// Instance methods
NoteEntitySchema.methods.markAsCompleted = function () {
    this.status = 'completed';
    this.completedDate = new Date();
    return this.save();
};
NoteEntitySchema.methods.markAsActive = function () {
    this.status = 'active';
    this.completedDate = undefined;
    return this.save();
};
NoteEntitySchema.methods.archive = function () {
    this.status = 'archived';
    return this.save();
};
NoteEntitySchema.methods.setReminder = function (date, method = 'notification') {
    this.reminderDate = date;
    this.reminderMethod = method;
    this.reminderSent = false;
    return this.save();
};
NoteEntitySchema.methods.markReminderSent = function () {
    this.reminderSent = true;
    return this.save();
};
NoteEntitySchema.methods.linkTo = function (type, id) {
    this.linkedTo = this.linkedTo || [];
    // Check if link already exists
    const exists = this.linkedTo.some((link) => link.type === type && link.id === id);
    if (!exists) {
        this.linkedTo.push({ type: type, id });
    }
    return this.save();
};
NoteEntitySchema.methods.unlinkFrom = function (type, id) {
    if (this.linkedTo) {
        this.linkedTo = this.linkedTo.filter((link) => !(link.type === type && link.id === id));
    }
    return this.save();
};
// Static methods
NoteEntitySchema.statics.findByClient = function (clientId) {
    return this.find({ clientId }).sort({ createdAt: -1 });
};
NoteEntitySchema.statics.findByType = function (type) {
    return this.find({ type }).sort({ createdAt: -1 });
};
NoteEntitySchema.statics.findActive = function () {
    return this.find({ status: 'active' }).sort({ priority: 1, dueDate: 1 });
};
NoteEntitySchema.statics.findOverdue = function () {
    return this.find({
        status: 'active',
        dueDate: { $lt: new Date() }
    }).sort({ dueDate: 1 });
};
NoteEntitySchema.statics.findDueToday = function () {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    return this.find({
        status: 'active',
        dueDate: {
            $gte: startOfDay,
            $lt: endOfDay
        }
    }).sort({ dueDate: 1 });
};
NoteEntitySchema.statics.findRemindersToSend = function () {
    return this.find({
        status: 'active',
        reminderDate: { $lte: new Date() },
        reminderSent: false
    }).sort({ reminderDate: 1 });
};
NoteEntitySchema.statics.findByPriority = function (priority) {
    return this.find({
        status: 'active',
        priority
    }).sort({ dueDate: 1 });
};
NoteEntitySchema.statics.findLinkedTo = function (type, id) {
    return this.find({
        'linkedTo.type': type,
        'linkedTo.id': id
    }).sort({ createdAt: -1 });
};
exports.NoteEntity = mongoose_1.default.model('NoteEntity', NoteEntitySchema);
