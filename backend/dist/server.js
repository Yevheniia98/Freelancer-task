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
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables FIRST before any other imports
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const express_session_1 = __importDefault(require("express-session"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const http_1 = require("http");
// Import configurations
const database_1 = require("./config/database");
const redis_1 = require("./config/redis");
// import { SecurityMonitor } from './services/security.monitor';
// Import routes
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const dashboard_routes_1 = __importDefault(require("./routes/dashboard.routes"));
const project_routes_1 = __importDefault(require("./routes/project.routes"));
const client_routes_1 = __importDefault(require("./routes/client.routes"));
const task_routes_1 = __importDefault(require("./routes/task.routes"));
const team_routes_1 = __importDefault(require("./routes/team.routes"));
const finance_routes_1 = __importDefault(require("./routes/finance.routes"));
const subscription_routes_1 = __importDefault(require("./routes/subscription.routes"));
const settings_routes_1 = __importDefault(require("./routes/settings.routes"));
const project_integration_routes_1 = __importDefault(require("./routes/project.integration.routes"));
const meeting_invitation_routes_1 = __importDefault(require("./routes/meeting-invitation.routes"));
const test_email_routes_1 = __importDefault(require("./routes/test-email.routes"));
const team_management_routes_1 = __importDefault(require("./routes/team-management.routes"));
const notification_routes_1 = __importDefault(require("./routes/notification.routes"));
const invite_routes_1 = __importDefault(require("./routes/invite.routes"));
const project_chat_routes_1 = __importDefault(require("./routes/project-chat.routes"));
// import financialRoutes from './routes/financial.routes';
// Import services
const socket_service_1 = require("./services/socket.service");
// Import middleware
const error_middleware_1 = require("./middleware/error.middleware");
const notFound_middleware_1 = require("./middleware/notFound.middleware");
const input_sanitization_middleware_1 = require("./middleware/input-sanitization.middleware");
const csrf_protection_middleware_1 = require("./middleware/csrf-protection.middleware");
// Create Express app
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
// Initialize Socket.IO service for real-time chat (creates its own Socket.IO server)
const socketService = new socket_service_1.SocketService(server);
const PORT = process.env.PORT || 5000;
// Security middleware - completely disable CSP in development
app.use((0, helmet_1.default)({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: false, // Completely disable CSP in development
}));
// CORS configuration
app.use((0, cors_1.default)({
    origin: [
        process.env.FRONTEND_URL || 'http://localhost:3030',
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:5173',
        'http://localhost:8080'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'enctype']
}));
// Request logging
app.use((0, morgan_1.default)('combined'));
// Body parsing middleware
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Ensure uploads directory exists with proper path handling
const uploadsDir = path_1.default.join(process.cwd(), 'uploads');
if (!fs_1.default.existsSync(uploadsDir)) {
    fs_1.default.mkdirSync(uploadsDir, { recursive: true });
    console.log('📁 Created uploads directory at:', uploadsDir);
}
// Static file serving for uploads with CORS headers
app.use('/uploads', (req, res, next) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
}, express_1.default.static(uploadsDir));
// Multer configuration for file uploads
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const sanitizedOriginalName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
        cb(null, `${file.fieldname}-${uniqueSuffix}-${sanitizedOriginalName}`);
    }
});
const upload = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB limit
    },
    fileFilter: (req, file, cb) => {
        // Allow images and documents
        const allowedMimes = [
            'image/jpeg', 'image/png', 'image/gif', 'image/webp',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-powerpoint',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'text/plain'
        ];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new Error(`File type ${file.mimetype} not allowed`));
        }
    }
});
// Session middleware
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || 'default_secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // Set to true in production
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));
// Rate limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
        error: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false
});
app.use('/api/', limiter);
// Security: Input sanitization middleware - protects against XSS, SQL injection, NoSQL injection, and prompt injection
// Apply strict sanitization only to public/auth endpoints
app.use('/api/auth', input_sanitization_middleware_1.strictInputSanitization);
// Security: CSRF token generation
app.use(csrf_protection_middleware_1.csrfTokenGenerator);
// CSRF token endpoint
app.get('/api/csrf-token', csrf_protection_middleware_1.getCsrfToken);
// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || '1.0.0'
    });
});
// API Routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/dashboard', dashboard_routes_1.default);
app.use('/api/projects', project_routes_1.default);
app.use('/api/clients', client_routes_1.default);
app.use('/api/tasks', task_routes_1.default);
app.use('/api/team', team_routes_1.default);
app.use('/api/team-management', team_management_routes_1.default);
app.use('/api/finance', finance_routes_1.default);
app.use('/api/subscription', subscription_routes_1.default);
app.use('/api/settings', settings_routes_1.default);
app.use('/api/integrations', project_integration_routes_1.default);
app.use('/api/meeting-invitations', meeting_invitation_routes_1.default);
app.use('/api/test-email', test_email_routes_1.default);
app.use('/api/notifications', notification_routes_1.default);
app.use('/api', invite_routes_1.default);
app.use('/api', project_chat_routes_1.default);
// app.use('/api/financial', financialRoutes);
// Team Invitation Email Endpoint
app.post('/api/send-email', async (req, res) => {
    try {
        const { to, subject, html } = req.body;
        if (!to || !subject || !html) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: to, subject, html'
            });
        }
        // Import EmailService dynamically
        const { EmailService } = await Promise.resolve().then(() => __importStar(require('./services/email.service')));
        const emailService = new EmailService();
        // Send the email
        const emailSent = await emailService.sendEmail({
            to,
            subject,
            html,
            text: subject // Fallback text version
        });
        if (emailSent) {
            console.log(`✅ Team invitation email sent to: ${to}`);
            res.status(200).json({
                success: true,
                message: 'Email sent successfully'
            });
        }
        else {
            console.error(`❌ Failed to send email to: ${to}`);
            res.status(500).json({
                success: false,
                message: 'Failed to send email'
            });
        }
    }
    catch (error) {
        console.error('❌ Email sending error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});
// Image Upload Endpoint - Clean & Simple
app.post('/upload', (req, res) => {
    const uploadSingle = (0, multer_1.default)({
        storage: multer_1.default.diskStorage({
            destination: (req, file, cb) => {
                cb(null, uploadsDir);
            },
            filename: (req, file, cb) => {
                const ext = path_1.default.extname(file.originalname);
                const name = Date.now() + '-' + Math.round(Math.random() * 1E9);
                cb(null, `img-${name}${ext}`);
            }
        }),
        limits: {
            fileSize: 5 * 1024 * 1024, // 5MB limit
        },
        fileFilter: (req, file, cb) => {
            // Allow images and documents (like WhatsApp)
            const allowedTypes = [
                'image/',
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'text/plain',
                'application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'application/vnd.ms-powerpoint',
                'application/vnd.openxmlformats-officedocument.presentationml.presentation'
            ];
            const isAllowed = allowedTypes.some(type => file.mimetype.startsWith(type) || file.mimetype === type);
            if (isAllowed) {
                cb(null, true);
            }
            else {
                cb(new Error('File type not supported. Please upload images or documents.'));
            }
        }
    }).single('file');
    uploadSingle(req, res, (err) => {
        if (err) {
            console.error('Upload error:', err.message);
            return res.status(400).json({
                success: false,
                message: err.message
            });
        }
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No image file uploaded'
            });
        }
        console.log(`✅ Image uploaded: ${req.file.filename}`);
        res.json({
            success: true,
            message: 'Image uploaded successfully',
            filename: req.file.filename,
            filePath: `/uploads/${req.file.filename}`,
            originalName: req.file.originalname,
            size: req.file.size
        });
    });
});
// Socket.IO is initialized via SocketService (see line ~58)
// All real-time features are handled there
// Error handling middleware (must be last)
app.use(notFound_middleware_1.notFound);
app.use(error_middleware_1.errorHandler);
// Database connections
const startServer = async () => {
    try {
        // Connect to MongoDB
        await (0, database_1.connectDB)();
        console.log('✅ MongoDB connected');
        // Connect to Redis  
        await (0, redis_1.connectRedis)();
        console.log('✅ Redis connected');
        // Comment out Security Monitor temporarily
        // const securityMonitor = SecurityMonitor.getInstance();
        // await securityMonitor.initialize();
        // console.log('🔐 Security Monitor initialized');
        // Start server
        server.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
        });
    }
    catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};
// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
    server.close(() => {
        process.exit(1);
    });
});
// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received');
    server.close(() => {
        console.log('Process terminated');
    });
});
startServer();
