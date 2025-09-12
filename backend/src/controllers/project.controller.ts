import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { ProjectService, CreateProjectDto, UpdateProjectDto, ProjectQuery } from '../services/project.service';
import { ProjectStatus } from '../models/project.entity';

export class ProjectController {
  private projectService: ProjectService;

  constructor() {
    this.projectService = ProjectService.getInstance();
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
   * Create a new project
   */
  create = async (req: Request, res: Response): Promise<void> => {
    try {
      if (this.handleValidationErrors(req, res)) return;

      const createProjectDto: CreateProjectDto = {
        title: req.body.title,
        description: req.body.description,
        status: req.body.status,
        priority: req.body.priority,
        deadline: req.body.deadline ? new Date(req.body.deadline) : undefined
      };

      const project = await this.projectService.create(createProjectDto);

      res.status(201).json({
        success: true,
        message: 'Project created successfully',
        data: project
      });
    } catch (error: any) {
      console.error('Create project error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to create project'
      });
    }
  };

  /**
   * Get all projects with filtering, pagination, and sorting
   */
  findAll = async (req: Request, res: Response): Promise<void> => {
    try {
      if (this.handleValidationErrors(req, res)) return;

      const query: ProjectQuery = {
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
        status: req.query.status as any,
        priority: req.query.priority as any,
        search: req.query.search as string,
        sortBy: req.query.sortBy as any,
        sortOrder: req.query.sortOrder as 'asc' | 'desc'
      };

      const result = await this.projectService.findAll(query);

      res.json({
        success: true,
        message: 'Projects retrieved successfully',
        data: result.data,
        pagination: result.pagination
      });
    } catch (error: any) {
      console.error('Get projects error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve projects'
      });
    }
  };

  /**
   * Get project statistics
   */
  getStats = async (req: Request, res: Response): Promise<void> => {
    try {
      const stats = await this.projectService.getStats();

      res.json({
        success: true,
        message: 'Project statistics retrieved successfully',
        data: stats
      });
    } catch (error: any) {
      console.error('Get project stats error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve project statistics'
      });
    }
  };

  /**
   * Search projects by text
   */
  search = async (req: Request, res: Response): Promise<void> => {
    try {
      if (this.handleValidationErrors(req, res)) return;

      const searchTerm = req.query.q as string;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

      const projects = await this.projectService.search(searchTerm, limit);

      res.json({
        success: true,
        message: 'Search completed successfully',
        data: projects,
        count: projects.length
      });
    } catch (error: any) {
      console.error('Search projects error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to search projects'
      });
    }
  };

  /**
   * Get a single project by ID
   */
  findById = async (req: Request, res: Response): Promise<void> => {
    try {
      if (this.handleValidationErrors(req, res)) return;

      const project = await this.projectService.findById(req.params.id);

      if (!project) {
        res.status(404).json({
          success: false,
          message: 'Project not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Project retrieved successfully',
        data: project
      });
    } catch (error: any) {
      console.error('Get project error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve project'
      });
    }
  };

  /**
   * Update a project by ID
   */
  update = async (req: Request, res: Response): Promise<void> => {
    try {
      if (this.handleValidationErrors(req, res)) return;

      const updateProjectDto: UpdateProjectDto = {};
      
      // Only include fields that were provided
      if (req.body.title !== undefined) updateProjectDto.title = req.body.title;
      if (req.body.description !== undefined) updateProjectDto.description = req.body.description;
      if (req.body.status !== undefined) updateProjectDto.status = req.body.status;
      if (req.body.priority !== undefined) updateProjectDto.priority = req.body.priority;
      if (req.body.deadline !== undefined) {
        updateProjectDto.deadline = req.body.deadline ? new Date(req.body.deadline) : undefined;
      }

      const updatedProject = await this.projectService.update(req.params.id, updateProjectDto);

      if (!updatedProject) {
        res.status(404).json({
          success: false,
          message: 'Project not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Project updated successfully',
        data: updatedProject
      });
    } catch (error: any) {
      console.error('Update project error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to update project'
      });
    }
  };

  /**
   * Bulk update project status
   */
  bulkUpdateStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      if (this.handleValidationErrors(req, res)) return;

      const { ids, status } = req.body;
      const modifiedCount = await this.projectService.bulkUpdateStatus(ids, status);

      res.json({
        success: true,
        message: `${modifiedCount} projects updated successfully`,
        data: { modifiedCount }
      });
    } catch (error: any) {
      console.error('Bulk update error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to bulk update projects'
      });
    }
  };

  /**
   * Delete a project by ID
   */
  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      if (this.handleValidationErrors(req, res)) return;

      const deleted = await this.projectService.delete(req.params.id);

      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'Project not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Project deleted successfully'
      });
    } catch (error: any) {
      console.error('Delete project error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to delete project'
      });
    }
  };
}
