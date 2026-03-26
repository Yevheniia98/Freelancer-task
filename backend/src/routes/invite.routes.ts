import { Router } from 'express';
import { ProjectInviteController } from '../controllers/project-invite.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { requireOwner } from '../middleware/permissions.middleware';

const router = Router();
const inviteController = new ProjectInviteController();

// Send invitation (simpler endpoint for frontend)
router.post(
  '/invites/send',
  authMiddleware,
  inviteController.createInvite
);

// Create invite (owner only) - original endpoint
router.post(
  '/projects/:id/invite',
  authMiddleware,
  requireOwner,
  inviteController.createInvite
);

// Accept invite (authenticated user)
router.get(
  '/invites/accept',
  authMiddleware,
  inviteController.acceptInvite
);

export default router;
