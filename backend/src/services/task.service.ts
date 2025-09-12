import { TaskEntity, ITaskEntity, TaskStatus, TaskPriority } from '../models/task.entity';
import mongoose from 'mongoose';

export interface CreateTaskDto {
  title: string;
  description: string;
  dueDate?: Date;
  priority?: TaskPriority;
  status?: TaskStatus;
  assigneeId?: string;
  projectId: string;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  dueDate?: Date;
  priority?: TaskPriority;
  status?: TaskStatus;
  assigneeId?: string;
  projectId?: string;
}

export interface TaskQuery {
  page?: number;
  limit?: number;
  projectId?: string;
  assigneeId?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  search?: string;
  overdue?: boolean;
  dueSoon?: boolean;
  sortBy?: 'createdAt' | 'updatedAt' | 'title' | 'dueDate' | 'priority' | 'status';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedTaskResult<T> {
  data: T[];
  pagination: {
    current: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export class TaskService {
  private static instance: TaskService;
  
  private constructor() {}

  public static getInstance(): TaskService {
    if (!TaskService.instance) {
      TaskService.instance = new TaskService();
    }
    return TaskService.instance;
  }

  /**
   * Create a new task
   */
  async create(createTaskDto: CreateTaskDto): Promise<ITaskEntity> {
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
      if (!mongoose.Types.ObjectId.isValid(createTaskDto.projectId)) {
        throw new Error('Invalid project ID');
      }

      // Validate assignee ID format if provided
      if (createTaskDto.assigneeId && !mongoose.Types.ObjectId.isValid(createTaskDto.assigneeId)) {
        throw new Error('Invalid assignee ID');
      }

      // Validate due date if provided
      if (createTaskDto.dueDate && new Date(createTaskDto.dueDate) <= new Date()) {
        throw new Error('Due date must be in the future');
      }

      const task = new TaskEntity({
        title: createTaskDto.title.trim(),
        description: createTaskDto.description.trim(),
        dueDate: createTaskDto.dueDate,
        priority: createTaskDto.priority || TaskPriority.MEDIUM,
        status: createTaskDto.status || TaskStatus.TODO,
        assigneeId: createTaskDto.assigneeId ? new mongoose.Types.ObjectId(createTaskDto.assigneeId) : undefined,
        projectId: new mongoose.Types.ObjectId(createTaskDto.projectId)
      });

      const savedTask = await task.save();
      return await this.populateTask(savedTask);
    } catch (error: any) {
      console.error('Error creating task:', error);
      throw new Error(`Failed to create task: ${error.message}`);
    }
  }

  /**
   * Get all tasks with optional filtering, pagination, and sorting
   */
  async findAll(query: TaskQuery = {}): Promise<PaginatedTaskResult<ITaskEntity>> {
    try {
      const {
        page = 1,
        limit = 10,
        projectId,
        assigneeId,
        status,
        priority,
        search,
        overdue,
        dueSoon,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = query;

      // Build filter object
      const filter: any = {};
      
      if (projectId) {
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
          throw new Error('Invalid project ID');
        }
        filter.projectId = new mongoose.Types.ObjectId(projectId);
      }
      
      if (assigneeId) {
        if (!mongoose.Types.ObjectId.isValid(assigneeId)) {
          throw new Error('Invalid assignee ID');
        }
        filter.assigneeId = new mongoose.Types.ObjectId(assigneeId);
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
        filter.status = { $ne: TaskStatus.COMPLETED };
      }

      // Handle due soon filter
      if (dueSoon === true) {
        const now = new Date();
        const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        filter.dueDate = { $lte: tomorrow, $gt: now };
        filter.status = { $ne: TaskStatus.COMPLETED };
      }

      // Build sort object
      const sort: any = {};
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

      // Calculate pagination
      const skip = (page - 1) * limit;

      // Execute query with pagination
      const [tasks, totalCount] = await Promise.all([
        TaskEntity.find(filter)
          .populate('assigneeId', 'firstName lastName email')
          .populate('projectId', 'title')
          .sort(sort)
          .skip(skip)
          .limit(Number(limit))
          .exec(),
        TaskEntity.countDocuments(filter)
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
    } catch (error: any) {
      console.error('Error fetching tasks:', error);
      throw new Error(`Failed to fetch tasks: ${error.message}`);
    }
  }

  /**
   * Get a task by ID
   */
  async findById(id: string): Promise<ITaskEntity | null> {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid task ID');
      }

      const task = await TaskEntity.findById(id)
        .populate('assigneeId', 'firstName lastName email')
        .populate('projectId', 'title')
        .exec();

      return task;
    } catch (error: any) {
      console.error('Error finding task by ID:', error);
      throw new Error(`Failed to find task: ${error.message}`);
    }
  }

  /**
   * Update a task by ID
   */
  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<ITaskEntity | null> {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid task ID');
      }

      // Validate update data
      if (updateTaskDto.title !== undefined && !updateTaskDto.title?.trim()) {
        throw new Error('Task title cannot be empty');
      }
      if (updateTaskDto.description !== undefined && !updateTaskDto.description?.trim()) {
        throw new Error('Task description cannot be empty');
      }
      if (updateTaskDto.projectId && !mongoose.Types.ObjectId.isValid(updateTaskDto.projectId)) {
        throw new Error('Invalid project ID');
      }
      if (updateTaskDto.assigneeId && !mongoose.Types.ObjectId.isValid(updateTaskDto.assigneeId)) {
        throw new Error('Invalid assignee ID');
      }

      // Prepare update data
      const updateData: any = {};
      
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
        updateData.assigneeId = updateTaskDto.assigneeId ? new mongoose.Types.ObjectId(updateTaskDto.assigneeId) : null;
      }
      if (updateTaskDto.projectId !== undefined) {
        updateData.projectId = new mongoose.Types.ObjectId(updateTaskDto.projectId);
      }

      const updatedTask = await TaskEntity.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      )
        .populate('assigneeId', 'firstName lastName email')
        .populate('projectId', 'title')
        .exec();

      return updatedTask;
    } catch (error: any) {
      console.error('Error updating task:', error);
      throw new Error(`Failed to update task: ${error.message}`);
    }
  }

  /**
   * Delete a task by ID
   */
  async delete(id: string): Promise<boolean> {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid task ID');
      }

      const result = await TaskEntity.findByIdAndDelete(id).exec();
      return result !== null;
    } catch (error: any) {
      console.error('Error deleting task:', error);
      throw new Error(`Failed to delete task: ${error.message}`);
    }
  }

  /**
   * Get task statistics
   */
  async getStats(projectId?: string): Promise<{
    total: number;
    byStatus: Record<TaskStatus, number>;
    byPriority: Record<TaskPriority, number>;
    overdue: number;
    dueSoon: number;
    completed: number;
  }> {
    try {
      const filter: any = {};
      if (projectId) {
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
          throw new Error('Invalid project ID');
        }
        filter.projectId = new mongoose.Types.ObjectId(projectId);
      }

      const [
        total,
        statusStats,
        priorityStats,
        overdueCount,
        dueSoonCount,
        completedCount
      ] = await Promise.all([
        TaskEntity.countDocuments(filter),
        TaskEntity.aggregate([
          { $match: filter },
          {
            $group: {
              _id: '$status',
              count: { $sum: 1 }
            }
          }
        ]),
        TaskEntity.aggregate([
          { $match: filter },
          {
            $group: {
              _id: '$priority',
              count: { $sum: 1 }
            }
          }
        ]),
        TaskEntity.countDocuments({
          ...filter,
          dueDate: { $lt: new Date() },
          status: { $ne: TaskStatus.COMPLETED }
        }),
        TaskEntity.countDocuments({
          ...filter,
          dueDate: { 
            $lte: new Date(Date.now() + 24 * 60 * 60 * 1000),
            $gt: new Date()
          },
          status: { $ne: TaskStatus.COMPLETED }
        }),
        TaskEntity.countDocuments({
          ...filter,
          status: TaskStatus.COMPLETED
        })
      ]);

      // Initialize stats objects with zeros
      const byStatus: Record<TaskStatus, number> = {
        [TaskStatus.TODO]: 0,
        [TaskStatus.IN_PROGRESS]: 0,
        [TaskStatus.IN_REVIEW]: 0,
        [TaskStatus.COMPLETED]: 0,
        [TaskStatus.CANCELLED]: 0
      };

      const byPriority: Record<TaskPriority, number> = {
        [TaskPriority.LOW]: 0,
        [TaskPriority.MEDIUM]: 0,
        [TaskPriority.HIGH]: 0,
        [TaskPriority.URGENT]: 0
      };

      // Fill in actual counts
      statusStats.forEach((stat: any) => {
        if (stat._id in byStatus) {
          byStatus[stat._id as TaskStatus] = stat.count;
        }
      });

      priorityStats.forEach((stat: any) => {
        if (stat._id in byPriority) {
          byPriority[stat._id as TaskPriority] = stat.count;
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
    } catch (error: any) {
      console.error('Error getting task stats:', error);
      throw new Error(`Failed to get task statistics: ${error.message}`);
    }
  }

  /**
   * Bulk update task status
   */
  async bulkUpdateStatus(ids: string[], status: TaskStatus): Promise<number> {
    try {
      const validIds = ids.filter(id => mongoose.Types.ObjectId.isValid(id))
        .map(id => new mongoose.Types.ObjectId(id));
      
      if (validIds.length === 0) {
        throw new Error('No valid task IDs provided');
      }

      const result = await TaskEntity.updateMany(
        { _id: { $in: validIds } },
        { status },
        { runValidators: true }
      );

      return result.modifiedCount;
    } catch (error: any) {
      console.error('Error bulk updating tasks:', error);
      throw new Error(`Failed to bulk update tasks: ${error.message}`);
    }
  }

  /**
   * Assign task to user
   */
  async assignTask(taskId: string, assigneeId: string | null): Promise<ITaskEntity | null> {
    try {
      if (!mongoose.Types.ObjectId.isValid(taskId)) {
        throw new Error('Invalid task ID');
      }
      
      if (assigneeId && !mongoose.Types.ObjectId.isValid(assigneeId)) {
        throw new Error('Invalid assignee ID');
      }

      const updatedTask = await TaskEntity.findByIdAndUpdate(
        taskId,
        { assigneeId: assigneeId ? new mongoose.Types.ObjectId(assigneeId) : null },
        { new: true, runValidators: true }
      )
        .populate('assigneeId', 'firstName lastName email')
        .populate('projectId', 'title')
        .exec();

      return updatedTask;
    } catch (error: any) {
      console.error('Error assigning task:', error);
      throw new Error(`Failed to assign task: ${error.message}`);
    }
  }

  /**
   * Search tasks by text
   */
  async search(searchTerm: string, projectId?: string, limit: number = 10): Promise<ITaskEntity[]> {
    try {
      if (!searchTerm.trim()) {
        return [];
      }

      const filter: any = {
        $or: [
          { title: { $regex: searchTerm, $options: 'i' } },
          { description: { $regex: searchTerm, $options: 'i' } }
        ]
      };

      if (projectId) {
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
          throw new Error('Invalid project ID');
        }
        filter.projectId = new mongoose.Types.ObjectId(projectId);
      }

      const tasks = await TaskEntity.find(filter)
        .populate('assigneeId', 'firstName lastName email')
        .populate('projectId', 'title')
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec();

      return tasks;
    } catch (error: any) {
      console.error('Error searching tasks:', error);
      throw new Error(`Failed to search tasks: ${error.message}`);
    }
  }

  /**
   * Get tasks by project ID
   */
  async findByProjectId(projectId: string, query: Omit<TaskQuery, 'projectId'> = {}): Promise<PaginatedTaskResult<ITaskEntity>> {
    return this.findAll({ ...query, projectId });
  }

  /**
   * Get tasks by assignee ID
   */
  async findByAssigneeId(assigneeId: string, query: Omit<TaskQuery, 'assigneeId'> = {}): Promise<PaginatedTaskResult<ITaskEntity>> {
    return this.findAll({ ...query, assigneeId });
  }

  /**
   * Helper method to populate task with related data
   */
  private async populateTask(task: ITaskEntity): Promise<ITaskEntity> {
    return await TaskEntity.findById(task._id)
      .populate('assigneeId', 'firstName lastName email')
      .populate('projectId', 'title')
      .exec() || task;
  }
}
