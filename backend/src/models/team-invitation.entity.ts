import mongoose, { Document, Schema } from 'mongoose';

export enum InvitationStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted', 
  REJECTED = 'rejected',
  EXPIRED = 'expired'
}

export interface ITeamInvitation extends Document {
  inviteEmail: string;
  inviteeName: string;
  inviterId: mongoose.Types.ObjectId;
  inviteeId?: mongoose.Types.ObjectId;
  token: string;
  status: InvitationStatus;
  expiresAt: Date;
  acceptedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const teamInvitationSchema = new Schema<ITeamInvitation>(
  {
    inviteEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    inviteeName: {
      type: String,
      required: true,
      trim: true
    },
    inviterId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    inviteeId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    token: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: Object.values(InvitationStatus),
      default: InvitationStatus.PENDING
    },
    expiresAt: {
      type: Date,
      required: true
    },
    acceptedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true,
    collection: 'team_invitations'
  }
);

// Indexes for better performance
teamInvitationSchema.index({ inviteEmail: 1, inviterId: 1 });
teamInvitationSchema.index({ token: 1 });
teamInvitationSchema.index({ expiresAt: 1 });
teamInvitationSchema.index({ status: 1 });

export const TeamInvitation = mongoose.model<ITeamInvitation>('TeamInvitation', teamInvitationSchema);
