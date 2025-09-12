"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectController = void 0;
const express_validator_1 = require("express-validator");
const project_service_1 = require("../services/project.service");
class ProjectController {
    constructor() {
        /**
         * Create a new project
         */
        this.create = async (req, res) => {
            try {
                if (this.handleValidationErrors(req, res))
                    return;
                const createProjectDto = {
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
            }
            catch (error) {
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
        this.findAll = async (req, res) => {
            try {
                if (this.handleValidationErrors(req, res))
                    return;
                const query = {
                    page: req.query.page ? parseInt(req.query.page) : undefined,
                    limit: req.query.limit ? parseInt(req.query.limit) : undefined,
                    status: req.query.status,
                    priority: req.query.priority,
                    search: req.query.search,
                    sortBy: req.query.sortBy,
                    sortOrder: req.query.sortOrder
                };
                const result = await this.projectService.findAll(query);
                res.json({
                    success: true,
                    message: 'Projects retrieved successfully',
                    data: result.data,
                    pagination: result.pagination
                });
            }
            catch (error) {
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
        this.getStats = async (req, res) => {
            try {
                const stats = await this.projectService.getStats();
                res.json({
                    success: true,
                    message: 'Project statistics retrieved successfully',
                    data: stats
                });
            }
            catch (error) {
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
        this.search = async (req, res) => {
            try {
                if (this.handleValidationErrors(req, res))
                    return;
                const searchTerm = req.query.q;
                const limit = req.query.limit ? parseInt(req.query.limit) : 10;
                const projects = await this.projectService.search(searchTerm, limit);
                res.json({
                    success: true,
                    message: 'Search completed successfully',
                    data: projects,
                    count: projects.length
                });
            }
            catch (error) {
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
        this.findById = async (req, res) => {
            try {
                if (this.handleValidationErrors(req, res))
                    return;
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
            }
            catch (error) {
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
        this.update = async (req, res) => {
            try {
                if (this.handleValidationErrors(req, res))
                    return;
                const updateProjectDto = {};
                // Only include fields that were provided
                if (req.body.title !== undefined)
                    updateProjectDto.title = req.body.title;
                if (req.body.description !== undefined)
                    updateProjectDto.description = req.body.description;
                if (req.body.status !== undefined)
                    updateProjectDto.status = req.body.status;
                if (req.body.priority !== undefined)
                    updateProjectDto.priority = req.body.priority;
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
            }
            catch (error) {
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
        this.bulkUpdateStatus = async (req, res) => {
            try {
                if (this.handleValidationErrors(req, res))
                    return;
                const { ids, status } = req.body;
                const modifiedCount = await this.projectService.bulkUpdateStatus(ids, status);
                res.json({
                    success: true,
                    message: `${modifiedCount} projects updated successfully`,
                    data: { modifiedCount }
                });
            }
            catch (error) {
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
        this.delete = async (req, res) => {
            try {
                if (this.handleValidationErrors(req, res))
                    return;
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
            }
            catch (error) {
                console.error('Delete project error:', error);
                res.status(500).json({
                    success: false,
                    message: error.message || 'Failed to delete project'
                });
            }
        };
        this.projectService = project_service_1.ProjectService.getInstance();
    }
    // Helper method to handle validation errors
    handleValidationErrors(req, res) {
        const errors = (0, express_validator_1.validationResult)(req);
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
}
exports.ProjectController = ProjectController;
