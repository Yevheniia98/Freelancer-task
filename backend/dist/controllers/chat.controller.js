"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatController = void 0;
const chat_message_model_1 = require("../models/chat-message.model");
const project_entity_1 = require("../models/project.entity");
const mongoose_1 = __importDefault(require("mongoose"));
class ChatController {
    constructor() {
        /**
         * Get chat messages for a project
         * GET /api/projects/:projectId/messages
         */
        this.getMessages = async (req, res) => {
            try {
                const { projectId } = req.params;
                const userId = req.user?._id?.toString() || req.user?.id;
                const limit = parseInt(req.query.limit) || 50;
                if (!mongoose_1.default.Types.ObjectId.isValid(projectId)) {
                    res.status(400).json({
                        success: false,
                        message: 'Invalid project ID'
                    });
                    return;
                }
                // Verify user has access to this project
                const project = await project_entity_1.ProjectEntity.findById(projectId);
                if (!project) {
                    res.status(404).json({
                        success: false,
                        message: 'Project not found'
                    });
                    return;
                }
                // Check if user is owner or team member
                const isOwner = project.projectOwner?.toString() === userId;
                const isTeamMember = project.teamMembers?.some((member) => member.userId?.toString() === userId);
                if (!isOwner && !isTeamMember) {
                    res.status(403).json({
                        success: false,
                        message: 'Access denied. You are not a member of this project.'
                    });
                    return;
                }
                // Get messages
                const messages = await chat_message_model_1.ChatMessage.find({ projectId })
                    .sort({ createdAt: -1 })
                    .limit(limit)
                    .lean();
                // Reverse to show oldest first
                messages.reverse();
                res.json({
                    success: true,
                    messages,
                    count: messages.length
                });
            }
            catch (error) {
                console.error('Get messages error:', error);
                res.status(500).json({
                    success: false,
                    message: error.message || 'Failed to get messages'
                });
            }
        };
        /**
         * Send a chat message
         * POST /api/projects/:projectId/messages
         */
        this.sendMessage = async (req, res) => {
            try {
                const { projectId } = req.params;
                const { message, fileUrl, fileName, fileSize } = req.body;
                const userId = req.user?._id?.toString() || req.user?.id;
                const userName = req.user?.name || req.user?.email || 'Unknown User';
                const userEmail = req.user?.email || '';
                if (!mongoose_1.default.Types.ObjectId.isValid(projectId)) {
                    res.status(400).json({
                        success: false,
                        message: 'Invalid project ID'
                    });
                    return;
                }
                if (!message || !message.trim()) {
                    res.status(400).json({
                        success: false,
                        message: 'Message is required'
                    });
                    return;
                }
                // Verify user has access to this project
                const project = await project_entity_1.ProjectEntity.findById(projectId);
                if (!project) {
                    res.status(404).json({
                        success: false,
                        message: 'Project not found'
                    });
                    return;
                }
                // Check if user is owner or team member
                const isOwner = project.projectOwner?.toString() === userId;
                const isTeamMember = project.teamMembers?.some((member) => member.userId?.toString() === userId);
                if (!isOwner && !isTeamMember) {
                    res.status(403).json({
                        success: false,
                        message: 'Access denied. You are not a member of this project.'
                    });
                    return;
                }
                // Create message
                const chatMessage = await chat_message_model_1.ChatMessage.create({
                    projectId,
                    userId,
                    userName,
                    userEmail,
                    message: message.trim(),
                    fileUrl: fileUrl || null,
                    fileName: fileName || null,
                    fileSize: fileSize || null
                });
                res.status(201).json({
                    success: true,
                    message: chatMessage
                });
            }
            catch (error) {
                console.error('Send message error:', error);
                res.status(500).json({
                    success: false,
                    message: error.message || 'Failed to send message'
                });
            }
        };
    }
}
exports.ChatController = ChatController;
