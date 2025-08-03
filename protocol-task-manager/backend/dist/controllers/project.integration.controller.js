"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectIntegrationController = void 0;
const integration_manager_1 = require("../services/integration.manager");
const project_model_1 = require("../models/project.model");
const express_validator_1 = require("express-validator");
class ProjectIntegrationController {
    constructor() {
        // Get all projects (internal + external)
        this.getAllProjects = async (req, res) => {
            try {
                const userId = req.user?.id;
                if (!userId) {
                    return res.status(401).json({
                        success: false,
                        message: 'Authentication required'
                    });
                }
                const { platform, status, type, page = 1, limit = 20 } = req.query;
                // Build query
                const query = { userId };
                if (platform) {
                    query['externalSource.platform'] = platform;
                }
                if (status) {
                    query.status = status;
                }
                if (type) {
                    query.type = type;
                }
                const skip = (Number(page) - 1) * Number(limit);
                const [projects, totalCount] = await Promise.all([
                    project_model_1.Project.find(query)
                        .populate('assignedTo', 'fullName email')
                        .populate('teamMembers', 'fullName email')
                        .populate('createdBy', 'fullName email')
                        .sort({ createdAt: -1 })
                        .skip(skip)
                        .limit(Number(limit)),
                    project_model_1.Project.countDocuments(query)
                ]);
                res.json({
                    success: true,
                    data: {
                        projects,
                        pagination: {
                            current: Number(page),
                            limit: Number(limit),
                            total: totalCount,
                            pages: Math.ceil(totalCount / Number(limit))
                        }
                    }
                });
            }
            catch (error) {
                console.error('Get projects error:', error);
                res.status(500).json({
                    success: false,
                    message: 'Failed to fetch projects',
                    error: error instanceof Error ? error.message : "Unknown error"
                });
            }
        };
        // Connect to a freelancer platform
        this.connectPlatform = async (req, res) => {
            try {
                const errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({
                        success: false,
                        message: 'Validation failed',
                        errors: errors.array()
                    });
                }
                const { platform, credentials } = req.body;
                if (!platform || !credentials) {
                    return res.status(400).json({
                        success: false,
                        message: 'Platform and credentials are required'
                    });
                }
                const connected = await this.integrationManager.connectPlatform(platform, credentials);
                if (connected) {
                    res.json({
                        success: true,
                        message: `Successfully connected to ${platform}`,
                        data: { platform, connected: true }
                    });
                }
                else {
                    res.status(400).json({
                        success: false,
                        message: `Failed to connect to ${platform}. Please check your credentials.`
                    });
                }
            }
            catch (error) {
                console.error('Connect platform error:', error);
                res.status(500).json({
                    success: false,
                    message: 'Failed to connect to platform',
                    error: error instanceof Error ? error.message : "Unknown error"
                });
            }
        };
        // Disconnect from a platform
        this.disconnectPlatform = async (req, res) => {
            try {
                const { platform } = req.params;
                if (!platform) {
                    return res.status(400).json({
                        success: false,
                        message: 'Platform name is required'
                    });
                }
                const disconnected = await this.integrationManager.disconnectPlatform(platform);
                if (disconnected) {
                    res.json({
                        success: true,
                        message: `Successfully disconnected from ${platform}`,
                        data: { platform, connected: false }
                    });
                }
                else {
                    res.status(400).json({
                        success: false,
                        message: `Failed to disconnect from ${platform}`
                    });
                }
            }
            catch (error) {
                console.error('Disconnect platform error:', error);
                res.status(500).json({
                    success: false,
                    message: 'Failed to disconnect from platform',
                    error: error instanceof Error ? error.message : "Unknown error"
                });
            }
        };
        // Get connected platforms status
        this.getConnectedPlatforms = async (req, res) => {
            try {
                const platforms = await this.integrationManager.getConnectedPlatforms();
                res.json({
                    success: true,
                    data: { platforms }
                });
            }
            catch (error) {
                console.error('Get platforms error:', error);
                res.status(500).json({
                    success: false,
                    message: 'Failed to fetch platform status',
                    error: error instanceof Error ? error.message : "Unknown error"
                });
            }
        };
        // Sync projects from all connected platforms
        this.syncAllPlatforms = async (req, res) => {
            try {
                const userId = req.user?.id;
                if (!userId) {
                    return res.status(401).json({
                        success: false,
                        message: 'Authentication required'
                    });
                }
                const results = await this.integrationManager.syncAllPlatforms(userId);
                // Calculate summary
                const summary = {
                    totalPlatforms: results.length,
                    successfulSyncs: results.filter(r => r.success).length,
                    totalProjectsFound: results.reduce((sum, r) => sum + r.projectsFound, 0),
                    totalProjectsSynced: results.reduce((sum, r) => sum + r.projectsSynced, 0),
                    totalErrors: results.reduce((sum, r) => sum + r.errors.length, 0)
                };
                res.json({
                    success: true,
                    message: 'Platform sync completed',
                    data: {
                        summary,
                        results
                    }
                });
            }
            catch (error) {
                console.error('Sync all platforms error:', error);
                res.status(500).json({
                    success: false,
                    message: 'Failed to sync platforms',
                    error: error instanceof Error ? error.message : "Unknown error"
                });
            }
        };
        // Sync projects from a specific platform
        this.syncPlatform = async (req, res) => {
            try {
                const userId = req.user?.id;
                const { platform } = req.params;
                if (!userId) {
                    return res.status(401).json({
                        success: false,
                        message: 'Authentication required'
                    });
                }
                if (!platform) {
                    return res.status(400).json({
                        success: false,
                        message: 'Platform name is required'
                    });
                }
                const result = await this.integrationManager.syncPlatform(platform, userId);
                res.json({
                    success: result.success,
                    message: result.success ?
                        `Successfully synced ${result.projectsSynced} projects from ${platform}` :
                        `Sync failed for ${platform}`,
                    data: result
                });
            }
            catch (error) {
                console.error('Sync platform error:', error);
                res.status(500).json({
                    success: false,
                    message: 'Failed to sync platform',
                    error: error instanceof Error ? error.message : "Unknown error"
                });
            }
        };
        // Get projects from external platforms
        this.getExternalProjects = async (req, res) => {
            try {
                const userId = req.user?.id;
                const { platform } = req.query;
                if (!userId) {
                    return res.status(401).json({
                        success: false,
                        message: 'Authentication required'
                    });
                }
                const projects = await this.integrationManager.getProjectsByPlatform(userId, platform);
                res.json({
                    success: true,
                    data: {
                        projects,
                        count: projects.length
                    }
                });
            }
            catch (error) {
                console.error('Get external projects error:', error);
                res.status(500).json({
                    success: false,
                    message: 'Failed to fetch external projects',
                    error: error instanceof Error ? error.message : "Unknown error"
                });
            }
        };
        // Resync a specific project
        this.resyncProject = async (req, res) => {
            try {
                const { projectId } = req.params;
                if (!projectId) {
                    return res.status(400).json({
                        success: false,
                        message: 'Project ID is required'
                    });
                }
                const success = await this.integrationManager.resyncProject(projectId);
                if (success) {
                    res.json({
                        success: true,
                        message: 'Project resynced successfully'
                    });
                }
                else {
                    res.status(400).json({
                        success: false,
                        message: 'Failed to resync project'
                    });
                }
            }
            catch (error) {
                console.error('Resync project error:', error);
                res.status(500).json({
                    success: false,
                    message: 'Failed to resync project',
                    error: error instanceof Error ? error.message : "Unknown error"
                });
            }
        };
        // Get project statistics
        this.getProjectStats = async (req, res) => {
            try {
                const userId = req.user?.id;
                if (!userId) {
                    return res.status(401).json({
                        success: false,
                        message: 'Authentication required'
                    });
                }
                const [totalProjects, externalProjects, activeProjects, completedProjects, projectsByPlatform] = await Promise.all([
                    project_model_1.Project.countDocuments({ userId }),
                    project_model_1.Project.countDocuments({ userId, type: 'external' }),
                    project_model_1.Project.countDocuments({ userId, status: 'active' }),
                    project_model_1.Project.countDocuments({ userId, status: 'completed' }),
                    project_model_1.Project.aggregate([
                        { $match: { userId: userId, type: 'external' } },
                        { $group: {
                                _id: '$externalSource.platform',
                                count: { $sum: 1 },
                                totalBudget: { $sum: '$budget.amount' }
                            } },
                        { $sort: { count: -1 } }
                    ])
                ]);
                res.json({
                    success: true,
                    data: {
                        summary: {
                            totalProjects,
                            externalProjects,
                            internalProjects: totalProjects - externalProjects,
                            activeProjects,
                            completedProjects
                        },
                        platformBreakdown: projectsByPlatform
                    }
                });
            }
            catch (error) {
                console.error('Get project stats error:', error);
                res.status(500).json({
                    success: false,
                    message: 'Failed to fetch project statistics',
                    error: error instanceof Error ? error.message : "Unknown error"
                });
            }
        };
        this.integrationManager = new integration_manager_1.FreelancerIntegrationManager();
    }
}
exports.ProjectIntegrationController = ProjectIntegrationController;
