import express, { Request, Response } from 'express';
import financeService from '../services/finance.service';
import { authMiddleware } from '../middleware/auth.middleware';

const router = express.Router();

// Apply auth middleware to all finance routes
router.use(authMiddleware);

/**
 * GET /api/finance/summary
 * Get comprehensive financial summary for the authenticated user
 */
router.get('/summary', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const summary = await financeService.getFinancialSummary(userId);
    res.json(summary);
  } catch (error: any) {
    console.error('Error getting financial summary:', error);
    res.status(500).json({
      error: 'Failed to get financial summary',
      message: error.message,
    });
  }
});

/**
 * POST /api/finance/sync
 * Sync earnings from all connected platforms
 */
router.post('/sync', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const result = await financeService.syncAllPlatforms(userId);
    res.json(result);
  } catch (error: any) {
    console.error('Error syncing platforms:', error);
    res.status(500).json({
      error: 'Failed to sync platforms',
      message: error.message,
    });
  }
});

/**
 * POST /api/finance/sync/:platform
 * Sync earnings from a specific platform
 */
router.post('/sync/:platform', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { platform } = req.params;
    const result = await financeService.syncPlatformEarnings(userId, platform);
    res.json(result);
  } catch (error: any) {
    console.error(`Error syncing ${req.params.platform}:`, error);
    res.status(500).json({
      error: `Failed to sync ${req.params.platform}`,
      message: error.message,
    });
  }
});

/**
 * GET /api/finance/platforms
 * Get list of connected platforms
 */
router.get('/platforms', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const platforms = await financeService.getConnectedPlatforms(userId);
    res.json(platforms);
  } catch (error: any) {
    console.error('Error getting platforms:', error);
    res.status(500).json({
      error: 'Failed to get platforms',
      message: error.message,
    });
  }
});

/**
 * POST /api/finance/platforms/connect
 * Connect a new platform
 */
router.post('/platforms/connect', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const {
      platform,
      accessToken,
      refreshToken,
      tokenExpiry,
      platformUserId,
      platformUsername,
    } = req.body;

    if (!platform || !accessToken) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'platform and accessToken are required',
      });
    }

    const connection = await financeService.connectPlatform(
      userId,
      platform,
      accessToken,
      refreshToken,
      tokenExpiry,
      platformUserId,
      platformUsername
    );

    res.json({
      success: true,
      message: `Successfully connected ${platform}`,
      connection: {
        platform: connection.platform,
        platformUsername: connection.platformUsername,
        lastSynced: connection.lastSyncedAt,
      },
    });
  } catch (error: any) {
    console.error('Error connecting platform:', error);
    res.status(500).json({
      error: 'Failed to connect platform',
      message: error.message,
    });
  }
});

/**
 * DELETE /api/finance/platforms/:platform
 * Disconnect a platform
 */
router.delete('/platforms/:platform', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { platform } = req.params;
    const result = await financeService.disconnectPlatform(userId, platform);
    res.json(result);
  } catch (error: any) {
    console.error('Error disconnecting platform:', error);
    res.status(500).json({
      error: 'Failed to disconnect platform',
      message: error.message,
    });
  }
});

/**
 * GET /api/finance/oauth/:platform/authorize
 * Initiate OAuth flow for a platform
 */
router.get('/oauth/:platform/authorize', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { platform } = req.params;
    
    const baseUrl = process.env.BACKEND_URL || 'http://localhost:3002';
    const redirectUri = `${baseUrl}/api/finance/oauth/${platform}/callback`;
    
    let authUrl = '';
    
    switch (platform) {
      case 'upwork':
        if (!process.env.UPWORK_CLIENT_ID) {
          return res.status(500).json({ error: 'Upwork client ID not configured' });
        }
        authUrl = `https://www.upwork.com/ab/account-security/oauth2/authorize?` +
          `response_type=code&` +
          `client_id=${process.env.UPWORK_CLIENT_ID}&` +
          `redirect_uri=${encodeURIComponent(redirectUri)}&` +
          `state=${userId}`;
        break;
        
      case 'freelancer':
        if (!process.env.FREELANCER_CLIENT_ID) {
          return res.status(500).json({ error: 'Freelancer client ID not configured' });
        }
        authUrl = `https://accounts.freelancer.com/oauth/authorize?` +
          `response_type=code&` +
          `client_id=${process.env.FREELANCER_CLIENT_ID}&` +
          `redirect_uri=${encodeURIComponent(redirectUri)}&` +
          `state=${userId}&` +
          `scope=basic`;
        break;
        
      case 'fiverr':
        if (!process.env.FIVERR_CLIENT_ID) {
          return res.status(500).json({ error: 'Fiverr client ID not configured' });
        }
        authUrl = `https://www.fiverr.com/oauth/authorize?` +
          `response_type=code&` +
          `client_id=${process.env.FIVERR_CLIENT_ID}&` +
          `redirect_uri=${encodeURIComponent(redirectUri)}&` +
          `state=${userId}`;
        break;
        
      default:
        return res.status(400).json({ error: 'Unsupported platform' });
    }
    
    res.json({ authUrl });
  } catch (error: any) {
    console.error('Error generating auth URL:', error);
    res.status(500).json({
      error: 'Failed to generate authorization URL',
      message: error.message,
    });
  }
});

/**
 * GET /api/finance/oauth/:platform/callback
 * Handle OAuth callback from platform
 */
router.get('/oauth/:platform/callback', async (req: Request, res: Response) => {
  try {
    const { platform } = req.params;
    const { code, state: userId } = req.query;
    
    if (!code || !userId) {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      return res.redirect(`${frontendUrl}/dashboard?error=oauth_failed`);
    }
    
    const axios = require('axios');
    const baseUrl = process.env.BACKEND_URL || 'http://localhost:3002';
    const redirectUri = `${baseUrl}/api/finance/oauth/${platform}/callback`;
    
    let tokenResponse;
    let platformData: any = {};
    
    switch (platform) {
      case 'upwork':
        tokenResponse = await axios.post('https://www.upwork.com/api/v3/oauth2/token', {
          grant_type: 'authorization_code',
          code,
          client_id: process.env.UPWORK_CLIENT_ID,
          client_secret: process.env.UPWORK_CLIENT_SECRET,
          redirect_uri: redirectUri,
        });
        
        // Fetch user info
        try {
          const userInfo = await axios.get('https://www.upwork.com/api/hr/v2/users/me', {
            headers: { Authorization: `Bearer ${tokenResponse.data.access_token}` }
          });
          platformData = {
            platformUserId: userInfo.data.user?.id,
            platformUsername: userInfo.data.user?.public_name,
          };
        } catch (e) {
          console.log('Could not fetch Upwork user info');
        }
        break;
        
      case 'freelancer':
        tokenResponse = await axios.post('https://accounts.freelancer.com/oauth/token', {
          grant_type: 'authorization_code',
          code,
          client_id: process.env.FREELANCER_CLIENT_ID,
          client_secret: process.env.FREELANCER_CLIENT_SECRET,
          redirect_uri: redirectUri,
        });
        
        // Fetch user info
        try {
          const userInfo = await axios.get('https://www.freelancer.com/api/projects/0.1/users/self/', {
            headers: { 'Freelancer-OAuth-V1': tokenResponse.data.access_token }
          });
          platformData = {
            platformUserId: userInfo.data.result?.id,
            platformUsername: userInfo.data.result?.username,
          };
        } catch (e) {
          console.log('Could not fetch Freelancer user info');
        }
        break;
        
      case 'fiverr':
        tokenResponse = await axios.post('https://api.fiverr.com/v1/oauth/token', {
          grant_type: 'authorization_code',
          code,
          client_id: process.env.FIVERR_CLIENT_ID,
          client_secret: process.env.FIVERR_CLIENT_SECRET,
          redirect_uri: redirectUri,
        });
        
        // Fetch user info
        try {
          const userInfo = await axios.get('https://api.fiverr.com/v1/seller/me', {
            headers: { Authorization: `Bearer ${tokenResponse.data.access_token}` }
          });
          platformData = {
            platformUserId: userInfo.data.id,
            platformUsername: userInfo.data.username,
          };
        } catch (e) {
          console.log('Could not fetch Fiverr user info');
        }
        break;
        
      default:
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        return res.redirect(`${frontendUrl}/dashboard?error=unsupported_platform`);
    }
    
    const { access_token, refresh_token, expires_in } = tokenResponse.data;
    
    // Store connection
    await financeService.connectPlatform(
      String(userId),
      platform,
      access_token,
      refresh_token,
      expires_in ? new Date(Date.now() + expires_in * 1000) : undefined,
      platformData.platformUserId,
      platformData.platformUsername
    );
    
    console.log(`✅ ${platform} connected successfully for user ${userId}`);
    
    // Redirect back to dashboard with success
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendUrl}/dashboard?connected=${platform}`);
  } catch (error: any) {
    console.error('OAuth callback error:', error.response?.data || error.message);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendUrl}/dashboard?error=connection_failed`);
  }
});

/**
 * POST /api/finance/demo
 * Create demo transactions for testing
 */
router.post('/demo', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    await financeService.createDemoTransactions(userId);
    res.json({
      success: true,
      message: 'Demo transactions created successfully',
    });
  } catch (error: any) {
    console.error('Error creating demo transactions:', error);
    res.status(500).json({
      error: 'Failed to create demo transactions',
      message: error.message,
    });
  }
});

export default router;
