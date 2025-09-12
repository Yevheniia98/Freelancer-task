"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectService = void 0;
const project_entity_1 = require("../models/project.entity");
const mongoose_1 = __importDefault(require("mongoose"));
class ProjectService {
    constructor() { }
    static getInstance() {
        if (!ProjectService.instance) {
            ProjectService.instance = new ProjectService();
        }
        return ProjectService.instance;
    }
    /**
     * Create a new project
     */
    async create(createProjectDto) {
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
            const project = new project_entity_1.ProjectEntity({
                title: createProjectDto.title.trim(),
                description: createProjectDto.description.trim(),
                status: createProjectDto.status || project_entity_1.ProjectStatus.PENDING,
                priority: createProjectDto.priority || project_entity_1.ProjectPriority.MEDIUM,
                deadline: createProjectDto.deadline
            });
            const savedProject = await project.save();
            return savedProject;
        }
        catch (error) {
            console.error('Error creating project:', error);
            throw new Error(`Failed to create project: ${error.message}`);
        }
    }
    /**
     * Get all projects with optional filtering, pagination, and sorting
     */
    async findAll(query = {}) {
        try {
            const { page = 1, limit = 10, status, priority, search, sortBy = 'createdAt', sortOrder = 'desc' } = query;
            // Build filter object
            const filter = {};
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
            const sort = {};
            sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
            // Calculate pagination
            const skip = (page - 1) * limit;
            // Execute query with pagination
            const [projects, totalCount] = await Promise.all([
                project_entity_1.ProjectEntity.find(filter)
                    .sort(sort)
                    .skip(skip)
                    .limit(Number(limit))
                    .exec(),
                project_entity_1.ProjectEntity.countDocuments(filter)
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
        }
        catch (error) {
            console.error('Error fetching projects:', error);
            throw new Error(`Failed to fetch projects: ${error.message}`);
        }
    }
    /**
     * Get a project by ID
     */
    async findById(id) {
        try {
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                throw new Error('Invalid project ID');
            }
            const project = await project_entity_1.ProjectEntity.findById(id).exec();
            return project;
        }
        catch (error) {
            console.error('Error finding project by ID:', error);
            throw new Error(`Failed to find project: ${error.message}`);
        }
    }
    /**
     * Update a project by ID
     */
    async update(id, updateProjectDto) {
        try {
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
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
            const updateData = {};
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
            const updatedProject = await project_entity_1.ProjectEntity.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).exec();
            return updatedProject;
        }
        catch (error) {
            console.error('Error updating project:', error);
            throw new Error(`Failed to update project: ${error.message}`);
        }
    }
    /**
     * Delete a project by ID
     */
    async delete(id) {
        try {
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                throw new Error('Invalid project ID');
            }
            const result = await project_entity_1.ProjectEntity.findByIdAndDelete(id).exec();
            return result !== null;
        }
        catch (error) {
            console.error('Error deleting project:', error);
            throw new Error(`Failed to delete project: ${error.message}`);
        }
    }
    /**
     * Get project statistics
     */
    async getStats() {
        try {
            const [total, statusStats, priorityStats, overdueCount] = await Promise.all([
                project_entity_1.ProjectEntity.countDocuments(),
                project_entity_1.ProjectEntity.aggregate([
                    {
                        $group: {
                            _id: '$status',
                            count: { $sum: 1 }
                        }
                    }
                ]),
                project_entity_1.ProjectEntity.aggregate([
                    {
                        $group: {
                            _id: '$priority',
                            count: { $sum: 1 }
                        }
                    }
                ]),
                project_entity_1.ProjectEntity.countDocuments({
                    deadline: { $lt: new Date() },
                    status: { $nin: [project_entity_1.ProjectStatus.COMPLETED, project_entity_1.ProjectStatus.CANCELLED] }
                })
            ]);
            // Initialize stats objects with zeros
            const byStatus = {
                [project_entity_1.ProjectStatus.PENDING]: 0,
                [project_entity_1.ProjectStatus.IN_PROGRESS]: 0,
                [project_entity_1.ProjectStatus.COMPLETED]: 0,
                [project_entity_1.ProjectStatus.CANCELLED]: 0
            };
            const byPriority = {
                [project_entity_1.ProjectPriority.LOW]: 0,
                [project_entity_1.ProjectPriority.MEDIUM]: 0,
                [project_entity_1.ProjectPriority.HIGH]: 0,
                [project_entity_1.ProjectPriority.URGENT]: 0
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
                overdue: overdueCount
            };
        }
        catch (error) {
            console.error('Error getting project stats:', error);
            throw new Error(`Failed to get project statistics: ${error.message}`);
        }
    }
    /**
     * Bulk update project status
     */
    async bulkUpdateStatus(ids, status) {
        try {
            const validIds = ids.filter(id => mongoose_1.default.Types.ObjectId.isValid(id));
            if (validIds.length === 0) {
                throw new Error('No valid project IDs provided');
            }
            const result = await project_entity_1.ProjectEntity.updateMany({ _id: { $in: validIds } }, { status }, { runValidators: true });
            return result.modifiedCount;
        }
        catch (error) {
            console.error('Error bulk updating projects:', error);
            throw new Error(`Failed to bulk update projects: ${error.message}`);
        }
    }
    /**
     * Search projects by text
     */
    async search(searchTerm, limit = 10) {
        try {
            if (!searchTerm.trim()) {
                return [];
            }
            const projects = await project_entity_1.ProjectEntity.find({
                $or: [
                    { title: { $regex: searchTerm, $options: 'i' } },
                    { description: { $regex: searchTerm, $options: 'i' } }
                ]
            })
                .limit(limit)
                .sort({ createdAt: -1 })
                .exec();
            return projects;
        }
        catch (error) {
            console.error('Error searching projects:', error);
            throw new Error(`Failed to search projects: ${error.message}`);
        }
    }
}
exports.ProjectService = ProjectService;
