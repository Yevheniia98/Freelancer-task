import { FreelancerIntegrationManager } from '../services/integration.manager';
import { Project } from '../models/project.model';
import { User } from '../models/user.model';
import mongoose from 'mongoose';

// Mock the Upwork service
const mockUpworkService = {
  authenticate: jest.fn().mockResolvedValue(true),
  fetchProjects: jest.fn().mockResolvedValue([
    {
      id: 'upwork123',
      title: 'Test Upwork Project',
      description: 'A test project from Upwork',
      budget: { min: 1000, max: 2000, currency: 'USD', type: 'fixed' },
      deadline: new Date('2025-09-01'),
      client: { name: 'Upwork Client', rating: 4.8, country: 'US' },
      skills: ['React', 'Node.js'],
      status: 'active',
      platform: 'upwork',
      platformUrl: 'https://upwork.com/jobs/upwork123',
      createdAt: new Date('2025-08-01'),
      updatedAt: new Date('2025-08-01')
    }
  ]),
  syncProject: jest.fn().mockResolvedValue({
    id: 'upwork123',
    title: 'Updated Upwork Project',
    description: 'Updated project description',
    budget: { min: 1500, max: 2500, currency: 'USD', type: 'fixed' },
    deadline: new Date('2025-09-15'),
    client: { name: 'Upwork Client', rating: 4.9, country: 'US' },
    skills: ['React', 'Node.js', 'TypeScript'],
    status: 'in_progress',
    platform: 'upwork',
    platformUrl: 'https://upwork.com/jobs/upwork123',
    createdAt: new Date('2025-08-01'),
    updatedAt: new Date('2025-08-03')
  }),
  isConnected: jest.fn().mockReturnValue(true),
  disconnect: jest.fn().mockImplementation(() => {
    mockUpworkService.isConnected.mockReturnValue(false);
    return Promise.resolve();
  })
};

jest.mock('../services/upwork.service', () => {
  return {
    UpworkService: jest.fn().mockImplementation(() => mockUpworkService)
  };
});

describe('FreelancerIntegrationManager', () => {
  let integrationManager: FreelancerIntegrationManager;
  let testUserId: mongoose.Types.ObjectId;
  let testUser: any;

  beforeEach(async () => {
    // Reset mock state
    mockUpworkService.isConnected.mockReturnValue(true);
    jest.clearAllMocks();
    
    integrationManager = new FreelancerIntegrationManager();
    
    // Create test user
    testUserId = new mongoose.Types.ObjectId();
    testUser = new User({
      _id: testUserId,
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'hashedpassword'
    });
    await testUser.save();
  });

  describe('platform connection', () => {
    it('should connect to Upwork platform successfully', async () => {
      const credentials = {
        consumerKey: 'test-key',
        consumerSecret: 'test-secret'
      };

      const result = await integrationManager.connectPlatform('upwork', credentials);

      expect(result).toBe(true);
    });

    it('should fail to connect to unsupported platform', async () => {
      const credentials = { apiKey: 'test-key' };

      const result = await integrationManager.connectPlatform('unsupported', credentials);

      expect(result).toBe(false);
    });

    it('should disconnect from platform successfully', async () => {
      const result = await integrationManager.disconnectPlatform('upwork');

      expect(result).toBe(true);
    });

    it('should fail to disconnect from unsupported platform', async () => {
      const result = await integrationManager.disconnectPlatform('unsupported');

      expect(result).toBe(false);
    });

    it('should get connected platforms status', async () => {
      const platforms = await integrationManager.getConnectedPlatforms();

      expect(platforms).toHaveLength(1);
      expect(platforms[0]).toMatchObject({
        platform: 'upwork',
        name: 'upwork'
      });
    });
  });

  describe('project synchronization', () => {
    beforeEach(async () => {
      // Connect to platform first
      await integrationManager.connectPlatform('upwork', {
        consumerKey: 'test-key',
        consumerSecret: 'test-secret'
      });
    });

    it('should sync all platforms successfully', async () => {
      const results = await integrationManager.syncAllPlatforms(testUserId.toString());

      expect(results).toHaveLength(1);
      expect(results[0]).toMatchObject({
        platform: 'upwork',
        success: true,
        projectsFound: 1,
        projectsSynced: 1,
        errors: []
      });

      // Verify project was created in database
      const projects = await Project.find({ userId: testUserId });
      expect(projects).toHaveLength(1);
      expect(projects[0].title).toBe('Test Upwork Project');
      expect(projects[0].externalSource?.platform).toBe('upwork');
    });

    it('should sync specific platform successfully', async () => {
      const result = await integrationManager.syncPlatform('upwork', testUserId.toString());

      expect(result).toMatchObject({
        platform: 'upwork',
        success: true,
        projectsFound: 1,
        projectsSynced: 1,
        errors: []
      });
    });

    it('should update existing project during sync', async () => {
      // Create existing project
      const existingProject = await Project.create({
        title: 'Old Title',
        description: 'Old description',
        status: 'draft',
        priority: 'medium',
        type: 'external',
        budget: { amount: 500, currency: 'USD', type: 'fixed' },
        client: { name: 'Old Client' },
        externalSource: {
          platform: 'upwork',
          externalId: 'upwork123',
          url: 'https://upwork.com/jobs/upwork123',
          lastSynced: new Date('2025-07-01'),
          syncStatus: 'synced'
        },
        userId: testUserId,
        createdBy: testUserId
      });

      // Sync should update the existing project
      await integrationManager.syncPlatform('upwork', testUserId.toString());

      const updatedProject = await Project.findById(existingProject._id);
      expect(updatedProject?.title).toBe('Test Upwork Project');
      expect(updatedProject?.budget.amount).toBe(2000); // max budget from mock
      expect(updatedProject?.externalSource?.lastSynced).toBeInstanceOf(Date);
    });

    it('should handle sync errors gracefully', async () => {
      // Mock service to throw error
      const mockService = integrationManager.getPlatformService('upwork') as any;
      mockService.fetchProjects.mockRejectedValueOnce(new Error('API Error'));

      const result = await integrationManager.syncPlatform('upwork', testUserId.toString());

      expect(result.success).toBe(false);
      expect(result.errors).toContain('Platform sync failed: API Error');
    });
  });

  describe('project operations', () => {
    let testProject: any;

    beforeEach(async () => {
      // Create test project
      testProject = await Project.create({
        title: 'Test Project',
        description: 'Test description',
        status: 'active',
        priority: 'medium',
        type: 'external',
        budget: { amount: 1000, currency: 'USD', type: 'fixed' },
        client: { name: 'Test Client' },
        externalSource: {
          platform: 'upwork',
          externalId: 'upwork123',
          url: 'https://upwork.com/jobs/upwork123',
          lastSynced: new Date(),
          syncStatus: 'synced'
        },
        userId: testUserId,
        createdBy: testUserId
      });

      // Connect platform
      await integrationManager.connectPlatform('upwork', {
        consumerKey: 'test-key',
        consumerSecret: 'test-secret'
      });
    });

    it('should get projects by platform', async () => {
      const projects = await integrationManager.getProjectsByPlatform(testUserId.toString(), 'upwork');

      expect(projects).toHaveLength(1);
      expect(projects[0].externalSource?.platform).toBe('upwork');
    });

    it('should get all external projects', async () => {
      const projects = await integrationManager.getProjectsByPlatform(testUserId.toString());

      expect(projects).toHaveLength(1);
      expect(projects[0].type).toBe('external');
    });

    it('should resync individual project successfully', async () => {
      const result = await integrationManager.resyncProject(testProject._id.toString());

      expect(result).toBe(true);

      // Verify project was updated
      const updatedProject = await Project.findById(testProject._id);
      expect(updatedProject?.title).toBe('Updated Upwork Project');
      expect(updatedProject?.status).toBe('in_progress');
    });

    it('should fail to resync non-external project', async () => {
      // Create internal project
      const internalProject = await Project.create({
        title: 'Internal Project',
        description: 'Internal description',
        status: 'active',
        priority: 'medium',
        type: 'internal',
        budget: { amount: 1000, currency: 'USD', type: 'fixed' },
        client: { name: 'Internal Client' },
        userId: testUserId,
        createdBy: testUserId
      });

      const result = await integrationManager.resyncProject((internalProject._id as mongoose.Types.ObjectId).toString());

      expect(result).toBe(false);
    });

    it('should fail to resync when platform not connected', async () => {
      // Disconnect platform
      await integrationManager.disconnectPlatform('upwork');

      const result = await integrationManager.resyncProject((testProject._id as mongoose.Types.ObjectId).toString());

      expect(result).toBe(false);
    });
  });

  describe('status mapping', () => {
    it('should map external status to local status correctly', async () => {
      const manager = integrationManager as any;

      expect(manager.mapExternalStatus('active')).toBe('active');
      expect(manager.mapExternalStatus('in_progress')).toBe('in_progress');
      expect(manager.mapExternalStatus('completed')).toBe('completed');
      expect(manager.mapExternalStatus('cancelled')).toBe('cancelled');
      expect(manager.mapExternalStatus('published')).toBe('active');
      expect(manager.mapExternalStatus('awarded')).toBe('in_progress');
      expect(manager.mapExternalStatus('closed')).toBe('completed');
      expect(manager.mapExternalStatus('unknown')).toBe('draft');
    });
  });

  describe('error handling', () => {
    it('should handle unsupported platform gracefully', async () => {
      const result = await integrationManager.syncPlatform('unsupported', testUserId.toString());

      expect(result.success).toBe(false);
      expect(result.errors).toContain('Platform unsupported is not supported');
    });

    it('should handle disconnected platform gracefully', async () => {
      // Mock disconnected service
      const mockService = integrationManager.getPlatformService('upwork') as any;
      mockService.isConnected.mockReturnValue(false);

      const result = await integrationManager.syncPlatform('upwork', testUserId.toString());

      expect(result.success).toBe(false);
      expect(result.errors).toContain('Platform upwork is not connected');
    });
  });
});
