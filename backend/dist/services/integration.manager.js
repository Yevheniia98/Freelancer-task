"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FreelancerIntegrationManager = void 0;
const upwork_service_1 = require("./upwork.service");
const project_model_1 = require("../models/project.model");
const mongoose_1 = __importDefault(require("mongoose"));
class FreelancerIntegrationManager {
    constructor() {
        this.services = new Map();
        this.platforms = new Map();
        this.initializePlatforms();
    }
    initializePlatforms() {
        // Initialize supported platforms
        const upworkPlatform = {
            name: 'upwork',
            apiKey: '',
            apiSecret: '',
            accessToken: '',
            refreshToken: '',
            isActive: false
        };
        this.platforms.set('upwork', upworkPlatform);
        this.services.set('upwork', new upwork_service_1.UpworkService(upworkPlatform));
        // TODO: Add other platforms like Freelancer.com, Fiverr, etc.
    }
    async connectPlatform(platformName, credentials) {
        try {
            const service = this.services.get(platformName);
            const platform = this.platforms.get(platformName);
            if (!service || !platform) {
                throw new Error(`Platform ${platformName} is not supported`);
            }
            const authenticated = await service.authenticate(credentials);
            if (authenticated) {
                platform.isActive = true;
                console.log(`Successfully connected to ${platformName}`);
            }
            return authenticated;
        }
        catch (error) {
            console.error(`Failed to connect to ${platformName}:`, error);
            return false;
        }
    }
    async disconnectPlatform(platformName) {
        try {
            const service = this.services.get(platformName);
            if (!service) {
                throw new Error(`Platform ${platformName} is not supported`);
            }
            await service.disconnect();
            console.log(`Disconnected from ${platformName}`);
            return true;
        }
        catch (error) {
            console.error(`Failed to disconnect from ${platformName}:`, error);
            return false;
        }
    }
    async syncAllPlatforms(userId) {
        const results = [];
        for (const [platformName, service] of this.services) {
            const result = await this.syncPlatform(platformName, userId);
            results.push(result);
        }
        return results;
    }
    async syncPlatform(platformName, userId) {
        const result = {
            platform: platformName,
            success: false,
            projectsFound: 0,
            projectsSynced: 0,
            errors: []
        };
        try {
            const service = this.services.get(platformName);
            if (!service) {
                result.errors.push(`Platform ${platformName} is not supported`);
                return result;
            }
            if (!service.isConnected()) {
                result.errors.push(`Platform ${platformName} is not connected`);
                return result;
            }
            console.log(`Syncing projects from ${platformName}...`);
            const externalProjects = await service.fetchProjects(userId);
            result.projectsFound = externalProjects.length;
            for (const externalProject of externalProjects) {
                try {
                    await this.syncExternalProject(externalProject, userId);
                    result.projectsSynced++;
                }
                catch (error) {
                    result.errors.push(`Failed to sync project ${externalProject.id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
                }
            }
            result.success = result.errors.length === 0;
            console.log(`Sync completed for ${platformName}: ${result.projectsSynced}/${result.projectsFound} projects synced`);
        }
        catch (error) {
            result.errors.push(`Platform sync failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
        return result;
    }
    async syncExternalProject(externalProject, userId) {
        try {
            // Check if project already exists
            let existingProject = await project_model_1.Project.findOne({
                'externalSource.platform': externalProject.platform,
                'externalSource.externalId': externalProject.id,
                userId: new mongoose_1.default.Types.ObjectId(userId)
            });
            if (existingProject) {
                // Update existing project
                existingProject.title = externalProject.title;
                existingProject.description = externalProject.description;
                existingProject.status = this.mapExternalStatus(externalProject.status);
                existingProject.budget = {
                    amount: externalProject.budget.max || externalProject.budget.min || 0,
                    currency: externalProject.budget.currency,
                    type: externalProject.budget.type,
                    spent: existingProject.budget.spent || 0
                };
                existingProject.deadline = externalProject.deadline;
                existingProject.skills = externalProject.skills;
                existingProject.client = externalProject.client;
                if (existingProject.externalSource) {
                    existingProject.externalSource.lastSynced = new Date();
                    existingProject.externalSource.syncStatus = 'synced';
                    existingProject.externalSource.url = externalProject.platformUrl;
                }
                await existingProject.save();
                return existingProject;
            }
            else {
                // Create new project
                const newProject = new project_model_1.Project({
                    title: externalProject.title,
                    description: externalProject.description,
                    status: this.mapExternalStatus(externalProject.status),
                    priority: 'medium',
                    type: project_model_1.ProjectType.EXTERNAL,
                    budget: {
                        amount: externalProject.budget.max || externalProject.budget.min || 0,
                        currency: externalProject.budget.currency,
                        type: externalProject.budget.type,
                        spent: 0
                    },
                    client: externalProject.client,
                    deadline: externalProject.deadline,
                    skills: externalProject.skills,
                    tags: [externalProject.platform],
                    externalSource: {
                        platform: externalProject.platform,
                        externalId: externalProject.id,
                        url: externalProject.platformUrl,
                        lastSynced: new Date(),
                        syncStatus: 'synced'
                    },
                    userId: new mongoose_1.default.Types.ObjectId(userId),
                    createdBy: new mongoose_1.default.Types.ObjectId(userId),
                    assignedTo: [new mongoose_1.default.Types.ObjectId(userId)],
                    teamMembers: [new mongoose_1.default.Types.ObjectId(userId)]
                });
                await newProject.save();
                return newProject;
            }
        }
        catch (error) {
            console.error('Failed to sync external project:', error);
            throw error;
        }
    }
    mapExternalStatus(externalStatus) {
        const statusMap = {
            'active': project_model_1.ProjectStatus.ACTIVE,
            'in_progress': project_model_1.ProjectStatus.IN_PROGRESS,
            'completed': project_model_1.ProjectStatus.COMPLETED,
            'cancelled': project_model_1.ProjectStatus.CANCELLED,
            'on_hold': project_model_1.ProjectStatus.ON_HOLD,
            'draft': project_model_1.ProjectStatus.DRAFT,
            'published': project_model_1.ProjectStatus.ACTIVE,
            'awarded': project_model_1.ProjectStatus.IN_PROGRESS,
            'closed': project_model_1.ProjectStatus.COMPLETED
        };
        return statusMap[externalStatus.toLowerCase()] || project_model_1.ProjectStatus.DRAFT;
    }
    async getConnectedPlatforms() {
        const platforms = [];
        for (const [platformName, platform] of this.platforms) {
            platforms.push({
                platform: platformName,
                isConnected: platform.isActive,
                name: platform.name
            });
        }
        return platforms;
    }
    async getProjectsByPlatform(userId, platform) {
        const query = {
            userId: new mongoose_1.default.Types.ObjectId(userId),
            type: project_model_1.ProjectType.EXTERNAL
        };
        if (platform) {
            query['externalSource.platform'] = platform;
        }
        return await project_model_1.Project.find(query)
            .populate('assignedTo', 'fullName email')
            .populate('teamMembers', 'fullName email')
            .populate('createdBy', 'fullName email')
            .sort({ createdAt: -1 });
    }
    async resyncProject(projectId) {
        try {
            const project = await project_model_1.Project.findById(projectId);
            if (!project || !project.externalSource) {
                throw new Error('Project not found or not linked to external platform');
            }
            const service = this.services.get(project.externalSource.platform);
            if (!service || !service.isConnected()) {
                throw new Error(`Platform ${project.externalSource.platform} is not connected`);
            }
            const externalProject = await service.syncProject(project.externalSource.externalId);
            await this.syncExternalProject(externalProject, project.userId.toString());
            return true;
        }
        catch (error) {
            console.error('Failed to resync project:', error);
            return false;
        }
    }
    getUpworkService() {
        return this.services.get('upwork') || null;
    }
    getPlatformService(platformName) {
        return this.services.get(platformName) || null;
    }
}
exports.FreelancerIntegrationManager = FreelancerIntegrationManager;
