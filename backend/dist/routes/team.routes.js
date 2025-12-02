"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const team_management_service_1 = require("../services/team-management.service");
const auth_middleware_1 = require("../middleware/auth.middleware");
const mongoose_1 = __importDefault(require("mongoose"));
const router = (0, express_1.Router)();
const teamService = new team_management_service_1.TeamManagementService();
// Send team invitation
router.post('/invite', auth_middleware_1.authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { email, name } = req.body;
        if (!email || !name) {
            return res.status(400).json({
                success: false,
                message: 'Email and name are required'
            });
        }
        const result = await teamService.sendInvitation(userId, email, name);
        if (!result.success) {
            return res.status(400).json(result);
        }
        res.json({
            success: true,
            message: 'Invitation sent successfully',
            inviteUrl: result.inviteUrl,
            invitation: {
                id: result.invitation?._id,
                email: result.invitation?.inviteEmail,
                name: result.invitation?.inviteeName,
                expiresAt: result.invitation?.expiresAt
            }
        });
    }
    catch (error) {
        console.error('Error sending invitation:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send invitation',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});
// Validate invitation token (public endpoint)
router.get('/invite/validate/:token', async (req, res) => {
    try {
        const { token } = req.params;
        if (!token) {
            return res.status(400).json({
                success: false,
                message: 'Token is required'
            });
        }
        const result = await teamService.validateInvitationToken(token);
        if (!result.valid) {
            return res.status(400).json({
                success: false,
                message: result.error || 'Invalid invitation'
            });
        }
        res.json({
            success: true,
            invitation: result.invitation
        });
    }
    catch (error) {
        console.error('Error validating invitation:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to validate invitation',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});
// Accept invitation and create account (public endpoint)
router.post('/invite/accept', async (req, res) => {
    try {
        const { token, email, password, firstName, lastName } = req.body;
        if (!token || !email || !password || !firstName || !lastName) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }
        const result = await teamService.acceptInvitation(token, {
            email,
            password,
            firstName,
            lastName
        });
        if (!result.success) {
            return res.status(400).json(result);
        }
        res.json({
            success: true,
            message: 'Account created and invitation accepted successfully',
            user: {
                id: result.user?._id,
                email: result.user?.email,
                firstName: result.user?.firstName,
                lastName: result.user?.lastName
            }
        });
    }
    catch (error) {
        console.error('Error accepting invitation:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to accept invitation',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});
// Get team members
router.get('/members', auth_middleware_1.authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId;
        const members = await teamService.getTeamMembers(userId);
        res.json({
            success: true,
            count: members.length,
            members
        });
    }
    catch (error) {
        console.error('Error fetching team members:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch team members',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});
// Search team members
router.get('/members/search', auth_middleware_1.authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { q } = req.query;
        if (!q || typeof q !== 'string') {
            return res.status(400).json({
                success: false,
                message: 'Search query is required'
            });
        }
        const members = await teamService.searchTeamMembers(userId, q);
        res.json({
            success: true,
            count: members.length,
            members
        });
    }
    catch (error) {
        console.error('Error searching team members:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to search team members',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});
// Remove team member
router.delete('/members/:memberId', auth_middleware_1.authMiddleware, async (req, res) => {
    try {
        const ownerId = req.user.userId;
        const { memberId } = req.params;
        if (!memberId) {
            return res.status(400).json({
                success: false,
                message: 'Member ID is required'
            });
        }
        const result = await teamService.removeMember(ownerId, new mongoose_1.default.Types.ObjectId(memberId));
        if (!result.success) {
            return res.status(400).json(result);
        }
        res.json({
            success: true,
            message: 'Team member removed successfully'
        });
    }
    catch (error) {
        console.error('Error removing team member:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to remove team member',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});
// Get pending invitations
router.get('/invitations/pending', auth_middleware_1.authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId;
        const invitations = await teamService.getPendingInvitations(userId);
        res.json({
            success: true,
            count: invitations.length,
            invitations: invitations.map(inv => ({
                id: inv._id,
                email: inv.inviteEmail,
                name: inv.inviteeName,
                status: inv.status,
                expiresAt: inv.expiresAt,
                createdAt: inv.createdAt
            }))
        });
    }
    catch (error) {
        console.error('Error fetching pending invitations:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch pending invitations',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});
exports.default = router;
