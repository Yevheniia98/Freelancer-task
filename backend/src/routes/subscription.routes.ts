import { Router, Request, Response } from 'express';
import { SubscriptionService } from '../services/subscription.service';
import { authMiddleware } from '../middleware/auth.middleware';
import { SubscriptionPlan } from '../models/subscription.model';

const router = Router();
const subscriptionService = new SubscriptionService();

// Get current subscription
router.get('/subscription', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
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

  } catch (error: any) {
    console.error('Error fetching subscription:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subscription',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Upgrade subscription
router.post('/subscription/upgrade', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { plan } = req.body;

    if (!plan || !Object.values(SubscriptionPlan).includes(plan)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid subscription plan'
      });
    }

    if (plan === SubscriptionPlan.FREE) {
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

  } catch (error: any) {
    console.error('Error upgrading subscription:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to upgrade subscription',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Cancel subscription
router.post('/subscription/cancel', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    
    const subscription = await subscriptionService.cancelSubscription(userId);
    const stats = await subscriptionService.getSubscriptionStats(userId);

    res.json({
      success: true,
      message: 'Subscription cancelled successfully',
      subscription: stats
    });

  } catch (error: any) {
    console.error('Error cancelling subscription:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to cancel subscription',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Check if user can invite more members
router.get('/subscription/can-invite', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const result = await subscriptionService.canUserInvite(userId);

    res.json({
      success: true,
      ...result
    });

  } catch (error: any) {
    console.error('Error checking invite eligibility:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check invite eligibility',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get all available plans
router.get('/subscription/plans', async (req: Request, res: Response) => {
  try {
    const { Subscription } = await import('../models/subscription.model');
    
    const plans = [
      {
        id: SubscriptionPlan.FREE,
        ...(Subscription as any).getPlanDetails(SubscriptionPlan.FREE)
      },
      {
        id: SubscriptionPlan.STARTUP,
        ...(Subscription as any).getPlanDetails(SubscriptionPlan.STARTUP)
      },
      {
        id: SubscriptionPlan.PRO,
        ...(Subscription as any).getPlanDetails(SubscriptionPlan.PRO)
      }
    ];

    res.json({
      success: true,
      plans
    });

  } catch (error: any) {
    console.error('Error fetching plans:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch plans',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;
