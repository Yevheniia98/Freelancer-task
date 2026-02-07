"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../models/user.model");
const security_monitor_1 = require("../services/security.monitor");
const security_utils_1 = require("../utils/security.utils");
const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        const ipAddress = (req.ip || req.socket.remoteAddress || 'unknown').replace('::ffff:', '');
        if (!token) {
            console.log('Auth middleware: No token provided');
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
        }
        // Check token format
        if (token.length < 20 || token.length > 500) {
            console.log('Auth middleware: Invalid token format');
            return res.status(401).json({
                success: false,
                message: 'Invalid token format.'
            });
        }
        console.log('Auth middleware: Token found, verifying...');
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        console.log('Auth middleware: Token decoded:', { userId: decoded.userId, id: decoded.id });
        const userId = decoded.userId || decoded.id; // Support both userId and id fields
        // Validate userId format
        if (!(0, security_utils_1.isValidMongoId)(userId)) {
            console.log('Auth middleware: Invalid user ID format');
            return res.status(401).json({
                success: false,
                message: 'Invalid token.'
            });
        }
        const user = await user_model_1.User.findById(userId).select('-password');
        if (!user) {
            console.log('Auth middleware: User not found for ID:', userId);
            // Log potential token compromise
            const securityMonitor = security_monitor_1.SecurityMonitor.getInstance();
            await securityMonitor.logEvent(security_monitor_1.SecurityEventType.TOKEN_COMPROMISED, {
                userId: userId,
                ipAddress,
                userAgent: req.get('user-agent') || 'unknown',
                metadata: {
                    reason: 'User not found for valid token',
                    path: req.path,
                    method: req.method
                }
            });
            return res.status(401).json({
                success: false,
                message: 'Invalid token.'
            });
        }
        console.log('Auth middleware: User authenticated:', user._id);
        req.user = user;
        next();
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Auth middleware error:', errorMessage);
        // Log failed authentication attempt (wrapped in try-catch to prevent crashes)
        try {
            const ipAddress = (req.ip || req.socket.remoteAddress || 'unknown').replace('::ffff:', '');
            const securityMonitor = security_monitor_1.SecurityMonitor.getInstance();
            await securityMonitor.logEvent(security_monitor_1.SecurityEventType.UNAUTHORIZED_ACCESS, {
                ipAddress,
                userAgent: req.get('user-agent') || 'unknown',
                metadata: {
                    error: errorMessage,
                    path: req.path,
                    method: req.method
                }
            });
        }
        catch (logError) {
            console.error('Failed to log security event:', logError);
        }
        // Return appropriate error message
        if (errorMessage === 'jwt expired') {
            return res.status(401).json({
                success: false,
                message: 'Token expired. Please log in again.'
            });
        }
        return res.status(401).json({
            success: false,
            message: 'Invalid token.'
        });
    }
};
exports.authMiddleware = authMiddleware;
exports.authenticate = exports.authMiddleware;
