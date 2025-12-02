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
const express_1 = require("express");
const subscription_service_1 = require("../services/subscription.service");
const auth_middleware_1 = require("../middleware/auth.middleware");
const subscription_model_1 = require("../models/subscription.model");
const router = (0, express_1.Router)();
const subscriptionService = new subscription_service_1.SubscriptionService();
// Get current subscription
router.get('/subscription', auth_middleware_1.authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId;
        const stats = await subscriptionService.getSubscriptionStats(userId);
        if (!stats) {
            return res.status(404).json({
                success: false,
                message: 'Subscription not found'
            });
        }
        res.json({
            success: true,
            subscription: stats
        });
    }
    catch (error) {
        console.error('Error fetching subscription:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch subscription',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});
// Upgrade subscription
router.post('/subscription/upgrade', auth_middleware_1.authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { plan } = req.body;
        if (!plan || !Object.values(subscription_model_1.SubscriptionPlan).includes(plan)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid subscription plan'
            });
        }
        if (plan === subscription_model_1.SubscriptionPlan.FREE) {
            return res.status(400).json({
                success: false,
                message: 'Cannot upgrade to free plan. Use cancel endpoint instead.'
            });
        }
        const subscription = await subscriptionService.upgradeSubscription(userId, plan);
        const stats = await subscriptionService.getSubscriptionStats(userId);
        res.json({
            success: true,
            message: `Successfully upgraded to ${plan} plan`,
            subscription: stats
        });
    }
    catch (error) {
        console.error('Error upgrading subscription:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to upgrade subscription',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});
// Cancel subscription
router.post('/subscription/cancel', auth_middleware_1.authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId;
        const subscription = await subscriptionService.cancelSubscription(userId);
        const stats = await subscriptionService.getSubscriptionStats(userId);
        res.json({
            success: true,
            message: 'Subscription cancelled successfully',
            subscription: stats
        });
    }
    catch (error) {
        console.error('Error cancelling subscription:', error);
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to cancel subscription',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});
// Check if user can invite more members
router.get('/subscription/can-invite', auth_middleware_1.authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId;
        const result = await subscriptionService.canUserInvite(userId);
        res.json({
            success: true,
            ...result
        });
    }
    catch (error) {
        console.error('Error checking invite eligibility:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to check invite eligibility',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});
// Get all available plans
router.get('/subscription/plans', async (req, res) => {
    try {
        const { Subscription } = await Promise.resolve().then(() => __importStar(require('../models/subscription.model')));
        const plans = [
            {
                id: subscription_model_1.SubscriptionPlan.FREE,
                ...Subscription.getPlanDetails(subscription_model_1.SubscriptionPlan.FREE)
            },
            {
                id: subscription_model_1.SubscriptionPlan.STARTUP,
                ...Subscription.getPlanDetails(subscription_model_1.SubscriptionPlan.STARTUP)
            },
            {
                id: subscription_model_1.SubscriptionPlan.PRO,
                ...Subscription.getPlanDetails(subscription_model_1.SubscriptionPlan.PRO)
            }
        ];
        res.json({
            success: true,
            plans
        });
    }
    catch (error) {
        console.error('Error fetching plans:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch plans',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});
exports.default = router;
