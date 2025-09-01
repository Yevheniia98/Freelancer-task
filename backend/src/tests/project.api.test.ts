import request from 'supertest';
import express from 'express';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import projectRoutes from '../routes/project.routes';
import { ProjectStatus, ProjectPriority } from '../models/project.entity';

const app = express();
app.use(express.json());
app.use('/api/projects', projectRoutes);

describe('Project API', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    // Clean up between tests
    if (mongoose.connection.db) {
      await mongoose.connection.db.dropDatabase();
    }
  });

  describe('POST /api/projects', () => {
    it('should create a new project', async () => {
      const projectData = {
        title: 'Test Project',
        description: 'This is a test project',
        status: ProjectStatus.PENDING,
        priority: ProjectPriority.HIGH,
        deadline: new Date(Date.now() + 86400000).toISOString() // Tomorrow
      };

      const response = await request(app)
        .post('/api/projects')
        .send(projectData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(projectData.title);
      expect(response.body.data.description).toBe(projectData.description);
      expect(response.body.data.status).toBe(projectData.status);
      expect(response.body.data.priority).toBe(projectData.priority);
    });

    it('should return validation error for missing title', async () => {
      const projectData = {
        description: 'This is a test project',
      };

      const response = await request(app)
        .post('/api/projects')
        .send(projectData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation failed');
    });
  });

  describe('GET /api/projects', () => {
    beforeEach(async () => {
      // Create some test projects
      const projects = [
        {
          title: 'Project 1',
          description: 'First project',
          status: ProjectStatus.PENDING,
          priority: ProjectPriority.HIGH
        },
        {
          title: 'Project 2',
          description: 'Second project',
          status: ProjectStatus.IN_PROGRESS,
          priority: ProjectPriority.MEDIUM
        }
      ];

      for (const project of projects) {
        await request(app)
          .post('/api/projects')
          .send(project);
      }
    });

    it('should get all projects', async () => {
      const response = await request(app)
        .get('/api/projects')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.pagination.total).toBe(2);
    });

    it('should filter projects by status', async () => {
      const response = await request(app)
        .get('/api/projects')
        .query({ status: ProjectStatus.PENDING })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].status).toBe(ProjectStatus.PENDING);
    });

    it('should search projects by title', async () => {
      const response = await request(app)
        .get('/api/projects')
        .query({ search: 'Project 1' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].title).toBe('Project 1');
    });
  });

  describe('GET /api/projects/:id', () => {
    let projectId: string;

    beforeEach(async () => {
      const response = await request(app)
        .post('/api/projects')
        .send({
          title: 'Test Project',
          description: 'This is a test project',
          status: ProjectStatus.PENDING,
          priority: ProjectPriority.MEDIUM
        });

      projectId = response.body.data.id;
    });

    it('should get a project by ID', async () => {
      const response = await request(app)
        .get(`/api/projects/${projectId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(projectId);
      expect(response.body.data.title).toBe('Test Project');
    });

    it('should return 404 for non-existent project', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      
      const response = await request(app)
        .get(`/api/projects/${nonExistentId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Project not found');
    });
  });

  describe('PUT /api/projects/:id', () => {
    let projectId: string;

    beforeEach(async () => {
      const response = await request(app)
        .post('/api/projects')
        .send({
          title: 'Test Project',
          description: 'This is a test project',
          status: ProjectStatus.PENDING,
          priority: ProjectPriority.MEDIUM
        });

      projectId = response.body.data.id;
    });

    it('should update a project', async () => {
      const updateData = {
        title: 'Updated Project',
        status: ProjectStatus.IN_PROGRESS,
        priority: ProjectPriority.HIGH
      };

      const response = await request(app)
        .put(`/api/projects/${projectId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(updateData.title);
      expect(response.body.data.status).toBe(updateData.status);
      expect(response.body.data.priority).toBe(updateData.priority);
    });
  });

  describe('DELETE /api/projects/:id', () => {
    let projectId: string;

    beforeEach(async () => {
      const response = await request(app)
        .post('/api/projects')
        .send({
          title: 'Test Project',
          description: 'This is a test project',
          status: ProjectStatus.PENDING,
          priority: ProjectPriority.MEDIUM
        });

      projectId = response.body.data.id;
    });

    it('should delete a project', async () => {
      const response = await request(app)
        .delete(`/api/projects/${projectId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Project deleted successfully');

      // Verify project is deleted
      await request(app)
        .get(`/api/projects/${projectId}`)
        .expect(404);
    });
  });

  describe('GET /api/projects/stats', () => {
    beforeEach(async () => {
      // Create some test projects
      const projects = [
        {
          title: 'Project 1',
          description: 'First project',
          status: ProjectStatus.PENDING,
          priority: ProjectPriority.HIGH
        },
        {
          title: 'Project 2',
          description: 'Second project',
          status: ProjectStatus.IN_PROGRESS,
          priority: ProjectPriority.MEDIUM
        },
        {
          title: 'Project 3',
          description: 'Third project',
          status: ProjectStatus.COMPLETED,
          priority: ProjectPriority.LOW
        }
      ];

      for (const project of projects) {
        await request(app)
          .post('/api/projects')
          .send(project);
      }
    });

    it('should get project statistics', async () => {
      const response = await request(app)
        .get('/api/projects/stats')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.total).toBe(3);
      expect(response.body.data.byStatus[ProjectStatus.PENDING]).toBe(1);
      expect(response.body.data.byStatus[ProjectStatus.IN_PROGRESS]).toBe(1);
      expect(response.body.data.byStatus[ProjectStatus.COMPLETED]).toBe(1);
    });
  });
});
