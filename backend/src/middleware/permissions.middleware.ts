import { Request, Response, NextFunction } from 'express';
import { ProjectEntity } from '../models/project.entity';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

/**
 * Check if user has required role for project
 */
export const requireProjectRole = (minRole: 'view' | 'edit' | 'owner') => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const projectId = req.params.id || req.body.projectId;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      if (!projectId) {
        return res.status(400).json({
          success: false,
          message: 'Project ID required'
        });
      }

      const project = await ProjectEntity.findById(projectId);
      
      if (!project) {
        return res.status(404).json({
          success: false,
          message: 'Project not found'
        });
      }

      // Check if user is project owner
      if (project.projectOwner?.toString() === userId) {
        (req as any).userRole = 'owner';
        return next();
      }

      // Check if user is in team members
      const member = project.teamMembers?.find(
        m => m.userId?.toString() === userId
      );

      if (!member || member.status !== 'active') {
        return res.status(403).json({
          success: false,
          message: 'You do not have access to this project'
        });
      }

      // Check role hierarchy: owner > edit > view
      const roleHierarchy = { view: 1, edit: 2, owner: 3 };
      const userRoleLevel = roleHierarchy[member.role as 'view' | 'edit' | 'owner'] || 0;
      const requiredLevel = roleHierarchy[minRole];

      if (userRoleLevel < requiredLevel) {
        return res.status(403).json({
          success: false,
          message: `This action requires '${minRole}' permission. You have '${member.role}' permission.`
        });
      }

      (req as any).userRole = member.role;
      next();
    } catch (error) {
      console.error('Permission check error:', error);
      res.status(500).json({
        success: false,
        message: 'Permission check failed'
      });
    }
  };
};

/**
 * Only owner can perform this action
 */
export const requireOwner = requireProjectRole('owner');

/**
 * Edit or Owner can perform this action
 */
export const requireEdit = requireProjectRole('edit');

/**
 * View, Edit or Owner can perform this action
 */
export const requireView = requireProjectRole('view');
