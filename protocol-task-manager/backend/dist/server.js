"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const dotenv_1 = __importDefault(require("dotenv"));
// Import configurations
const database_1 = require("./config/database");
const redis_1 = require("./config/redis");
const security_monitor_1 = require("./services/security.monitor");
// Import routes
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const dashboard_routes_1 = __importDefault(require("./routes/dashboard.routes"));
const project_routes_1 = __importDefault(require("./routes/project.routes"));
const client_routes_1 = __importDefault(require("./routes/client.routes"));
const task_routes_1 = __importDefault(require("./routes/task.routes"));
const team_routes_1 = __importDefault(require("./routes/team.routes"));
const finance_routes_1 = __importDefault(require("./routes/finance.routes"));
const settings_routes_1 = __importDefault(require("./routes/settings.routes"));
// Import middleware
const error_middleware_1 = require("./middleware/error.middleware");
const notFound_middleware_1 = require("./middleware/notFound.middleware");
// Load environment variables
dotenv_1.default.config();
// Create Express app
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});
const PORT = process.env.PORT || 5000;
// Security middleware
app.use((0, helmet_1.default)({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
}));
// CORS configuration
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
// Request logging
app.use((0, morgan_1.default)('combined'));
// Body parsing middleware
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
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
app.use('/api/finance', finance_routes_1.default);
app.use('/api/settings', settings_routes_1.default);
// Socket.io for real-time features
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    // Join project rooms for real-time updates
    socket.on('join-project', (projectId) => {
        socket.join(`project-${projectId}`);
    });
    // Handle team chat
    socket.on('send-message', (data) => {
        socket.to(`project-${data.projectId}`).emit('new-message', data);
    });
    // Handle task updates
    socket.on('task-update', (data) => {
        socket.to(`project-${data.projectId}`).emit('task-updated', data);
    });
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});
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
        // Initialize Security Monitor
        const securityMonitor = security_monitor_1.SecurityMonitor.getInstance();
        await securityMonitor.initialize();
        console.log('🔐 Security Monitor initialized');
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
