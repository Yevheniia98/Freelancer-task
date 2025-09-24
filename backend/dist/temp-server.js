"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const uuid_1 = require("uuid");
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv = __importStar(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
// Import task entity
const task_entity_1 = require("./models/task.entity");
// Load environment variables
dotenv.config();
const app = (0, express_1.default)();
// MongoDB connection
let isMongoConnected = false;
const connectToMongoDB = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/freelancer-task';
        await mongoose_1.default.connect(mongoUri);
        console.log('📊 Connected to MongoDB');
        isMongoConnected = true;
    }
    catch (error) {
        console.error('⚠️  MongoDB connection failed, using in-memory storage:', error.message);
        isMongoConnected = false;
    }
};
// Initialize MongoDB connection
connectToMongoDB();
// Enable CORS for all requests
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Serve static files from uploads directory
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
// In-memory user storage (temporary solution)
const users = [
    {
        id: 1,
        email: "suprun.jen@gmail.com",
        password: "$2b$10$.i6w9NCM/J95NbONzdq0F.SJilsgqeUll82kjsySyXyKjsd8lyJ5m", // "03101998Polo"
        fullName: "User Test",
        resetCode: null,
        resetCodeExpires: null
    }
];
// In-memory task storage (fallback when MongoDB is not available)
const inMemoryTasks = [
    {
        _id: '1',
        title: 'Complete Project Setup',
        description: 'Set up the initial project structure and dependencies',
        dueDate: new Date('2024-02-15'),
        priority: 'high',
        status: 'TODO',
        assigneeId: 1,
        projectId: '1',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
    },
    {
        _id: '2',
        title: 'Implement User Authentication',
        description: 'Create login and registration functionality',
        dueDate: new Date('2024-02-20'),
        priority: 'high',
        status: 'IN_PROGRESS',
        assigneeId: 1,
        projectId: '1',
        createdAt: new Date('2024-01-16'),
        updatedAt: new Date('2024-01-18')
    },
    {
        _id: '3',
        title: 'Design Database Schema',
        description: 'Create the database schema for all entities',
        dueDate: new Date('2024-02-10'),
        priority: 'medium',
        status: 'COMPLETED',
        assigneeId: 1,
        projectId: '1',
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-20')
    },
    {
        _id: '4',
        title: 'Write API Documentation',
        description: 'Document all API endpoints and their usage',
        dueDate: new Date('2024-03-01'),
        priority: 'low',
        status: 'TODO',
        assigneeId: 1,
        projectId: '1',
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-20')
    },
    {
        _id: '5',
        title: 'Code Review and Testing',
        description: 'Review code quality and write comprehensive tests',
        dueDate: new Date('2024-02-25'),
        priority: 'medium',
        status: 'IN_PROGRESS',
        assigneeId: 1,
        projectId: '1',
        createdAt: new Date('2024-01-22'),
        updatedAt: new Date('2024-01-25')
    }
];
// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-make-it-long-and-complex';
// Email configuration
const transporter = nodemailer_1.default.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
        user: process.env.SMTP_USER || 'freelancetasker0@gmail.com',
        pass: process.env.SMTP_PASS || 'cflj fcsz jadd gbmy'
    }
});
// File upload configuration
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path_1.default.join(__dirname, "../uploads/"));
    },
    filename: (req, file, cb) => {
        const ext = path_1.default.extname(file.originalname);
        cb(null, (0, uuid_1.v4)() + ext);
    },
});
// General file upload (no restrictions)
const upload = (0, multer_1.default)({ storage });
// Project file upload with PDF support and size limits
const projectFileUpload = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        // Allow all previously supported formats plus PDFs
        const allowedTypes = [
            'application/pdf', // PDF files
            'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp', 'image/svg+xml', 'image/webp', 'image/tiff',
            'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOC, DOCX
            'text/plain', 'application/rtf', 'application/vnd.oasis.opendocument.text', // TXT, RTF, ODT
            'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // XLS, XLSX
            'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', // PPT, PPTX
            'video/mp4', 'video/avi', 'video/quicktime', 'video/x-ms-wmv', // Video formats
            'application/zip', 'application/x-rar-compressed', 'application/x-7z-compressed' // Archive formats
        ];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new Error(`File type ${file.mimetype} is not supported. Supported formats include PDF, images, documents, videos, and archives.`));
        }
    }
});
// Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Access token required' });
    }
    jsonwebtoken_1.default.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};
// Routes
// Login route
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }
        const user = users.find(u => u.email === email);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }
        const isValidPassword = await bcryptjs_1.default.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
        res.json({
            success: true,
            message: 'Login successful',
            data: {
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    fullName: user.fullName
                }
            }
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
// Register route
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password, fullName } = req.body;
        if (!email || !password || !fullName) {
            return res.status(400).json({
                success: false,
                message: 'Email, password, and full name are required'
            });
        }
        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const newUser = {
            id: users.length + 1,
            email,
            password: hashedPassword,
            fullName,
            resetCode: null,
            resetCodeExpires: null
        };
        users.push(newUser);
        const token = jsonwebtoken_1.default.sign({ userId: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '24h' });
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                token,
                user: {
                    id: newUser.id,
                    email: newUser.email,
                    fullName: newUser.fullName
                }
            }
        });
    }
    catch (error) {
        console.error('Register error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
// Forgot password route
app.post('/api/auth/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }
        const user = users.find(u => u.email === email);
        if (!user) {
            // Don't reveal if user exists or not
            return res.json({
                success: true,
                message: 'If an account with this email exists, a reset code will be sent'
            });
        }
        // Generate 6-digit reset code
        const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetCode = resetCode;
        user.resetCodeExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
        // Send email
        const mailOptions = {
            from: 'freelancetasker0@gmail.com',
            to: email,
            subject: 'Password Reset Code',
            html: `
        <h2>Password Reset Request</h2>
        <p>Your password reset code is: <strong>${resetCode}</strong></p>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this reset, please ignore this email.</p>
      `
        };
        await transporter.sendMail(mailOptions);
        res.json({
            success: true,
            message: 'Reset code sent to your email'
        });
    }
    catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send reset code'
        });
    }
});
// Reset password route
app.post('/api/auth/reset-password', async (req, res) => {
    try {
        const { email, code, newPassword } = req.body;
        if (!email || !code || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Email, code, and new password are required'
            });
        }
        const user = users.find(u => u.email === email);
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid reset code'
            });
        }
        if (user.resetCode !== code || !user.resetCodeExpires || Date.now() > user.resetCodeExpires) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired reset code'
            });
        }
        user.password = await bcryptjs_1.default.hash(newPassword, 10);
        user.resetCode = null;
        user.resetCodeExpires = null;
        res.json({
            success: true,
            message: 'Password reset successfully'
        });
    }
    catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to reset password'
        });
    }
});
// File upload route
app.post("/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "File not uploaded" });
    }
    res.json({
        message: "File uploaded successfully",
        filename: req.file.filename,
        path: `/uploads/${req.file.filename}`,
    });
});
// Dashboard route (protected)
app.get('/api/dashboard', authenticateToken, (req, res) => {
    res.json({
        success: true,
        message: 'Dashboard data',
        user: req.user
    });
});
// API File upload route (for profile pictures, etc.)
app.post("/api/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "File not uploaded" });
    }
    res.json({
        message: "File uploaded successfully",
        filename: req.file.filename,
        path: `/uploads/${req.file.filename}`,
    });
});
// In-memory project storage
const projects = [];
let projectIdCounter = 1;
// Project routes
// Get all projects
app.get('/api/projects', (req, res) => {
    res.json({
        success: true,
        data: projects
    });
});
// Get project by ID
app.get('/api/projects/:id', (req, res) => {
    const projectId = req.params.id;
    const project = projects.find(p => p.id === projectId);
    if (!project) {
        return res.status(404).json({
            success: false,
            message: 'Project not found'
        });
    }
    res.json({
        success: true,
        data: project
    });
});
// Create new project
app.post('/api/projects', (req, res) => {
    const { title, description, priority, status, deadline } = req.body;
    if (!title || !description) {
        return res.status(400).json({
            success: false,
            message: 'Title and description are required'
        });
    }
    const newProject = {
        id: `project_${projectIdCounter++}_${Date.now()}`,
        title,
        description,
        priority: priority || 'medium',
        status: status || 'pending',
        deadline: deadline || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        files: []
    };
    projects.push(newProject);
    res.status(201).json({
        success: true,
        data: newProject
    });
});
// Update project
app.put('/api/projects/:id', (req, res) => {
    const projectId = req.params.id;
    const projectIndex = projects.findIndex(p => p.id === projectId);
    if (projectIndex === -1) {
        return res.status(404).json({
            success: false,
            message: 'Project not found'
        });
    }
    projects[projectIndex] = {
        ...projects[projectIndex],
        ...req.body,
        updatedAt: new Date().toISOString()
    };
    res.json({
        success: true,
        data: projects[projectIndex]
    });
});
// Delete project
app.delete('/api/projects/:id', (req, res) => {
    const projectId = req.params.id;
    const projectIndex = projects.findIndex(p => p.id === projectId);
    if (projectIndex === -1) {
        return res.status(404).json({
            success: false,
            message: 'Project not found'
        });
    }
    projects.splice(projectIndex, 1);
    res.json({
        success: true,
        message: 'Project deleted successfully'
    });
});
// Upload file for project
app.post('/api/projects/:id/files', projectFileUpload.single('file'), (req, res) => {
    const projectId = req.params.id;
    const project = projects.find(p => p.id === projectId);
    if (!project) {
        return res.status(404).json({
            success: false,
            message: 'Project not found'
        });
    }
    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: 'No file uploaded'
        });
    }
    const fileInfo = {
        id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        filename: req.file.filename,
        originalName: req.file.originalname,
        path: `/uploads/${req.file.filename}`,
        size: req.file.size,
        mimetype: req.file.mimetype,
        uploadedAt: new Date().toISOString()
    };
    project.files.push(fileInfo);
    project.updatedAt = new Date().toISOString();
    res.json({
        success: true,
        data: fileInfo,
        message: `File uploaded successfully (${(req.file.size / (1024 * 1024)).toFixed(2)}MB)`
    });
});
// Add error handling middleware for file upload errors
app.use((error, req, res, next) => {
    if (error instanceof multer_1.default.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File size too large. Maximum size is 5MB.'
            });
        }
        return res.status(400).json({
            success: false,
            message: `Upload error: ${error.message}`
        });
    }
    if (error.message && error.message.includes('File type')) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
    next(error);
});
// Meeting invitation endpoints
app.post('/api/meeting-invitations/send-multiple', async (req, res) => {
    try {
        const { recipients, meetingData } = req.body;
        console.log('📧 Received meeting invitation request:', {
            recipients: recipients?.length || 0,
            meetingData: meetingData?.title || 'No title'
        });
        if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Recipients array is required and must not be empty'
            });
        }
        if (!meetingData || !meetingData.title) {
            return res.status(400).json({
                success: false,
                message: 'Meeting data with title is required'
            });
        }
        const emailResults = await Promise.allSettled(recipients.map(async (recipient) => {
            if (!recipient.email) {
                throw new Error(`Invalid recipient: missing email`);
            }
            const emailContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Meeting Invitation</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; }
        .header { background: #0D7C66; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .meeting-details { background: #f8f9fa; padding: 20px; border-radius: 6px; margin: 20px 0; }
        .detail-row { margin: 10px 0; }
        .label { font-weight: bold; color: #0D7C66; }
        .join-button { display: inline-block; background: #0D7C66; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; color: #666; font-size: 14px; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📅 Meeting Invitation</h1>
        </div>
        <div class="content">
            <p>Hello ${recipient.name || 'there'},</p>
            
            <p>You're invited to join our upcoming meeting:</p>
            
            <div class="meeting-details">
                <div class="detail-row">
                    <span class="label">Meeting:</span> ${meetingData.title}
                </div>
                ${meetingData.description ? `
                <div class="detail-row">
                    <span class="label">Description:</span> ${meetingData.description}
                </div>
                ` : ''}
                <div class="detail-row">
                    <span class="label">Date:</span> ${new Date(meetingData.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })}
                </div>
                <div class="detail-row">
                    <span class="label">Time:</span> ${meetingData.startTime} - ${meetingData.endTime}
                </div>
                ${meetingData.platform ? `
                <div class="detail-row">
                    <span class="label">Platform:</span> ${meetingData.platform.charAt(0).toUpperCase() + meetingData.platform.slice(1)}
                </div>
                ` : ''}
                <div class="detail-row">
                    <span class="label">Organizer:</span> ${meetingData.organizerName} (${meetingData.organizerEmail})
                </div>
            </div>
            
            ${meetingData.meetingLink ? `
            <p style="text-align: center;">
                <a href="${meetingData.meetingLink}" class="join-button">🔗 Join Meeting</a>
            </p>
            ` : ''}
            
            <p>We look forward to seeing you there!</p>
            
            <p>Best regards,<br>
            ${meetingData.organizerName}</p>
        </div>
        <div class="footer">
            <p>This is an automated invitation from the Freelancer Task Manager</p>
        </div>
    </div>
</body>
</html>
        `;
            const mailOptions = {
                from: `"${meetingData.organizerName}" <${process.env.EMAIL_USER || 'freelancetasker0@gmail.com'}>`,
                to: recipient.email,
                subject: `📅 Meeting Invitation: ${meetingData.title}`,
                html: emailContent
            };
            console.log(`📤 Sending email to: ${recipient.email}`);
            const info = await transporter.sendMail(mailOptions);
            console.log(`✅ Email sent to ${recipient.email}:`, info.messageId);
            return {
                email: recipient.email,
                name: recipient.name,
                status: 'sent',
                messageId: info.messageId
            };
        }));
        const sentSuccessfully = emailResults.filter(result => result.status === 'fulfilled').length;
        const failed = emailResults.filter(result => result.status === 'rejected').length;
        const failedResults = emailResults
            .filter(result => result.status === 'rejected')
            .map(result => ({
            error: result.reason.message
        }));
        console.log(`📊 Email results: ${sentSuccessfully} sent, ${failed} failed`);
        res.json({
            success: true,
            message: `Meeting invitations processed: ${sentSuccessfully} sent, ${failed} failed`,
            data: {
                sentSuccessfully,
                failed,
                results: emailResults.map(result => result.status === 'fulfilled' ? result.value : { error: result.reason.message }),
                failedResults
            }
        });
    }
    catch (error) {
        console.error('❌ Meeting invitation error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send meeting invitations',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
app.post('/api/meeting-invitations/send-single', async (req, res) => {
    try {
        const { recipient, meetingData } = req.body;
        if (!recipient?.email || !meetingData?.title) {
            return res.status(400).json({
                success: false,
                message: 'Recipient email and meeting title are required'
            });
        }
        // Use the same logic as send-multiple but for a single recipient
        const result = await sendSingleMeetingInvitation(recipient, meetingData);
        res.json({
            success: true,
            message: 'Meeting invitation sent successfully',
            data: result
        });
    }
    catch (error) {
        console.error('❌ Single meeting invitation error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send meeting invitation',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// Helper function for single email sending
async function sendSingleMeetingInvitation(recipient, meetingData) {
    const emailContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Meeting Invitation</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; }
        .header { background: #0D7C66; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .meeting-details { background: #f8f9fa; padding: 20px; border-radius: 6px; margin: 20px 0; }
        .detail-row { margin: 10px 0; }
        .label { font-weight: bold; color: #0D7C66; }
        .join-button { display: inline-block; background: #0D7C66; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; color: #666; font-size: 14px; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📅 Meeting Invitation</h1>
        </div>
        <div class="content">
            <p>Hello ${recipient.name || 'there'},</p>
            
            <p>You're invited to join our upcoming meeting:</p>
            
            <div class="meeting-details">
                <div class="detail-row">
                    <span class="label">Meeting:</span> ${meetingData.title}
                </div>
                ${meetingData.description ? `
                <div class="detail-row">
                    <span class="label">Description:</span> ${meetingData.description}
                </div>
                ` : ''}
                <div class="detail-row">
                    <span class="label">Date:</span> ${new Date(meetingData.date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })}
                </div>
                <div class="detail-row">
                    <span class="label">Time:</span> ${meetingData.startTime} - ${meetingData.endTime}
                </div>
                ${meetingData.platform ? `
                <div class="detail-row">
                    <span class="label">Platform:</span> ${meetingData.platform.charAt(0).toUpperCase() + meetingData.platform.slice(1)}
                </div>
                ` : ''}
                <div class="detail-row">
                    <span class="label">Organizer:</span> ${meetingData.organizerName} (${meetingData.organizerEmail})
                </div>
            </div>
            
            ${meetingData.meetingLink ? `
            <p style="text-align: center;">
                <a href="${meetingData.meetingLink}" class="join-button">🔗 Join Meeting</a>
            </p>
            ` : ''}
            
            <p>We look forward to seeing you there!</p>
            
            <p>Best regards,<br>
            ${meetingData.organizerName}</p>
        </div>
        <div class="footer">
            <p>This is an automated invitation from the Freelancer Task Manager</p>
        </div>
    </div>
</body>
</html>
  `;
    const mailOptions = {
        from: `"${meetingData.organizerName}" <${process.env.EMAIL_USER || 'freelancetasker0@gmail.com'}>`,
        to: recipient.email,
        subject: `📅 Meeting Invitation: ${meetingData.title}`,
        html: emailContent
    };
    console.log(`📤 Sending single email to: ${recipient.email}`);
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${recipient.email}:`, info.messageId);
    return {
        email: recipient.email,
        name: recipient.name,
        status: 'sent',
        messageId: info.messageId
    };
}
// ==================== TASK STATISTICS ENDPOINT ====================
// Task Statistics endpoint (protected)
app.get('/api/tasks/statistics', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId || req.user.id;
        console.log(`📊 Fetching task statistics for user: ${userId}`);
        let tasks = [];
        if (isMongoConnected) {
            // Use MongoDB
            const userObjectId = new mongoose_1.default.Types.ObjectId(userId);
            tasks = await task_entity_1.TaskEntity.find({ assigneeId: userObjectId }).lean();
        }
        else {
            // Use in-memory storage
            tasks = inMemoryTasks.filter(task => task.assigneeId === userId);
        }
        console.log(`📋 Found ${tasks.length} tasks for user ${userId}`);
        // Calculate statistics
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.status === 'COMPLETED').length;
        const inProgressTasks = tasks.filter(task => task.status === 'IN_PROGRESS').length;
        const pendingTasks = tasks.filter(task => task.status === 'TODO' ||
            task.status === 'IN_REVIEW').length;
        const cancelledTasks = tasks.filter(task => task.status === 'CANCELLED').length;
        // Calculate completion rate
        const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
        // Additional useful statistics
        const overdueTasks = tasks.filter(task => {
            if (!task.dueDate || task.status === 'COMPLETED')
                return false;
            return new Date() > new Date(task.dueDate);
        }).length;
        const dueSoonTasks = tasks.filter(task => {
            if (!task.dueDate || task.status === 'COMPLETED')
                return false;
            const now = new Date();
            const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
            const dueDate = new Date(task.dueDate);
            return dueDate <= tomorrow && dueDate > now;
        }).length;
        // Priority breakdown
        const priorityBreakdown = {
            urgent: tasks.filter(task => task.priority === 'urgent' && task.status !== 'COMPLETED').length,
            high: tasks.filter(task => task.priority === 'high' && task.status !== 'COMPLETED').length,
            medium: tasks.filter(task => task.priority === 'medium' && task.status !== 'COMPLETED').length,
            low: tasks.filter(task => task.priority === 'low' && task.status !== 'COMPLETED').length
        };
        // Recent activity (tasks updated in last 7 days)
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const recentlyUpdatedTasks = tasks.filter(task => new Date(task.updatedAt) >= sevenDaysAgo).length;
        const statistics = {
            totalTasks,
            completedTasks,
            inProgressTasks,
            pendingTasks,
            cancelledTasks,
            completionRate,
            overdueCount: overdueTasks,
            dueSoonTasks,
            priorityBreakdown,
            recentlyUpdatedTasks,
            // Additional metadata
            lastUpdated: new Date().toISOString(),
            userId: req.user.userId || req.user.id,
            userName: req.user.email,
            dataSource: isMongoConnected ? 'MongoDB' : 'In-Memory'
        };
        console.log(`✅ Task statistics calculated:`, {
            totalTasks,
            completedTasks,
            completionRate: `${completionRate}%`,
            overdueCount: overdueTasks,
            dueSoonTasks
        });
        res.json({
            success: true,
            data: statistics,
            message: 'Task statistics retrieved successfully'
        });
    }
    catch (error) {
        console.error('❌ Error fetching task statistics:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while fetching task statistics',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// ==================== ADDITIONAL TASK ENDPOINTS ====================
// Get user's tasks (for debugging/verification)
app.get('/api/tasks/my-tasks', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId || req.user.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const status = req.query.status;
        const priority = req.query.priority;
        console.log(`📋 Fetching tasks for user: ${userId}, page: ${page}, limit: ${limit}`);
        let tasks = [];
        let totalTasks = 0;
        if (isMongoConnected) {
            // Use MongoDB
            const userObjectId = new mongoose_1.default.Types.ObjectId(userId);
            // Build query
            let query = { assigneeId: userObjectId };
            if (status) {
                query.status = status;
            }
            if (priority) {
                query.priority = priority;
            }
            // Get tasks with pagination
            tasks = await task_entity_1.TaskEntity.find(query)
                .sort({ updatedAt: -1 })
                .limit(limit)
                .skip((page - 1) * limit)
                .populate('projectId', 'title')
                .lean();
            totalTasks = await task_entity_1.TaskEntity.countDocuments(query);
        }
        else {
            // Use in-memory storage
            let filteredTasks = inMemoryTasks.filter(task => task.assigneeId === userId);
            // Apply filters
            if (status) {
                filteredTasks = filteredTasks.filter(task => task.status === status);
            }
            if (priority) {
                filteredTasks = filteredTasks.filter(task => task.priority === priority);
            }
            // Sort by updated date (newest first)
            filteredTasks.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
            // Apply pagination
            totalTasks = filteredTasks.length;
            const startIndex = (page - 1) * limit;
            tasks = filteredTasks.slice(startIndex, startIndex + limit);
        }
        const totalPages = Math.ceil(totalTasks / limit);
        res.json({
            success: true,
            data: {
                tasks,
                pagination: {
                    page,
                    limit,
                    totalCount: totalTasks,
                    totalPages,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1
                },
                currentPage: page
            },
            message: 'Tasks retrieved successfully',
            dataSource: isMongoConnected ? 'MongoDB' : 'In-Memory'
        });
    }
    catch (error) {
        console.error('❌ Error fetching user tasks:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while fetching tasks',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// Create a new task
app.post('/api/tasks', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId || req.user.id;
        console.log(`📝 Creating new task for user: ${userId}`);
        const { title, description, priority, status, dueDate, project, clientName } = req.body;
        // Validate required fields
        if (!title || !description) {
            return res.status(400).json({
                success: false,
                message: 'Title and description are required'
            });
        }
        if (isMongoConnected) {
            // Use MongoDB
            const userObjectId = new mongoose_1.default.Types.ObjectId(userId);
            const projectObjectId = new mongoose_1.default.Types.ObjectId(); // Generate a project ID or use existing
            const newTask = new task_entity_1.TaskEntity({
                title,
                description: description || '',
                priority: priority || 'medium',
                status: status || 'TODO',
                assigneeId: userObjectId,
                projectId: projectObjectId,
                dueDate: dueDate ? new Date(dueDate) : null,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            const savedTask = await newTask.save();
            res.status(201).json({
                success: true,
                data: savedTask,
                message: 'Task created successfully'
            });
        }
        else {
            // Use in-memory storage
            const newTask = {
                _id: (inMemoryTasks.length + 1).toString(),
                title,
                description: description || '',
                priority: priority || 'medium',
                status: status || 'TODO',
                assigneeId: userId,
                projectId: '1', // Default project
                dueDate: dueDate ? new Date(dueDate) : null,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            inMemoryTasks.push(newTask);
            res.status(201).json({
                success: true,
                data: newTask,
                message: 'Task created successfully (in-memory)',
                dataSource: 'In-Memory'
            });
        }
    }
    catch (error) {
        console.error('❌ Error creating task:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create task',
            error: error.message
        });
    }
});
// Create a sample task (for testing)
app.post('/api/tasks/create-sample', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const userObjectId = new mongoose_1.default.Types.ObjectId(userId);
        // Create a sample project ID (you might want to adjust this)
        const sampleProjectId = new mongoose_1.default.Types.ObjectId();
        const sampleTasks = [
            {
                title: 'Complete project proposal',
                description: 'Write and submit the project proposal for Q4 initiatives',
                priority: 'high',
                status: task_entity_1.TaskStatus.IN_PROGRESS,
                assigneeId: userObjectId,
                projectId: sampleProjectId,
                dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days from now
            },
            {
                title: 'Review client feedback',
                description: 'Analyze client feedback and prepare response document',
                priority: 'medium',
                status: task_entity_1.TaskStatus.TODO,
                assigneeId: userObjectId,
                projectId: sampleProjectId,
                dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
            },
            {
                title: 'Update documentation',
                description: 'Update project documentation with latest changes',
                priority: 'low',
                status: task_entity_1.TaskStatus.COMPLETED,
                assigneeId: userObjectId,
                projectId: sampleProjectId,
                dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
            },
            {
                title: 'Prepare presentation',
                description: 'Create presentation slides for stakeholder meeting',
                priority: 'urgent',
                status: task_entity_1.TaskStatus.IN_REVIEW,
                assigneeId: userObjectId,
                projectId: sampleProjectId,
                dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) // 1 day from now
            }
        ];
        const createdTasks = await task_entity_1.TaskEntity.insertMany(sampleTasks);
        console.log(`✅ Created ${createdTasks.length} sample tasks for user ${userId}`);
        res.json({
            success: true,
            data: {
                tasksCreated: createdTasks.length,
                tasks: createdTasks
            },
            message: 'Sample tasks created successfully'
        });
    }
    catch (error) {
        console.error('❌ Error creating sample tasks:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while creating sample tasks',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// Update an existing task
app.put('/api/tasks/:id', authenticateToken, async (req, res) => {
    try {
        const taskId = req.params.id;
        const userId = req.user.userId || req.user.id;
        const { title, description, priority, status, dueDate } = req.body;
        console.log(`📝 Updating task ${taskId} for user: ${userId}`);
        if (isMongoConnected) {
            // Use MongoDB
            const userObjectId = new mongoose_1.default.Types.ObjectId(userId);
            const taskObjectId = new mongoose_1.default.Types.ObjectId(taskId);
            const updatedTask = await task_entity_1.TaskEntity.findOneAndUpdate({ _id: taskObjectId, assigneeId: userObjectId }, {
                title,
                description,
                priority,
                status,
                dueDate: dueDate ? new Date(dueDate) : null,
                updatedAt: new Date()
            }, { new: true });
            if (!updatedTask) {
                return res.status(404).json({
                    success: false,
                    message: 'Task not found or not authorized'
                });
            }
            res.json({
                success: true,
                data: updatedTask,
                message: 'Task updated successfully'
            });
        }
        else {
            // Use in-memory storage
            const taskIndex = inMemoryTasks.findIndex(task => task._id === taskId && task.assigneeId === userId);
            if (taskIndex === -1) {
                return res.status(404).json({
                    success: false,
                    message: 'Task not found or not authorized'
                });
            }
            inMemoryTasks[taskIndex] = {
                ...inMemoryTasks[taskIndex],
                title: title || inMemoryTasks[taskIndex].title,
                description: description || inMemoryTasks[taskIndex].description,
                priority: priority || inMemoryTasks[taskIndex].priority,
                status: status || inMemoryTasks[taskIndex].status,
                dueDate: dueDate ? new Date(dueDate) : inMemoryTasks[taskIndex].dueDate,
                updatedAt: new Date()
            };
            res.json({
                success: true,
                data: inMemoryTasks[taskIndex],
                message: 'Task updated successfully (in-memory)',
                dataSource: 'In-Memory'
            });
        }
    }
    catch (error) {
        console.error('❌ Error updating task:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update task',
            error: error.message
        });
    }
});
// Delete a task
app.delete('/api/tasks/:id', authenticateToken, async (req, res) => {
    try {
        const taskId = req.params.id;
        const userId = req.user.userId || req.user.id;
        console.log(`🗑️ Deleting task ${taskId} for user: ${userId}`);
        if (isMongoConnected) {
            // Use MongoDB
            const userObjectId = new mongoose_1.default.Types.ObjectId(userId);
            const taskObjectId = new mongoose_1.default.Types.ObjectId(taskId);
            const deletedTask = await task_entity_1.TaskEntity.findOneAndDelete({
                _id: taskObjectId,
                assigneeId: userObjectId
            });
            if (!deletedTask) {
                return res.status(404).json({
                    success: false,
                    message: 'Task not found or not authorized'
                });
            }
            res.json({
                success: true,
                message: 'Task deleted successfully'
            });
        }
        else {
            // Use in-memory storage
            const taskIndex = inMemoryTasks.findIndex(task => task._id === taskId && task.assigneeId === userId);
            if (taskIndex === -1) {
                return res.status(404).json({
                    success: false,
                    message: 'Task not found or not authorized'
                });
            }
            inMemoryTasks.splice(taskIndex, 1);
            res.json({
                success: true,
                message: 'Task deleted successfully (in-memory)',
                dataSource: 'In-Memory'
            });
        }
    }
    catch (error) {
        console.error('❌ Error deleting task:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete task',
            error: error.message
        });
    }
});
const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
    console.log(`🚀 Temporary server running on http://localhost:${PORT}`);
    console.log(`📧 Email service configured`);
    console.log(`📁 File uploads enabled`);
    console.log(`🔐 Authentication enabled`);
});
