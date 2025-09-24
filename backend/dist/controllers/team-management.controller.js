"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamManagementController = void 0;
const team_invitation_entity_1 = require("../models/team-invitation.entity");
const team_member_entity_1 = require("../models/team-member.entity");
const user_model_1 = require("../models/user.model");
const invite_token_service_1 = require("../services/invite-token.service");
const team_invitation_email_service_1 = require("../services/team-invitation-email.service");
const mongoose_1 = __importDefault(require("mongoose"));
class TeamManagementController {
    static async initialize() {
        console.log('✅ TeamManagementController initialized');
    }
    /**
     * Send team invitation
     * POST /api/team-management/invite
     */
    static async sendInvitation(req, res) {
        try {
            const { inviteEmail, inviteeName } = req.body;
            const inviter = req.user;
            if (!inviter) {
                return res.status(401).json({
                    success: false,
                    message: 'Authentication required'
                });
            }
            // Validation
            if (!inviteEmail || !inviteeName) {
                return res.status(400).json({
                    success: false,
                    message: 'Invite email and name are required'
                });
            }
            // Check if user is trying to invite themselves
            if (inviteEmail.toLowerCase() === inviter.email.toLowerCase()) {
                return res.status(400).json({
                    success: false,
                    message: 'You cannot invite yourself'
                });
            }
            // Check if invitation already exists and is still valid
            const existingInvitation = await team_invitation_entity_1.TeamInvitation.findOne({
                inviteEmail: inviteEmail.toLowerCase(),
                inviterId: new mongoose_1.default.Types.ObjectId(inviter.id),
                status: team_invitation_entity_1.InvitationStatus.PENDING
            });
            if (existingInvitation && !invite_token_service_1.InviteTokenService.isTokenExpired(existingInvitation.expiresAt)) {
                return res.status(400).json({
                    success: false,
                    message: 'An active invitation already exists for this email'
                });
            }
            // Check if user is already a team member
            const existingUser = await user_model_1.User.findOne({
                email: inviteEmail.toLowerCase()
            });
            if (existingUser) {
                const existingMember = await team_member_entity_1.TeamMember.findOne({
                    ownerId: new mongoose_1.default.Types.ObjectId(inviter.id),
                    memberId: existingUser._id
                });
                if (existingMember) {
                    return res.status(400).json({
                        success: false,
                        message: 'This user is already a team member'
                    });
                }
            }
            // Create invitation record
            const invitation = new team_invitation_entity_1.TeamInvitation({
                inviteEmail: inviteEmail.toLowerCase(),
                inviteeName: inviteeName,
                inviterId: new mongoose_1.default.Types.ObjectId(inviter.id),
                inviteeId: existingUser?._id || null,
                expiresAt: invite_token_service_1.InviteTokenService.getExpiryDate(),
                status: team_invitation_entity_1.InvitationStatus.PENDING,
                token: '' // Will be set after saving
            });
            // Save invitation to get ID
            const savedInvitation = await invitation.save();
            // Generate token with invitation ID
            const tokenPayload = {
                invitationId: savedInvitation._id.toString(),
                inviteEmail: inviteEmail.toLowerCase(),
                inviterId: inviter.id,
                inviterName: inviter.fullName,
                inviterEmail: inviter.email
            };
            const token = invite_token_service_1.InviteTokenService.generateInviteToken(tokenPayload);
            // Update invitation with token
            savedInvitation.token = token;
            await savedInvitation.save();
            // Send invitation email
            const emailSent = await team_invitation_email_service_1.TeamInvitationEmailService.sendInvitationEmail({
                inviteeName,
                inviterName: inviter.fullName,
                inviterEmail: inviter.email,
                inviteToken: token,
                inviteEmail: inviteEmail.toLowerCase()
            });
            if (!emailSent) {
                // Delete the invitation if email failed
                await team_invitation_entity_1.TeamInvitation.findByIdAndDelete(savedInvitation._id);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to send invitation email'
                });
            }
            res.status(201).json({
                success: true,
                message: 'Invitation sent successfully',
                data: {
                    invitationId: savedInvitation._id.toString(),
                    inviteEmail: savedInvitation.inviteEmail,
                    inviteeName: savedInvitation.inviteeName,
                    expiresAt: savedInvitation.expiresAt,
                    status: savedInvitation.status
                }
            });
        }
        catch (error) {
            console.error('Error sending team invitation:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    /**
     * Accept team invitation
     * POST /api/team-management/accept
     */
    static async acceptInvitation(req, res) {
        try {
            const { token } = req.body;
            const user = req.user;
            if (!token) {
                return res.status(400).json({
                    success: false,
                    message: 'Invitation token is required'
                });
            }
            // Verify token
            const tokenPayload = invite_token_service_1.InviteTokenService.verifyInviteToken(token);
            if (!tokenPayload) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid or expired invitation token'
                });
            }
            // Find invitation
            const invitation = await team_invitation_entity_1.TeamInvitation.findById(tokenPayload.invitationId)
                .populate('inviterId', 'fullName email');
            if (!invitation) {
                return res.status(404).json({
                    success: false,
                    message: 'Invitation not found'
                });
            }
            // Check invitation status
            if (invitation.status !== team_invitation_entity_1.InvitationStatus.PENDING) {
                return res.status(400).json({
                    success: false,
                    message: 'Invitation has already been processed'
                });
            }
            // Check if invitation is expired
            if (invite_token_service_1.InviteTokenService.isTokenExpired(invitation.expiresAt)) {
                invitation.status = team_invitation_entity_1.InvitationStatus.EXPIRED;
                await invitation.save();
                return res.status(400).json({
                    success: false,
                    message: 'Invitation has expired'
                });
            }
            // If user is not authenticated, return info for account creation
            if (!user) {
                return res.status(200).json({
                    success: true,
                    message: 'Account required to accept invitation',
                    requiresAccount: true,
                    data: {
                        inviteEmail: invitation.inviteEmail,
                        inviteeName: invitation.inviteeName,
                        inviterName: invitation.inviterId.fullName,
                        inviterEmail: invitation.inviterId.email,
                        token: token
                    }
                });
            }
            // Check if user email matches invitation email
            if (user.email.toLowerCase() !== invitation.inviteEmail.toLowerCase()) {
                return res.status(400).json({
                    success: false,
                    message: 'Your email does not match the invitation email'
                });
            }
            // Check if user is already a team member
            const existingMember = await team_member_entity_1.TeamMember.findOne({
                ownerId: invitation.inviterId,
                memberId: new mongoose_1.default.Types.ObjectId(user.id)
            });
            if (existingMember) {
                return res.status(400).json({
                    success: false,
                    message: 'You are already a team member'
                });
            }
            // Create team member record
            const teamMember = new team_member_entity_1.TeamMember({
                ownerId: invitation.inviterId,
                memberId: new mongoose_1.default.Types.ObjectId(user.id),
                role: team_member_entity_1.MemberRole.MEMBER,
                hasProjectAccess: true,
                hasChatAccess: true
            });
            await teamMember.save();
            // Update invitation status
            invitation.status = team_invitation_entity_1.InvitationStatus.ACCEPTED;
            invitation.acceptedAt = new Date();
            invitation.inviteeId = new mongoose_1.default.Types.ObjectId(user.id);
            await invitation.save();
            res.status(200).json({
                success: true,
                message: 'Invitation accepted successfully',
                data: {
                    teamMemberId: teamMember._id.toString(),
                    ownerId: teamMember.ownerId.toString(),
                    role: teamMember.role,
                    hasProjectAccess: teamMember.hasProjectAccess,
                    hasChatAccess: teamMember.hasChatAccess
                }
            });
        }
        catch (error) {
            console.error('Error accepting team invitation:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    /**
     * Get team members
     * GET /api/team-management/members
     */
    static async getTeamMembers(req, res) {
        try {
            const user = req.user;
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Authentication required'
                });
            }
            // Get team members where user is the owner
            const teamMembers = await team_member_entity_1.TeamMember.find({
                ownerId: new mongoose_1.default.Types.ObjectId(user.id)
            })
                .populate('memberId', 'fullName email')
                .sort({ createdAt: -1 });
            // Get pending invitations
            const pendingInvitations = await team_invitation_entity_1.TeamInvitation.find({
                inviterId: new mongoose_1.default.Types.ObjectId(user.id),
                status: team_invitation_entity_1.InvitationStatus.PENDING
            })
                .sort({ createdAt: -1 });
            // Filter out expired invitations
            const validInvitations = pendingInvitations.filter(inv => !invite_token_service_1.InviteTokenService.isTokenExpired(inv.expiresAt));
            // Mark expired invitations
            const expiredInvitations = pendingInvitations.filter(inv => invite_token_service_1.InviteTokenService.isTokenExpired(inv.expiresAt));
            if (expiredInvitations.length > 0) {
                await Promise.all(expiredInvitations.map(inv => {
                    inv.status = team_invitation_entity_1.InvitationStatus.EXPIRED;
                    return inv.save();
                }));
            }
            const members = teamMembers.map(tm => ({
                id: tm._id.toString(),
                memberId: tm.memberId._id.toString(),
                memberName: tm.memberId.fullName,
                memberEmail: tm.memberId.email,
                role: tm.role,
                hasProjectAccess: tm.hasProjectAccess,
                hasChatAccess: tm.hasChatAccess,
                lastAccessedAt: tm.lastAccessedAt,
                joinedAt: tm.createdAt,
                status: 'active'
            }));
            const invitations = validInvitations.map(inv => ({
                id: inv._id.toString(),
                inviteEmail: inv.inviteEmail,
                inviteeName: inv.inviteeName,
                status: inv.status,
                expiresAt: inv.expiresAt,
                createdAt: inv.createdAt
            }));
            res.status(200).json({
                success: true,
                data: {
                    members,
                    pendingInvitations: invitations,
                    totalMembers: members.length,
                    totalPendingInvitations: invitations.length
                }
            });
        }
        catch (error) {
            console.error('Error getting team members:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    /**
     * Remove team member
     * DELETE /api/team-management/members/:memberId
     */
    static async removeMember(req, res) {
        try {
            const { memberId } = req.params;
            const user = req.user;
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Authentication required'
                });
            }
            // Find team member record
            const teamMember = await team_member_entity_1.TeamMember.findOne({
                _id: new mongoose_1.default.Types.ObjectId(memberId),
                ownerId: new mongoose_1.default.Types.ObjectId(user.id)
            })
                .populate('memberId', 'fullName email');
            if (!teamMember) {
                return res.status(404).json({
                    success: false,
                    message: 'Team member not found'
                });
            }
            // Cannot remove owner
            if (teamMember.role === team_member_entity_1.MemberRole.OWNER) {
                return res.status(400).json({
                    success: false,
                    message: 'Cannot remove team owner'
                });
            }
            // Send notification email to removed member
            await team_invitation_email_service_1.TeamInvitationEmailService.sendRemovalNotificationEmail(teamMember.memberId.email, teamMember.memberId.fullName, user.fullName);
            // Remove team member record
            await team_member_entity_1.TeamMember.findByIdAndDelete(teamMember._id);
            res.status(200).json({
                success: true,
                message: 'Team member removed successfully'
            });
        }
        catch (error) {
            console.error('Error removing team member:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    /**
     * Cancel pending invitation
     * DELETE /api/team-management/invitations/:invitationId
     */
    static async cancelInvitation(req, res) {
        try {
            const { invitationId } = req.params;
            const user = req.user;
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Authentication required'
                });
            }
            const invitation = await team_invitation_entity_1.TeamInvitation.findOne({
                _id: new mongoose_1.default.Types.ObjectId(invitationId),
                inviterId: new mongoose_1.default.Types.ObjectId(user.id),
                status: team_invitation_entity_1.InvitationStatus.PENDING
            });
            if (!invitation) {
                return res.status(404).json({
                    success: false,
                    message: 'Pending invitation not found'
                });
            }
            // Delete invitation
            await team_invitation_entity_1.TeamInvitation.findByIdAndDelete(invitation._id);
            res.status(200).json({
                success: true,
                message: 'Invitation cancelled successfully'
            });
        }
        catch (error) {
            console.error('Error cancelling invitation:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    /**
     * Get invitation details by token (for invite page)
     * GET /api/team-management/invitation/:token
     */
    static async getInvitationDetails(req, res) {
        try {
            const { token } = req.params;
            // Verify token
            const tokenPayload = invite_token_service_1.InviteTokenService.verifyInviteToken(token);
            if (!tokenPayload) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid or expired invitation token'
                });
            }
            // Find invitation
            const invitation = await team_invitation_entity_1.TeamInvitation.findById(tokenPayload.invitationId)
                .populate('inviterId', 'fullName email');
            if (!invitation) {
                return res.status(404).json({
                    success: false,
                    message: 'Invitation not found'
                });
            }
            // Check if expired
            if (invite_token_service_1.InviteTokenService.isTokenExpired(invitation.expiresAt)) {
                invitation.status = team_invitation_entity_1.InvitationStatus.EXPIRED;
                await invitation.save();
                return res.status(400).json({
                    success: false,
                    message: 'Invitation has expired'
                });
            }
            // Check status
            if (invitation.status !== team_invitation_entity_1.InvitationStatus.PENDING) {
                return res.status(400).json({
                    success: false,
                    message: 'Invitation has already been processed'
                });
            }
            res.status(200).json({
                success: true,
                data: {
                    inviteEmail: invitation.inviteEmail,
                    inviteeName: invitation.inviteeName,
                    inviterName: invitation.inviterId.fullName,
                    inviterEmail: invitation.inviterId.email,
                    expiresAt: invitation.expiresAt,
                    token: token
                }
            });
        }
        catch (error) {
            console.error('Error getting invitation details:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
}
exports.TeamManagementController = TeamManagementController;
