"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamManagementService = void 0;
const team_invitation_entity_1 = require("../models/team-invitation.entity");
const team_member_entity_1 = require("../models/team-member.entity");
const user_model_1 = require("../models/user.model");
const subscription_service_1 = require("./subscription.service");
const crypto_1 = __importDefault(require("crypto"));
class TeamManagementService {
    constructor() {
        this.subscriptionService = new subscription_service_1.SubscriptionService();
    }
    /**
     * Send team invitation
     */
    async sendInvitation(inviterId, inviteEmail, inviteeName) {
        try {
            // Check if inviter can invite more members
            const canInvite = await this.subscriptionService.canUserInvite(inviterId);
            if (!canInvite.canInvite) {
                return {
                    success: false,
                    error: canInvite.reason || 'Cannot send invitation'
                };
            }
            // Check if invitation already exists and is pending
            const existingInvitation = await team_invitation_entity_1.TeamInvitation.findOne({
                inviterId,
                inviteEmail: inviteEmail.toLowerCase(),
                status: team_invitation_entity_1.InvitationStatus.PENDING
            });
            if (existingInvitation) {
                return {
                    success: false,
                    error: 'An invitation has already been sent to this email address'
                };
            }
            // Check if user is already a team member
            const invitedUser = await user_model_1.User.findOne({ email: inviteEmail.toLowerCase() });
            if (invitedUser) {
                const existingMember = await team_member_entity_1.TeamMember.findOne({
                    ownerId: inviterId,
                    memberId: invitedUser._id
                });
                if (existingMember) {
                    return {
                        success: false,
                        error: 'This user is already a member of your team'
                    };
                }
            }
            // Generate unique token
            const token = crypto_1.default.randomBytes(32).toString('hex');
            // Create invitation (expires in 7 days)
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 7);
            const invitation = new team_invitation_entity_1.TeamInvitation({
                inviteEmail: inviteEmail.toLowerCase(),
                inviteeName,
                inviterId,
                token,
                status: team_invitation_entity_1.InvitationStatus.PENDING,
                expiresAt
            });
            await invitation.save();
            // Generate invitation URL
            const inviteUrl = `${process.env.FRONTEND_URL || 'http://localhost:3030'}/team-invite?token=${token}`;
            return {
                success: true,
                invitation,
                inviteUrl
            };
        }
        catch (error) {
            console.error('Error sending invitation:', error);
            return {
                success: false,
                error: error.message || 'Failed to send invitation'
            };
        }
    }
    /**
     * Accept invitation and create account
     */
    async acceptInvitation(token, userData) {
        try {
            // Find invitation by token
            const invitation = await team_invitation_entity_1.TeamInvitation.findOne({
                token,
                status: team_invitation_entity_1.InvitationStatus.PENDING
            }).populate('inviterId');
            if (!invitation) {
                return {
                    success: false,
                    error: 'Invalid or expired invitation'
                };
            }
            // Check if invitation has expired
            if (invitation.expiresAt < new Date()) {
                invitation.status = team_invitation_entity_1.InvitationStatus.EXPIRED;
                await invitation.save();
                return {
                    success: false,
                    error: 'This invitation has expired'
                };
            }
            // Check if email matches
            if (invitation.inviteEmail !== userData.email.toLowerCase()) {
                return {
                    success: false,
                    error: 'Email does not match the invitation'
                };
            }
            // Check if user already exists
            const existingUser = await user_model_1.User.findOne({ email: userData.email.toLowerCase() });
            if (existingUser) {
                // User exists, just add them to the team
                return await this.addExistingUserToTeam(invitation, existingUser);
            }
            // Create new user account (invited users get free access)
            const newUser = new user_model_1.User({
                email: userData.email.toLowerCase(),
                password: userData.password, // Should be hashed by pre-save hook
                firstName: userData.firstName,
                lastName: userData.lastName,
                invitedBy: invitation.inviterId,
                inviteToken: token,
                isInvitedUser: true // Invited users get free access
            });
            await newUser.save();
            // Create team member relationship
            const teamMember = new team_member_entity_1.TeamMember({
                ownerId: invitation.inviterId,
                memberId: newUser._id,
                role: team_member_entity_1.MemberRole.MEMBER,
                hasProjectAccess: true,
                hasChatAccess: true
            });
            await teamMember.save();
            // Update invitation status
            invitation.status = team_invitation_entity_1.InvitationStatus.ACCEPTED;
            invitation.inviteeId = newUser._id;
            invitation.acceptedAt = new Date();
            await invitation.save();
            // Increment inviter's subscription count
            await this.subscriptionService.incrementInviteCount(invitation.inviterId);
            return {
                success: true,
                user: newUser
            };
        }
        catch (error) {
            console.error('Error accepting invitation:', error);
            return {
                success: false,
                error: error.message || 'Failed to accept invitation'
            };
        }
    }
    /**
     * Add existing user to team
     */
    async addExistingUserToTeam(invitation, user) {
        try {
            // Check if already a member
            const existingMember = await team_member_entity_1.TeamMember.findOne({
                ownerId: invitation.inviterId,
                memberId: user._id
            });
            if (existingMember) {
                return {
                    success: false,
                    error: 'You are already a member of this team'
                };
            }
            // Create team member relationship
            const teamMember = new team_member_entity_1.TeamMember({
                ownerId: invitation.inviterId,
                memberId: user._id,
                role: team_member_entity_1.MemberRole.MEMBER,
                hasProjectAccess: true,
                hasChatAccess: true
            });
            await teamMember.save();
            // Update invitation status
            invitation.status = team_invitation_entity_1.InvitationStatus.ACCEPTED;
            invitation.inviteeId = user._id;
            invitation.acceptedAt = new Date();
            await invitation.save();
            // Increment inviter's subscription count
            await this.subscriptionService.incrementInviteCount(invitation.inviterId);
            return {
                success: true,
                user
            };
        }
        catch (error) {
            console.error('Error adding user to team:', error);
            return {
                success: false,
                error: error.message || 'Failed to add user to team'
            };
        }
    }
    /**
     * Get team members for a user
     */
    async getTeamMembers(userId) {
        const members = await team_member_entity_1.TeamMember.find({ ownerId: userId })
            .populate('memberId', 'email firstName lastName createdAt isInvitedUser')
            .sort({ createdAt: -1 });
        return members.map(member => ({
            id: member._id,
            user: member.memberId,
            role: member.role,
            hasProjectAccess: member.hasProjectAccess,
            hasChatAccess: member.hasChatAccess,
            joinedAt: member.createdAt,
            lastAccessedAt: member.lastAccessedAt
        }));
    }
    /**
     * Search team members by name or email
     */
    async searchTeamMembers(userId, searchTerm) {
        const members = await team_member_entity_1.TeamMember.find({ ownerId: userId })
            .populate('memberId', 'email firstName lastName isInvitedUser');
        const searchLower = searchTerm.toLowerCase();
        return members
            .filter(member => {
            const user = member.memberId;
            const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
            const email = user.email.toLowerCase();
            return fullName.includes(searchLower) || email.includes(searchLower);
        })
            .map(member => {
            const user = member.memberId;
            return {
                id: member._id,
                userId: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                fullName: `${user.firstName} ${user.lastName}`,
                role: member.role,
                isInvitedUser: user.isInvitedUser,
                joinedAt: member.createdAt
            };
        });
    }
    /**
     * Remove team member
     */
    async removeMember(ownerId, memberId) {
        try {
            const member = await team_member_entity_1.TeamMember.findOneAndDelete({
                ownerId,
                memberId
            });
            if (!member) {
                return {
                    success: false,
                    error: 'Team member not found'
                };
            }
            // Decrement owner's subscription count
            await this.subscriptionService.decrementInviteCount(ownerId);
            return { success: true };
        }
        catch (error) {
            console.error('Error removing member:', error);
            return {
                success: false,
                error: error.message || 'Failed to remove member'
            };
        }
    }
    /**
     * Get pending invitations
     */
    async getPendingInvitations(inviterId) {
        return await team_invitation_entity_1.TeamInvitation.find({
            inviterId,
            status: team_invitation_entity_1.InvitationStatus.PENDING,
            expiresAt: { $gt: new Date() }
        }).sort({ createdAt: -1 });
    }
    /**
     * Validate invitation token
     */
    async validateInvitationToken(token) {
        try {
            const invitation = await team_invitation_entity_1.TeamInvitation.findOne({
                token,
                status: team_invitation_entity_1.InvitationStatus.PENDING
            }).populate('inviterId', 'email firstName lastName');
            if (!invitation) {
                return {
                    valid: false,
                    error: 'Invalid invitation token'
                };
            }
            if (invitation.expiresAt < new Date()) {
                invitation.status = team_invitation_entity_1.InvitationStatus.EXPIRED;
                await invitation.save();
                return {
                    valid: false,
                    error: 'This invitation has expired'
                };
            }
            const inviter = invitation.inviterId;
            return {
                valid: true,
                invitation: {
                    inviteEmail: invitation.inviteEmail,
                    inviteeName: invitation.inviteeName,
                    inviterName: `${inviter.firstName} ${inviter.lastName}`,
                    inviterEmail: inviter.email,
                    expiresAt: invitation.expiresAt
                }
            };
        }
        catch (error) {
            console.error('Error validating token:', error);
            return {
                valid: false,
                error: 'Failed to validate invitation'
            };
        }
    }
}
exports.TeamManagementService = TeamManagementService;
