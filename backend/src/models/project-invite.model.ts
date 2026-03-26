import mongoose, { Document, Schema } from 'mongoose';

export interface IProjectInvite extends Document {
  projectId: mongoose.Types.ObjectId;
  email: string;
  role: 'view' | 'edit' | 'owner';
  token: string;
  expiresAt: Date;
  acceptedAt?: Date;
  acceptedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  createdBy: mongoose.Types.ObjectId;
}

const ProjectInviteSchema = new Schema<IProjectInvite>({
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'ProjectEntity',
    required: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['view', 'edit', 'owner'],
    required: true,
    default: 'view'
  },
  token: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  expiresAt: {
    type: Date,
    required: true,
    index: true
  },
  acceptedAt: {
    type: Date
  },
  acceptedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: false
});

// Index for cleaning up expired invites
ProjectInviteSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Compound index for checking existing invites
ProjectInviteSchema.index({ projectId: 1, email: 1 });

export const ProjectInvite = mongoose.model<IProjectInvite>('ProjectInvite', ProjectInviteSchema);
