"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
const mongoose_1 = __importDefault(require("mongoose"));
const project_routes_1 = __importDefault(require("../routes/project.routes"));
const project_entity_1 = require("../models/project.entity");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api/projects', project_routes_1.default);
describe('Project API', () => {
    let mongoServer;
    beforeAll(async () => {
        mongoServer = await mongodb_memory_server_1.MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        await mongoose_1.default.connect(mongoUri);
    });
    afterAll(async () => {
        await mongoose_1.default.disconnect();
        await mongoServer.stop();
    });
    afterEach(async () => {
        // Clean up between tests
        if (mongoose_1.default.connection.db) {
            await mongoose_1.default.connection.db.dropDatabase();
        }
    });
    describe('POST /api/projects', () => {
        it('should create a new project', async () => {
            const projectData = {
                title: 'Test Project',
                description: 'This is a test project',
                status: project_entity_1.ProjectStatus.PENDING,
                priority: project_entity_1.ProjectPriority.HIGH,
                deadline: new Date(Date.now() + 86400000).toISOString() // Tomorrow
            };
            const response = await (0, supertest_1.default)(app)
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
            const response = await (0, supertest_1.default)(app)
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
                    status: project_entity_1.ProjectStatus.PENDING,
                    priority: project_entity_1.ProjectPriority.HIGH
                },
                {
                    title: 'Project 2',
                    description: 'Second project',
                    status: project_entity_1.ProjectStatus.IN_PROGRESS,
                    priority: project_entity_1.ProjectPriority.MEDIUM
                }
            ];
            for (const project of projects) {
                await (0, supertest_1.default)(app)
                    .post('/api/projects')
                    .send(project);
            }
        });
        it('should get all projects', async () => {
            const response = await (0, supertest_1.default)(app)
                .get('/api/projects')
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveLength(2);
            expect(response.body.pagination.total).toBe(2);
        });
        it('should filter projects by status', async () => {
            const response = await (0, supertest_1.default)(app)
                .get('/api/projects')
                .query({ status: project_entity_1.ProjectStatus.PENDING })
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveLength(1);
            expect(response.body.data[0].status).toBe(project_entity_1.ProjectStatus.PENDING);
        });
        it('should search projects by title', async () => {
            const response = await (0, supertest_1.default)(app)
                .get('/api/projects')
                .query({ search: 'Project 1' })
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveLength(1);
            expect(response.body.data[0].title).toBe('Project 1');
        });
    });
    describe('GET /api/projects/:id', () => {
        let projectId;
        beforeEach(async () => {
            const response = await (0, supertest_1.default)(app)
                .post('/api/projects')
                .send({
                title: 'Test Project',
                description: 'This is a test project',
                status: project_entity_1.ProjectStatus.PENDING,
                priority: project_entity_1.ProjectPriority.MEDIUM
            });
            projectId = response.body.data.id;
        });
        it('should get a project by ID', async () => {
            const response = await (0, supertest_1.default)(app)
                .get(`/api/projects/${projectId}`)
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.id).toBe(projectId);
            expect(response.body.data.title).toBe('Test Project');
        });
        it('should return 404 for non-existent project', async () => {
            const nonExistentId = new mongoose_1.default.Types.ObjectId().toString();
            const response = await (0, supertest_1.default)(app)
                .get(`/api/projects/${nonExistentId}`)
                .expect(404);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Project not found');
        });
    });
    describe('PUT /api/projects/:id', () => {
        let projectId;
        beforeEach(async () => {
            const response = await (0, supertest_1.default)(app)
                .post('/api/projects')
                .send({
                title: 'Test Project',
                description: 'This is a test project',
                status: project_entity_1.ProjectStatus.PENDING,
                priority: project_entity_1.ProjectPriority.MEDIUM
            });
            projectId = response.body.data.id;
        });
        it('should update a project', async () => {
            const updateData = {
                title: 'Updated Project',
                status: project_entity_1.ProjectStatus.IN_PROGRESS,
                priority: project_entity_1.ProjectPriority.HIGH
            };
            const response = await (0, supertest_1.default)(app)
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
        let projectId;
        beforeEach(async () => {
            const response = await (0, supertest_1.default)(app)
                .post('/api/projects')
                .send({
                title: 'Test Project',
                description: 'This is a test project',
                status: project_entity_1.ProjectStatus.PENDING,
                priority: project_entity_1.ProjectPriority.MEDIUM
            });
            projectId = response.body.data.id;
        });
        it('should delete a project', async () => {
            const response = await (0, supertest_1.default)(app)
                .delete(`/api/projects/${projectId}`)
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('Project deleted successfully');
            // Verify project is deleted
            await (0, supertest_1.default)(app)
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
                    status: project_entity_1.ProjectStatus.PENDING,
                    priority: project_entity_1.ProjectPriority.HIGH
                },
                {
                    title: 'Project 2',
                    description: 'Second project',
                    status: project_entity_1.ProjectStatus.IN_PROGRESS,
                    priority: project_entity_1.ProjectPriority.MEDIUM
                },
                {
                    title: 'Project 3',
                    description: 'Third project',
                    status: project_entity_1.ProjectStatus.COMPLETED,
                    priority: project_entity_1.ProjectPriority.LOW
                }
            ];
            for (const project of projects) {
                await (0, supertest_1.default)(app)
                    .post('/api/projects')
                    .send(project);
            }
        });
        it('should get project statistics', async () => {
            const response = await (0, supertest_1.default)(app)
                .get('/api/projects/stats')
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.total).toBe(3);
            expect(response.body.data.byStatus[project_entity_1.ProjectStatus.PENDING]).toBe(1);
            expect(response.body.data.byStatus[project_entity_1.ProjectStatus.IN_PROGRESS]).toBe(1);
            expect(response.body.data.byStatus[project_entity_1.ProjectStatus.COMPLETED]).toBe(1);
        });
    });
});
