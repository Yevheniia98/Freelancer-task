import { ProjectEntity, IProjectEntity, ProjectStatus, ProjectPriority } from '../models/project.entity';
import mongoose from 'mongoose';

export interface CreateProjectDto {
  title: string;
  description: string;
  status?: ProjectStatus;
  priority?: ProjectPriority;
  deadline?: Date;
}

export interface UpdateProjectDto {
  title?: string;
  description?: string;
  status?: ProjectStatus;
  priority?: ProjectPriority;
  deadline?: Date;
}

export interface ProjectQuery {
  page?: number;
  limit?: number;
  status?: ProjectStatus;
  priority?: ProjectPriority;
  search?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'title' | 'deadline' | 'priority';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    current: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export class ProjectService {
  private static instance: ProjectService;
  
  private constructor() {}

  public static getInstance(): ProjectService {
    if (!ProjectService.instance) {
      ProjectService.instance = new ProjectService();
    }
    return ProjectService.instance;
  }

  /**
   * Create a new project
   */
  async create(createProjectDto: CreateProjectDto): Promise<IProjectEntity> {
    try {
      // Validate required fields
      if (!createProjectDto.title?.trim()) {
        throw new Error('Project title is required');
      }
      if (!createProjectDto.description?.trim()) {
        throw new Error('Project description is required');
      }

      // Validate deadline if provided
      if (createProjectDto.deadline && new Date(createProjectDto.deadline) <= new Date()) {
        throw new Error('Deadline must be in the future');
      }

      const project = new ProjectEntity({
        title: createProjectDto.title.trim(),
        description: createProjectDto.description.trim(),
        status: createProjectDto.status || ProjectStatus.PENDING,
        priority: createProjectDto.priority || ProjectPriority.MEDIUM,
        deadline: createProjectDto.deadline
      });

      const savedProject = await project.save();
      return savedProject;
    } catch (error: any) {
      console.error('Error creating project:', error);
      throw new Error(`Failed to create project: ${error.message}`);
    }
  }

  /**
   * Get all projects with optional filtering, pagination, and sorting
   */
  async findAll(query: ProjectQuery = {}): Promise<PaginatedResult<IProjectEntity>> {
    try {
      const {
        page = 1,
        limit = 10,
        status,
        priority,
        search,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = query;

      // Build filter object
      const filter: any = {};
      
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

      // Build sort object
      const sort: any = {};
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

      // Calculate pagination
      const skip = (page - 1) * limit;

      // Execute query with pagination
      const [projects, totalCount] = await Promise.all([
        ProjectEntity.find(filter)
          .sort(sort)
          .skip(skip)
          .limit(Number(limit))
          .exec(),
        ProjectEntity.countDocuments(filter)
      ]);

      return {
        data: projects,
        pagination: {
          current: Number(page),
          limit: Number(limit),
          total: totalCount,
          pages: Math.ceil(totalCount / Number(limit))
        }
      };
    } catch (error: any) {
      console.error('Error fetching projects:', error);
      throw new Error(`Failed to fetch projects: ${error.message}`);
    }
  }

  /**
   * Get a project by ID
   */
  async findById(id: string): Promise<IProjectEntity | null> {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid project ID');
      }

      const project = await ProjectEntity.findById(id).exec();
      return project;
    } catch (error: any) {
      console.error('Error finding project by ID:', error);
      throw new Error(`Failed to find project: ${error.message}`);
    }
  }

  /**
   * Update a project by ID
   */
  async update(id: string, updateProjectDto: UpdateProjectDto): Promise<IProjectEntity | null> {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid project ID');
      }

      // Validate update data
      if (updateProjectDto.title !== undefined && !updateProjectDto.title?.trim()) {
        throw new Error('Project title cannot be empty');
      }
      if (updateProjectDto.description !== undefined && !updateProjectDto.description?.trim()) {
        throw new Error('Project description cannot be empty');
      }
      if (updateProjectDto.deadline && new Date(updateProjectDto.deadline) <= new Date()) {
        throw new Error('Deadline must be in the future');
      }

      // Prepare update data
      const updateData: any = {};
      
      if (updateProjectDto.title !== undefined) {
        updateData.title = updateProjectDto.title.trim();
      }
      if (updateProjectDto.description !== undefined) {
        updateData.description = updateProjectDto.description.trim();
      }
      if (updateProjectDto.status !== undefined) {
        updateData.status = updateProjectDto.status;
      }
      if (updateProjectDto.priority !== undefined) {
        updateData.priority = updateProjectDto.priority;
      }
      if (updateProjectDto.deadline !== undefined) {
        updateData.deadline = updateProjectDto.deadline;
      }

      const updatedProject = await ProjectEntity.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      ).exec();

      return updatedProject;
    } catch (error: any) {
      console.error('Error updating project:', error);
      throw new Error(`Failed to update project: ${error.message}`);
    }
  }

  /**
   * Delete a project by ID
   */
  async delete(id: string): Promise<boolean> {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid project ID');
      }

      const result = await ProjectEntity.findByIdAndDelete(id).exec();
      return result !== null;
    } catch (error: any) {
      console.error('Error deleting project:', error);
      throw new Error(`Failed to delete project: ${error.message}`);
    }
  }

  /**
   * Get project statistics
   */
  async getStats(): Promise<{
    total: number;
    byStatus: Record<ProjectStatus, number>;
    byPriority: Record<ProjectPriority, number>;
    overdue: number;
  }> {
    try {
      const [
        total,
        statusStats,
        priorityStats,
        overdueCount
      ] = await Promise.all([
        ProjectEntity.countDocuments(),
        ProjectEntity.aggregate([
          {
            $group: {
              _id: '$status',
              count: { $sum: 1 }
            }
          }
        ]),
        ProjectEntity.aggregate([
          {
            $group: {
              _id: '$priority',
              count: { $sum: 1 }
            }
          }
        ]),
        ProjectEntity.countDocuments({
          deadline: { $lt: new Date() },
          status: { $nin: [ProjectStatus.COMPLETED, ProjectStatus.CANCELLED] }
        })
      ]);

      // Initialize stats objects with zeros
      const byStatus: Record<ProjectStatus, number> = {
        [ProjectStatus.PENDING]: 0,
        [ProjectStatus.IN_PROGRESS]: 0,
        [ProjectStatus.COMPLETED]: 0,
        [ProjectStatus.CANCELLED]: 0
      };

      const byPriority: Record<ProjectPriority, number> = {
        [ProjectPriority.LOW]: 0,
        [ProjectPriority.MEDIUM]: 0,
        [ProjectPriority.HIGH]: 0,
        [ProjectPriority.URGENT]: 0
      };

      // Fill in actual counts
      statusStats.forEach((stat: any) => {
        if (stat._id in byStatus) {
          byStatus[stat._id as ProjectStatus] = stat.count;
        }
      });

      priorityStats.forEach((stat: any) => {
        if (stat._id in byPriority) {
          byPriority[stat._id as ProjectPriority] = stat.count;
        }
      });

      return {
        total,
        byStatus,
        byPriority,
        overdue: overdueCount
      };
    } catch (error: any) {
      console.error('Error getting project stats:', error);
      throw new Error(`Failed to get project statistics: ${error.message}`);
    }
  }

  /**
   * Bulk update project status
   */
  async bulkUpdateStatus(ids: string[], status: ProjectStatus): Promise<number> {
    try {
      const validIds = ids.filter(id => mongoose.Types.ObjectId.isValid(id));
      if (validIds.length === 0) {
        throw new Error('No valid project IDs provided');
      }

      const result = await ProjectEntity.updateMany(
        { _id: { $in: validIds } },
        { status },
        { runValidators: true }
      );

      return result.modifiedCount;
    } catch (error: any) {
      console.error('Error bulk updating projects:', error);
      throw new Error(`Failed to bulk update projects: ${error.message}`);
    }
  }

  /**
   * Search projects by text
   */
  async search(searchTerm: string, limit: number = 10): Promise<IProjectEntity[]> {
    try {
      if (!searchTerm.trim()) {
        return [];
      }

      const projects = await ProjectEntity.find({
        $or: [
          { title: { $regex: searchTerm, $options: 'i' } },
          { description: { $regex: searchTerm, $options: 'i' } }
        ]
      })
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec();

      return projects;
    } catch (error: any) {
      console.error('Error searching projects:', error);
      throw new Error(`Failed to search projects: ${error.message}`);
    }
  }
}
