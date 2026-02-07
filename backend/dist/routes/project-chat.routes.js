"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const project_chat_controller_1 = require("../controllers/project-chat.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
const chatController = new project_chat_controller_1.ProjectChatController();
// Get messages for a project
router.get('/projects/:projectId/chat/messages', auth_middleware_1.authMiddleware, chatController.getMessages);
// Send a message (with optional file upload)
router.post('/projects/:projectId/chat/messages', auth_middleware_1.authMiddleware, project_chat_controller_1.chatUpload.single('file'), chatController.sendMessage);
// Delete a message
router.delete('/projects/:projectId/chat/messages/:messageId', auth_middleware_1.authMiddleware, chatController.deleteMessage);
exports.default = router;
