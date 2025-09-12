import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { TaskService, CreateTaskDto, UpdateTaskDto, TaskQuery } from '../services/task.service';

export class TaskController {
  private taskService: TaskService;

  constructor() {
    this.taskService = TaskService.getInstance();
  }

  // Helper method to handle validation errors
  private handleValidationErrors(req: Request, res: Response): boolean {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
      return true;
    }
    return false;
  }

  /**
   * Create a new task
   */
  create = async (req: Request, res: Response): Promise<void> => {
    try {
      if (this.handleValidationErrors(req, res)) return;

      const createTaskDto: CreateTaskDto = {
        title: req.body.title,
        description: req.body.description,
        projectId: req.body.projectId,
        assigneeId: req.body.assigneeId,
        status: req.body.status,
        priority: req.body.priority,
        dueDate: req.body.dueDate ? new Date(req.body.dueDate) : undefined
      };

      const task = await this.taskService.create(createTaskDto);

      res.status(201).json({
        success: true,
        message: 'Task created successfully',
        data: task
      });
    } catch (error: any) {
      console.error('Create task error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to create task'
      });
    }
  };

  /**
   * Get all tasks with filtering, pagination, and sorting
   */
  findAll = async (req: Request, res: Response): Promise<void> => {
    try {
      if (this.handleValidationErrors(req, res)) return;

      const query: TaskQuery = {
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
        projectId: req.query.projectId as string,
        assigneeId: req.query.assigneeId as string,
        status: req.query.status as any,
        priority: req.query.priority as any,
        search: req.query.search as string,
        overdue: req.query.overdue === 'true',
        dueSoon: req.query.dueSoon === 'true',
        sortBy: req.query.sortBy as any,
        sortOrder: req.query.sortOrder as 'asc' | 'desc'
      };

      const result = await this.taskService.findAll(query);

      res.json({
        success: true,
        message: 'Tasks retrieved successfully',
        data: result.data,
        pagination: result.pagination
      });
    } catch (error: any) {
      console.error('Get tasks error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve tasks'
      });
    }
  };

  /**
   * Get task statistics
   */
  getStats = async (req: Request, res: Response): Promise<void> => {
    try {
      if (this.handleValidationErrors(req, res)) return;

      const projectId = req.query.projectId as string;
      const stats = await this.taskService.getStats(projectId);

      res.json({
        success: true,
        message: 'Task statistics retrieved successfully',
        data: stats
      });
    } catch (error: any) {
      console.error('Get task stats error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve task statistics'
      });
    }
  };

  /**
   * Search tasks by text
   */
  search = async (req: Request, res: Response): Promise<void> => {
    try {
      if (this.handleValidationErrors(req, res)) return;

      const searchTerm = req.query.q as string;
      const projectId = req.query.projectId as string;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

      const tasks = await this.taskService.search(searchTerm, projectId, limit);

      res.json({
        success: true,
        message: 'Search completed successfully',
        data: tasks,
        count: tasks.length
      });
    } catch (error: any) {
      console.error('Search tasks error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to search tasks'
      });
    }
  };

  /**
   * Get tasks by project ID
   */
  findByProjectId = async (req: Request, res: Response): Promise<void> => {
    try {
      if (this.handleValidationErrors(req, res)) return;

      const projectId = req.params.projectId;
      const query: Omit<TaskQuery, 'projectId'> = {
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
        assigneeId: req.query.assigneeId as string,
        status: req.query.status as any,
        priority: req.query.priority as any,
        search: req.query.search as string,
        overdue: req.query.overdue === 'true',
        dueSoon: req.query.dueSoon === 'true',
        sortBy: req.query.sortBy as any,
        sortOrder: req.query.sortOrder as 'asc' | 'desc'
      };

      const result = await this.taskService.findByProjectId(projectId, query);

      res.json({
        success: true,
        message: 'Project tasks retrieved successfully',
        data: result.data,
        pagination: result.pagination
      });
    } catch (error: any) {
      console.error('Get project tasks error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve project tasks'
      });
    }
  };

  /**
   * Get tasks by assignee ID
   */
  findByAssigneeId = async (req: Request, res: Response): Promise<void> => {
    try {
      if (this.handleValidationErrors(req, res)) return;

      const assigneeId = req.params.assigneeId;
      const query: Omit<TaskQuery, 'assigneeId'> = {
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
        projectId: req.query.projectId as string,
        status: req.query.status as any,
        priority: req.query.priority as any,
        search: req.query.search as string,
        overdue: req.query.overdue === 'true',
        dueSoon: req.query.dueSoon === 'true',
        sortBy: req.query.sortBy as any,
        sortOrder: req.query.sortOrder as 'asc' | 'desc'
      };

      const result = await this.taskService.findByAssigneeId(assigneeId, query);

      res.json({
        success: true,
        message: 'Assignee tasks retrieved successfully',
        data: result.data,
        pagination: result.pagination
      });
    } catch (error: any) {
      console.error('Get assignee tasks error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve assignee tasks'
      });
    }
  };

  /**
   * Get a single task by ID
   */
  findById = async (req: Request, res: Response): Promise<void> => {
    try {
      if (this.handleValidationErrors(req, res)) return;

      const task = await this.taskService.findById(req.params.id);

      if (!task) {
        res.status(404).json({
          success: false,
          message: 'Task not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Task retrieved successfully',
        data: task
      });
    } catch (error: any) {
      console.error('Get task error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve task'
      });
    }
  };

  /**
   * Update a task by ID
   */
  update = async (req: Request, res: Response): Promise<void> => {
    try {
      if (this.handleValidationErrors(req, res)) return;

      const updateTaskDto: UpdateTaskDto = {};
      
      // Only include fields that were provided
      if (req.body.title !== undefined) updateTaskDto.title = req.body.title;
      if (req.body.description !== undefined) updateTaskDto.description = req.body.description;
      if (req.body.status !== undefined) updateTaskDto.status = req.body.status;
      if (req.body.priority !== undefined) updateTaskDto.priority = req.body.priority;
      if (req.body.projectId !== undefined) updateTaskDto.projectId = req.body.projectId;
      if (req.body.assigneeId !== undefined) {
        updateTaskDto.assigneeId = req.body.assigneeId || null;
      }
      if (req.body.dueDate !== undefined) {
        updateTaskDto.dueDate = req.body.dueDate ? new Date(req.body.dueDate) : undefined;
      }

      const updatedTask = await this.taskService.update(req.params.id, updateTaskDto);

      if (!updatedTask) {
        res.status(404).json({
          success: false,
          message: 'Task not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Task updated successfully',
        data: updatedTask
      });
    } catch (error: any) {
      console.error('Update task error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to update task'
      });
    }
  };

  /**
   * Assign/unassign task to/from user
   */
  assignTask = async (req: Request, res: Response): Promise<void> => {
    try {
      if (this.handleValidationErrors(req, res)) return;

      const assigneeId = req.body.assigneeId || null;
      const updatedTask = await this.taskService.assignTask(req.params.id, assigneeId);

      if (!updatedTask) {
        res.status(404).json({
          success: false,
          message: 'Task not found'
        });
        return;
      }

      res.json({
        success: true,
        message: assigneeId ? 'Task assigned successfully' : 'Task unassigned successfully',
        data: updatedTask
      });
    } catch (error: any) {
      console.error('Assign task error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to assign task'
      });
    }
  };

  /**
   * Bulk update task status
   */
  bulkUpdateStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      if (this.handleValidationErrors(req, res)) return;

      const { ids, status } = req.body;
      const modifiedCount = await this.taskService.bulkUpdateStatus(ids, status);

      res.json({
        success: true,
        message: `${modifiedCount} tasks updated successfully`,
        data: { modifiedCount }
      });
    } catch (error: any) {
      console.error('Bulk update error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to bulk update tasks'
      });
    }
  };

  /**
   * Delete a task by ID
   */
  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      if (this.handleValidationErrors(req, res)) return;

      const deleted = await this.taskService.delete(req.params.id);

      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'Task not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Task deleted successfully'
      });
    } catch (error: any) {
      console.error('Delete task error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to delete task'
      });
    }
  };
}
