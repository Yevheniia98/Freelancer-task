import express from 'express';
import { body, param, query } from 'express-validator';
import { NotificationController } from '../controllers/notification.controller';
import { NotificationType, NotificationPriority } from '../models/notification.entity';
import { authMiddleware } from '../middleware/auth.middleware';

const router = express.Router();
const notificationController = new NotificationController();

// Apply auth middleware to all notification routes except health check
router.get('/health', notificationController.healthCheck);
router.use(authMiddleware);

// Validation rules
const createNotificationValidation = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  body('message')
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ min: 1, max: 1000 })
    .withMessage('Message must be between 1 and 1000 characters'),
  body('type')
    .isIn(Object.values(NotificationType))
    .withMessage('Invalid notification type'),
  body('priority')
    .optional()
    .isIn(Object.values(NotificationPriority))
    .withMessage('Invalid notification priority'),
  body('targetUserId')
    .optional()
    .isString()
    .withMessage('Target user ID must be a string'),
  body('metadata')
    .optional()
    .isObject()
    .withMessage('Metadata must be an object')
];

const createProjectNotificationValidation = [
  body('projectId')
    .notEmpty()
    .withMessage('Project ID is required'),
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  body('message')
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ min: 1, max: 1000 })
    .withMessage('Message must be between 1 and 1000 characters'),
  body('actionUrl')
    .optional()
    .isURL()
    .withMessage('Action URL must be a valid URL')
];

const createBillingNotificationValidation = [
  body('amount')
    .isNumeric()
    .withMessage('Amount must be a number')
    .custom((value) => {
      if (value <= 0) {
        throw new Error('Amount must be greater than 0');
      }
      return true;
    }),
  body('dueDate')
    .isISO8601()
    .withMessage('Due date must be a valid date'),
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  body('message')
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ min: 1, max: 1000 })
    .withMessage('Message must be between 1 and 1000 characters')
];

const idValidation = [
  param('id')
    .notEmpty()
    .withMessage('Notification ID is required')
    .isString()
    .withMessage('Notification ID must be a string')
];

const notificationQueryValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('unreadOnly')
    .optional()
    .isBoolean()
    .withMessage('unreadOnly must be a boolean'),
  query('type')
    .optional()
    .isIn(Object.values(NotificationType))
    .withMessage('Invalid notification type'),
  query('priority')
    .optional()
    .isIn(Object.values(NotificationPriority))
    .withMessage('Invalid notification priority'),
  query('sortBy')
    .optional()
    .isIn(['createdAt', 'priority'])
    .withMessage('Invalid sort field'),
  query('sortOrder')
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

export default router;