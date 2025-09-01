"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskService = void 0;
const task_entity_1 = require("../models/task.entity");
const mongoose_1 = __importDefault(require("mongoose"));
class TaskService {
    constructor() { }
    static getInstance() {
        if (!TaskService.instance) {
            TaskService.instance = new TaskService();
        }
        return TaskService.instance;
    }
    /**
     * Create a new task
     */
    async create(createTaskDto) {
        try {
            // Validate required fields
            if (!createTaskDto.title?.trim()) {
                throw new Error('Task title is required');
            }
            if (!createTaskDto.description?.trim()) {
                throw new Error('Task description is required');
            }
            if (!createTaskDto.projectId) {
                throw new Error('Project ID is required');
            }
            // Validate project ID format
            if (!mongoose_1.default.Types.ObjectId.isValid(createTaskDto.projectId)) {
                throw new Error('Invalid project ID');
            }
            // Validate assignee ID format if provided
            if (createTaskDto.assigneeId && !mongoose_1.default.Types.ObjectId.isValid(createTaskDto.assigneeId)) {
                throw new Error('Invalid assignee ID');
            }
            // Validate due date if provided
            if (createTaskDto.dueDate && new Date(createTaskDto.dueDate) <= new Date()) {
                throw new Error('Due date must be in the future');
            }
            const task = new task_entity_1.TaskEntity({
                title: createTaskDto.title.trim(),
                description: createTaskDto.description.trim(),
                dueDate: createTaskDto.dueDate,
                priority: createTaskDto.priority || task_entity_1.TaskPriority.MEDIUM,
                status: createTaskDto.status || task_entity_1.TaskStatus.TODO,
                assigneeId: createTaskDto.assigneeId ? new mongoose_1.default.Types.ObjectId(createTaskDto.assigneeId) : undefined,
                projectId: new mongoose_1.default.Types.ObjectId(createTaskDto.projectId)
            });
            const savedTask = await task.save();
            return await this.populateTask(savedTask);
        }
        catch (error) {
            console.error('Error creating task:', error);
            throw new Error(`Failed to create task: ${error.message}`);
        }
    }
    /**
     * Get all tasks with optional filtering, pagination, and sorting
     */
    async findAll(query = {}) {
        try {
            const { page = 1, limit = 10, projectId, assigneeId, status, priority, search, overdue, dueSoon, sortBy = 'createdAt', sortOrder = 'desc' } = query;
            // Build filter object
            const filter = {};
            if (projectId) {
                if (!mongoose_1.default.Types.ObjectId.isValid(projectId)) {
                    throw new Error('Invalid project ID');
                }
                filter.projectId = new mongoose_1.default.Types.ObjectId(projectId);
            }
            if (assigneeId) {
                if (!mongoose_1.default.Types.ObjectId.isValid(assigneeId)) {
                    throw new Error('Invalid assignee ID');
                }
                filter.assigneeId = new mongoose_1.default.Types.ObjectId(assigneeId);
            }
            if (status) {
                filter.status = status;
            }
            if (priority) {
                filter.priority = priority;
            }
            if (search) {
                filter.$or = [
                    { title: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } }
                ];
            }
            // Handle overdue filter
            if (overdue === true) {
                filter.dueDate = { $lt: new Date() };
                filter.status = { $ne: task_entity_1.TaskStatus.COMPLETED };
            }
            // Handle due soon filter
            if (dueSoon === true) {
                const now = new Date();
                const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
                filter.dueDate = { $lte: tomorrow, $gt: now };
                filter.status = { $ne: task_entity_1.TaskStatus.COMPLETED };
            }
            // Build sort object
            const sort = {};
            sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
            // Calculate pagination
            const skip = (page - 1) * limit;
            // Execute query with pagination
            const [tasks, totalCount] = await Promise.all([
                task_entity_1.TaskEntity.find(filter)
                    .populate('assigneeId', 'firstName lastName email')
                    .populate('projectId', 'title')
                    .sort(sort)
                    .skip(skip)
                    .limit(Number(limit))
                    .exec(),
                task_entity_1.TaskEntity.countDocuments(filter)
            ]);
            return {
                data: tasks,
                pagination: {
                    current: Number(page),
                    limit: Number(limit),
                    total: totalCount,
                    pages: Math.ceil(totalCount / Number(limit))
                }
            };
        }
        catch (error) {
            console.error('Error fetching tasks:', error);
            throw new Error(`Failed to fetch tasks: ${error.message}`);
        }
    }
    /**
     * Get a task by ID
     */
    async findById(id) {
        try {
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                throw new Error('Invalid task ID');
            }
            const task = await task_entity_1.TaskEntity.findById(id)
                .populate('assigneeId', 'firstName lastName email')
                .populate('projectId', 'title')
                .exec();
            return task;
        }
        catch (error) {
            console.error('Error finding task by ID:', error);
            throw new Error(`Failed to find task: ${error.message}`);
        }
    }
    /**
     * Update a task by ID
     */
    async update(id, updateTaskDto) {
        try {
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                throw new Error('Invalid task ID');
            }
            // Validate update data
            if (updateTaskDto.title !== undefined && !updateTaskDto.title?.trim()) {
                throw new Error('Task title cannot be empty');
            }
            if (updateTaskDto.description !== undefined && !updateTaskDto.description?.trim()) {
                throw new Error('Task description cannot be empty');
            }
            if (updateTaskDto.projectId && !mongoose_1.default.Types.ObjectId.isValid(updateTaskDto.projectId)) {
                throw new Error('Invalid project ID');
            }
            if (updateTaskDto.assigneeId && !mongoose_1.default.Types.ObjectId.isValid(updateTaskDto.assigneeId)) {
                throw new Error('Invalid assignee ID');
            }
            // Prepare update data
            const updateData = {};
            if (updateTaskDto.title !== undefined) {
                updateData.title = updateTaskDto.title.trim();
            }
            if (updateTaskDto.description !== undefined) {
                updateData.description = updateTaskDto.description.trim();
            }
            if (updateTaskDto.dueDate !== undefined) {
                updateData.dueDate = updateTaskDto.dueDate;
            }
            if (updateTaskDto.priority !== undefined) {
                updateData.priority = updateTaskDto.priority;
            }
            if (updateTaskDto.status !== undefined) {
                updateData.status = updateTaskDto.status;
            }
            if (updateTaskDto.assigneeId !== undefined) {
                updateData.assigneeId = updateTaskDto.assigneeId ? new mongoose_1.default.Types.ObjectId(updateTaskDto.assigneeId) : null;
            }
            if (updateTaskDto.projectId !== undefined) {
                updateData.projectId = new mongoose_1.default.Types.ObjectId(updateTaskDto.projectId);
            }
            const updatedTask = await task_entity_1.TaskEntity.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
                .populate('assigneeId', 'firstName lastName email')
                .populate('projectId', 'title')
                .exec();
            return updatedTask;
        }
        catch (error) {
            console.error('Error updating task:', error);
            throw new Error(`Failed to update task: ${error.message}`);
        }
    }
    /**
     * Delete a task by ID
     */
    async delete(id) {
        try {
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                throw new Error('Invalid task ID');
            }
            const result = await task_entity_1.TaskEntity.findByIdAndDelete(id).exec();
            return result !== null;
        }
        catch (error) {
            console.error('Error deleting task:', error);
            throw new Error(`Failed to delete task: ${error.message}`);
        }
    }
    /**
     * Get task statistics
     */
    async getStats(projectId) {
        try {
            const filter = {};
            if (projectId) {
                if (!mongoose_1.default.Types.ObjectId.isValid(projectId)) {
                    throw new Error('Invalid project ID');
                }
                filter.projectId = new mongoose_1.default.Types.ObjectId(projectId);
            }
            const [total, statusStats, priorityStats, overdueCount, dueSoonCount, completedCount] = await Promise.all([
                task_entity_1.TaskEntity.countDocuments(filter),
                task_entity_1.TaskEntity.aggregate([
                    { $match: filter },
                    {
                        $group: {
                            _id: '$status',
                            count: { $sum: 1 }
                        }
                    }
                ]),
                task_entity_1.TaskEntity.aggregate([
                    { $match: filter },
                    {
                        $group: {
                            _id: '$priority',
                            count: { $sum: 1 }
                        }
                    }
                ]),
                task_entity_1.TaskEntity.countDocuments({
                    ...filter,
                    dueDate: { $lt: new Date() },
                    status: { $ne: task_entity_1.TaskStatus.COMPLETED }
                }),
                task_entity_1.TaskEntity.countDocuments({
                    ...filter,
                    dueDate: {
                        $lte: new Date(Date.now() + 24 * 60 * 60 * 1000),
                        $gt: new Date()
                    },
                    status: { $ne: task_entity_1.TaskStatus.COMPLETED }
                }),
                task_entity_1.TaskEntity.countDocuments({
                    ...filter,
                    status: task_entity_1.TaskStatus.COMPLETED
                })
            ]);
            // Initialize stats objects with zeros
            const byStatus = {
                [task_entity_1.TaskStatus.TODO]: 0,
                [task_entity_1.TaskStatus.IN_PROGRESS]: 0,
                [task_entity_1.TaskStatus.IN_REVIEW]: 0,
                [task_entity_1.TaskStatus.COMPLETED]: 0,
                [task_entity_1.TaskStatus.CANCELLED]: 0
            };
            const byPriority = {
                [task_entity_1.TaskPriority.LOW]: 0,
                [task_entity_1.TaskPriority.MEDIUM]: 0,
                [task_entity_1.TaskPriority.HIGH]: 0,
                [task_entity_1.TaskPriority.URGENT]: 0
            };
            // Fill in actual counts
            statusStats.forEach((stat) => {
                if (stat._id in byStatus) {
                    byStatus[stat._id] = stat.count;
                }
            });
            priorityStats.forEach((stat) => {
                if (stat._id in byPriority) {
                    byPriority[stat._id] = stat.count;
                }
            });
            return {
                total,
                byStatus,
                byPriority,
                overdue: overdueCount,
                dueSoon: dueSoonCount,
                completed: completedCount
            };
        }
        catch (error) {
            console.error('Error getting task stats:', error);
            throw new Error(`Failed to get task statistics: ${error.message}`);
        }
    }
    /**
     * Bulk update task status
     */
    async bulkUpdateStatus(ids, status) {
        try {
            const validIds = ids.filter(id => mongoose_1.default.Types.ObjectId.isValid(id))
                .map(id => new mongoose_1.default.Types.ObjectId(id));
            if (validIds.length === 0) {
                throw new Error('No valid task IDs provided');
            }
            const result = await task_entity_1.TaskEntity.updateMany({ _id: { $in: validIds } }, { status }, { runValidators: true });
            return result.modifiedCount;
        }
        catch (error) {
            console.error('Error bulk updating tasks:', error);
            throw new Error(`Failed to bulk update tasks: ${error.message}`);
        }
    }
    /**
     * Assign task to user
     */
    async assignTask(taskId, assigneeId) {
        try {
            if (!mongoose_1.default.Types.ObjectId.isValid(taskId)) {
                throw new Error('Invalid task ID');
            }
            if (assigneeId && !mongoose_1.default.Types.ObjectId.isValid(assigneeId)) {
                throw new Error('Invalid assignee ID');
            }
            const updatedTask = await task_entity_1.TaskEntity.findByIdAndUpdate(taskId, { assigneeId: assigneeId ? new mongoose_1.default.Types.ObjectId(assigneeId) : null }, { new: true, runValidators: true })
                .populate('assigneeId', 'firstName lastName email')
                .populate('projectId', 'title')
                .exec();
            return updatedTask;
        }
        catch (error) {
            console.error('Error assigning task:', error);
            throw new Error(`Failed to assign task: ${error.message}`);
        }
    }
    /**
     * Search tasks by text
     */
    async search(searchTerm, projectId, limit = 10) {
        try {
            if (!searchTerm.trim()) {
                return [];
            }
            const filter = {
                $or: [
                    { title: { $regex: searchTerm, $options: 'i' } },
                    { description: { $regex: searchTerm, $options: 'i' } }
                ]
            };
            if (projectId) {
                if (!mongoose_1.default.Types.ObjectId.isValid(projectId)) {
                    throw new Error('Invalid project ID');
                }
                filter.projectId = new mongoose_1.default.Types.ObjectId(projectId);
            }
            const tasks = await task_entity_1.TaskEntity.find(filter)
                .populate('assigneeId', 'firstName lastName email')
                .populate('projectId', 'title')
                .limit(limit)
                .sort({ createdAt: -1 })
                .exec();
            return tasks;
        }
        catch (error) {
            console.error('Error searching tasks:', error);
            throw new Error(`Failed to search tasks: ${error.message}`);
        }
    }
    /**
     * Get tasks by project ID
     */
    async findByProjectId(projectId, query = {}) {
        return this.findAll({ ...query, projectId });
    }
    /**
     * Get tasks by assignee ID
     */
    async findByAssigneeId(assigneeId, query = {}) {
        return this.findAll({ ...query, assigneeId });
    }
    /**
     * Helper method to populate task with related data
     */
    async populateTask(task) {
        return await task_entity_1.TaskEntity.findById(task._id)
            .populate('assigneeId', 'firstName lastName email')
            .populate('projectId', 'title')
            .exec() || task;
    }
}
exports.TaskService = TaskService;
