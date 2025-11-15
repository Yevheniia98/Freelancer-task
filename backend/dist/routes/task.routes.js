"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const task_entity_1 = require("../models/task.entity");
const router = express_1.default.Router();
// Middleware to authenticate token (assuming it's available)
// You'll need to import this from your auth middleware
const authenticateToken = (req, res, next) => {
    // This should be imported from your actual auth middleware
    // For now, we'll assume the user is attached to req.user
    next();
};
// Task Statistics endpoint
router.get('/statistics', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        console.log(`📊 Fetching task statistics for user: ${userId}`);
        // Convert userId to ObjectId if it's a string
        const userObjectId = new mongoose_1.default.Types.ObjectId(userId);
        // Get all tasks assigned to the user
        const tasks = await task_entity_1.TaskEntity.find({ assigneeId: userObjectId }).lean();
        console.log(`📋 Found ${tasks.length} tasks for user ${userId}`);
        // Calculate statistics
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.status === task_entity_1.TaskStatus.COMPLETED).length;
        const inProgressTasks = tasks.filter(task => task.status === task_entity_1.TaskStatus.IN_PROGRESS).length;
        const pendingTasks = tasks.filter(task => task.status === task_entity_1.TaskStatus.TODO ||
            task.status === task_entity_1.TaskStatus.IN_REVIEW).length;
        const cancelledTasks = tasks.filter(task => task.status === task_entity_1.TaskStatus.CANCELLED).length;
        // Calculate completion rate
        const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
        // Additional useful statistics
        const overdueTasks = tasks.filter(task => {
            if (!task.dueDate || task.status === task_entity_1.TaskStatus.COMPLETED)
                return false;
            return new Date() > new Date(task.dueDate);
        }).length;
        const dueSoonTasks = tasks.filter(task => {
            if (!task.dueDate || task.status === task_entity_1.TaskStatus.COMPLETED)
                return false;
            const now = new Date();
            const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
            const dueDate = new Date(task.dueDate);
            return dueDate <= tomorrow && dueDate > now;
        }).length;
        // Priority breakdown
        const priorityBreakdown = {
            urgent: tasks.filter(task => task.priority === 'urgent' && task.status !== task_entity_1.TaskStatus.COMPLETED).length,
            high: tasks.filter(task => task.priority === 'high' && task.status !== task_entity_1.TaskStatus.COMPLETED).length,
            medium: tasks.filter(task => task.priority === 'medium' && task.status !== task_entity_1.TaskStatus.COMPLETED).length,
            low: tasks.filter(task => task.priority === 'low' && task.status !== task_entity_1.TaskStatus.COMPLETED).length
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
            overdueTasks,
            dueSoonTasks,
            priorityBreakdown,
            recentlyUpdatedTasks,
            // Additional metadata
            lastUpdated: new Date().toISOString(),
            userId: req.user.id,
            userName: req.user.email
        };
        console.log(`✅ Task statistics calculated:`, {
            totalTasks,
            completedTasks,
            completionRate: `${completionRate}%`,
            overdueTasks,
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
// Get user's tasks
router.get('/my-tasks', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const status = req.query.status;
        const priority = req.query.priority;
        console.log(`📋 Fetching tasks for user: ${userId}, page: ${page}, limit: ${limit}`);
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
        const tasks = await task_entity_1.TaskEntity.find(query)
            .sort({ updatedAt: -1 })
            .limit(limit)
            .skip((page - 1) * limit)
            .populate('projectId', 'title')
            .lean();
        const totalTasks = await task_entity_1.TaskEntity.countDocuments(query);
        const totalPages = Math.ceil(totalTasks / limit);
        res.json({
            success: true,
            data: {
                tasks,
                pagination: {
                    page,
                    limit,
                    totalTasks,
                    totalPages,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1
                }
            },
            message: 'Tasks retrieved successfully'
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
exports.default = router;
