import { Request, Response } from 'express';
import { FreelancerIntegrationManager } from '../services/integration.manager';
import { Project } from '../models/project.model';
import { validationResult } from 'express-validator';
import mongoose from 'mongoose';
import SessionManager from '../services/session.manager';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    fullName: string;
  };
  session: any; // Add session type to avoid TypeScript errors
}

export class ProjectIntegrationController {
  private integrationManager: FreelancerIntegrationManager;
  private sessionManager: SessionManager;

  constructor() {
    this.integrationManager = new FreelancerIntegrationManager();
    this.sessionManager = SessionManager.getInstance();
  }

  // Get all projects (internal + external)
  getAllProjects = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const { platform, status, type, page = 1, limit = 20 } = req.query;
      
      // Build query
      const query: any = { userId };
      
      if (platform) {
        query['externalSource.platform'] = platform;
      }
      
      if (status) {
        query.status = status;
      }
      
      if (type) {
        query.type = type;
      }

      const skip = (Number(page) - 1) * Number(limit);
      
      const [projects, totalCount] = await Promise.all([
        Project.find(query)
          .populate('assignedTo', 'fullName email')
          .populate('teamMembers', 'fullName email')
          .populate('createdBy', 'fullName email')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(Number(limit)),
        Project.countDocuments(query)
      ]);

      res.json({
        success: true,
        data: {
          projects,
          pagination: {
            current: Number(page),
            limit: Number(limit),
            total: totalCount,
            pages: Math.ceil(totalCount / Number(limit))
          }
        }
      });

    } catch (error) {
      console.error('Get projects error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch projects',
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  };

  // Connect to a freelancer platform
  connectPlatform = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { platform, credentials } = req.body;

      if (!platform || !credentials) {
        return res.status(400).json({
          success: false,
          message: 'Platform and credentials are required'
        });
      }

      const connected = await this.integrationManager.connectPlatform(platform, credentials);

      if (connected) {
        res.json({
          success: true,
          message: `Successfully connected to ${platform}`,
          data: { platform, connected: true }
        });
      } else {
        res.status(400).json({
          success: false,
          message: `Failed to connect to ${platform}. Please check your credentials.`
        });
      }

    } catch (error) {
      console.error('Connect platform error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to connect to platform',
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  };

  // Disconnect from a platform
  disconnectPlatform = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { platform } = req.params;

      const disconnected = await this.integrationManager.disconnectPlatform(platform);

      if (disconnected) {
        res.json({
          success: true,
          message: `Successfully disconnected from ${platform}`,
          data: { platform, connected: false }
        });
      } else {
        res.status(400).json({
          success: false,
          message: `Failed to disconnect from ${platform}`
        });
      }

    } catch (error) {
      console.error('Disconnect platform error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to disconnect from platform',
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  };

  // Get connected platforms status
  getConnectedPlatforms = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const platforms = await this.integrationManager.getConnectedPlatforms();

      res.json({
        success: true,
        data: { platforms }
      });

    } catch (error) {
      console.error('Get platforms error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch platform status',
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  };

  // Sync projects from all connected platforms
  syncAllPlatforms = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const results = await this.integrationManager.syncAllPlatforms(userId);

      // Calculate summary
      const summary = {
        totalPlatforms: results.length,
        successfulSyncs: results.filter(r => r.success).length,
        totalProjectsFound: results.reduce((sum, r) => sum + r.projectsFound, 0),
        totalProjectsSynced: results.reduce((sum, r) => sum + r.projectsSynced, 0),
        totalErrors: results.reduce((sum, r) => sum + r.errors.length, 0)
      };

      res.json({
        success: true,
        message: 'Platform sync completed',
        data: {
          summary,
          results
        }
      });

    } catch (error) {
      console.error('Sync all platforms error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to sync platforms',
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  };

  // Sync projects from a specific platform
  syncPlatform = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      const { platform } = req.params;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      if (!platform) {
        return res.status(400).json({
          success: false,
          message: 'Platform name is required'
        });
      }

      const result = await this.integrationManager.syncPlatform(platform, userId);

      res.json({
        success: result.success,
        message: result.success ? 
          `Successfully synced ${result.projectsSynced} projects from ${platform}` :
          `Sync failed for ${platform}`,
        data: result
      });

    } catch (error) {
      console.error('Sync platform error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to sync platform',
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  };

  // Get projects from external platforms
  getExternalProjects = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      const { platform } = req.query;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const projects = await this.integrationManager.getProjectsByPlatform(
        userId, 
        platform as string
      );

      res.json({
        success: true,
        data: {
          projects,
          count: projects.length
        }
      });

    } catch (error) {
      console.error('Get external projects error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch external projects',
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  };

  // Resync a specific project
  resyncProject = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { projectId } = req.params;

      const success = await this.integrationManager.resyncProject(projectId);

      if (success) {
        res.json({
          success: true,
          message: 'Project resynced successfully'
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'Failed to resync project'
        });
      }

    } catch (error) {
      console.error('Resync project error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to resync project',
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  };

  // Get project statistics
  getProjectStats = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const [
        totalProjects,
        externalProjects,
        activeProjects,
        completedProjects,
        projectsByPlatform
      ] = await Promise.all([
        Project.countDocuments({ userId: new mongoose.Types.ObjectId(userId) }),
        Project.countDocuments({ userId: new mongoose.Types.ObjectId(userId), type: 'external' }),
        Project.countDocuments({ userId: new mongoose.Types.ObjectId(userId), status: 'active' }),
        Project.countDocuments({ userId: new mongoose.Types.ObjectId(userId), status: 'completed' }),
        Project.aggregate([
          { $match: { userId: new mongoose.Types.ObjectId(userId), type: 'external' } },
          { $group: { 
            _id: '$externalSource.platform', 
            count: { $sum: 1 },
            totalBudget: { $sum: '$budget.amount' }
          }},
          { $sort: { count: -1 } }
        ])
      ]);

      res.json({
        success: true,
        data: {
          summary: {
            totalProjects,
            externalProjects,
            internalProjects: totalProjects - externalProjects,
            activeProjects,
            completedProjects
          },
          platformBreakdown: projectsByPlatform
        }
      });

    } catch (error) {
      console.error('Get project stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch project statistics',
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  };

  // OAuth endpoints for Upwork integration
  initiateUpworkOAuth = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      const ipAddress = req.ip || req.connection.remoteAddress || 'unknown';
      const userAgent = req.get('User-Agent');
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const upworkService = this.integrationManager.getUpworkService();
      
      if (!upworkService) {
        return res.status(500).json({
          success: false,
          message: 'Upwork service not available'
        });
      }

      const { authUrl, requestToken } = await upworkService.getRequestToken();

      // Create OAuth session using Session Manager
      const redirectUrl = req.body.redirectUrl || req.query.redirectUrl as string;
      const oauthSession = await this.sessionManager.createOAuthState(
        userId,
        'upwork',
        redirectUrl,
        { requestToken }
      );

      // Update OAuth session with request token
      await this.sessionManager.updateOAuthSession(oauthSession.sessionId, {
        requestToken
      });

      res.json({
        success: true,
        data: {
          authUrl,
          state: oauthSession.state,
          sessionId: oauthSession.sessionId
        }
      });

    } catch (error) {
      console.error('Upwork OAuth initiation failed:', error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'OAuth initiation failed',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  };

  handleUpworkCallback = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { oauth_token, oauth_verifier, state } = req.query;
      const userId = req.user?.id;
      const ipAddress = req.ip || req.connection.remoteAddress || 'unknown';

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      if (!oauth_token || !oauth_verifier) {
        return res.status(400).json({
          success: false,
          message: 'Missing OAuth parameters'
        });
      }

      // Retrieve OAuth session using state parameter
      let oauthSession = null;
      if (state) {
        oauthSession = await this.sessionManager.getOAuthSessionByState(state as string);
        
        if (!oauthSession || oauthSession.userId !== userId) {
          return res.status(400).json({
            success: false,
            message: 'Invalid or expired OAuth state'
          });
        }
      }

      const upworkService = this.integrationManager.getUpworkService();
      
      if (!upworkService) {
        return res.status(500).json({
          success: false,
          message: 'Upwork service not available'
        });
      }

      const success = await upworkService.handleOAuthCallback(
        oauth_token as string, 
        oauth_verifier as string
      );

      if (!success) {
        // Clean up OAuth session on failure
        if (oauthSession) {
          await this.sessionManager.destroyOAuthSession(oauthSession.sessionId);
        }
        
        return res.status(400).json({
          success: false,
          message: 'OAuth callback handling failed'
        });
      }

      // Mark platform as connected for the user
      await this.integrationManager.connectPlatform('upwork', userId);

      // Clean up OAuth session on success
      if (oauthSession) {
        await this.sessionManager.destroyOAuthSession(oauthSession.sessionId);
      }

      // Redirect to frontend success page
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
      const redirectUrl = oauthSession?.redirectUrl || `${frontendUrl}/settings/integrations?success=true`;
      res.redirect(redirectUrl);

    } catch (error) {
      console.error('Upwork OAuth callback failed:', error);
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
      res.redirect(`${frontendUrl}/settings/integrations?success=false&message=${encodeURIComponent('OAuth authentication failed')}`);
    }
  };
}
