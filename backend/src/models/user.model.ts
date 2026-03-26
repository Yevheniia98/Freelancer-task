import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  username?: string;
  phoneNumber?: string;
  phone?: string;
  country?: string;
  profileImage?: string;
  gender?: string;
  payment?: number;
  currentProject?: string;
  skills?: string[];
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  invitedBy?: mongoose.Types.ObjectId; // User who invited this user
  inviteToken?: string; // Token from the invitation
  isInvitedUser: boolean; // Whether this user joined via invitation (gets free access)
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    fullName: {
      type: String,
      trim: true,
    },
    username: {
      type: String,
      trim: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
    },
    profileImage: {
      type: String,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      default: 'male',
    },
    payment: {
      type: Number,
      default: 0,
    },
    currentProject: {
      type: String,
      trim: true,
    },
    skills: {
      type: [String],
      default: [],
    },
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    twoFactorSecret: {
      type: String,
      select: false,
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    invitedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    inviteToken: {
      type: String,
      default: null
    },
    isInvitedUser: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
  }
);

// Create indexes
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ resetPasswordToken: 1 }, { sparse: true });

export const User = mongoose.model<IUser>('User', userSchema);