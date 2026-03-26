"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chat_controller_1 = require("../controllers/chat.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
const chatController = new chat_controller_1.ChatController();
// Get messages for a project
router.get('/projects/:projectId/messages', auth_middleware_1.authMiddleware, chatController.getMessages);
// Send a message to a project
router.post('/projects/:projectId/messages', auth_middleware_1.authMiddleware, chatController.sendMessage);
exports.default = router;
