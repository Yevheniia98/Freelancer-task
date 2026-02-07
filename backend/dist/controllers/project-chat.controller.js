"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatUpload = exports.ProjectChatController = void 0;
const project_chat_model_1 = require("../models/project-chat.model");
const project_entity_1 = require("../models/project.entity");
const user_model_1 = require("../models/user.model");
const socket_service_1 = require("../services/socket.service");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
class ProjectChatController {
    constructor() {
        /**
         * Get chat messages for a project
         */
        this.getMessages = async (req, res) => {
            try {
                const { projectId } = req.params;
                const { limit = 50, skip = 0 } = req.query;
                const userId = req.user?.id;
                // Verify user has access to this project
                const project = await project_entity_1.ProjectEntity.findById(projectId);
                if (!project) {
                    res.status(404).json({
                        success: false,
                        message: 'Project not found'
                    });
                    return;
                }
                // Check if user is project owner or team member
                const isOwner = project.projectOwner?.toString() === userId?.toString();
                const isMember = project.teamMembers?.some((member) => member.userId?.toString() === userId?.toString());
                if (!isOwner && !isMember) {
                    res.status(403).json({
                        success: false,
                        message: 'You do not have access to this project chat'
                    });
                    return;
                }
                // Get messages
                const messages = await project_chat_model_1.ProjectChatMessage.find({ projectId })
                    .sort({ createdAt: -1 })
                    .limit(Number(limit))
                    .skip(Number(skip));
                // Reverse to show oldest first
                messages.reverse();
                res.json({
                    success: true,
                    data: messages,
                    total: await project_chat_model_1.ProjectChatMessage.countDocuments({ projectId })
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
         */
        this.sendMessage = async (req, res) => {
            try {
                const { projectId } = req.params;
                const { message } = req.body;
                const userId = req.user?.id;
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
                // Check if user is project owner or team member
                const isOwner = project.projectOwner?.toString() === userId?.toString();
                const isMember = project.teamMembers?.some((member) => member.userId?.toString() === userId?.toString());
                if (!isOwner && !isMember) {
                    res.status(403).json({
                        success: false,
                        message: 'You do not have access to this project chat'
                    });
                    return;
                }
                // Get user info
                const user = await user_model_1.User.findById(userId);
                if (!user) {
                    res.status(401).json({
                        success: false,
                        message: 'User not found'
                    });
                    return;
                }
                const userName = user.firstName && user.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : user.email.split('@')[0];
                // Handle file upload if present
                let fileData = {};
                if (req.file) {
                    fileData = {
                        fileUrl: `/uploads/${req.file.filename}`,
                        fileName: req.file.originalname,
                        fileSize: req.file.size,
                        fileType: req.file.mimetype
                    };
                }
                // Create message
                const chatMessage = await project_chat_model_1.ProjectChatMessage.create({
                    projectId,
                    userId: user._id,
                    userName,
                    userEmail: user.email,
                    message: message.trim(),
                    ...fileData
                });
                console.log('✅ Chat message created:', {
                    projectId,
                    userName,
                    hasFile: !!req.file
                });
                // Broadcast to all users in the project room via Socket.IO
                const socketService = socket_service_1.SocketService.getInstance();
                if (socketService) {
                    const io = socketService.getIO();
                    io.to(`project:${projectId}`).emit('message:new', chatMessage);
                }
                res.status(201).json({
                    success: true,
                    data: chatMessage
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
        /**
         * Delete a chat message (only own messages)
         */
        this.deleteMessage = async (req, res) => {
            try {
                const { projectId, messageId } = req.params;
                const userId = req.user?.id;
                const message = await project_chat_model_1.ProjectChatMessage.findById(messageId);
                if (!message) {
                    res.status(404).json({
                        success: false,
                        message: 'Message not found'
                    });
                    return;
                }
                // Check if user owns the message
                if (message.userId.toString() !== userId?.toString()) {
                    res.status(403).json({
                        success: false,
                        message: 'You can only delete your own messages'
                    });
                    return;
                }
                // Delete associated file if exists
                if (message.fileUrl) {
                    const filePath = path_1.default.join(__dirname, '../../', message.fileUrl);
                    if (fs_1.default.existsSync(filePath)) {
                        fs_1.default.unlinkSync(filePath);
                    }
                }
                await project_chat_model_1.ProjectChatMessage.findByIdAndDelete(messageId);
                res.json({
                    success: true,
                    message: 'Message deleted successfully'
                });
            }
            catch (error) {
                console.error('Delete message error:', error);
                res.status(500).json({
                    success: false,
                    message: error.message || 'Failed to delete message'
                });
            }
        };
    }
}
exports.ProjectChatController = ProjectChatController;
// Configure multer for file uploads
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path_1.default.join(__dirname, '../../uploads');
        if (!fs_1.default.existsSync(uploadPath)) {
            fs_1.default.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, 'chat-' + uniqueSuffix + path_1.default.extname(file.originalname));
    }
});
const fileFilter = (req, file, cb) => {
    // Allow common file types
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt|zip|rar|mp4|mov|avi/;
    const extname = allowedTypes.test(path_1.default.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
        cb(null, true);
    }
    else {
        cb(new Error('Invalid file type. Allowed: images, PDFs, documents, videos, archives'));
    }
};
exports.chatUpload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});
