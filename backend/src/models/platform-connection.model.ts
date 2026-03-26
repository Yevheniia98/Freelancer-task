import mongoose, { Document, Schema } from 'mongoose';

export interface IPlatformConnection extends Document {
  userId: mongoose.Types.ObjectId;
  platform: 'upwork' | 'freelancer' | 'fiverr' | 'toptal' | 'guru';
  accessToken: string;
  refreshToken?: string;
  tokenExpiry?: Date;
  platformUserId?: string;
  platformUsername?: string;
  isActive: boolean;
  lastSyncedAt?: Date;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const PlatformConnectionSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    platform: {
      type: String,
      enum: ['upwork', 'freelancer', 'fiverr', 'toptal', 'guru'],
      required: true,
    },
    accessToken: {
      type: String,
      required: true,
      select: false, // Don't return in queries by default
    },
    refreshToken: {
      type: String,
      select: false,
    },
    tokenExpiry: {
      type: Date,
    },
    platformUserId: {
      type: String,
    },
    platformUsername: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastSyncedAt: {
      type: Date,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for unique platform per user
PlatformConnectionSchema.index({ userId: 1, platform: 1 }, { unique: true });

export default mongoose.model<IPlatformConnection>(
  'PlatformConnection',
  PlatformConnectionSchema
);
