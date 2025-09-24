"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../models/user.model");
const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            console.log('Auth middleware: No token provided');
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
        }
        console.log('Auth middleware: Token found, verifying...');
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        console.log('Auth middleware: Token decoded:', { userId: decoded.userId, id: decoded.id });
        const userId = decoded.userId || decoded.id; // Support both userId and id fields
        const user = await user_model_1.User.findById(userId).select('-password');
        if (!user) {
            console.log('Auth middleware: User not found for ID:', userId);
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
        return res.status(401).json({
            success: false,
            message: 'Invalid token.'
        });
    }
};
exports.authMiddleware = authMiddleware;
exports.authenticate = exports.authMiddleware;
