import express from 'express';
import mongoose from 'mongoose';
import { TaskEntity, TaskStatus } from '../models/task.entity';

const router = express.Router();

// Middleware to authenticate token (assuming it's available)
// You'll need to import this from your auth middleware
const authenticateToken = (req: any, res: any, next: any) => {
  // This should be imported from your actual auth middleware
  // For now, we'll assume the user is attached to req.user
  next();
};

// Task Statistics endpoint
router.get('/statistics', authenticateToken, async (req: any, res) => {
  try {
    const userId = req.user.id;
    console.log(`📊 Fetching task statistics for user: ${userId}`);

    // Convert userId to ObjectId if it's a string
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Get all tasks assigned to the user
    const tasks = await TaskEntity.find({ assigneeId: userObjectId }).lean();
    
    console.log(`📋 Found ${tasks.length} tasks for user ${userId}`);

    // Calculate statistics
    const totalTasks = tasks.length;
    
    const completedTasks = tasks.filter(task => task.status === TaskStatus.COMPLETED).length;
    const inProgressTasks = tasks.filter(task => task.status === TaskStatus.IN_PROGRESS).length;
    const pendingTasks = tasks.filter(task => 
      task.status === TaskStatus.TODO || 
      task.status === TaskStatus.IN_REVIEW
    ).length;
    const cancelledTasks = tasks.filter(task => task.status === TaskStatus.CANCELLED).length;
    
    // Calculate completion rate
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    // Additional useful statistics
    const overdueTasks = tasks.filter(task => {
      if (!task.dueDate || task.status === TaskStatus.COMPLETED) return false;
      return new Date() > new Date(task.dueDate);
    }).length;
    
    const dueSoonTasks = tasks.filter(task => {
      if (!task.dueDate || task.status === TaskStatus.COMPLETED) return false;
      const now = new Date();
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      const dueDate = new Date(task.dueDate);
      return dueDate <= tomorrow && dueDate > now;
    }).length;

    // Priority breakdown
    const priorityBreakdown = {
      urgent: tasks.filter(task => task.priority === 'urgent' && task.status !== TaskStatus.COMPLETED).length,
      high: tasks.filter(task => task.priority === 'high' && task.status !== TaskStatus.COMPLETED).length,
      medium: tasks.filter(task => task.priority === 'medium' && task.status !== TaskStatus.COMPLETED).length,
      low: tasks.filter(task => task.priority === 'low' && task.status !== TaskStatus.COMPLETED).length
    };

    // Recent activity (tasks updated in last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentlyUpdatedTasks = tasks.filter(task => 
      new Date(task.updatedAt) >= sevenDaysAgo
    ).length;

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

  } catch (error) {
    console.error('❌ Error fetching task statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching task statistics',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get user's tasks
router.get('/my-tasks', authenticateToken, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as string;
    const priority = req.query.priority as string;

    console.log(`📋 Fetching tasks for user: ${userId}, page: ${page}, limit: ${limit}`);

    const userObjectId = new mongoose.Types.ObjectId(userId);
    
    // Build query
    let query: any = { assigneeId: userObjectId };
    
    if (status) {
      query.status = status;
    }
    
    if (priority) {
      query.priority = priority;
    }

    // Get tasks with pagination
    const tasks = await TaskEntity.find(query)
      .sort({ updatedAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .populate('projectId', 'title')
      .lean();

    const totalTasks = await TaskEntity.countDocuments(query);
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

  } catch (error) {
    console.error('❌ Error fetching user tasks:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching tasks',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
