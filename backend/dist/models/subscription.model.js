"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subscription = exports.SubscriptionStatus = exports.SubscriptionPlan = void 0;
const mongoose_1 = __importStar(require("mongoose"));
var SubscriptionPlan;
(function (SubscriptionPlan) {
    SubscriptionPlan["FREE"] = "free";
    SubscriptionPlan["STARTUP"] = "startup";
    SubscriptionPlan["PRO"] = "pro";
})(SubscriptionPlan || (exports.SubscriptionPlan = SubscriptionPlan = {}));
var SubscriptionStatus;
(function (SubscriptionStatus) {
    SubscriptionStatus["ACTIVE"] = "active";
    SubscriptionStatus["CANCELLED"] = "cancelled";
    SubscriptionStatus["EXPIRED"] = "expired";
    SubscriptionStatus["PAST_DUE"] = "past_due";
})(SubscriptionStatus || (exports.SubscriptionStatus = SubscriptionStatus = {}));
const subscriptionSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
}, {
    timestamps: true,
    collection: 'subscriptions'
});
// Indexes for performance
subscriptionSchema.index({ userId: 1 }, { unique: true });
subscriptionSchema.index({ plan: 1, status: 1 });
subscriptionSchema.index({ status: 1 });
subscriptionSchema.index({ nextPaymentDate: 1 });
// Static method to get plan details
subscriptionSchema.statics.getPlanDetails = function (plan) {
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
subscriptionSchema.methods.canInviteMore = function () {
    // Free plan cannot invite anyone
    if (this.plan === SubscriptionPlan.FREE) {
        return false;
    }
    // Check if current invites are below max
    return this.currentInvites < this.maxInvites;
};
// Instance method to get remaining invites
subscriptionSchema.methods.getRemainingInvites = function () {
    if (this.plan === SubscriptionPlan.FREE) {
        return 0;
    }
    return Math.max(0, this.maxInvites - this.currentInvites);
};
exports.Subscription = mongoose_1.default.model('Subscription', subscriptionSchema);
