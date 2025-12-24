import { Router } from 'express';
import { ProjectChatController, chatUpload } from '../controllers/project-chat.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const chatController = new ProjectChatController();

// Get messages for a project
router.get(
  '/projects/:projectId/chat/messages',
  authMiddleware,
  chatController.getMessages
);

// Send a message (with optional file upload)
router.post(
  '/projects/:projectId/chat/messages',
  authMiddleware,
  chatUpload.single('file'),
  chatController.sendMessage
);

// Delete a message
router.delete(
  '/projects/:projectId/chat/messages/:messageId',
  authMiddleware,
  chatController.deleteMessage
);

export default router;
