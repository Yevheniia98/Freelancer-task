import { Router } from 'express';
import { body } from 'express-validator';
import { MeetingInvitationController } from '../controllers/meeting-invitation.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const meetingInvitationController = new MeetingInvitationController();

// Validation middleware for meeting invitations
const validateMeetingInvitation = [
  body('recipients')
    .isArray({ min: 1 })
    .withMessage('Recipients must be an array with at least one recipient'),
  
  body('recipients.*.email')
    .isEmail()
    .withMessage('Each recipient must have a valid email address'),
  
  body('recipients.*.name')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Recipient name must be between 1 and 100 characters'),

  body('meetingData.title')
    .isString()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Meeting title is required and must be between 1 and 200 characters'),

  body('meetingData.description')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Meeting description must not exceed 1000 characters'),

  body('meetingData.date')
    .isISO8601()
    .withMessage('Meeting date must be a valid ISO 8601 date'),

  body('meetingData.startTime')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Start time must be in HH:MM format'),

  body('meetingData.endTime')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('End time must be in HH:MM format'),

  body('meetingData.meetingLink')
    .optional()
    .isURL()
    .withMessage('Meeting link must be a valid URL'),

  body('meetingData.platform')
    .optional()
    .isString()
    .trim()
    .isIn(['zoom', 'meet', 'teams', 'custom'])
    .withMessage('Platform must be one of: zoom, meet, teams, custom'),

  body('meetingData.organizerName')
    .isString()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Organizer name is required and must be between 1 and 100 characters'),

  body('meetingData.organizerEmail')
    .isEmail()
    .withMessage('Organizer email must be a valid email address')
];

// Validation middleware for single invitation
const validateSingleInvitation = [
  body('recipientEmail')
    .isEmail()
    .withMessage('Recipient email must be valid'),

  body('recipientName')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Recipient name must be between 1 and 100 characters'),

  body('meetingTitle')
    .isString()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Meeting title is required and must be between 1 and 200 characters'),

  body('meetingDescription')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Meeting description must not exceed 1000 characters'),

  body('meetingDate')
    .isISO8601()
    .withMessage('Meeting date must be a valid ISO 8601 date'),

  body('meetingStartTime')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Start time must be in HH:MM format'),

  body('meetingEndTime')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('End time must be in HH:MM format'),

  body('meetingLink')
    .optional()
    .isURL()
    .withMessage('Meeting link must be a valid URL'),

  body('platform')
    .optional()
    .isString()
    .trim()
    .isIn(['zoom', 'meet', 'teams', 'custom'])
    .withMessage('Platform must be one of: zoom, meet, teams, custom'),

  body('organizerName')
    .isString()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Organizer name is required and must be between 1 and 100 characters'),

  body('organizerEmail')
    .isEmail()
    .withMessage('Organizer email must be a valid email address')
];

/**
 * @route   POST /api/meeting-invitations/send-multiple
 * @desc    Send meeting invitations to multiple recipients
 * @access  Public (temporary for testing)
 */
router.post(
  '/send-multiple',
  validateMeetingInvitation,
  meetingInvitationController.sendInvitations
);

/**
 * @route   POST /api/meeting-invitations/send-single
 * @desc    Send a single meeting invitation
 * @access  Private
 */
router.post(
  '/send-single',
  authMiddleware,
  validateSingleInvitation,
  meetingInvitationController.sendSingleInvitation
);

export default router;
