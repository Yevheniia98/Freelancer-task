"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const project_controller_1 = require("../controllers/project.controller");
const project_entity_1 = require("../models/project.entity");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
const projectController = new project_controller_1.ProjectController();
// Apply auth middleware to all project routes
router.use(auth_middleware_1.authMiddleware);
// Validation rules
const createProjectValidation = [
    (0, express_validator_1.body)('title')
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ min: 3, max: 200 })
        .withMessage('Title must be between 3 and 200 characters'),
    (0, express_validator_1.body)('description')
        .notEmpty()
        .withMessage('Description is required')
        .isLength({ min: 10, max: 1000 })
        .withMessage('Description must be between 10 and 1000 characters'),
    (0, express_validator_1.body)('status')
        .optional()
        .isIn(Object.values(project_entity_1.ProjectStatus))
        .withMessage('Invalid project status'),
    (0, express_validator_1.body)('priority')
        .optional()
        .isIn(Object.values(project_entity_1.ProjectPriority))
        .withMessage('Invalid project priority'),
    (0, express_validator_1.body)('deadline')
        .optional()
        .isISO8601()
        .withMessage('Invalid deadline format')
];
const updateProjectValidation = [
    (0, express_validator_1.param)('id').isMongoId().withMessage('Invalid project ID'),
    (0, express_validator_1.body)('title')
        .optional()
        .isLength({ min: 3, max: 200 })
        .withMessage('Title must be between 3 and 200 characters'),
    (0, express_validator_1.body)('description')
        .optional()
        .isLength({ min: 10, max: 1000 })
        .withMessage('Description must be between 10 and 1000 characters'),
    (0, express_validator_1.body)('status')
        .optional()
        .isIn(Object.values(project_entity_1.ProjectStatus))
        .withMessage('Invalid project status'),
    (0, express_validator_1.body)('priority')
        .optional()
        .isIn(Object.values(project_entity_1.ProjectPriority))
        .withMessage('Invalid project priority'),
    (0, express_validator_1.body)('deadline')
        .optional()
        .isISO8601()
        .withMessage('Invalid deadline format')
];
const idValidation = [
    (0, express_validator_1.param)('id').isMongoId().withMessage('Invalid project ID')
];
const queryValidation = [
    (0, express_validator_1.query)('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
    (0, express_validator_1.query)('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
    (0, express_validator_1.query)('status')
        .optional()
        .isIn(Object.values(project_entity_1.ProjectStatus))
        .withMessage('Invalid status filter'),
    (0, express_validator_1.query)('priority')
        .optional()
        .isIn(Object.values(project_entity_1.ProjectPriority))
        .withMessage('Invalid priority filter'),
    (0, express_validator_1.query)('sortBy')
        .optional()
        .isIn(['createdAt', 'updatedAt', 'title', 'deadline', 'priority'])
        .withMessage('Invalid sort field'),
    (0, express_validator_1.query)('sortOrder')
        .optional()
        .isIn(['asc', 'desc'])
        .withMessage('Invalid sort order')
];
const searchValidation = [
    (0, express_validator_1.query)('q')
        .notEmpty()
        .withMessage('Search term is required')
        .isLength({ min: 2 })
        .withMessage('Search term must be at least 2 characters'),
    (0, express_validator_1.query)('limit')
        .optional()
        .isInt({ min: 1, max: 50 })
        .withMessage('Limit must be between 1 and 50')
];
const bulkUpdateValidation = [
    (0, express_validator_1.body)('ids')
        .isArray({ min: 1 })
        .withMessage('IDs array is required with at least one ID'),
    (0, express_validator_1.body)('ids.*')
        .isMongoId()
        .withMessage('Invalid project ID in array'),
    (0, express_validator_1.body)('status')
        .isIn(Object.values(project_entity_1.ProjectStatus))
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
exports.default = router;
