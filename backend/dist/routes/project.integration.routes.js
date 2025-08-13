"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const project_integration_controller_1 = require("../controllers/project.integration.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
const controller = new project_integration_controller_1.ProjectIntegrationController();
// Apply authentication middleware to all routes
router.use(auth_middleware_1.authMiddleware);
// Validation middleware
const validatePlatformConnection = [
    (0, express_validator_1.body)('platform')
        .isString()
        .notEmpty()
        .isIn(['upwork', 'freelancer', 'fiverr', 'guru', 'peopleperhour'])
        .withMessage('Valid platform name is required'),
    (0, express_validator_1.body)('credentials')
        .isObject()
        .notEmpty()
        .withMessage('Credentials object is required')
];
const validatePlatformParam = [
    (0, express_validator_1.param)('platform')
        .isString()
        .notEmpty()
        .isIn(['upwork', 'freelancer', 'fiverr', 'guru', 'peopleperhour'])
        .withMessage('Valid platform name is required')
];
const validateProjectId = [
    (0, express_validator_1.param)('projectId')
        .isMongoId()
        .withMessage('Valid project ID is required')
];
const validateProjectQuery = [
    (0, express_validator_1.query)('platform')
        .optional()
        .isString()
        .isIn(['upwork', 'freelancer', 'fiverr', 'guru', 'peopleperhour']),
    (0, express_validator_1.query)('status')
        .optional()
        .isString()
        .isIn(['draft', 'active', 'in_progress', 'on_hold', 'completed', 'cancelled', 'archived']),
    (0, express_validator_1.query)('type')
        .optional()
        .isString()
        .isIn(['internal', 'client', 'freelance', 'external']),
    (0, express_validator_1.query)('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
    (0, express_validator_1.query)('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100')
];
// Routes
// Get all projects (internal + external)
router.get('/projects', validateProjectQuery, controller.getAllProjects);
// Get project statistics
router.get('/projects/stats', controller.getProjectStats);
// Get external projects only
router.get('/projects/external', controller.getExternalProjects);
// Platform connection routes
router.get('/platforms', controller.getConnectedPlatforms);
router.post('/platforms/connect', validatePlatformConnection, controller.connectPlatform);
router.delete('/platforms/:platform/disconnect', validatePlatformParam, controller.disconnectPlatform);
// Sync routes
router.post('/sync/all', controller.syncAllPlatforms);
router.post('/sync/:platform', validatePlatformParam, controller.syncPlatform);
// OAuth routes for Upwork
router.get('/upwork/oauth/initiate', controller.initiateUpworkOAuth);
router.get('/upwork/callback', controller.handleUpworkCallback);
// Individual project operations
router.post('/projects/:projectId/resync', validateProjectId, controller.resyncProject);
exports.default = router;
