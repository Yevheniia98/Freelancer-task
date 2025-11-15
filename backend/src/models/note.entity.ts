import mongoose, { Document, Schema, Model } from 'mongoose';

// Note entity for managing notes and reminders
export interface INoteEntity extends Document {
  id: string;
  clientId?: string;
  projectId?: string;
  dealId?: string;
  type: 'note' | 'reminder' | 'todo' | 'follow_up';
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'active' | 'completed' | 'archived';
  tags?: string[];
  reminderDate?: Date;
  reminderSent?: boolean;
  reminderMethod?: 'email' | 'notification' | 'both';
  dueDate?: Date;
  completedDate?: Date;
  attachments?: string[];
  linkedTo?: {
    type: 'client' | 'project' | 'deal' | 'invoice' | 'communication';
    id: string;
  }[];
  isPrivate: boolean;
  color?: string; // For visual organization
  createdAt: Date;
  updatedAt: Date;
  
  // Instance methods
  markAsCompleted(): Promise<INoteEntity>;
  markAsActive(): Promise<INoteEntity>;
  archive(): Promise<INoteEntity>;
  setReminder(date: Date, method?: string): Promise<INoteEntity>;
  markReminderSent(): Promise<INoteEntity>;
  linkTo(type: string, id: string): Promise<INoteEntity>;
  unlinkFrom(type: string, id: string): Promise<INoteEntity>;
}

// Static methods interface
export interface INoteModel extends Model<INoteEntity> {
  findByClient(clientId: string): Promise<INoteEntity[]>;
  findByType(type: string): Promise<INoteEntity[]>;
  findActive(): Promise<INoteEntity[]>;
  findOverdue(): Promise<INoteEntity[]>;
  findDueToday(): Promise<INoteEntity[]>;
  findRemindersToSend(): Promise<INoteEntity[]>;
  findByPriority(priority: string): Promise<INoteEntity[]>;
  findLinkedTo(type: string, id: string): Promise<INoteEntity[]>;
}

const NoteEntitySchema = new Schema<INoteEntity>({
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
    transform: function(doc, ret: any) {
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
NoteEntitySchema.virtual('formattedReminderDate').get(function(this: INoteEntity) {
  if (!this.reminderDate) return null;
  
  return this.reminderDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
});

// Virtual for formatted due date
NoteEntitySchema.virtual('formattedDueDate').get(function(this: INoteEntity) {
  if (!this.dueDate) return null;
  
  return this.dueDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
});

// Virtual for is overdue
NoteEntitySchema.virtual('isOverdue').get(function(this: INoteEntity) {
  if (!this.dueDate || this.status === 'completed' || this.status === 'archived') {
    return false;
  }
  
  return this.dueDate < new Date();
});

// Virtual for days until due
NoteEntitySchema.virtual('daysUntilDue').get(function(this: INoteEntity) {
  if (!this.dueDate) return null;
  
  const today = new Date();
  const diffTime = this.dueDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
});

// Virtual for reminder needed
NoteEntitySchema.virtual('reminderNeeded').get(function(this: INoteEntity) {
  if (!this.reminderDate || this.reminderSent || this.status !== 'active') {
    return false;
  }
  
  return this.reminderDate <= new Date();
});

// Virtual for priority color
NoteEntitySchema.virtual('priorityColor').get(function(this: INoteEntity) {
  const colors = {
    low: '#10B981',
    medium: '#F59E0B',
    high: '#EF4444',
    urgent: '#DC2626'
  };
  return colors[this.priority] || '#6B7280';
});

// Virtual for type icon
NoteEntitySchema.virtual('typeIcon').get(function(this: INoteEntity) {
  const icons = {
    note: 'mdi-note-text',
    reminder: 'mdi-bell',
    todo: 'mdi-checkbox-marked-circle',
    follow_up: 'mdi-phone-callback'
  };
  return icons[this.type] || 'mdi-note-text';
});

// Virtual for content preview
NoteEntitySchema.virtual('contentPreview').get(function(this: INoteEntity) {
  const maxLength = 150;
  return this.content.length > maxLength 
    ? this.content.substring(0, maxLength) + '...'
    : this.content;
});

// Pre-save middleware
NoteEntitySchema.pre('save', function(this: INoteEntity, next) {
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
NoteEntitySchema.methods.markAsCompleted = function() {
  this.status = 'completed';
  this.completedDate = new Date();
  return this.save();
};

NoteEntitySchema.methods.markAsActive = function() {
  this.status = 'active';
  this.completedDate = undefined;
  return this.save();
};

NoteEntitySchema.methods.archive = function() {
  this.status = 'archived';
  return this.save();
};

NoteEntitySchema.methods.setReminder = function(date: Date, method: string = 'notification') {
  this.reminderDate = date;
  this.reminderMethod = method as any;
  this.reminderSent = false;
  return this.save();
};

NoteEntitySchema.methods.markReminderSent = function() {
  this.reminderSent = true;
  return this.save();
};

NoteEntitySchema.methods.linkTo = function(type: string, id: string) {
  this.linkedTo = this.linkedTo || [];
  
  // Check if link already exists
  const exists = this.linkedTo.some((link: any) => link.type === type && link.id === id);
  
  if (!exists) {
    this.linkedTo.push({ type: type as any, id });
  }
  
  return this.save();
};

NoteEntitySchema.methods.unlinkFrom = function(type: string, id: string) {
  if (this.linkedTo) {
    this.linkedTo = this.linkedTo.filter((link: any) => !(link.type === type && link.id === id));
  }
  return this.save();
};

// Static methods
NoteEntitySchema.statics.findByClient = function(clientId: string) {
  return this.find({ clientId }).sort({ createdAt: -1 });
};

NoteEntitySchema.statics.findByType = function(type: string) {
  return this.find({ type }).sort({ createdAt: -1 });
};

NoteEntitySchema.statics.findActive = function() {
  return this.find({ status: 'active' }).sort({ priority: 1, dueDate: 1 });
};

NoteEntitySchema.statics.findOverdue = function() {
  return this.find({ 
    status: 'active',
    dueDate: { $lt: new Date() }
  }).sort({ dueDate: 1 });
};

NoteEntitySchema.statics.findDueToday = function() {
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

NoteEntitySchema.statics.findRemindersToSend = function() {
  return this.find({ 
    status: 'active',
    reminderDate: { $lte: new Date() },
    reminderSent: false
  }).sort({ reminderDate: 1 });
};

NoteEntitySchema.statics.findByPriority = function(priority: string) {
  return this.find({ 
    status: 'active',
    priority 
  }).sort({ dueDate: 1 });
};

NoteEntitySchema.statics.findLinkedTo = function(type: string, id: string) {
  return this.find({ 
    'linkedTo.type': type,
    'linkedTo.id': id
  }).sort({ createdAt: -1 });
};

export const NoteEntity = mongoose.model<INoteEntity, INoteModel>('NoteEntity', NoteEntitySchema);
