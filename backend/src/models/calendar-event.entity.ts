import mongoose, { Document, Schema } from 'mongoose';

// Event types enum
export enum EventType {
  MEETING = 'meeting',
  DEADLINE = 'deadline',
  MILESTONE = 'milestone',
  CALL = 'call',
  PRESENTATION = 'presentation',
  REVIEW = 'review',
  PERSONAL = 'personal',
  OTHER = 'other'
}

// Reminder options enum
export enum ReminderType {
  NONE = 'none',
  FIVE_MINUTES = '5min',
  FIFTEEN_MINUTES = '15min',
  THIRTY_MINUTES = '30min',
  ONE_HOUR = '1hour',
  TWO_HOURS = '2hours',
  ONE_DAY = '1day',
  ONE_WEEK = '1week'
}

// CalendarEvent entity similar to TypeORM style
export interface ICalendarEventEntity extends Document {
  id: string;
  eventTitle: string;
  eventType: EventType;
  date: Date;
  reminder: ReminderType;
  projectId?: mongoose.Types.ObjectId;
  description?: string;
  duration?: number; // Duration in minutes
  location?: string;
  attendees?: string[];
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CalendarEventEntitySchema = new Schema<ICalendarEventEntity>({
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
    type: Schema.Types.ObjectId,
    ref: 'ProjectEntity',
    validate: {
      validator: function(value: any) {
        // Allow null/undefined for non-project events
        return value === null || value === undefined || mongoose.Types.ObjectId.isValid(value);
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
      validator: function(attendees: string[]) {
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
    transform: function(doc, ret: any) {
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
CalendarEventEntitySchema.virtual('isUpcoming').get(function(this: ICalendarEventEntity) {
  return this.date > new Date() && !this.isCompleted;
});

// Virtual for checking if event is overdue
CalendarEventEntitySchema.virtual('isOverdue').get(function(this: ICalendarEventEntity) {
  return this.date < new Date() && !this.isCompleted;
});

// Virtual for checking if event is today
CalendarEventEntitySchema.virtual('isToday').get(function(this: ICalendarEventEntity) {
  const today = new Date();
  const eventDate = new Date(this.date);
  return eventDate.toDateString() === today.toDateString();
});

// Virtual for getting formatted date
CalendarEventEntitySchema.virtual('formattedDate').get(function(this: ICalendarEventEntity) {
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
CalendarEventEntitySchema.virtual('reminderMinutes').get(function(this: ICalendarEventEntity) {
  const reminderMap: Record<ReminderType, number> = {
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
CalendarEventEntitySchema.virtual('reminderTime').get(function(this: ICalendarEventEntity) {
  if (this.reminder === ReminderType.NONE) return null;
  
  const reminderMap: Record<ReminderType, number> = {
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
CalendarEventEntitySchema.pre('save', function(this: ICalendarEventEntity, next) {
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
CalendarEventEntitySchema.methods.markCompleted = function() {
  this.isCompleted = true;
  return this.save();
};

CalendarEventEntitySchema.methods.markIncomplete = function() {
  this.isCompleted = false;
  return this.save();
};

CalendarEventEntitySchema.methods.addAttendee = function(email: string) {
  if (!this.attendees.includes(email.toLowerCase())) {
    this.attendees.push(email.toLowerCase());
  }
  return this.save();
};

CalendarEventEntitySchema.methods.removeAttendee = function(email: string) {
  this.attendees = this.attendees.filter((attendee: string) => attendee !== email.toLowerCase());
  return this.save();
};

CalendarEventEntitySchema.methods.reschedule = function(newDate: Date) {
  this.date = newDate;
  return this.save();
};

export const CalendarEventEntity = mongoose.model<ICalendarEventEntity>('CalendarEventEntity', CalendarEventEntitySchema);
