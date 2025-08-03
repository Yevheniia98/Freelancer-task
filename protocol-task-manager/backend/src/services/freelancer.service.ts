import axios from 'axios';
import { IProject, ProjectStatus, ProjectPriority } from '../models/project.model';

export interface FreelancerPlatform {
  name: string;
  apiKey: string;
  apiSecret?: string;
  accessToken?: string;
  refreshToken?: string;
  isActive: boolean;
}

export interface ExternalProject {
  id: string;
  title: string;
  description: string;
  budget: {
    min?: number;
    max?: number;
    currency: string;
    type: 'fixed' | 'hourly';
  };
  deadline?: Date;
  client: {
    name: string;
    rating?: number;
    country?: string;
  };
  skills: string[];
  status: string;
  platform: string;
  platformUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlatformService {
  authenticate(credentials: any): Promise<boolean>;
  fetchProjects(userId: string): Promise<ExternalProject[]>;
  syncProject(projectId: string): Promise<ExternalProject>;
  isConnected(): boolean;
  disconnect(): Promise<void>;
}

export abstract class BasePlatformService implements PlatformService {
  protected platform: FreelancerPlatform;
  protected httpClient: any;

  constructor(platform: FreelancerPlatform) {
    this.platform = platform;
    this.setupHttpClient();
  }

  protected setupHttpClient() {
    this.httpClient = axios.create({
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'FreelancerTaskManager/1.0'
      }
    });
  }

  abstract authenticate(credentials: any): Promise<boolean>;
  abstract fetchProjects(userId: string): Promise<ExternalProject[]>;
  abstract syncProject(projectId: string): Promise<ExternalProject>;

  isConnected(): boolean {
    return this.platform.isActive && !!this.platform.accessToken;
  }

  async disconnect(): Promise<void> {
    this.platform.isActive = false;
    this.platform.accessToken = undefined;
    this.platform.refreshToken = undefined;
  }

  protected mapStatusToLocal(externalStatus: string): ProjectStatus {
    const statusMap: { [key: string]: ProjectStatus } = {
      'active': ProjectStatus.IN_PROGRESS,
      'in_progress': ProjectStatus.IN_PROGRESS,
      'completed': ProjectStatus.COMPLETED,
      'cancelled': ProjectStatus.CANCELLED,
      'on_hold': ProjectStatus.ON_HOLD,
      'draft': ProjectStatus.DRAFT,
      'published': ProjectStatus.IN_PROGRESS,
      'awarded': ProjectStatus.IN_PROGRESS,
      'closed': ProjectStatus.COMPLETED
    };

    return statusMap[externalStatus.toLowerCase()] || ProjectStatus.DRAFT;
  }

  protected mapPriorityToLocal(externalPriority?: string): ProjectPriority {
    if (!externalPriority) return ProjectPriority.MEDIUM;
    
    const priorityMap: { [key: string]: ProjectPriority } = {
      'urgent': ProjectPriority.HIGH,
      'high': ProjectPriority.HIGH,
      'medium': ProjectPriority.MEDIUM,
      'normal': ProjectPriority.MEDIUM,
      'low': ProjectPriority.LOW
    };

    return priorityMap[externalPriority.toLowerCase()] || ProjectPriority.MEDIUM;
  }
}
