"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const meeting_invitation_service_1 = require("../services/meeting-invitation.service");
const router = (0, express_1.Router)();
/**
 * @route   POST /api/test-email/invitation
 * @desc    Test meeting invitation email (development only)
 * @access  Public (development only)
 */
router.post('/invitation', async (req, res) => {
    try {
        // Only allow in development
        if (process.env.NODE_ENV === 'production') {
            return res.status(403).json({
                success: false,
                message: 'Test email endpoints not available in production'
            });
        }
        const invitationService = new meeting_invitation_service_1.MeetingInvitationService();
        // Test invitation data
        const testInvitation = {
            recipientEmail: req.body.email || 'test@example.com',
            recipientName: req.body.name || undefined,
            organizerName: req.body.organizerName || 'Test Organizer',
            organizerEmail: req.body.organizerEmail || 'organizer@example.com',
            meetingTitle: req.body.title || 'Test Meeting Invitation',
            meetingDescription: req.body.description || 'This is a test meeting invitation to verify the email functionality.',
            meetingDate: new Date(req.body.date || '2025-09-15'),
            meetingStartTime: req.body.startTime || '10:00',
            meetingEndTime: req.body.endTime || '11:00',
            meetingLink: req.body.meetingLink || 'https://meet.google.com/test-meeting',
            platform: req.body.platform || 'meet'
        };
        const success = await invitationService.sendMeetingInvitation(testInvitation);
        if (success) {
            res.json({
                success: true,
                message: 'Test meeting invitation sent successfully',
                data: testInvitation
            });
        }
        else {
            res.status(500).json({
                success: false,
                message: 'Failed to send test meeting invitation'
            });
        }
    }
    catch (error) {
        console.error('❌ Error sending test invitation:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});
exports.default = router;
