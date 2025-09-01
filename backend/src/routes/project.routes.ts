import express from 'express';
import { body, param, query } from 'express-validator';
import { ProjectController } from '../controllers/project.controller';
import { ProjectStatus, ProjectPriority } from '../models/project.entity';
import { authMiddleware } from '../middleware/auth.middleware';

const router = express.Router();
const projectController = new ProjectController();

// Apply auth middleware to all project routes
router.use(authMiddleware);

// Validation rules
const createProjectValidation = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),
  body('description')
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('status')
    .optional()
    .isIn(Object.values(ProjectStatus))
    .withMessage('Invalid project status'),
  body('priority')
    .optional()
    .isIn(Object.values(ProjectPriority))
    .withMessage('Invalid project priority'),
  body('deadline')
    .optional()
    .isISO8601()
    .withMessage('Invalid deadline format')
];

const updateProjectValidation = [
  param('id').isMongoId().withMessage('Invalid project ID'),
  body('title')
    .optional()
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),
  body('description')
    .optional()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('status')
    .optional()
    .isIn(Object.values(ProjectStatus))
    .withMessage('Invalid project status'),
  body('priority')
    .optional()
    .isIn(Object.values(ProjectPriority))
    .withMessage('Invalid project priority'),
  body('deadline')
    .optional()
    .isISO8601()
    .withMessage('Invalid deadline format')
];

const idValidation = [
  param('id').isMongoId().withMessage('Invalid project ID')
];

const queryValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('status')
    .optional()
    .isIn(Object.values(ProjectStatus))
    .withMessage('Invalid status filter'),
  query('priority')
    .optional()
    .isIn(Object.values(ProjectPriority))
    .withMessage('Invalid priority filter'),
  query('sortBy')
    .optional()
    .isIn(['createdAt', 'updatedAt', 'title', 'deadline', 'priority'])
    .withMessage('Invalid sort field'),
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Invalid sort order')
];

const searchValidation = [
  query('q')
    .notEmpty()
    .withMessage('Search term is required')
    .isLength({ min: 2 })
    .withMessage('Search term must be at least 2 characters'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50')
];

const bulkUpdateValidation = [
  body('ids')
    .isArray({ min: 1 })
    .withMessage('IDs array is required with at least one ID'),
  body('ids.*')
    .isMongoId()
    .withMessage('Invalid project ID in array'),
  body('status')
    .isIn(Object.values(ProjectStatus))
    .withMessage('Invalid project status')
];

// Routes
router.get('/', queryValidation, projectController.findAll);
router.get('/stats', projectController.getStats);
router.get('/search', searchValidation, projectController.search);
router.get('/:id', idValidation, projectController.findById);
router.post('/', createProjectValidation, projectController.create);
router.put('/:id', updateProjectValidation, projectController.update);
router.patch('/bulk/status', bulkUpdateValidation, projectController.bulkUpdateStatus);
router.delete('/:id', idValidation, projectController.delete);

export default router;
