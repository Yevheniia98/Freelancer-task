"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionService = void 0;
const subscription_model_1 = require("../models/subscription.model");
class SubscriptionService {
    /**
     * Create a free subscription for a new user
     */
    async createFreeSubscription(userId) {
        const subscription = new subscription_model_1.Subscription({
            userId,
            plan: subscription_model_1.SubscriptionPlan.FREE,
            status: subscription_model_1.SubscriptionStatus.ACTIVE,
            maxInvites: 0,
            currentInvites: 0,
            price: 0,
            startDate: new Date()
        });
        await subscription.save();
        return subscription;
    }
    /**
     * Get user's subscription
     */
    async getUserSubscription(userId) {
        return await subscription_model_1.Subscription.findOne({ userId });
    }
    /**
     * Upgrade user's subscription
     */
    async upgradeSubscription(userId, newPlan) {
        const subscription = await subscription_model_1.Subscription.findOne({ userId });
        if (!subscription) {
            throw new Error('Subscription not found');
        }
        // Get plan details
        const planDetails = subscription_model_1.Subscription.getPlanDetails(newPlan);
        // Update subscription
        subscription.plan = newPlan;
        subscription.maxInvites = planDetails.maxInvites;
        subscription.price = planDetails.price;
        subscription.status = subscription_model_1.SubscriptionStatus.ACTIVE;
        subscription.startDate = new Date();
        // Calculate next payment date (30 days from now)
        const nextPayment = new Date();
        nextPayment.setDate(nextPayment.getDate() + 30);
        subscription.nextPaymentDate = nextPayment;
        subscription.lastPaymentDate = new Date();
        await subscription.save();
        return subscription;
    }
    /**
     * Downgrade or cancel subscription
     */
    async cancelSubscription(userId) {
        const subscription = await subscription_model_1.Subscription.findOne({ userId });
        if (!subscription) {
            throw new Error('Subscription not found');
        }
        // If user has active team members, prevent cancellation
        if (subscription.currentInvites > 0) {
            throw new Error(`Cannot downgrade to Free plan while you have ${subscription.currentInvites} active team members. Please remove team members first.`);
        }
        subscription.plan = subscription_model_1.SubscriptionPlan.FREE;
        subscription.maxInvites = 0;
        subscription.price = 0;
        subscription.status = subscription_model_1.SubscriptionStatus.CANCELLED;
        subscription.cancelledAt = new Date();
        subscription.endDate = new Date();
        await subscription.save();
        return subscription;
    }
    /**
     * Check if user can invite more members
     */
    async canUserInvite(userId) {
        const subscription = await subscription_model_1.Subscription.findOne({ userId });
        if (!subscription) {
            return {
                canInvite: false,
                remaining: 0,
                reason: 'No subscription found'
            };
        }
        if (subscription.status !== subscription_model_1.SubscriptionStatus.ACTIVE) {
            return {
                canInvite: false,
                remaining: 0,
                reason: 'Subscription is not active'
            };
        }
        if (subscription.plan === subscription_model_1.SubscriptionPlan.FREE) {
            return {
                canInvite: false,
                remaining: 0,
                reason: 'Free plan does not allow team invitations. Upgrade to Startup ($30/month) to invite 2 members or Pro ($150/month) to invite 5 members.'
            };
        }
        const canInvite = subscription.currentInvites < subscription.maxInvites;
        const remaining = Math.max(0, subscription.maxInvites - subscription.currentInvites);
        if (!canInvite) {
            return {
                canInvite: false,
                remaining: 0,
                reason: `You've reached your invitation limit (${subscription.maxInvites} members). Upgrade to Pro plan to invite up to 5 members.`
            };
        }
        return { canInvite, remaining };
    }
    /**
     * Increment invite count when user invites someone
     */
    async incrementInviteCount(userId) {
        await subscription_model_1.Subscription.findOneAndUpdate({ userId }, { $inc: { currentInvites: 1 } });
    }
    /**
     * Decrement invite count when member leaves or is removed
     */
    async decrementInviteCount(userId) {
        await subscription_model_1.Subscription.findOneAndUpdate({ userId }, { $inc: { currentInvites: -1 } });
    }
    /**
     * Get subscription statistics
     */
    async getSubscriptionStats(userId) {
        const subscription = await this.getUserSubscription(userId);
        if (!subscription) {
            return null;
        }
        const planDetails = subscription_model_1.Subscription.getPlanDetails(subscription.plan);
        return {
            plan: subscription.plan,
            planName: planDetails.name,
            price: planDetails.price,
            status: subscription.status,
            maxInvites: subscription.maxInvites,
            currentInvites: subscription.currentInvites,
            remainingInvites: Math.max(0, subscription.maxInvites - subscription.currentInvites),
            canInviteMore: subscription.currentInvites < subscription.maxInvites && subscription.plan !== subscription_model_1.SubscriptionPlan.FREE,
            features: planDetails.features,
            nextPaymentDate: subscription.nextPaymentDate,
            lastPaymentDate: subscription.lastPaymentDate
        };
    }
}
exports.SubscriptionService = SubscriptionService;
