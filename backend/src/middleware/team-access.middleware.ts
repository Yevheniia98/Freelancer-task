import { Request, Response, NextFunction } from 'express';
import { TeamMember } from '../models/team-member.entity';
import { ProjectEntity } from '../models/project.entity';
import mongoose from 'mongoose';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    fullName: string;
  };
}

export class TeamAccessMiddleware {
  static async initialize() {
    console.log('✅ TeamAccessMiddleware initialized');
  }

  /**
   * Middleware to verify project access
   * Checks if user is owner or team member with project access
   */
  static verifyProjectAccess = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      const { projectId } = req.params;

      if (!user || !user.id) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      if (!projectId) {
        return res.status(400).json({
          success: false,
          message: 'Project ID is required'
        });
      }

      // Get project details to find owner
      // TODO: Fix this when project schema includes user/owner field
      // const project = await ProjectEntity.findById(projectId).populate('user', '_id');
      const project = await ProjectEntity.findById(projectId);

      if (!project) {
        return res.status(404).json({
          success: false,
          message: 'Project not found'
        });
      }

      // For now, allow access - TODO: implement proper project ownership check
      next();

    } catch (error) {
      console.error('Error verifying project access:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  };

  /**
   * Middleware to verify chat access
   * Checks if user is owner or team member with chat access
   */
  static verifyChatAccess = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      const { userId, ownerId } = req.params;
      
      // Extract owner ID from different possible sources
      const targetOwnerId = ownerId || req.body.ownerId || req.query.ownerId;

      if (!user || !user.id) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      if (!targetOwnerId) {
        return res.status(400).json({
          success: false,
          message: 'Owner ID is required for chat access verification'
        });
      }

      // Check if user is the owner
      if (user.id === targetOwnerId) {
        return next(); // Owner has full access
      }

      // Check if user is a team member with chat access
      const teamMember = await TeamMember.findOne({
        ownerId: new mongoose.Types.ObjectId(targetOwnerId),
        memberId: new mongoose.Types.ObjectId(user.id),
        hasChatAccess: true
      });

      if (!teamMember) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You are not authorized to access this chat.'
        });
      }

      // Update last accessed time
      if (teamMember) {
        teamMember.lastAccessedAt = new Date();
        await teamMember.save();
      }

      next();

    } catch (error) {
      console.error('Error verifying chat access:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  };

  /**
   * Middleware to get accessible projects for user
   * Includes own projects and projects from team owners
   */
  static getAccessibleProjects = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const user = req.user;

      if (!user || !user.id) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      // Get team memberships where user has project access
      const teamMemberships = await TeamMember.find({
        memberId: new mongoose.Types.ObjectId(user.id),
        hasProjectAccess: true
      }).populate('ownerId', '_id fullName email');

      // Extract owner IDs
      const accessibleOwnerIds = teamMemberships.map(tm => tm.ownerId.toString());
      
      // Add user's own ID for their own projects
      accessibleOwnerIds.push(user.id);

      // Attach to request for use in controllers
      (req as any).accessibleOwnerIds = accessibleOwnerIds;
      (req as any).teamMemberships = teamMemberships;

      next();

    } catch (error) {
      console.error('Error getting accessible projects:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  };

  /**
   * Middleware to get accessible chats for user
   * Includes own chats and chats from team owners
   */
  static getAccessibleChats = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const user = req.user;

      if (!user || !user.id) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      // Get team memberships where user has chat access
      const teamMemberships = await TeamMember.find({
        memberId: new mongoose.Types.ObjectId(user.id),
        hasChatAccess: true
      }).populate('ownerId', '_id fullName email');

      // Extract owner IDs
      const accessibleOwnerIds = teamMemberships.map(tm => tm.ownerId.toString());
      
      // Add user's own ID for their own chats
      accessibleOwnerIds.push(user.id);

      // Attach to request for use in controllers
      (req as any).accessibleOwnerIds = accessibleOwnerIds;
      (req as any).teamMemberships = teamMemberships;

      next();

    } catch (error) {
      console.error('Error getting accessible chats:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  };

  /**
   * Utility function to check if user has access to a specific owner's resources
   */
  static async hasAccessToOwner(userId: string, ownerId: string, accessType: 'project' | 'chat'): Promise<boolean> {
    try {
      // User always has access to their own resources
      if (userId === ownerId) {
        return true;
      }

      const whereCondition = {
        ownerId: new mongoose.Types.ObjectId(ownerId),
        memberId: new mongoose.Types.ObjectId(userId),
        ...(accessType === 'project' ? { hasProjectAccess: true } : { hasChatAccess: true })
      };

      const teamMember = await TeamMember.findOne(whereCondition);

      return !!teamMember;

    } catch (error) {
      console.error('Error checking owner access:', error);
      return false;
    }
  }

  /**
   * Function to remove team member access (called when member is removed)
   */
  static async revokeTeamAccess(ownerId: string, memberId: string): Promise<void> {
    try {
      // Remove team member record
      await TeamMember.deleteOne({
        ownerId: new mongoose.Types.ObjectId(ownerId),
        memberId: new mongoose.Types.ObjectId(memberId)
      });

      console.log(`✅ Revoked team access for member ${memberId} from owner ${ownerId}`);

    } catch (error) {
      console.error('Error revoking team access:', error);
      throw error;
    }
  }
}

// Initialize middleware when the module is loaded
TeamAccessMiddleware.initialize();