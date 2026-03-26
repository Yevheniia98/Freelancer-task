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

export interface IFile {
  filename: string;
  originalName: string;
  path: string;
  mimetype: string;
  size: number;
  uploadedAt: Date;
  uploadedBy: mongoose.Types.ObjectId;
}

export enum TeamMemberPermission {
  VIEW_ONLY = 'view',
  VIEW_AND_EDIT = 'edit',
  OWNER = 'owner'
}

export interface ITeamMember {
  userId: mongoose.Types.ObjectId;
  name: string;
  email: string;
  role: 'view' | 'edit' | 'owner';
  status?: 'active' | 'pending';
  addedAt: Date;
  addedBy: mongoose.Types.ObjectId;
}

export interface IProjectEntity extends Document {
  id: string;
  title: string;
  name?: string;
  description: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  deadline?: Date;
  privacy?: string;
  category?: string;
  skills?: string[];
  teamLead?: string;
  teamMembers?: ITeamMember[];
  projectOwner?: mongoose.Types.ObjectId;
  files?: IFile[];
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
  name: {
    type: String,
    trim: true,
    maxlength: [200, 'Name cannot exceed 200 characters']
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
  },
  privacy: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    trim: true
  },
  skills: {
    type: [String],
    default: []
  },
  teamLead: {
    type: String,
    trim: true
  },
  teamMembers: {
    type: [{
      userId: { type: Schema.Types.ObjectId, ref: 'User', required: false },
      name: { type: String, required: true },
      email: { type: String, required: true },
      role: { 
        type: String, 
        enum: ['view', 'edit', 'owner'],
        default: 'view',
        required: true
      },
      status: { 
        type: String, 
        enum: ['active', 'pending'],
        default: 'active'
      },
      addedAt: { type: Date, default: Date.now },
      addedBy: { type: Schema.Types.ObjectId, ref: 'User' }
    }],
    default: []
  },
  projectOwner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  files: {
    type: [{
      filename: { type: String, required: true },
      originalName: { type: String, required: true },
      path: { type: String, required: true },
      mimetype: { type: String, required: true },
      size: { type: Number, required: true },
      uploadedAt: { type: Date, default: Date.now },
      uploadedBy: { type: Schema.Types.ObjectId, ref: 'User' }
    }],
    default: []
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
