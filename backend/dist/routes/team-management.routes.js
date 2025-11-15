"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const team_management_controller_1 = require("../controllers/team-management.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const router = (0, express_1.Router)();
// Initialize controller
team_management_controller_1.TeamManagementController.initialize();
// Rate limiting for invitation endpoints
const inviteRateLimit = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // limit each IP to 10 invitations per windowMs
    message: {
        success: false,
        message: 'Too many invitation attempts, please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false,
});
const acceptRateLimit = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // limit each IP to 20 accept attempts per windowMs
    message: {
        success: false,
        message: 'Too many accept attempts, please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false,
});
/**
 * @route POST /api/team/invite
 * @desc Send team collaboration invitation
 * @access Private
 * @body { inviteEmail: string, inviteeName: string }
 */
router.post('/invite', inviteRateLimit, auth_middleware_1.authenticate, team_management_controller_1.TeamManagementController.sendInvitation);
/**
 * @route POST /api/team/accept
 * @desc Accept team invitation
 * @access Public/Private (can be called with or without auth)
 * @body { token: string }
 */
router.post('/accept', acceptRateLimit, (req, res, next) => {
    // Try to authenticate, but don't require it
    (0, auth_middleware_1.authenticate)(req, res, (error) => {
        // Continue regardless of auth status
        next();
    });
}, team_management_controller_1.TeamManagementController.acceptInvitation);
/**
 * @route GET /api/team/members
 * @desc Get team members and pending invitations
 * @access Private
 */
router.get('/members', auth_middleware_1.authenticate, team_management_controller_1.TeamManagementController.getTeamMembers);
/**
 * @route DELETE /api/team/members/:memberId
 * @desc Remove team member
 * @access Private
 */
router.delete('/members/:memberId', auth_middleware_1.authenticate, team_management_controller_1.TeamManagementController.removeMember);
/**
 * @route DELETE /api/team/invitations/:invitationId
 * @desc Cancel pending invitation
 * @access Private
 */
router.delete('/invitations/:invitationId', auth_middleware_1.authenticate, team_management_controller_1.TeamManagementController.cancelInvitation);
/**
 * @route GET /api/team/invitation/:token
 * @desc Get invitation details by token (for invite acceptance page)
 * @access Public
 */
router.get('/invitation/:token', team_management_controller_1.TeamManagementController.getInvitationDetails);
exports.default = router;
