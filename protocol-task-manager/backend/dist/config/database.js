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
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
            retryWrites: true
        });
    }
    catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
};
exports.connectDB = connectDB;
