import mongoose, { Document, Schema } from 'mongoose';

export enum SubscriptionPlan {
  FREE = 'free',
  STARTUP = 'startup',
  PRO = 'pro'
}

export enum SubscriptionStatus {
  ACTIVE = 'active',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
  PAST_DUE = 'past_due'
}

export interface ISubscription extends Document {
  userId: mongoose.Types.ObjectId;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  maxInvites: number; // Max number of people the user can invite
  currentInvites: number; // Current number of active invitations/members
  price: number; // Monthly price in euros
  startDate: Date;
  endDate?: Date;
  cancelledAt?: Date;
  lastPaymentDate?: Date;
  nextPaymentDate?: Date;
  paymentMethod?: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const subscriptionSchema = new Schema<ISubscription>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true // Each user has only one subscription
    },
    plan: {
      type: String,
      enum: Object.values(SubscriptionPlan),
      default: SubscriptionPlan.FREE,
      required: true
    },
    status: {
      type: String,
      enum: Object.values(SubscriptionStatus),
      default: SubscriptionStatus.ACTIVE,
      required: true
    },
    maxInvites: {
      type: Number,
      required: true,
      default: 0 // Free plan allows 0 invites
    },
    currentInvites: {
      type: Number,
      default: 0,
      required: true
    },
    price: {
      type: Number,
      default: 0,
      required: true
    },
    startDate: {
      type: Date,
      default: Date.now,
      required: true
    },
    endDate: {
      type: Date,
      default: null
    },
    cancelledAt: {
      type: Date,
      default: null
    },
    lastPaymentDate: {
      type: Date,
      default: null
    },
    nextPaymentDate: {
      type: Date,
      default: null
    },
    paymentMethod: {
      type: String,
      default: null
    },
    stripeCustomerId: {
      type: String,
      default: null
    },
    stripeSubscriptionId: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true,
    collection: 'subscriptions'
  }
);

// Indexes for performance
subscriptionSchema.index({ userId: 1 }, { unique: true });
subscriptionSchema.index({ plan: 1, status: 1 });
subscriptionSchema.index({ status: 1 });
subscriptionSchema.index({ nextPaymentDate: 1 });

// Static method to get plan details
subscriptionSchema.statics.getPlanDetails = function(plan: SubscriptionPlan) {
  const planDetails = {
    [SubscriptionPlan.FREE]: {
      name: 'Free',
      price: 0,
      maxInvites: 0,
      features: [
        '1 user only (no team members)',
        'Basic project management',
        'Task tracking',
        'Personal workspace'
      ]
    },
    [SubscriptionPlan.STARTUP]: {
      name: 'Startup',
      price: 30,
      maxInvites: 2,
      features: [
        'Up to 3 total users (1 owner + 2 invited members)',
        'Team collaboration',
        'Team chat & messaging',
        'Shared projects',
        'File sharing',
        'Calendar integration',
        'Priority support'
      ]
    },
    [SubscriptionPlan.PRO]: {
      name: 'Pro',
      price: 150,
      maxInvites: 5,
      features: [
        'Up to 6 total users (1 owner + 5 invited members)',
        'All Startup features',
        'CRM integration',
        'Advanced analytics',
        'Custom workflows',
        'API access',
        'Dedicated support',
        'Extended team collaboration'
      ]
    }
  };
  
  return planDetails[plan];
};

// Instance method to check if user can invite more members
subscriptionSchema.methods.canInviteMore = function(): boolean {
  // Free plan cannot invite anyone
  if (this.plan === SubscriptionPlan.FREE) {
    return false;
  }
  
  // Check if current invites are below max
  return this.currentInvites < this.maxInvites;
};

// Instance method to get remaining invites
subscriptionSchema.methods.getRemainingInvites = function(): number {
  if (this.plan === SubscriptionPlan.FREE) {
    return 0;
  }
  
  return Math.max(0, this.maxInvites - this.currentInvites);
};

export const Subscription = mongoose.model<ISubscription>('Subscription', subscriptionSchema);
