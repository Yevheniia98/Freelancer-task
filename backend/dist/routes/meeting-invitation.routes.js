"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const meeting_invitation_controller_1 = require("../controllers/meeting-invitation.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
const meetingInvitationController = new meeting_invitation_controller_1.MeetingInvitationController();
// Validation middleware for meeting invitations
const validateMeetingInvitation = [
    (0, express_validator_1.body)('recipients')
        .isArray({ min: 1 })
        .withMessage('Recipients must be an array with at least one recipient'),
    (0, express_validator_1.body)('recipients.*.email')
        .isEmail()
        .withMessage('Each recipient must have a valid email address'),
    (0, express_validator_1.body)('recipients.*.name')
        .optional()
        .isString()
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Recipient name must be between 1 and 100 characters'),
    (0, express_validator_1.body)('meetingData.title')
        .isString()
        .trim()
        .isLength({ min: 1, max: 200 })
        .withMessage('Meeting title is required and must be between 1 and 200 characters'),
    (0, express_validator_1.body)('meetingData.description')
        .optional()
        .isString()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Meeting description must not exceed 1000 characters'),
    (0, express_validator_1.body)('meetingData.date')
        .isISO8601()
        .withMessage('Meeting date must be a valid ISO 8601 date'),
    (0, express_validator_1.body)('meetingData.startTime')
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage('Start time must be in HH:MM format'),
    (0, express_validator_1.body)('meetingData.endTime')
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage('End time must be in HH:MM format'),
    (0, express_validator_1.body)('meetingData.meetingLink')
        .optional()
        .isURL()
        .withMessage('Meeting link must be a valid URL'),
    (0, express_validator_1.body)('meetingData.platform')
        .optional()
        .isString()
        .trim()
        .isIn(['zoom', 'meet', 'teams', 'custom'])
        .withMessage('Platform must be one of: zoom, meet, teams, custom'),
    (0, express_validator_1.body)('meetingData.organizerName')
        .isString()
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Organizer name is required and must be between 1 and 100 characters'),
    (0, express_validator_1.body)('meetingData.organizerEmail')
        .isEmail()
        .withMessage('Organizer email must be a valid email address')
];
// Validation middleware for single invitation
const validateSingleInvitation = [
    (0, express_validator_1.body)('recipientEmail')
        .isEmail()
        .withMessage('Recipient email must be valid'),
    (0, express_validator_1.body)('recipientName')
        .optional()
        .isString()
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Recipient name must be between 1 and 100 characters'),
    (0, express_validator_1.body)('meetingTitle')
        .isString()
        .trim()
        .isLength({ min: 1, max: 200 })
        .withMessage('Meeting title is required and must be between 1 and 200 characters'),
    (0, express_validator_1.body)('meetingDescription')
        .optional()
        .isString()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Meeting description must not exceed 1000 characters'),
    (0, express_validator_1.body)('meetingDate')
        .isISO8601()
        .withMessage('Meeting date must be a valid ISO 8601 date'),
    (0, express_validator_1.body)('meetingStartTime')
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage('Start time must be in HH:MM format'),
    (0, express_validator_1.body)('meetingEndTime')
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage('End time must be in HH:MM format'),
    (0, express_validator_1.body)('meetingLink')
        .optional()
        .isURL()
        .withMessage('Meeting link must be a valid URL'),
    (0, express_validator_1.body)('platform')
        .optional()
        .isString()
        .trim()
        .isIn(['zoom', 'meet', 'teams', 'custom'])
        .withMessage('Platform must be one of: zoom, meet, teams, custom'),
    (0, express_validator_1.body)('organizerName')
        .isString()
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Organizer name is required and must be between 1 and 100 characters'),
    (0, express_validator_1.body)('organizerEmail')
        .isEmail()
        .withMessage('Organizer email must be a valid email address')
];
/**
 * @route   POST /api/meeting-invitations/send-multiple
 * @desc    Send meeting invitations to multiple recipients
 * @access  Public (temporary for testing)
 */
router.post('/send-multiple', validateMeetingInvitation, meetingInvitationController.sendInvitations);
/**
 * @route   POST /api/meeting-invitations/send-single
 * @desc    Send a single meeting invitation
 * @access  Private
 */
router.post('/send-single', auth_middleware_1.authMiddleware, validateSingleInvitation, meetingInvitationController.sendSingleInvitation);
exports.default = router;
