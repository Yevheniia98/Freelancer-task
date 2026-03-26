"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireView = exports.requireEdit = exports.requireOwner = exports.requireProjectRole = void 0;
const project_entity_1 = require("../models/project.entity");
/**
 * Check if user has required role for project
 */
const requireProjectRole = (minRole) => {
    return async (req, res, next) => {
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
            const project = await project_entity_1.ProjectEntity.findById(projectId);
            if (!project) {
                return res.status(404).json({
                    success: false,
                    message: 'Project not found'
                });
            }
            // Check if user is project owner
            if (project.projectOwner?.toString() === userId) {
                req.userRole = 'owner';
                return next();
            }
            // Check if user is in team members
            const member = project.teamMembers?.find(m => m.userId?.toString() === userId);
            if (!member || member.status !== 'active') {
                return res.status(403).json({
                    success: false,
                    message: 'You do not have access to this project'
                });
            }
            // Check role hierarchy: owner > edit > view
            const roleHierarchy = { view: 1, edit: 2, owner: 3 };
            const userRoleLevel = roleHierarchy[member.role] || 0;
            const requiredLevel = roleHierarchy[minRole];
            if (userRoleLevel < requiredLevel) {
                return res.status(403).json({
                    success: false,
                    message: `This action requires '${minRole}' permission. You have '${member.role}' permission.`
                });
            }
            req.userRole = member.role;
            next();
        }
        catch (error) {
            console.error('Permission check error:', error);
            res.status(500).json({
                success: false,
                message: 'Permission check failed'
            });
        }
    };
};
exports.requireProjectRole = requireProjectRole;
/**
 * Only owner can perform this action
 */
exports.requireOwner = (0, exports.requireProjectRole)('owner');
/**
 * Edit or Owner can perform this action
 */
exports.requireEdit = (0, exports.requireProjectRole)('edit');
/**
 * View, Edit or Owner can perform this action
 */
exports.requireView = (0, exports.requireProjectRole)('view');
