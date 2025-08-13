"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const project_model_1 = require("../models/project.model");
const user_model_1 = require("../models/user.model");
const project_integration_routes_1 = __importDefault(require("../routes/project.integration.routes"));
// Create a mock user context that can be updated
const mockUserContext = {
    id: 'testuser123',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User'
};
// Mock auth middleware before importing routes
jest.mock('../middleware/auth.middleware', () => ({
    authMiddleware: (req, res, next) => {
        req.user = mockUserContext;
        next();
    }
}));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api/integration', project_integration_routes_1.default);
describe('Project Integration API - Integration Tests', () => {
    let testUserId;
    let testUser;
    beforeEach(async () => {
        // Create test user
        testUserId = new mongoose_1.default.Types.ObjectId();
        testUser = new user_model_1.User({
            _id: testUserId,
            firstName: 'Test',
            lastName: 'User',
            email: 'test@example.com',
            password: 'hashedpassword'
        });
        await testUser.save();
        // Update mock user context to use real user ID
        mockUserContext.id = testUserId.toString();
    });
    describe('GET /api/integration/projects', () => {
        beforeEach(async () => {
            // Create test projects
            await project_model_1.Project.create([
                {
                    title: 'Internal Project 1',
                    description: 'An internal project',
                    status: 'active',
                    priority: 'medium',
                    type: 'internal',
                    budget: { amount: 1000, currency: 'USD', type: 'fixed' },
                    client: { name: 'Internal Client' },
                    userId: testUserId,
                    createdBy: testUserId
                },
                {
                    title: 'Upwork Project 1',
                    description: 'A project from Upwork',
                    status: 'in_progress',
                    priority: 'high',
                    type: 'external',
                    budget: { amount: 2000, currency: 'USD', type: 'hourly' },
                    client: { name: 'Upwork Client', rating: 4.8 },
                    skills: ['React', 'Node.js'],
                    externalSource: {
                        platform: 'upwork',
                        externalId: 'upwork123',
                        url: 'https://upwork.com/jobs/upwork123',
                        lastSynced: new Date(),
                        syncStatus: 'synced'
                    },
                    userId: testUserId,
                    createdBy: testUserId
                }
            ]);
        });
        it('should get all projects for user', async () => {
            const response = await (0, supertest_1.default)(app)
                .get('/api/integration/projects')
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.projects).toHaveLength(2);
            expect(response.body.data.pagination).toBeDefined();
        });
        it('should filter projects by platform', async () => {
            const response = await (0, supertest_1.default)(app)
                .get('/api/integration/projects?platform=upwork')
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.projects).toHaveLength(1);
            expect(response.body.data.projects[0].externalSource.platform).toBe('upwork');
        });
        it('should filter projects by status', async () => {
            const response = await (0, supertest_1.default)(app)
                .get('/api/integration/projects?status=active')
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.projects).toHaveLength(1);
            expect(response.body.data.projects[0].status).toBe('active');
        });
        it('should filter projects by type', async () => {
            const response = await (0, supertest_1.default)(app)
                .get('/api/integration/projects?type=external')
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.projects).toHaveLength(1);
            expect(response.body.data.projects[0].type).toBe('external');
        });
        it('should paginate results', async () => {
            const response = await (0, supertest_1.default)(app)
                .get('/api/integration/projects?page=1&limit=1')
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.projects).toHaveLength(1);
            expect(response.body.data.pagination.current).toBe(1);
            expect(response.body.data.pagination.limit).toBe(1);
            expect(response.body.data.pagination.total).toBe(2);
        });
    });
    describe('GET /api/integration/projects/stats', () => {
        beforeEach(async () => {
            await project_model_1.Project.create([
                {
                    title: 'Internal Project',
                    description: 'Internal project',
                    status: 'active',
                    type: 'internal',
                    budget: { amount: 1000, currency: 'USD', type: 'fixed' },
                    client: { name: 'Internal Client' },
                    userId: testUserId,
                    createdBy: testUserId
                },
                {
                    title: 'Upwork Project',
                    description: 'Upwork project',
                    status: 'completed',
                    type: 'external',
                    budget: { amount: 2000, currency: 'USD', type: 'fixed' },
                    client: { name: 'Upwork Client' },
                    externalSource: {
                        platform: 'upwork',
                        externalId: 'upwork123',
                        url: 'https://upwork.com/jobs/upwork123',
                        lastSynced: new Date(),
                        syncStatus: 'synced'
                    },
                    userId: testUserId,
                    createdBy: testUserId
                }
            ]);
        });
        it('should get project statistics', async () => {
            const response = await (0, supertest_1.default)(app)
                .get('/api/integration/projects/stats')
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.summary).toMatchObject({
                totalProjects: 2,
                externalProjects: 1,
                internalProjects: 1,
                activeProjects: 1,
                completedProjects: 1
            });
            expect(response.body.data.platformBreakdown).toHaveLength(1);
            expect(response.body.data.platformBreakdown[0]._id).toBe('upwork');
        });
    });
    describe('GET /api/integration/platforms', () => {
        it('should get connected platforms status', async () => {
            const response = await (0, supertest_1.default)(app)
                .get('/api/integration/platforms')
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.platforms).toBeDefined();
            expect(Array.isArray(response.body.data.platforms)).toBe(true);
        });
    });
    describe('POST /api/integration/platforms/connect', () => {
        it('should connect to a platform with valid credentials', async () => {
            const credentials = {
                platform: 'upwork',
                credentials: {
                    consumerKey: 'test-key',
                    consumerSecret: 'test-secret'
                }
            };
            const response = await (0, supertest_1.default)(app)
                .post('/api/integration/platforms/connect')
                .send(credentials)
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toContain('Successfully connected to upwork');
        });
        it('should fail with invalid platform', async () => {
            const credentials = {
                platform: 'invalid-platform',
                credentials: {
                    consumerKey: 'test-key',
                    consumerSecret: 'test-secret'
                }
            };
            const response = await (0, supertest_1.default)(app)
                .post('/api/integration/platforms/connect')
                .send(credentials)
                .expect(400);
            expect(response.body.success).toBe(false);
            expect(response.body.errors).toBeDefined();
        });
        it('should fail with missing credentials', async () => {
            const credentials = {
                platform: 'upwork'
                // missing credentials
            };
            const response = await (0, supertest_1.default)(app)
                .post('/api/integration/platforms/connect')
                .send(credentials)
                .expect(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain('Validation failed');
            expect(response.body.errors).toBeDefined();
        });
    });
    describe('DELETE /api/integration/platforms/:platform/disconnect', () => {
        it('should disconnect from a platform', async () => {
            const response = await (0, supertest_1.default)(app)
                .delete('/api/integration/platforms/upwork/disconnect')
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toContain('Successfully disconnected from upwork');
        });
        it('should fail with invalid platform', async () => {
            const response = await (0, supertest_1.default)(app)
                .delete('/api/integration/platforms/invalid-platform/disconnect')
                .expect(400);
            expect(response.body.success).toBe(false);
            expect(response.body.errors).toBeDefined();
        });
    });
    describe('GET /api/integration/projects/external', () => {
        beforeEach(async () => {
            await project_model_1.Project.create([
                {
                    title: 'Upwork Project 1',
                    description: 'Upwork project 1',
                    status: 'active',
                    type: 'external',
                    budget: { amount: 1000, currency: 'USD', type: 'fixed' },
                    client: { name: 'Upwork Client' },
                    externalSource: {
                        platform: 'upwork',
                        externalId: 'upwork123',
                        url: 'https://upwork.com/jobs/upwork123',
                        lastSynced: new Date(),
                        syncStatus: 'synced'
                    },
                    userId: testUserId,
                    createdBy: testUserId
                },
                {
                    title: 'Freelancer Project 1',
                    description: 'Freelancer project 1',
                    status: 'active',
                    type: 'external',
                    budget: { amount: 2000, currency: 'USD', type: 'hourly' },
                    client: { name: 'Freelancer Client' },
                    externalSource: {
                        platform: 'freelancer',
                        externalId: 'freelancer456',
                        url: 'https://freelancer.com/projects/freelancer456',
                        lastSynced: new Date(),
                        syncStatus: 'synced'
                    },
                    userId: testUserId,
                    createdBy: testUserId
                }
            ]);
        });
        it('should get all external projects', async () => {
            const response = await (0, supertest_1.default)(app)
                .get('/api/integration/projects/external')
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.projects).toHaveLength(2);
            expect(response.body.data.count).toBe(2);
        });
        it('should filter external projects by platform', async () => {
            const response = await (0, supertest_1.default)(app)
                .get('/api/integration/projects/external?platform=upwork')
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.projects).toHaveLength(1);
            expect(response.body.data.projects[0].externalSource.platform).toBe('upwork');
        });
    });
    describe('POST /api/integration/projects/:projectId/resync', () => {
        let testProject;
        beforeEach(async () => {
            testProject = await project_model_1.Project.create({
                title: 'Test Project',
                description: 'Test project for resyncing',
                status: 'active',
                type: 'external',
                budget: { amount: 1000, currency: 'USD', type: 'fixed' },
                client: { name: 'Test Client' },
                externalSource: {
                    platform: 'upwork',
                    externalId: 'test123',
                    url: 'https://upwork.com/jobs/test123',
                    lastSynced: new Date(),
                    syncStatus: 'synced'
                },
                userId: testUserId,
                createdBy: testUserId
            });
        });
        it('should handle resync request', async () => {
            const response = await (0, supertest_1.default)(app)
                .post(`/api/integration/projects/${testProject._id}/resync`)
                .expect(400); // Will fail because service is not connected, but endpoint works
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Failed to resync project');
        });
        it('should fail with invalid project ID', async () => {
            const response = await (0, supertest_1.default)(app)
                .post('/api/integration/projects/invalid-id/resync')
                .expect(400);
            expect(response.body.success).toBe(false);
            expect(response.body.errors).toBeDefined();
        });
    });
});
