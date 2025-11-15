"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeetingInvitationController = void 0;
const meeting_invitation_service_1 = require("../services/meeting-invitation.service");
const express_validator_1 = require("express-validator");
class MeetingInvitationController {
    constructor() {
        /**
         * Send meeting invitations to multiple recipients
         */
        this.sendInvitations = async (req, res) => {
            try {
                // Check for validation errors
                const errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    res.status(400).json({
                        success: false,
                        message: 'Validation failed',
                        errors: errors.array()
                    });
                    return;
                }
                const { recipients, meetingData } = req.body;
                // Validate required fields
                if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
                    res.status(400).json({
                        success: false,
                        message: 'Recipients array is required and must not be empty'
                    });
                    return;
                }
                if (!meetingData || !meetingData.title || !meetingData.date || !meetingData.startTime || !meetingData.endTime) {
                    res.status(400).json({
                        success: false,
                        message: 'Meeting data is incomplete. Title, date, startTime, and endTime are required.'
                    });
                    return;
                }
                // Convert date string to Date object
                const meetingDate = new Date(meetingData.date);
                if (isNaN(meetingDate.getTime())) {
                    res.status(400).json({
                        success: false,
                        message: 'Invalid meeting date format'
                    });
                    return;
                }
                // Send invitations
                const results = await this.invitationService.sendMeetingInvitations(recipients, {
                    organizerName: meetingData.organizerName,
                    organizerEmail: meetingData.organizerEmail,
                    meetingTitle: meetingData.title,
                    meetingDescription: meetingData.description,
                    meetingDate: meetingDate,
                    meetingStartTime: meetingData.startTime,
                    meetingEndTime: meetingData.endTime,
                    meetingLink: meetingData.meetingLink,
                    platform: meetingData.platform
                });
                // Respond with results
                const totalSent = results.success.length;
                const totalFailed = results.failed.length;
                const totalRecipients = recipients.length;
                res.status(200).json({
                    success: true,
                    message: `Invitations processed: ${totalSent}/${totalRecipients} sent successfully`,
                    data: {
                        totalRecipients,
                        sentSuccessfully: totalSent,
                        failed: totalFailed,
                        successfulRecipients: results.success,
                        failedRecipients: results.failed
                    }
                });
            }
            catch (error) {
                console.error('❌ Error sending meeting invitations:', error);
                res.status(500).json({
                    success: false,
                    message: 'Internal server error while sending invitations',
                    error: process.env.NODE_ENV === 'development' ? error.message : undefined
                });
            }
        };
        /**
         * Send a single meeting invitation
         */
        this.sendSingleInvitation = async (req, res) => {
            try {
                // Check for validation errors
                const errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    res.status(400).json({
                        success: false,
                        message: 'Validation failed',
                        errors: errors.array()
                    });
                    return;
                }
                const invitationData = req.body;
                // Validate required fields
                if (!invitationData.recipientEmail || !invitationData.meetingTitle ||
                    !invitationData.meetingDate || !invitationData.meetingStartTime ||
                    !invitationData.meetingEndTime || !invitationData.organizerName ||
                    !invitationData.organizerEmail) {
                    res.status(400).json({
                        success: false,
                        message: 'Missing required fields for meeting invitation'
                    });
                    return;
                }
                // Convert date string to Date object if needed
                if (typeof invitationData.meetingDate === 'string') {
                    invitationData.meetingDate = new Date(invitationData.meetingDate);
                }
                // Send invitation
                const success = await this.invitationService.sendMeetingInvitation(invitationData);
                if (success) {
                    res.status(200).json({
                        success: true,
                        message: `Meeting invitation sent successfully to ${invitationData.recipientEmail}`
                    });
                }
                else {
                    res.status(500).json({
                        success: false,
                        message: `Failed to send meeting invitation to ${invitationData.recipientEmail}`
                    });
                }
            }
            catch (error) {
                console.error('❌ Error sending meeting invitation:', error);
                res.status(500).json({
                    success: false,
                    message: 'Internal server error while sending invitation',
                    error: process.env.NODE_ENV === 'development' ? error.message : undefined
                });
            }
        };
        this.invitationService = new meeting_invitation_service_1.MeetingInvitationService();
    }
}
exports.MeetingInvitationController = MeetingInvitationController;
