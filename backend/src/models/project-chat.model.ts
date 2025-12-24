import mongoose, { Schema, Document } from 'mongoose';

export interface IProjectChatMessage extends Document {
  projectId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  userName: string;
  userEmail: string;
  message: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectChatMessageSchema = new Schema<IProjectChatMessage>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      index: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    userName: {
      type: String,
      required: true
    },
    userEmail: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true,
      maxlength: 5000
    },
    fileUrl: {
      type: String
    },
    fileName: {
      type: String
    },
    fileSize: {
      type: Number
    },
    fileType: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

// Create compound index for efficient querying
ProjectChatMessageSchema.index({ projectId: 1, createdAt: -1 });

export const ProjectChatMessage = mongoose.model<IProjectChatMessage>(
  'ProjectChatMessage',
  ProjectChatMessageSchema
);
