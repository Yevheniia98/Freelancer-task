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
exports.CalendarEventEntity = exports.ReminderType = exports.EventType = void 0;
const mongoose_1 = __importStar(require("mongoose"));
// Event types enum
var EventType;
(function (EventType) {
    EventType["MEETING"] = "meeting";
    EventType["DEADLINE"] = "deadline";
    EventType["MILESTONE"] = "milestone";
    EventType["CALL"] = "call";
    EventType["PRESENTATION"] = "presentation";
    EventType["REVIEW"] = "review";
    EventType["PERSONAL"] = "personal";
    EventType["OTHER"] = "other";
})(EventType || (exports.EventType = EventType = {}));
// Reminder options enum
var ReminderType;
(function (ReminderType) {
    ReminderType["NONE"] = "none";
    ReminderType["FIVE_MINUTES"] = "5min";
    ReminderType["FIFTEEN_MINUTES"] = "15min";
    ReminderType["THIRTY_MINUTES"] = "30min";
    ReminderType["ONE_HOUR"] = "1hour";
    ReminderType["TWO_HOURS"] = "2hours";
    ReminderType["ONE_DAY"] = "1day";
    ReminderType["ONE_WEEK"] = "1week";
})(ReminderType || (exports.ReminderType = ReminderType = {}));
const CalendarEventEntitySchema = new mongoose_1.Schema({
    eventTitle: {
        type: String,
        required: [true, 'Event title is required'],
        trim: true,
        maxlength: [200, 'Event title cannot exceed 200 characters']
    },
    eventType: {
        type: String,
        enum: Object.values(EventType),
        required: [true, 'Event type is required'],
        default: EventType.OTHER
    },
    date: {
        type: Date,
        required: [true, 'Event date is required']
    },
    reminder: {
        type: String,
        enum: Object.values(ReminderType),
        default: ReminderType.FIFTEEN_MINUTES
    },
    projectId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'ProjectEntity',
        validate: {
            validator: function (value) {
                // Allow null/undefined for non-project events
                return value === null || value === undefined || mongoose_1.default.Types.ObjectId.isValid(value);
            },
            message: 'Invalid project ID format'
        }
    },
    description: {
        type: String,
        trim: true,
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    duration: {
        type: Number,
        min: [5, 'Duration must be at least 5 minutes'],
        max: [1440, 'Duration cannot exceed 24 hours (1440 minutes)'],
        default: 60 // Default to 1 hour
    },
    location: {
        type: String,
        trim: true,
        maxlength: [200, 'Location cannot exceed 200 characters']
    },
    attendees: {
        type: [String],
        default: [],
        validate: {
            validator: function (attendees) {
                return attendees.every(email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
            },
            message: 'All attendees must have valid email addresses'
        }
    },
    isCompleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true, // This automatically adds createdAt and updatedAt
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
CalendarEventEntitySchema.index({ date: 1 });
CalendarEventEntitySchema.index({ eventType: 1 });
CalendarEventEntitySchema.index({ projectId: 1 });
CalendarEventEntitySchema.index({ isCompleted: 1 });
CalendarEventEntitySchema.index({ date: 1, eventType: 1 });
CalendarEventEntitySchema.index({ eventTitle: 'text', description: 'text', location: 'text' }); // For text search
// Virtual for checking if event is upcoming
CalendarEventEntitySchema.virtual('isUpcoming').get(function () {
    return this.date > new Date() && !this.isCompleted;
});
// Virtual for checking if event is overdue
CalendarEventEntitySchema.virtual('isOverdue').get(function () {
    return this.date < new Date() && !this.isCompleted;
});
// Virtual for checking if event is today
CalendarEventEntitySchema.virtual('isToday').get(function () {
    const today = new Date();
    const eventDate = new Date(this.date);
    return eventDate.toDateString() === today.toDateString();
});
// Virtual for getting formatted date
CalendarEventEntitySchema.virtual('formattedDate').get(function () {
    return this.date.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
});
// Virtual for getting reminder time in minutes
CalendarEventEntitySchema.virtual('reminderMinutes').get(function () {
    const reminderMap = {
        [ReminderType.NONE]: 0,
        [ReminderType.FIVE_MINUTES]: 5,
        [ReminderType.FIFTEEN_MINUTES]: 15,
        [ReminderType.THIRTY_MINUTES]: 30,
        [ReminderType.ONE_HOUR]: 60,
        [ReminderType.TWO_HOURS]: 120,
        [ReminderType.ONE_DAY]: 1440,
        [ReminderType.ONE_WEEK]: 10080
    };
    return reminderMap[this.reminder] || 0;
});
// Virtual for getting reminder time
CalendarEventEntitySchema.virtual('reminderTime').get(function () {
    if (this.reminder === ReminderType.NONE)
        return null;
    const reminderMap = {
        [ReminderType.NONE]: 0,
        [ReminderType.FIVE_MINUTES]: 5,
        [ReminderType.FIFTEEN_MINUTES]: 15,
        [ReminderType.THIRTY_MINUTES]: 30,
        [ReminderType.ONE_HOUR]: 60,
        [ReminderType.TWO_HOURS]: 120,
        [ReminderType.ONE_DAY]: 1440,
        [ReminderType.ONE_WEEK]: 10080
    };
    const reminderMinutes = reminderMap[this.reminder] || 0;
    const reminderTime = new Date(this.date.getTime() - (reminderMinutes * 60 * 1000));
    return reminderTime;
});
// Pre-save middleware for validation
CalendarEventEntitySchema.pre('save', function (next) {
    // Ensure event date is not in the past for new events (unless it's being marked as completed)
    if (this.isNew && this.date < new Date() && !this.isCompleted) {
        // Allow past dates but warn in development
        if (process.env.NODE_ENV === 'development') {
            console.warn(`Warning: Creating event "${this.eventTitle}" with past date: ${this.date}`);
        }
    }
    // Normalize attendees emails
    if (this.attendees && this.attendees.length > 0) {
        this.attendees = this.attendees.map(email => email.toLowerCase().trim());
    }
    next();
});
// Instance methods
CalendarEventEntitySchema.methods.markCompleted = function () {
    this.isCompleted = true;
    return this.save();
};
CalendarEventEntitySchema.methods.markIncomplete = function () {
    this.isCompleted = false;
    return this.save();
};
CalendarEventEntitySchema.methods.addAttendee = function (email) {
    if (!this.attendees.includes(email.toLowerCase())) {
        this.attendees.push(email.toLowerCase());
    }
    return this.save();
};
CalendarEventEntitySchema.methods.removeAttendee = function (email) {
    this.attendees = this.attendees.filter((attendee) => attendee !== email.toLowerCase());
    return this.save();
};
CalendarEventEntitySchema.methods.reschedule = function (newDate) {
    this.date = newDate;
    return this.save();
};
exports.CalendarEventEntity = mongoose_1.default.model('CalendarEventEntity', CalendarEventEntitySchema);
