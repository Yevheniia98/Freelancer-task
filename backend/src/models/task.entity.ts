import mongoose, { Document, Schema } from 'mongoose';

// Task entity similar to TypeORM style
export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  IN_REVIEW = 'in_review',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export interface ITaskEntity extends Document {
  id: string;
  title: string;
  description: string;
  dueDate?: Date;
  priority: TaskPriority;
  status: TaskStatus;
  assigneeId?: mongoose.Types.ObjectId;
  projectId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  isOverdue?: boolean;
  isDueSoon?: boolean;
}

const TaskEntitySchema = new Schema<ITaskEntity>({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Task description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  dueDate: {
    type: Date,
    required: false
  },
  priority: {
    type: String,
    enum: Object.values(TaskPriority),
    default: TaskPriority.MEDIUM,
    required: true
  },
  status: {
    type: String,
    enum: Object.values(TaskStatus),
    default: TaskStatus.TODO,
    required: true
  },
  assigneeId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'ProjectEntity',
    required: [true, 'Project ID is required']
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
TaskEntitySchema.index({ projectId: 1, status: 1 });
TaskEntitySchema.index({ assigneeId: 1, status: 1 });
TaskEntitySchema.index({ priority: 1, status: 1 });
TaskEntitySchema.index({ dueDate: 1 });
TaskEntitySchema.index({ createdAt: -1 });
TaskEntitySchema.index({ title: 'text', description: 'text' }); // For text search

// Virtual for checking if task is overdue
TaskEntitySchema.virtual('isOverdue').get(function(this: ITaskEntity) {
  return this.dueDate && new Date() > this.dueDate && this.status !== TaskStatus.COMPLETED;
});

// Virtual for checking if task is due soon (within 24 hours)
TaskEntitySchema.virtual('isDueSoon').get(function(this: ITaskEntity) {
  if (!this.dueDate || this.status === TaskStatus.COMPLETED) return false;
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  return this.dueDate <= tomorrow && this.dueDate > now;
});

// Pre-save middleware
TaskEntitySchema.pre('save', function(this: ITaskEntity, next) {
  // Validate due date if provided
  if (this.dueDate && this.dueDate <= new Date()) {
    // Allow setting due date in the past for completed tasks
    if (this.status !== TaskStatus.COMPLETED && this.isNew) {
      const error = new Error('Due date must be in the future for new tasks');
      return next(error);
    }
  }
  next();
});

export const TaskEntity = mongoose.model<ITaskEntity>('TaskEntity', TaskEntitySchema);
