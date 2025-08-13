import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { ProjectIntegrationController } from '../controllers/project.integration.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const controller = new ProjectIntegrationController();

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Validation middleware
const validatePlatformConnection = [
  body('platform')
    .isString()
    .notEmpty()
    .isIn(['upwork', 'freelancer', 'fiverr', 'guru', 'peopleperhour'])
    .withMessage('Valid platform name is required'),
  body('credentials')
    .isObject()
    .notEmpty()
    .withMessage('Credentials object is required')
];

const validatePlatformParam = [
  param('platform')
    .isString()
    .notEmpty()
    .isIn(['upwork', 'freelancer', 'fiverr', 'guru', 'peopleperhour'])
    .withMessage('Valid platform name is required')
];

const validateProjectId = [
  param('projectId')
    .isMongoId()
    .withMessage('Valid project ID is required')
];

const validateProjectQuery = [
  query('platform')
    .optional()
    .isString()
    .isIn(['upwork', 'freelancer', 'fiverr', 'guru', 'peopleperhour']),
  query('status')
    .optional()
    .isString()
    .isIn(['draft', 'active', 'in_progress', 'on_hold', 'completed', 'cancelled', 'archived']),
  query('type')
    .optional()
    .isString()
    .isIn(['internal', 'client', 'freelance', 'external']),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
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

export default router;
