import mongoose, { Document, Schema } from 'mongoose';

export enum MemberRole {
  OWNER = 'owner',
  MEMBER = 'member'
}

export interface ITeamMember extends Document {
  ownerId: mongoose.Types.ObjectId;
  memberId: mongoose.Types.ObjectId;
  role: MemberRole;
  hasProjectAccess: boolean;
  hasChatAccess: boolean;
  lastAccessedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const teamMemberSchema = new Schema<ITeamMember>(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    memberId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: Object.values(MemberRole),
      default: MemberRole.MEMBER
    },
    hasProjectAccess: {
      type: Boolean,
      default: true
    },
    hasChatAccess: {
      type: Boolean,
      default: true
    },
    lastAccessedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true,
    collection: 'team_members'
  }
);

// Unique compound index to prevent duplicate team memberships
teamMemberSchema.index({ ownerId: 1, memberId: 1 }, { unique: true });

// Additional indexes for performance
teamMemberSchema.index({ ownerId: 1 });
teamMemberSchema.index({ memberId: 1 });
teamMemberSchema.index({ role: 1 });

export const TeamMember = mongoose.model<ITeamMember>('TeamMember', teamMemberSchema);
