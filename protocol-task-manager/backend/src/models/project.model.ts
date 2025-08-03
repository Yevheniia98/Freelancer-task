import mongoose, { Document, Schema } from 'mongoose';

export enum ProjectStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  IN_PROGRESS = 'in_progress',
  ON_HOLD = 'on_hold',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  ARCHIVED = 'archived'
}

export enum ProjectPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export enum ProjectType {
  INTERNAL = 'internal',
  CLIENT = 'client',
  FREELANCE = 'freelance',
  EXTERNAL = 'external'
}

export interface IBudget {
  amount: number;
  currency: string;
  type: 'fixed' | 'hourly';
  spent?: number;
  remaining?: number;
}

export interface IClient {
  name: string;
  email?: string;
  company?: string;
  rating?: number;
  country?: string;
  platformId?: string;
  platform?: string;
}

export interface IExternalSource {
  platform: string;
  externalId: string;
  url: string;
  lastSynced: Date;
  syncStatus: 'pending' | 'synced' | 'error';
  syncError?: string;
}

export interface IProject extends Document {
  title: string;
  description: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  type: ProjectType;
  
  // Budget and financial info
  budget: IBudget;
  
  // Client information
  client: IClient;
  
  // Dates
  startDate?: Date;
  endDate?: Date;
  deadline?: Date;
  
  // Team and assignments
  assignedTo: mongoose.Types.ObjectId[];
  teamMembers: mongoose.Types.ObjectId[];
  
  // Skills and tags
  skills: string[];
  tags: string[];
  
  // External platform integration
  externalSource?: IExternalSource;
  
  // User who owns this project
  userId: mongoose.Types.ObjectId;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: mongoose.Types.ObjectId;
  lastModifiedBy: mongoose.Types.ObjectId;
}

const BudgetSchema = new Schema({
  amount: { type: Number, required: true, min: 0 },
  currency: { type: String, required: true, default: 'USD' },
  type: { type: String, enum: ['fixed', 'hourly'], required: true },
  spent: { type: Number, default: 0, min: 0 },
  remaining: { type: Number, min: 0 }
});

const ClientSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String },
  company: { type: String },
  rating: { type: Number, min: 0, max: 5 },
  country: { type: String },
  platformId: { type: String },
  platform: { type: String }
});

const ExternalSourceSchema = new Schema({
  platform: { type: String, required: true },
  externalId: { type: String, required: true },
  url: { type: String, required: true },
  lastSynced: { type: Date, default: Date.now },
  syncStatus: { 
    type: String, 
    enum: ['pending', 'synced', 'error'], 
    default: 'pending' 
  },
  syncError: { type: String }
});

const ProjectSchema = new Schema<IProject>({
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
    maxlength: [5000, 'Description cannot exceed 5000 characters']
  },
  
  status: { 
    type: String, 
    enum: Object.values(ProjectStatus),
    default: ProjectStatus.DRAFT,
    required: true
  },
  
  priority: { 
    type: String, 
    enum: Object.values(ProjectPriority),
    default: ProjectPriority.MEDIUM,
    required: true
  },
  
  type: { 
    type: String, 
    enum: Object.values(ProjectType),
    default: ProjectType.INTERNAL,
    required: true
  },
  
  budget: { 
    type: BudgetSchema, 
    required: true 
  },
  
  client: { 
    type: ClientSchema, 
    required: true 
  },
  
  startDate: { type: Date },
  endDate: { type: Date },
  deadline: { type: Date },
  
  assignedTo: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  
  teamMembers: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  
  skills: [{ 
    type: String, 
    trim: true 
  }],
  
  tags: [{ 
    type: String, 
    trim: true 
  }],
  
  externalSource: ExternalSourceSchema,
  
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  createdBy: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  lastModifiedBy: { 
    type: Schema.Types.ObjectId, 
    ref: 'User' 
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
ProjectSchema.index({ userId: 1, status: 1 });
ProjectSchema.index({ 'externalSource.platform': 1, 'externalSource.externalId': 1 });
ProjectSchema.index({ deadline: 1 });
ProjectSchema.index({ priority: 1, status: 1 });
ProjectSchema.index({ skills: 1 });
ProjectSchema.index({ tags: 1 });
ProjectSchema.index({ createdAt: -1 });

// Virtual for calculating budget remaining
ProjectSchema.virtual('budgetRemaining').get(function() {
  if (this.budget.type === 'fixed') {
    return Math.max(0, this.budget.amount - (this.budget.spent || 0));
  }
  return null;
});

// Virtual for project duration
ProjectSchema.virtual('duration').get(function() {
  if (this.startDate && this.endDate) {
    return Math.ceil((this.endDate.getTime() - this.startDate.getTime()) / (1000 * 60 * 60 * 24));
  }
  return null;
});

// Pre-save middleware
ProjectSchema.pre('save', function(next) {
  if (this.isModified()) {
    this.lastModifiedBy = this.userId;
  }
  
  // Calculate remaining budget for fixed projects
  if (this.budget.type === 'fixed') {
    this.budget.remaining = Math.max(0, this.budget.amount - (this.budget.spent || 0));
  }
  
  next();
});

// Methods
ProjectSchema.methods.isOverdue = function(): boolean {
  return this.deadline && new Date() > this.deadline;
};

ProjectSchema.methods.isOverBudget = function(): boolean {
  return this.budget.type === 'fixed' && (this.budget.spent || 0) > this.budget.amount;
};

ProjectSchema.methods.getProgress = function(): number {
  // This would be calculated based on tasks/milestones completion
  // For now, return a simple status-based progress
  const progressMap: Record<string, number> = {
    [ProjectStatus.DRAFT]: 0,
    [ProjectStatus.ACTIVE]: 10,
    [ProjectStatus.IN_PROGRESS]: 50,
    [ProjectStatus.ON_HOLD]: 50,
    [ProjectStatus.COMPLETED]: 100,
    [ProjectStatus.CANCELLED]: 0,
    [ProjectStatus.ARCHIVED]: 100
  };
  
  return progressMap[this.status as string] || 0;
};

export const Project = mongoose.model<IProject>('Project', ProjectSchema);
