import { Router } from 'express';
import { ChatController } from '../controllers/chat.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const chatController = new ChatController();

// Get messages for a project
router.get(
  '/projects/:projectId/messages',
  authMiddleware,
  chatController.getMessages
);

// Send a message to a project
router.post(
  '/projects/:projectId/messages',
  authMiddleware,
  chatController.sendMessage
);

export default router;
