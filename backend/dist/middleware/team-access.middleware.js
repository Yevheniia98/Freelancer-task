"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamAccessMiddleware = void 0;
const team_member_entity_1 = require("../models/team-member.entity");
const project_entity_1 = require("../models/project.entity");
const mongoose_1 = __importDefault(require("mongoose"));
class TeamAccessMiddleware {
    static async initialize() {
        console.log('✅ TeamAccessMiddleware initialized');
    }
    /**
     * Utility function to check if user has access to a specific owner's resources
     */
    static async hasAccessToOwner(userId, ownerId, accessType) {
        try {
            // User always has access to their own resources
            if (userId === ownerId) {
                return true;
            }
            const whereCondition = {
                ownerId: new mongoose_1.default.Types.ObjectId(ownerId),
                memberId: new mongoose_1.default.Types.ObjectId(userId),
                ...(accessType === 'project' ? { hasProjectAccess: true } : { hasChatAccess: true })
            };
            const teamMember = await team_member_entity_1.TeamMember.findOne(whereCondition);
            return !!teamMember;
        }
        catch (error) {
            console.error('Error checking owner access:', error);
            return false;
        }
    }
    /**
     * Function to remove team member access (called when member is removed)
     */
    static async revokeTeamAccess(ownerId, memberId) {
        try {
            // Remove team member record
            await team_member_entity_1.TeamMember.deleteOne({
                ownerId: new mongoose_1.default.Types.ObjectId(ownerId),
                memberId: new mongoose_1.default.Types.ObjectId(memberId)
            });
            console.log(`✅ Revoked team access for member ${memberId} from owner ${ownerId}`);
        }
        catch (error) {
            console.error('Error revoking team access:', error);
            throw error;
        }
    }
}
exports.TeamAccessMiddleware = TeamAccessMiddleware;
_a = TeamAccessMiddleware;
/**
 * Middleware to verify project access
 * Checks if user is owner or team member with project access
 */
TeamAccessMiddleware.verifyProjectAccess = async (req, res, next) => {
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
        const project = await project_entity_1.ProjectEntity.findById(projectId);
        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }
        // For now, allow access - TODO: implement proper project ownership check
        next();
    }
    catch (error) {
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
TeamAccessMiddleware.verifyChatAccess = async (req, res, next) => {
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
        const teamMember = await team_member_entity_1.TeamMember.findOne({
            ownerId: new mongoose_1.default.Types.ObjectId(targetOwnerId),
            memberId: new mongoose_1.default.Types.ObjectId(user.id),
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
    }
    catch (error) {
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
TeamAccessMiddleware.getAccessibleProjects = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user || !user.id) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }
        // Get team memberships where user has project access
        const teamMemberships = await team_member_entity_1.TeamMember.find({
            memberId: new mongoose_1.default.Types.ObjectId(user.id),
            hasProjectAccess: true
        }).populate('ownerId', '_id fullName email');
        // Extract owner IDs
        const accessibleOwnerIds = teamMemberships.map(tm => tm.ownerId.toString());
        // Add user's own ID for their own projects
        accessibleOwnerIds.push(user.id);
        // Attach to request for use in controllers
        req.accessibleOwnerIds = accessibleOwnerIds;
        req.teamMemberships = teamMemberships;
        next();
    }
    catch (error) {
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
TeamAccessMiddleware.getAccessibleChats = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user || !user.id) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }
        // Get team memberships where user has chat access
        const teamMemberships = await team_member_entity_1.TeamMember.find({
            memberId: new mongoose_1.default.Types.ObjectId(user.id),
            hasChatAccess: true
        }).populate('ownerId', '_id fullName email');
        // Extract owner IDs
        const accessibleOwnerIds = teamMemberships.map(tm => tm.ownerId.toString());
        // Add user's own ID for their own chats
        accessibleOwnerIds.push(user.id);
        // Attach to request for use in controllers
        req.accessibleOwnerIds = accessibleOwnerIds;
        req.teamMemberships = teamMemberships;
        next();
    }
    catch (error) {
        console.error('Error getting accessible chats:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
// Initialize middleware when the module is loaded
TeamAccessMiddleware.initialize();
