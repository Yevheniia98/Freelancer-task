import { Router } from 'express';
import { TeamManagementController } from '../controllers/team-management.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import rateLimit from 'express-rate-limit';

const router = Router();

// Initialize controller
TeamManagementController.initialize();

// Rate limiting for invitation endpoints
const inviteRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 invitations per windowMs
  message: {
    success: false,
    message: 'Too many invitation attempts, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const acceptRateLimit = rateLimit({
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
router.post('/invite', inviteRateLimit, authenticateToken, TeamManagementController.sendInvitation);

/**
 * @route POST /api/team/accept
 * @desc Accept team invitation
 * @access Public/Private (can be called with or without auth)
 * @body { token: string }
 */
router.post('/accept', acceptRateLimit, (req, res, next) => {
  // Try to authenticate, but don't require it
  authenticateToken(req, res, (error) => {
    // Continue regardless of auth status
    next();
  });
}, TeamManagementController.acceptInvitation);

/**
 * @route GET /api/team/members
 * @desc Get team members and pending invitations
 * @access Private
 */
router.get('/members', authenticateToken, TeamManagementController.getTeamMembers);

/**
 * @route DELETE /api/team/members/:memberId
 * @desc Remove team member
 * @access Private
 */
router.delete('/members/:memberId', authenticateToken, TeamManagementController.removeMember);

/**
 * @route DELETE /api/team/invitations/:invitationId
 * @desc Cancel pending invitation
 * @access Private
 */
router.delete('/invitations/:invitationId', authenticateToken, TeamManagementController.cancelInvitation);

/**
 * @route GET /api/team/invitation/:token
 * @desc Get invitation details by token (for invite acceptance page)
 * @access Public
 */
router.get('/invitation/:token', TeamManagementController.getInvitationDetails);

export default router;

