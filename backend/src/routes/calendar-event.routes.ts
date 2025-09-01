import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { CalendarEventController } from '../controllers/calendar-event.controller';
import { EventType, ReminderType } from '../models/calendar-event.entity';

const router = Router();
const calendarEventController = new CalendarEventController();

// Validation middleware
const validateCreateEvent = [
  body('eventTitle')
    .trim()
    .notEmpty()
    .withMessage('Event title is required')
    .isLength({ max: 200 })
    .withMessage('Event title cannot exceed 200 characters'),
  body('eventType')
    .isIn(Object.values(EventType))
    .withMessage(`Event type must be one of: ${Object.values(EventType).join(', ')}`),
  body('date')
    .isISO8601()
    .withMessage('Date must be in valid ISO 8601 format'),
  body('reminder')
    .optional()
    .isIn(Object.values(ReminderType))
    .withMessage(`Reminder must be one of: ${Object.values(ReminderType).join(', ')}`),
  body('projectId')
    .optional()
    .isMongoId()
    .withMessage('Project ID must be a valid MongoDB ObjectId'),
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  body('duration')
    .optional()
    .isInt({ min: 5, max: 1440 })
    .withMessage('Duration must be between 5 and 1440 minutes'),
  body('location')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Location cannot exceed 200 characters'),
  body('attendees')
    .optional()
    .isArray()
    .withMessage('Attendees must be an array'),
  body('attendees.*')
    .optional()
    .isEmail()
    .withMessage('All attendees must have valid email addresses')
];

const validateUpdateEvent = [
  body('eventTitle')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Event title cannot be empty')
    .isLength({ max: 200 })
    .withMessage('Event title cannot exceed 200 characters'),
  body('eventType')
    .optional()
    .isIn(Object.values(EventType))
    .withMessage(`Event type must be one of: ${Object.values(EventType).join(', ')}`),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be in valid ISO 8601 format'),
  body('reminder')
    .optional()
    .isIn(Object.values(ReminderType))
    .withMessage(`Reminder must be one of: ${Object.values(ReminderType).join(', ')}`),
  body('projectId')
    .optional()
    .isMongoId()
    .withMessage('Project ID must be a valid MongoDB ObjectId'),
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  body('duration')
    .optional()
    .isInt({ min: 5, max: 1440 })
    .withMessage('Duration must be between 5 and 1440 minutes'),
  body('location')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Location cannot exceed 200 characters'),
  body('attendees')
    .optional()
    .isArray()
    .withMessage('Attendees must be an array'),
  body('attendees.*')
    .optional()
    .isEmail()
    .withMessage('All attendees must have valid email addresses'),
  body('isCompleted')
    .optional()
    .isBoolean()
    .withMessage('isCompleted must be a boolean')
];

const validateId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid calendar event ID format')
];

const validateProjectId = [
  param('projectId')
    .isMongoId()
    .withMessage('Invalid project ID format')
];

const validateReschedule = [
  param('id')
    .isMongoId()
    .withMessage('Invalid calendar event ID format'),
  body('newDate')
    .isISO8601()
    .withMessage('New date must be in valid ISO 8601 format')
];

const validateBulkUpdate = [
  body('eventIds')
    .isArray({ min: 1 })
    .withMessage('Event IDs must be a non-empty array'),
  body('eventIds.*')
    .isMongoId()
    .withMessage('Each event ID must be a valid MongoDB ObjectId'),
  body('isCompleted')
    .isBoolean()
    .withMessage('isCompleted must be a boolean')
];

const validateListQuery = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('sortBy')
    .optional()
    .isIn(['eventTitle', 'eventType', 'date', 'isCompleted', 'createdAt', 'updatedAt'])
    .withMessage('Invalid sort field'),
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc'),
  query('eventType')
    .optional()
    .isIn(Object.values(EventType))
    .withMessage(`Event type must be one of: ${Object.values(EventType).join(', ')}`),
  query('projectId')
    .optional()
    .isMongoId()
    .withMessage('Project ID must be a valid MongoDB ObjectId'),
  query('isCompleted')
    .optional()
    .isBoolean()
    .withMessage('isCompleted must be a boolean'),
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be in valid ISO 8601 format'),
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be in valid ISO 8601 format'),
  query('reminder')
    .optional()
    .isIn(Object.values(ReminderType))
    .withMessage(`Reminder must be one of: ${Object.values(ReminderType).join(', ')}`),
  query('hasAttendees')
    .optional()
    .isBoolean()
    .withMessage('hasAttendees must be a boolean')
];

const validateSearch = [
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

const validateDateRange = [
  query('startDate')
    .isISO8601()
    .withMessage('Start date is required and must be in valid ISO 8601 format'),
  query('endDate')
    .isISO8601()
    .withMessage('End date is required and must be in valid ISO 8601 format')
];

const validateUpcomingDays = [
  query('days')
    .optional()
    .isInt({ min: 1, max: 365 })
    .withMessage('Days must be between 1 and 365')
];

const validateAttendeeEmail = [
  param('email')
    .isEmail()
    .withMessage('Invalid email format')
];

// Routes
// Create a new calendar event
router.post('/', validateCreateEvent, calendarEventController.createEvent);

// Get all calendar events with filtering, pagination, and sorting
router.get('/', validateListQuery, calendarEventController.getEvents);

// Search calendar events
router.get('/search', validateSearch, calendarEventController.searchEvents);

// Get calendar event statistics
router.get('/stats', calendarEventController.getStats);

// Get upcoming events
router.get('/upcoming', validateUpcomingDays, calendarEventController.getUpcomingEvents);

// Get overdue events
router.get('/overdue', calendarEventController.getOverdueEvents);

// Get today's events
router.get('/today', calendarEventController.getTodayEvents);

// Get events in date range
router.get('/range', validateDateRange, calendarEventController.getEventsInRange);

// Get events needing reminders
router.get('/reminders', calendarEventController.getEventsNeedingReminders);

// Get events by project
router.get('/project/:projectId', validateProjectId, calendarEventController.getEventsByProject);

// Get events by attendee
router.get('/attendee/:email', validateAttendeeEmail, calendarEventController.getEventsByAttendee);

// Get a specific calendar event by ID
router.get('/:id', validateId, calendarEventController.getEventById);

// Update a calendar event
router.put('/:id', [...validateId, ...validateUpdateEvent], calendarEventController.updateEvent);

// Delete a calendar event
router.delete('/:id', validateId, calendarEventController.deleteEvent);

// Mark event as completed
router.patch('/:id/complete', validateId, calendarEventController.markCompleted);

// Mark event as incomplete
router.patch('/:id/incomplete', validateId, calendarEventController.markIncomplete);

// Reschedule event
router.patch('/:id/reschedule', validateReschedule, calendarEventController.rescheduleEvent);

// Bulk update event status
router.patch('/bulk/status', validateBulkUpdate, calendarEventController.bulkUpdateStatus);

export default router;
