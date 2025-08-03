"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRedisClient = exports.connectRedis = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
let redisClient = null;
const connectRedis = async () => {
    try {
        redisClient = new ioredis_1.default(process.env.REDIS_URL || 'redis://localhost:6379');
        return redisClient;
    }
    catch (error) {
        console.error('Redis connection error:', error);
        throw error;
    }
};
exports.connectRedis = connectRedis;
const getRedisClient = () => {
    if (!redisClient) {
        throw new Error('Redis client not initialized');
    }
    return redisClient;
};
exports.getRedisClient = getRedisClient;
