import mongoose, { Document, Schema } from 'mongoose';

// Simple Project entity similar to TypeORM style
export enum ProjectStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum ProjectPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export interface IProjectEntity extends Document {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  deadline?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectEntitySchema = new Schema<IProjectEntity>({
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Project description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  status: {
    type: String,
    enum: Object.values(ProjectStatus),
    default: ProjectStatus.PENDING,
    required: true
  },
  priority: {
    type: String,
    enum: Object.values(ProjectPriority),
    default: ProjectPriority.MEDIUM,
    required: true
  },
  deadline: {
    type: Date,
    required: false
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

// Index for better performance
ProjectEntitySchema.index({ status: 1 });
ProjectEntitySchema.index({ priority: 1 });
ProjectEntitySchema.index({ createdAt: -1 });
ProjectEntitySchema.index({ deadline: 1 });

// Virtual for checking if project is overdue
ProjectEntitySchema.virtual('isOverdue').get(function() {
  return this.deadline && new Date() > this.deadline;
});

export const ProjectEntity = mongoose.model<IProjectEntity>('ProjectEntity', ProjectEntitySchema);
