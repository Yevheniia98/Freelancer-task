import { Router } from 'express';
import { ProjectInviteController } from '../controllers/project-invite.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { requireOwner } from '../middleware/permissions.middleware';

const router = Router();
const inviteController = new ProjectInviteController();

// Create invite (owner only)
router.post(
  '/projects/:id/invite',
  authMiddleware,
  requireOwner,
  inviteController.createInvite
);

// Accept invite (authenticated user)
router.get(
  '/invite/accept',
  authMiddleware,
  inviteController.acceptInvite
);

export default router;
