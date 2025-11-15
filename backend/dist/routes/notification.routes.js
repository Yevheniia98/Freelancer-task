"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const notification_controller_1 = require("../controllers/notification.controller");
const notification_entity_1 = require("../models/notification.entity");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
const notificationController = new notification_controller_1.NotificationController();
// Apply auth middleware to all notification routes except health check
router.get('/health', notificationController.healthCheck);
router.use(auth_middleware_1.authMiddleware);
// Validation rules
const createNotificationValidation = [
    (0, express_validator_1.body)('title')
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ min: 1, max: 200 })
        .withMessage('Title must be between 1 and 200 characters'),
    (0, express_validator_1.body)('message')
        .notEmpty()
        .withMessage('Message is required')
        .isLength({ min: 1, max: 1000 })
        .withMessage('Message must be between 1 and 1000 characters'),
    (0, express_validator_1.body)('type')
        .isIn(Object.values(notification_entity_1.NotificationType))
        .withMessage('Invalid notification type'),
    (0, express_validator_1.body)('priority')
        .optional()
        .isIn(Object.values(notification_entity_1.NotificationPriority))
        .withMessage('Invalid notification priority'),
    (0, express_validator_1.body)('targetUserId')
        .optional()
        .isString()
        .withMessage('Target user ID must be a string'),
    (0, express_validator_1.body)('metadata')
        .optional()
        .isObject()
        .withMessage('Metadata must be an object')
];
const createProjectNotificationValidation = [
    (0, express_validator_1.body)('projectId')
        .notEmpty()
        .withMessage('Project ID is required'),
    (0, express_validator_1.body)('title')
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ min: 1, max: 200 })
        .withMessage('Title must be between 1 and 200 characters'),
    (0, express_validator_1.body)('message')
        .notEmpty()
        .withMessage('Message is required')
        .isLength({ min: 1, max: 1000 })
        .withMessage('Message must be between 1 and 1000 characters'),
    (0, express_validator_1.body)('actionUrl')
        .optional()
        .isURL()
        .withMessage('Action URL must be a valid URL')
];
const createBillingNotificationValidation = [
    (0, express_validator_1.body)('amount')
        .isNumeric()
        .withMessage('Amount must be a number')
        .custom((value) => {
        if (value <= 0) {
            throw new Error('Amount must be greater than 0');
        }
        return true;
    }),
    (0, express_validator_1.body)('dueDate')
        .isISO8601()
        .withMessage('Due date must be a valid date'),
    (0, express_validator_1.body)('title')
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ min: 1, max: 200 })
        .withMessage('Title must be between 1 and 200 characters'),
    (0, express_validator_1.body)('message')
        .notEmpty()
        .withMessage('Message is required')
        .isLength({ min: 1, max: 1000 })
        .withMessage('Message must be between 1 and 1000 characters')
];
const idValidation = [
    (0, express_validator_1.param)('id')
        .notEmpty()
        .withMessage('Notification ID is required')
        .isString()
        .withMessage('Notification ID must be a string')
];
const notificationQueryValidation = [
    (0, express_validator_1.query)('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
    (0, express_validator_1.query)('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
    (0, express_validator_1.query)('unreadOnly')
        .optional()
        .isBoolean()
        .withMessage('unreadOnly must be a boolean'),
    (0, express_validator_1.query)('type')
        .optional()
        .isIn(Object.values(notification_entity_1.NotificationType))
        .withMessage('Invalid notification type'),
    (0, express_validator_1.query)('priority')
        .optional()
        .isIn(Object.values(notification_entity_1.NotificationPriority))
        .withMessage('Invalid notification priority'),
    (0, express_validator_1.query)('sortBy')
        .optional()
        .isIn(['createdAt', 'priority'])
        .withMessage('Invalid sort field'),
    (0, express_validator_1.query)('sortOrder')
        .optional()
        .isIn(['asc', 'desc'])
        .withMessage('Invalid sort order')
];
// Routes
/**
 * GET /api/notifications/health
 * Health check endpoint (no auth required)
 */
// Already defined above before auth middleware
/**
 * GET /api/notifications/stats
 * Get notification statistics for the authenticated user
 */
router.get('/stats', notificationController.getNotificationStats);
/**
 * GET /api/notifications
 * Get paginated notifications for the authenticated user
 * Query params: page, limit, unreadOnly, type, priority, sortBy, sortOrder
 */
router.get('/', notificationQueryValidation, notificationController.getUserNotifications);
/**
 * POST /api/notifications
 * Create a new notification
 */
router.post('/', createNotificationValidation, notificationController.createNotification);
/**
 * POST /api/notifications/project
 * Create a project-specific notification
 */
router.post('/project', createProjectNotificationValidation, notificationController.createProjectNotification);
/**
 * POST /api/notifications/billing
 * Create a billing-specific notification
 */
router.post('/billing', createBillingNotificationValidation, notificationController.createBillingNotification);
/**
 * PUT /api/notifications/read-all
 * Mark all notifications as read for the authenticated user
 */
router.put('/read-all', notificationController.markAllAsRead);
/**
 * POST /api/notifications/clear-all
 * Clear (archive) all notifications for the authenticated user
 */
router.post('/clear-all', notificationController.clearAllNotifications);
/**
 * GET /api/notifications/:id
 * Get a specific notification by ID
 */
router.get('/:id', idValidation, notificationController.getNotificationById);
/**
 * PUT /api/notifications/:id/read
 * Mark a specific notification as read
 */
router.put('/:id/read', idValidation, notificationController.markAsRead);
/**
 * PUT /api/notifications/:id/archive
 * Archive a specific notification
 */
router.put('/:id/archive', idValidation, notificationController.archiveNotification);
/**
 * DELETE /api/notifications/:id
 * Delete a specific notification
 */
router.delete('/:id', idValidation, notificationController.deleteNotification);
exports.default = router;
