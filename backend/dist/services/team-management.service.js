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
        return members.map(member => {
            const user = member.memberId;
            return {
                id: member._id,
                _id: member._id,
                memberId: user._id,
                name: `${user.firstName} ${user.lastName}`,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                // Get these fields from TeamMember, not User
                phone: member.phone || '',
                gender: member.gender || 'male',
                payment: member.payment || 0,
                currentProject: member.currentProject || '',
                skills: member.skills || [],
                role: member.customRole || member.role || 'member',
                hasProjectAccess: member.hasProjectAccess,
                hasChatAccess: member.hasChatAccess,
                joinedAt: member.createdAt,
                lastAccessedAt: member.lastAccessedAt
            };
        });
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
     * Remove team member by TeamMember document _id
     */
    async removeByTeamMemberId(ownerId, teamMemberId) {
        try {
            const member = await team_member_entity_1.TeamMember.findOneAndDelete({
                _id: teamMemberId,
                ownerId
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
    /**
     * Create a team member directly (manual add without invitation)
     */
    async createTeamMember(ownerId, memberData) {
        try {
            // Skip subscription check for now - allow adding team members freely
            // TODO: Re-enable subscription check in production if needed
            // const canInvite = await this.subscriptionService.canUserInvite(ownerId);
            // if (!canInvite.canInvite) {
            //   return {
            //     success: false,
            //     error: canInvite.reason || 'Cannot add more team members'
            //   };
            // }
            // Parse name into first and last name
            const nameParts = memberData.name.trim().split(' ');
            const firstName = nameParts[0] || memberData.name;
            const lastName = nameParts.slice(1).join(' ') || '';
            // Check if user already exists with this email
            let user = await user_model_1.User.findOne({ email: memberData.email.toLowerCase() });
            if (user) {
                // Check if already a team member
                const existingMember = await team_member_entity_1.TeamMember.findOne({
                    ownerId,
                    memberId: user._id
                });
                if (existingMember) {
                    return {
                        success: false,
                        error: 'This user is already a member of your team'
                    };
                }
            }
            else {
                // Create a new user for this team member (as invited/contact user)
                user = new user_model_1.User({
                    email: memberData.email.toLowerCase(),
                    firstName,
                    lastName,
                    password: crypto_1.default.randomBytes(32).toString('hex'), // Random password (they can reset if needed)
                    isInvitedUser: true,
                    phone: memberData.phone || '',
                    gender: memberData.gender || '',
                    payment: memberData.payment || 0,
                    currentProject: memberData.currentProject || '',
                    skills: memberData.skills || []
                });
                await user.save();
            }
            // Create team member relationship with all custom fields
            const teamMember = new team_member_entity_1.TeamMember({
                ownerId,
                memberId: user._id,
                role: team_member_entity_1.MemberRole.MEMBER,
                customRole: memberData.role || '',
                phone: memberData.phone || '',
                gender: memberData.gender || 'male',
                payment: memberData.payment || 0,
                currentProject: memberData.currentProject || '',
                skills: memberData.skills || [],
                hasProjectAccess: true,
                hasChatAccess: true
            });
            await teamMember.save();
            // Increment invitation count
            await this.subscriptionService.incrementInviteCount(ownerId);
            return {
                success: true,
                member: {
                    id: teamMember._id,
                    memberId: user._id,
                    name: memberData.name,
                    firstName,
                    lastName,
                    email: user.email,
                    phone: teamMember.phone,
                    role: teamMember.customRole,
                    gender: teamMember.gender,
                    payment: teamMember.payment,
                    currentProject: teamMember.currentProject,
                    skills: teamMember.skills,
                    joinedAt: teamMember.createdAt
                }
            };
        }
        catch (error) {
            console.error('Error creating team member:', error);
            return {
                success: false,
                error: error.message || 'Failed to create team member'
            };
        }
    }
}
exports.TeamManagementService = TeamManagementService;
