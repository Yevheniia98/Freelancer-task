import { FreelancerPlatform, PlatformService, ExternalProject } from './freelancer.service';
import { UpworkService } from './upwork.service';
import { Project, IProject, ProjectType, ProjectStatus } from '../models/project.model';
import mongoose from 'mongoose';

export interface PlatformCredentials {
  upwork?: {
    consumerKey: string;
    consumerSecret: string;
  };
  freelancer?: {
    oauthToken: string;
    oauthSecret: string;
  };
  fiverr?: {
    apiKey: string;
  };
}

export interface SyncResult {
  platform: string;
  success: boolean;
  projectsFound: number;
  projectsSynced: number;
  errors: string[];
}

export class FreelancerIntegrationManager {
  private services: Map<string, PlatformService> = new Map();
  private platforms: Map<string, FreelancerPlatform> = new Map();

  constructor() {
    this.initializePlatforms();
  }

  private initializePlatforms() {
    // Initialize supported platforms
    const upworkPlatform: FreelancerPlatform = {
      name: 'upwork',
      apiKey: '',
      apiSecret: '',
      accessToken: '',
      refreshToken: '',
      isActive: false
    };

    this.platforms.set('upwork', upworkPlatform);
    this.services.set('upwork', new UpworkService(upworkPlatform));

    // TODO: Add other platforms like Freelancer.com, Fiverr, etc.
  }

  async connectPlatform(platformName: string, credentials: any): Promise<boolean> {
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
    } catch (error) {
      console.error(`Failed to connect to ${platformName}:`, error);
      return false;
    }
  }

  async disconnectPlatform(platformName: string): Promise<boolean> {
    try {
      const service = this.services.get(platformName);
      
      if (!service) {
        throw new Error(`Platform ${platformName} is not supported`);
      }

      await service.disconnect();
      console.log(`Disconnected from ${platformName}`);
      return true;
    } catch (error) {
      console.error(`Failed to disconnect from ${platformName}:`, error);
      return false;
    }
  }

  async syncAllPlatforms(userId: string): Promise<SyncResult[]> {
    const results: SyncResult[] = [];

    for (const [platformName, service] of this.services) {
      const result = await this.syncPlatform(platformName, userId);
      results.push(result);
    }

    return results;
  }

  async syncPlatform(platformName: string, userId: string): Promise<SyncResult> {
    const result: SyncResult = {
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
        } catch (error) {
          result.errors.push(`Failed to sync project ${externalProject.id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      result.success = result.errors.length === 0;
      console.log(`Sync completed for ${platformName}: ${result.projectsSynced}/${result.projectsFound} projects synced`);

    } catch (error) {
      result.errors.push(`Platform sync failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return result;
  }

  private async syncExternalProject(externalProject: ExternalProject, userId: string): Promise<IProject> {
    try {
      // Check if project already exists
      let existingProject = await Project.findOne({
        'externalSource.platform': externalProject.platform,
        'externalSource.externalId': externalProject.id,
        userId: new mongoose.Types.ObjectId(userId)
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
      } else {
        // Create new project
        const newProject = new Project({
          title: externalProject.title,
          description: externalProject.description,
          status: this.mapExternalStatus(externalProject.status),
          priority: 'medium',
          type: ProjectType.EXTERNAL,
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
          userId: new mongoose.Types.ObjectId(userId),
          createdBy: new mongoose.Types.ObjectId(userId),
          assignedTo: [new mongoose.Types.ObjectId(userId)],
          teamMembers: [new mongoose.Types.ObjectId(userId)]
        });

        await newProject.save();
        return newProject;
      }
    } catch (error) {
      console.error('Failed to sync external project:', error);
      throw error;
    }
  }

  private mapExternalStatus(externalStatus: string): ProjectStatus {
    const statusMap: { [key: string]: ProjectStatus } = {
      'active': ProjectStatus.ACTIVE,
      'in_progress': ProjectStatus.IN_PROGRESS,
      'completed': ProjectStatus.COMPLETED,
      'cancelled': ProjectStatus.CANCELLED,
      'on_hold': ProjectStatus.ON_HOLD,
      'draft': ProjectStatus.DRAFT,
      'published': ProjectStatus.ACTIVE,
      'awarded': ProjectStatus.IN_PROGRESS,
      'closed': ProjectStatus.COMPLETED
    };

    return statusMap[externalStatus.toLowerCase()] || ProjectStatus.DRAFT;
  }

  async getConnectedPlatforms(): Promise<{ platform: string; isConnected: boolean; name: string }[]> {
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

  async getProjectsByPlatform(userId: string, platform?: string): Promise<IProject[]> {
    const query: any = {
      userId: new mongoose.Types.ObjectId(userId),
      type: ProjectType.EXTERNAL
    };

    if (platform) {
      query['externalSource.platform'] = platform;
    }

    return await Project.find(query)
      .populate('assignedTo', 'fullName email')
      .populate('teamMembers', 'fullName email')
      .populate('createdBy', 'fullName email')
      .sort({ createdAt: -1 });
  }

  async resyncProject(projectId: string): Promise<boolean> {
    try {
      const project = await Project.findById(projectId);
      
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
    } catch (error) {
      console.error('Failed to resync project:', error);
      return false;
    }
  }

  getUpworkService(): UpworkService | null {
    return this.services.get('upwork') as UpworkService || null;
  }

  getPlatformService(platformName: string): PlatformService | null {
    return this.services.get(platformName) || null;
  }
}
