import request from 'supertest';
import express from 'express';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import clientRoutes from '../routes/client.routes';
import { ClientEntity } from '../models/client.entity';

const app = express();
app.use(express.json());
app.use('/api/clients', clientRoutes);

describe('Client API', () => {
  let mongoServer: MongoMemoryServer;
  let createdClientIds: string[] = [];

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
    createdClientIds = [];
  });

  // Clean up created clients after tests
  afterEach(async () => {
    if (createdClientIds.length > 0) {
      await ClientEntity.deleteMany({ _id: { $in: createdClientIds } });
      createdClientIds = [];
    }
  });

  describe('POST /api/clients', () => {
    it('should create a new client with valid data', async () => {
      const clientData = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
        notes: 'Test client'
      };

      const response = await request(app)
        .post('/api/clients')
        .send(clientData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(clientData.name);
      expect(response.body.data.email).toBe(clientData.email);
      expect(response.body.data.status).toBe('new');
      expect(response.body.data.totalEarned).toBe(0);

      createdClientIds.push(response.body.data.id);
    });

    it('should create a client with initial earnings', async () => {
      const clientData = {
        name: 'Jane Smith',
        email: 'jane.smith@business.com',
        totalEarned: 2500.50
      };

      const response = await request(app)
        .post('/api/clients')
        .send(clientData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.totalEarned).toBe(2500.50);
      expect(response.body.data.status).toBe('silver');

      createdClientIds.push(response.body.data.id);
    });

    it('should reject client creation with duplicate email', async () => {
      const clientData = {
        name: 'John Doe',
        email: 'duplicate@example.com'
      };

      // Create first client
      const firstResponse = await request(app)
        .post('/api/clients')
        .send(clientData)
        .expect(201);

      createdClientIds.push(firstResponse.body.data.id);

      // Try to create second client with same email
      await request(app)
        .post('/api/clients')
        .send({ ...clientData, name: 'Jane Doe' })
        .expect(400);
    });

    it('should reject client creation with invalid email', async () => {
      const clientData = {
        name: 'John Doe',
        email: 'invalid-email'
      };

      const response = await request(app)
        .post('/api/clients')
        .send(clientData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation failed');
    });

    it('should reject client creation with missing required fields', async () => {
      const clientData = {
        phone: '+1234567890'
      };

      const response = await request(app)
        .post('/api/clients')
        .send(clientData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation failed');
    });

    it('should handle invalid phone number format', async () => {
      const clientData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: 'invalid-phone'
      };

      const response = await request(app)
        .post('/api/clients')
        .send(clientData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/clients', () => {
    beforeEach(async () => {
      // Create test clients
      const clients = [
        { name: 'John Doe', email: 'john@example.com', totalEarned: 0 },
        { name: 'Jane Smith', email: 'jane@example.com', totalEarned: 1500 },
        { name: 'Bob Johnson', email: 'bob@example.com', totalEarned: 7500 },
        { name: 'Alice Brown', email: 'alice@example.com', totalEarned: 12000 }
      ];

      for (const clientData of clients) {
        const response = await request(app)
          .post('/api/clients')
          .send(clientData);
        createdClientIds.push(response.body.data.id);
      }
    });

    it('should get all clients', async () => {
      const response = await request(app)
        .get('/api/clients')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.pagination).toBeDefined();
      expect(response.body.data.length).toBeGreaterThanOrEqual(4);
    });

    it('should support pagination', async () => {
      const response = await request(app)
        .get('/api/clients?page=1&limit=2')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBeLessThanOrEqual(2);
      expect(response.body.pagination.page).toBe(1);
      expect(response.body.pagination.totalPages).toBeGreaterThanOrEqual(2);
    });

    it('should filter clients by status', async () => {
      const response = await request(app)
        .get('/api/clients?status=gold')
        .expect(200);

      expect(response.body.success).toBe(true);
      // Should find clients with earnings between 5000-9999
      response.body.data.forEach((client: any) => {
        expect(client.totalEarned).toBeGreaterThanOrEqual(5000);
        expect(client.totalEarned).toBeLessThan(10000);
      });
    });

    it('should filter clients by earnings range', async () => {
      const response = await request(app)
        .get('/api/clients?minEarnings=1000&maxEarnings=5000')
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.forEach((client: any) => {
        expect(client.totalEarned).toBeGreaterThanOrEqual(1000);
        expect(client.totalEarned).toBeLessThanOrEqual(5000);
      });
    });

    it('should search clients by name', async () => {
      const response = await request(app)
        .get('/api/clients?name=John')
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.forEach((client: any) => {
        expect(client.name.toLowerCase()).toContain('john');
      });
    });

    it('should sort clients by totalEarned descending', async () => {
      const response = await request(app)
        .get('/api/clients?sortBy=totalEarned&sortOrder=desc')
        .expect(200);

      expect(response.body.success).toBe(true);
      
      for (let i = 1; i < response.body.data.length; i++) {
        expect(response.body.data[i-1].totalEarned).toBeGreaterThanOrEqual(
          response.body.data[i].totalEarned
        );
      }
    });
  });

  describe('GET /api/clients/:id', () => {
    let clientId: string;

    beforeEach(async () => {
      const response = await request(app)
        .post('/api/clients')
        .send({
          name: 'Test Client',
          email: 'test@example.com',
          totalEarned: 1000
        });
      
      clientId = response.body.data.id;
      createdClientIds.push(clientId);
    });

    it('should get client by valid ID', async () => {
      const response = await request(app)
        .get(`/api/clients/${clientId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(clientId);
      expect(response.body.data.name).toBe('Test Client');
    });

    it('should return 404 for non-existent client', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      
      const response = await request(app)
        .get(`/api/clients/${nonExistentId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Client not found');
    });

    it('should return 400 for invalid ID format', async () => {
      const response = await request(app)
        .get('/api/clients/invalid-id')
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/clients/:id', () => {
    let clientId: string;

    beforeEach(async () => {
      const response = await request(app)
        .post('/api/clients')
        .send({
          name: 'Original Name',
          email: 'original@example.com',
          phone: '+1234567890'
        });
      
      clientId = response.body.data.id;
      createdClientIds.push(clientId);
    });

    it('should update client with valid data', async () => {
      const updateData = {
        name: 'Updated Name',
        phone: '+1987654321',
        notes: 'Updated notes'
      };

      const response = await request(app)
        .put(`/api/clients/${clientId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(updateData.name);
      expect(response.body.data.phone).toBe('1987654321'); // Normalized
      expect(response.body.data.notes).toBe(updateData.notes);
    });

    it('should reject update with duplicate email', async () => {
      // Create another client
      const anotherResponse = await request(app)
        .post('/api/clients')
        .send({
          name: 'Another Client',
          email: 'another@example.com'
        });
      
      createdClientIds.push(anotherResponse.body.data.id);

      // Try to update first client with second client's email
      const response = await request(app)
        .put(`/api/clients/${clientId}`)
        .send({ email: 'another@example.com' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('already exists');
    });

    it('should return 404 for non-existent client', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      
      const response = await request(app)
        .put(`/api/clients/${nonExistentId}`)
        .send({ name: 'Updated Name' })
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/clients/:id', () => {
    let clientId: string;

    beforeEach(async () => {
      const response = await request(app)
        .post('/api/clients')
        .send({
          name: 'To Be Deleted',
          email: 'delete@example.com'
        });
      
      clientId = response.body.data.id;
      // Don't add to createdClientIds since we're testing deletion
    });

    it('should delete existing client', async () => {
      const response = await request(app)
        .delete(`/api/clients/${clientId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(clientId);

      // Verify client is deleted
      await request(app)
        .get(`/api/clients/${clientId}`)
        .expect(404);
    });

    it('should return 404 for non-existent client', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      
      const response = await request(app)
        .delete(`/api/clients/${nonExistentId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PATCH /api/clients/:id/earnings/add', () => {
    let clientId: string;

    beforeEach(async () => {
      const response = await request(app)
        .post('/api/clients')
        .send({
          name: 'Earnings Test Client',
          email: 'earnings@example.com',
          totalEarned: 1000
        });
      
      clientId = response.body.data.id;
      createdClientIds.push(clientId);
    });

    it('should add earnings to client', async () => {
      const response = await request(app)
        .patch(`/api/clients/${clientId}/earnings/add`)
        .send({ amount: 500 })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.totalEarned).toBe(1500);
    });

    it('should reject negative earnings', async () => {
      const response = await request(app)
        .patch(`/api/clients/${clientId}/earnings/add`)
        .send({ amount: -500 })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should reject zero earnings', async () => {
      const response = await request(app)
        .patch(`/api/clients/${clientId}/earnings/add`)
        .send({ amount: 0 })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PATCH /api/clients/:id/earnings/reset', () => {
    let clientId: string;

    beforeEach(async () => {
      const response = await request(app)
        .post('/api/clients')
        .send({
          name: 'Reset Test Client',
          email: 'reset@example.com',
          totalEarned: 5000
        });
      
      clientId = response.body.data.id;
      createdClientIds.push(clientId);
    });

    it('should reset client earnings to zero', async () => {
      const response = await request(app)
        .patch(`/api/clients/${clientId}/earnings/reset`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.totalEarned).toBe(0);
      expect(response.body.data.status).toBe('new');
    });
  });

  describe('GET /api/clients/stats', () => {
    beforeEach(async () => {
      // Create clients with different earnings levels
      const clients = [
        { name: 'New Client', email: 'new@example.com', totalEarned: 0 },
        { name: 'Bronze Client', email: 'bronze@example.com', totalEarned: 500 },
        { name: 'Silver Client', email: 'silver@example.com', totalEarned: 2000 },
        { name: 'Gold Client', email: 'gold@example.com', totalEarned: 7500 },
        { name: 'Platinum Client', email: 'platinum@example.com', totalEarned: 15000 }
      ];

      for (const clientData of clients) {
        const response = await request(app)
          .post('/api/clients')
          .send(clientData);
        createdClientIds.push(response.body.data.id);
      }
    });

    it('should return comprehensive client statistics', async () => {
      const response = await request(app)
        .get('/api/clients/stats')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('totalClients');
      expect(response.body.data).toHaveProperty('totalEarnings');
      expect(response.body.data).toHaveProperty('averageEarningsPerClient');
      expect(response.body.data).toHaveProperty('statusBreakdown');
      expect(response.body.data).toHaveProperty('topEarningClients');
      
      expect(response.body.data.totalClients).toBeGreaterThanOrEqual(5);
      expect(response.body.data.statusBreakdown).toHaveProperty('new');
      expect(response.body.data.statusBreakdown).toHaveProperty('bronze');
      expect(response.body.data.statusBreakdown).toHaveProperty('silver');
      expect(response.body.data.statusBreakdown).toHaveProperty('gold');
      expect(response.body.data.statusBreakdown).toHaveProperty('platinum');
    });
  });

  describe('GET /api/clients/search', () => {
    beforeEach(async () => {
      const clients = [
        { name: 'John Developer', email: 'john.dev@example.com', notes: 'React developer' },
        { name: 'Jane Designer', email: 'jane.design@example.com', notes: 'UI/UX specialist' },
        { name: 'Bob Manager', email: 'bob.mgr@example.com', notes: 'Project manager' }
      ];

      for (const clientData of clients) {
        const response = await request(app)
          .post('/api/clients')
          .send(clientData);
        createdClientIds.push(response.body.data.id);
      }
    });

    it('should search clients by name', async () => {
      const response = await request(app)
        .get('/api/clients/search?q=john')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBeGreaterThanOrEqual(1);
    });

    it('should search clients by notes', async () => {
      const response = await request(app)
        .get('/api/clients/search?q=developer')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBeGreaterThanOrEqual(1);
    });

    it('should limit search results', async () => {
      const response = await request(app)
        .get('/api/clients/search?q=manager&limit=1')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBeLessThanOrEqual(1);
    });

    it('should require search term', async () => {
      const response = await request(app)
        .get('/api/clients/search')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Search term is required');
    });
  });

  describe('GET /api/clients/status/:status', () => {
    beforeEach(async () => {
      const clients = [
        { name: 'New Client', email: 'new@example.com', totalEarned: 0 },
        { name: 'Platinum Client 1', email: 'platinum1@example.com', totalEarned: 12000 },
        { name: 'Platinum Client 2', email: 'platinum2@example.com', totalEarned: 25000 }
      ];

      for (const clientData of clients) {
        const response = await request(app)
          .post('/api/clients')
          .send(clientData);
        createdClientIds.push(response.body.data.id);
      }
    });

    it('should get clients by status - platinum', async () => {
      const response = await request(app)
        .get('/api/clients/status/platinum')
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.forEach((client: any) => {
        expect(client.totalEarned).toBeGreaterThanOrEqual(10000);
      });
    });

    it('should get clients by status - new', async () => {
      const response = await request(app)
        .get('/api/clients/status/new')
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.forEach((client: any) => {
        expect(client.totalEarned).toBe(0);
      });
    });

    it('should reject invalid status', async () => {
      const response = await request(app)
        .get('/api/clients/status/invalid')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid status');
    });
  });

  describe('PATCH /api/clients/bulk/earnings', () => {
    let clientIds: string[];

    beforeEach(async () => {
      clientIds = [];
      const clients = [
        { name: 'Bulk Test 1', email: 'bulk1@example.com', totalEarned: 1000 },
        { name: 'Bulk Test 2', email: 'bulk2@example.com', totalEarned: 2000 }
      ];

      for (const clientData of clients) {
        const response = await request(app)
          .post('/api/clients')
          .send(clientData);
        clientIds.push(response.body.data.id);
        createdClientIds.push(response.body.data.id);
      }
    });

    it('should update earnings for multiple clients', async () => {
      const updates = [
        { id: clientIds[0], amount: 500 },
        { id: clientIds[1], amount: -300 }
      ];

      const response = await request(app)
        .patch('/api/clients/bulk/earnings')
        .send({ updates })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('Bulk earnings update completed');

      // Verify the updates
      const client1 = await request(app).get(`/api/clients/${clientIds[0]}`);
      const client2 = await request(app).get(`/api/clients/${clientIds[1]}`);
      
      expect(client1.body.data.totalEarned).toBe(1500); // 1000 + 500
      expect(client2.body.data.totalEarned).toBe(1700); // 2000 - 300
    });

    it('should reject empty updates array', async () => {
      const response = await request(app)
        .patch('/api/clients/bulk/earnings')
        .send({ updates: [] })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation failed');
    });

    it('should reject invalid client ID in bulk update', async () => {
      const updates = [
        { id: 'invalid-id', amount: 500 }
      ];

      const response = await request(app)
        .patch('/api/clients/bulk/earnings')
        .send({ updates })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });
});
