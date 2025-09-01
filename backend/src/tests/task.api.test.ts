import request from 'supertest';
import express from 'express';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import taskRoutes from '../routes/task.routes';
import projectRoutes from '../routes/project.routes';
import { TaskStatus, TaskPriority } from '../models/task.entity';
import { ProjectStatus, ProjectPriority } from '../models/project.entity';

const app = express();
app.use(express.json());
app.use('/api/tasks', taskRoutes);
app.use('/api/projects', projectRoutes);

describe('Task API', () => {
  let mongoServer: MongoMemoryServer;
  let testProjectId: string;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    // Clean up between tests
    if (mongoose.connection.db) {
      await mongoose.connection.db.dropDatabase();
    }

    // Create a test project for task association
    const projectResponse = await request(app)
      .post('/api/projects')
      .send({
        title: 'Test Project for Tasks',
        description: 'A project for testing task functionality',
        status: ProjectStatus.PENDING,
        priority: ProjectPriority.MEDIUM
      });

    testProjectId = projectResponse.body.data.id;
  });

  describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'This is a test task for API validation',
        projectId: testProjectId,
        status: TaskStatus.TODO,
        priority: TaskPriority.HIGH,
        dueDate: new Date(Date.now() + 86400000).toISOString() // Tomorrow
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(taskData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(taskData.title);
      expect(response.body.data.description).toBe(taskData.description);
      expect(response.body.data.status).toBe(taskData.status);
      expect(response.body.data.priority).toBe(taskData.priority);
      expect(response.body.data.projectId).toBeDefined();
    });

    it('should return validation error for missing title', async () => {
      const taskData = {
        description: 'This task has no title',
        projectId: testProjectId
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(taskData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation failed');
    });

    it('should return validation error for invalid project ID', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'Task with invalid project ID',
        projectId: 'invalid-project-id'
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(taskData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation failed');
    });

    it('should return validation error for due date in the past', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'Task with past due date',
        projectId: testProjectId,
        dueDate: new Date(Date.now() - 86400000).toISOString() // Yesterday
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(taskData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation failed');
    });
  });

  describe('GET /api/tasks', () => {
    beforeEach(async () => {
      // Create some test tasks
      const tasks = [
        {
          title: 'Task 1',
          description: 'First test task',
          projectId: testProjectId,
          status: TaskStatus.TODO,
          priority: TaskPriority.HIGH
        },
        {
          title: 'Task 2',
          description: 'Second test task',
          projectId: testProjectId,
          status: TaskStatus.IN_PROGRESS,
          priority: TaskPriority.MEDIUM
        },
        {
          title: 'Task 3',
          description: 'Third test task',
          projectId: testProjectId,
          status: TaskStatus.COMPLETED,
          priority: TaskPriority.LOW
        }
      ];

      for (const task of tasks) {
        await request(app)
          .post('/api/tasks')
          .send(task);
      }
    });

    it('should get all tasks', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(3);
      expect(response.body.pagination.total).toBe(3);
    });

    it('should filter tasks by status', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .query({ status: TaskStatus.TODO })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].status).toBe(TaskStatus.TODO);
    });

    it('should filter tasks by priority', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .query({ priority: TaskPriority.HIGH })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].priority).toBe(TaskPriority.HIGH);
    });

    it('should filter tasks by project ID', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .query({ projectId: testProjectId })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(3);
    });

    it('should search tasks by title', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .query({ search: 'Task 1' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].title).toBe('Task 1');
    });

    it('should paginate results', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .query({ page: 1, limit: 2 })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.pagination.current).toBe(1);
      expect(response.body.pagination.limit).toBe(2);
      expect(response.body.pagination.total).toBe(3);
      expect(response.body.pagination.pages).toBe(2);
    });

    it('should sort tasks by creation date', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .query({ sortBy: 'createdAt', sortOrder: 'asc' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(3);
      // Tasks should be sorted by creation date ascending
      const dates = response.body.data.map((task: any) => new Date(task.createdAt));
      expect(dates[0] <= dates[1]).toBe(true);
      expect(dates[1] <= dates[2]).toBe(true);
    });
  });

  describe('GET /api/tasks/:id', () => {
    let taskId: string;

    beforeEach(async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({
          title: 'Test Task',
          description: 'This is a test task',
          projectId: testProjectId,
          status: TaskStatus.TODO,
          priority: TaskPriority.MEDIUM
        });

      taskId = response.body.data.id;
    });

    it('should get a task by ID', async () => {
      const response = await request(app)
        .get(`/api/tasks/${taskId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(taskId);
      expect(response.body.data.title).toBe('Test Task');
    });

    it('should return 404 for non-existent task', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      
      const response = await request(app)
        .get(`/api/tasks/${nonExistentId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Task not found');
    });

    it('should return 400 for invalid task ID', async () => {
      const response = await request(app)
        .get('/api/tasks/invalid-id')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation failed');
    });
  });

  describe('PUT /api/tasks/:id', () => {
    let taskId: string;

    beforeEach(async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({
          title: 'Test Task',
          description: 'This is a test task',
          projectId: testProjectId,
          status: TaskStatus.TODO,
          priority: TaskPriority.MEDIUM
        });

      taskId = response.body.data.id;
    });

    it('should update a task', async () => {
      const updateData = {
        title: 'Updated Task',
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.HIGH
      };

      const response = await request(app)
        .put(`/api/tasks/${taskId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(updateData.title);
      expect(response.body.data.status).toBe(updateData.status);
      expect(response.body.data.priority).toBe(updateData.priority);
    });

    it('should return 404 for non-existent task', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      
      const response = await request(app)
        .put(`/api/tasks/${nonExistentId}`)
        .send({ title: 'Updated Task' })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Task not found');
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    let taskId: string;

    beforeEach(async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({
          title: 'Test Task',
          description: 'This is a test task',
          projectId: testProjectId,
          status: TaskStatus.TODO,
          priority: TaskPriority.MEDIUM
        });

      taskId = response.body.data.id;
    });

    it('should delete a task', async () => {
      const response = await request(app)
        .delete(`/api/tasks/${taskId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Task deleted successfully');

      // Verify task is deleted
      await request(app)
        .get(`/api/tasks/${taskId}`)
        .expect(404);
    });

    it('should return 404 for non-existent task', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      
      const response = await request(app)
        .delete(`/api/tasks/${nonExistentId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Task not found');
    });
  });

  describe('GET /api/tasks/stats', () => {
    beforeEach(async () => {
      // Create tasks with different statuses and priorities
      const tasks = [
        {
          title: 'Task 1',
          description: 'Test task 1',
          projectId: testProjectId,
          status: TaskStatus.TODO,
          priority: TaskPriority.HIGH
        },
        {
          title: 'Task 2',
          description: 'Test task 2',
          projectId: testProjectId,
          status: TaskStatus.IN_PROGRESS,
          priority: TaskPriority.MEDIUM
        },
        {
          title: 'Task 3',
          description: 'Test task 3',
          projectId: testProjectId,
          status: TaskStatus.COMPLETED,
          priority: TaskPriority.LOW
        }
      ];

      for (const task of tasks) {
        await request(app)
          .post('/api/tasks')
          .send(task);
      }
    });

    it('should get task statistics', async () => {
      const response = await request(app)
        .get('/api/tasks/stats')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.total).toBe(3);
      expect(response.body.data.byStatus[TaskStatus.TODO]).toBe(1);
      expect(response.body.data.byStatus[TaskStatus.IN_PROGRESS]).toBe(1);
      expect(response.body.data.byStatus[TaskStatus.COMPLETED]).toBe(1);
      expect(response.body.data.byPriority[TaskPriority.HIGH]).toBe(1);
      expect(response.body.data.byPriority[TaskPriority.MEDIUM]).toBe(1);
      expect(response.body.data.byPriority[TaskPriority.LOW]).toBe(1);
    });

    it('should get project-specific task statistics', async () => {
      const response = await request(app)
        .get('/api/tasks/stats')
        .query({ projectId: testProjectId })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.total).toBe(3);
    });
  });

  describe('GET /api/tasks/search', () => {
    beforeEach(async () => {
      const tasks = [
        {
          title: 'Authentication Task',
          description: 'Implement user authentication system',
          projectId: testProjectId,
          status: TaskStatus.TODO,
          priority: TaskPriority.HIGH
        },
        {
          title: 'Database Task',
          description: 'Design database schema',
          projectId: testProjectId,
          status: TaskStatus.IN_PROGRESS,
          priority: TaskPriority.MEDIUM
        }
      ];

      for (const task of tasks) {
        await request(app)
          .post('/api/tasks')
          .send(task);
      }
    });

    it('should search tasks by title', async () => {
      const response = await request(app)
        .get('/api/tasks/search')
        .query({ q: 'Authentication', limit: 5 })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].title).toContain('Authentication');
    });

    it('should search tasks by description', async () => {
      const response = await request(app)
        .get('/api/tasks/search')
        .query({ q: 'database', limit: 5 })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].description).toContain('database');
    });

    it('should return validation error for missing search query', async () => {
      const response = await request(app)
        .get('/api/tasks/search')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation failed');
    });
  });

  describe('PATCH /api/tasks/bulk/status', () => {
    let taskIds: string[];

    beforeEach(async () => {
      taskIds = [];
      const tasks = [
        {
          title: 'Task 1',
          description: 'First task',
          projectId: testProjectId,
          status: TaskStatus.TODO,
          priority: TaskPriority.HIGH
        },
        {
          title: 'Task 2',
          description: 'Second task',
          projectId: testProjectId,
          status: TaskStatus.TODO,
          priority: TaskPriority.MEDIUM
        }
      ];

      for (const task of tasks) {
        const response = await request(app)
          .post('/api/tasks')
          .send(task);
        taskIds.push(response.body.data.id);
      }
    });

    it('should bulk update task status', async () => {
      const response = await request(app)
        .patch('/api/tasks/bulk/status')
        .send({
          ids: taskIds,
          status: TaskStatus.COMPLETED
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.modifiedCount).toBe(2);

      // Verify tasks are updated
      for (const taskId of taskIds) {
        const taskResponse = await request(app)
          .get(`/api/tasks/${taskId}`);
        expect(taskResponse.body.data.status).toBe(TaskStatus.COMPLETED);
      }
    });

    it('should return validation error for empty IDs array', async () => {
      const response = await request(app)
        .patch('/api/tasks/bulk/status')
        .send({
          ids: [],
          status: TaskStatus.COMPLETED
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation failed');
    });
  });

  describe('PATCH /api/tasks/:id/assign', () => {
    let taskId: string;

    beforeEach(async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({
          title: 'Test Task',
          description: 'This is a test task',
          projectId: testProjectId,
          status: TaskStatus.TODO,
          priority: TaskPriority.MEDIUM
        });

      taskId = response.body.data.id;
    });

    it('should unassign a task', async () => {
      const response = await request(app)
        .patch(`/api/tasks/${taskId}/assign`)
        .send({
          assigneeId: null
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Task unassigned successfully');
      expect(response.body.data.assigneeId).toBeNull();
    });

    it('should return 404 for non-existent task', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      
      const response = await request(app)
        .patch(`/api/tasks/${nonExistentId}/assign`)
        .send({
          assigneeId: null
        })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Task not found');
    });
  });
});
