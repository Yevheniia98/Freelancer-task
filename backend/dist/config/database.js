"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    try {
        // Use Docker container URI or fallback to local connection
        const mongoURI = process.env.MONGODB_URI || 'mongodb://host.docker.internal:27017/task-manager';
        await mongoose_1.default.connect(mongoURI, {
            serverSelectionTimeoutMS: 3000, // Timeout after 3s instead of 5s
            connectTimeoutMS: 3000, // Connection timeout
            maxPoolSize: 10, // Maintain up to 10 socket connections
            minPoolSize: 5, // Maintain at least 5 socket connections
            retryWrites: true,
            retryReads: false, // Disable retry reads for faster startup
            bufferCommands: false, // Disable command buffering
        });
        console.log('✅ MongoDB connected');
    }
    catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
};
exports.connectDB = connectDB;
