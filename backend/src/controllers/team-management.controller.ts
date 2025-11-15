import { Request, Response } from 'express';
import { TeamInvitation, InvitationStatus, ITeamInvitation } from '../models/team-invitation.entity';
import { TeamMember, MemberRole, ITeamMember } from '../models/team-member.entity';
import { User, IUser } from '../models/user.model';
import { InviteTokenService } from '../services/invite-token.service';
import { TeamInvitationEmailService } from '../services/team-invitation-email.service';
import mongoose from 'mongoose';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    fullName: string;
  };
}

export class TeamManagementController {
  static async initialize() {
    console.log('✅ TeamManagementController initialized');
  }

  /**
   * Send team invitation
   * POST /api/team-management/invite
   */
  static async sendInvitation(req: AuthenticatedRequest, res: Response) {
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
      const existingInvitation = await TeamInvitation.findOne({
        inviteEmail: inviteEmail.toLowerCase(),
        inviterId: new mongoose.Types.ObjectId(inviter.id),
        status: InvitationStatus.PENDING
      });

      if (existingInvitation && !InviteTokenService.isTokenExpired(existingInvitation.expiresAt)) {
        return res.status(400).json({
          success: false,
          message: 'An active invitation already exists for this email'
        });
      }

      // Check if user is already a team member
      const existingUser = await User.findOne({ 
        email: inviteEmail.toLowerCase() 
      });

      if (existingUser) {
        const existingMember = await TeamMember.findOne({
          ownerId: new mongoose.Types.ObjectId(inviter.id),
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
      const invitation = new TeamInvitation({
        inviteEmail: inviteEmail.toLowerCase(),
        inviteeName: inviteeName,
        inviterId: new mongoose.Types.ObjectId(inviter.id),
        inviteeId: existingUser?._id || null,
        expiresAt: InviteTokenService.getExpiryDate(),
        status: InvitationStatus.PENDING,
        token: '' // Will be set after saving
      });

      // Save invitation to get ID
      const savedInvitation = await invitation.save();

      // Generate token with invitation ID
      const tokenPayload = {
        invitationId: (savedInvitation._id as any).toString(),
        inviteEmail: inviteEmail.toLowerCase(),
        inviterId: inviter.id,
        inviterName: inviter.fullName,
        inviterEmail: inviter.email
      };
      
      const token = InviteTokenService.generateInviteToken(tokenPayload);
      
      // Update invitation with token
      savedInvitation.token = token;
      await savedInvitation.save();

      // Send invitation email
      const emailSent = await TeamInvitationEmailService.sendInvitationEmail({
        inviteeName,
        inviterName: inviter.fullName,
        inviterEmail: inviter.email,
        inviteToken: token,
        inviteEmail: inviteEmail.toLowerCase()
      });

      if (!emailSent) {
        // Delete the invitation if email failed
        await TeamInvitation.findByIdAndDelete(savedInvitation._id);
        return res.status(500).json({
          success: false,
          message: 'Failed to send invitation email'
        });
      }

      res.status(201).json({
        success: true,
        message: 'Invitation sent successfully',
        data: {
          invitationId: (savedInvitation._id as any).toString(),
          inviteEmail: savedInvitation.inviteEmail,
          inviteeName: savedInvitation.inviteeName,
          expiresAt: savedInvitation.expiresAt,
          status: savedInvitation.status
        }
      });

    } catch (error) {
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
  static async acceptInvitation(req: AuthenticatedRequest, res: Response) {
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
      const tokenPayload = InviteTokenService.verifyInviteToken(token);
      if (!tokenPayload) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or expired invitation token'
        });
      }

      // Find invitation
      const invitation = await TeamInvitation.findById(tokenPayload.invitationId)
        .populate('inviterId', 'fullName email');

      if (!invitation) {
        return res.status(404).json({
          success: false,
          message: 'Invitation not found'
        });
      }

      // Check invitation status
      if (invitation.status !== InvitationStatus.PENDING) {
        return res.status(400).json({
          success: false,
          message: 'Invitation has already been processed'
        });
      }

      // Check if invitation is expired
      if (InviteTokenService.isTokenExpired(invitation.expiresAt)) {
        invitation.status = InvitationStatus.EXPIRED;
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
            inviterName: (invitation.inviterId as any).fullName,
            inviterEmail: (invitation.inviterId as any).email,
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
      const existingMember = await TeamMember.findOne({
        ownerId: invitation.inviterId,
        memberId: new mongoose.Types.ObjectId(user.id)
      });

      if (existingMember) {
        return res.status(400).json({
          success: false,
          message: 'You are already a team member'
        });
      }

      // Create team member record
      const teamMember = new TeamMember({
        ownerId: invitation.inviterId,
        memberId: new mongoose.Types.ObjectId(user.id),
        role: MemberRole.MEMBER,
        hasProjectAccess: true,
        hasChatAccess: true
      });

      await teamMember.save();

      // Update invitation status
      invitation.status = InvitationStatus.ACCEPTED;
      invitation.acceptedAt = new Date();
      invitation.inviteeId = new mongoose.Types.ObjectId(user.id);
      await invitation.save();

      res.status(200).json({
        success: true,
        message: 'Invitation accepted successfully',
        data: {
          teamMemberId: (teamMember._id as any).toString(),
          ownerId: teamMember.ownerId.toString(),
          role: teamMember.role,
          hasProjectAccess: teamMember.hasProjectAccess,
          hasChatAccess: teamMember.hasChatAccess
        }
      });

    } catch (error) {
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
  static async getTeamMembers(req: AuthenticatedRequest, res: Response) {
    try {
      const user = req.user;

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      // Get team members where user is the owner
      const teamMembers = await TeamMember.find({
        ownerId: new mongoose.Types.ObjectId(user.id)
      })
      .populate('memberId', 'fullName email')
      .sort({ createdAt: -1 });

      // Get pending invitations
      const pendingInvitations = await TeamInvitation.find({
        inviterId: new mongoose.Types.ObjectId(user.id),
        status: InvitationStatus.PENDING
      })
      .sort({ createdAt: -1 });

      // Filter out expired invitations
      const validInvitations = pendingInvitations.filter(inv => 
        !InviteTokenService.isTokenExpired(inv.expiresAt)
      );

      // Mark expired invitations
      const expiredInvitations = pendingInvitations.filter(inv => 
        InviteTokenService.isTokenExpired(inv.expiresAt)
      );

      if (expiredInvitations.length > 0) {
        await Promise.all(
          expiredInvitations.map(inv => {
            inv.status = InvitationStatus.EXPIRED;
            return inv.save();
          })
        );
      }

      const members = teamMembers.map(tm => ({
        id: (tm._id as any).toString(),
        memberId: tm.memberId._id.toString(),
        memberName: (tm.memberId as any).fullName,
        memberEmail: (tm.memberId as any).email,
        role: tm.role,
        hasProjectAccess: tm.hasProjectAccess,
        hasChatAccess: tm.hasChatAccess,
        lastAccessedAt: tm.lastAccessedAt,
        joinedAt: tm.createdAt,
        status: 'active'
      }));

      const invitations = validInvitations.map(inv => ({
        id: (inv._id as any).toString(),
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

    } catch (error) {
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
  static async removeMember(req: AuthenticatedRequest, res: Response) {
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
      const teamMember = await TeamMember.findOne({
        _id: new mongoose.Types.ObjectId(memberId),
        ownerId: new mongoose.Types.ObjectId(user.id)
      })
      .populate('memberId', 'fullName email');

      if (!teamMember) {
        return res.status(404).json({
          success: false,
          message: 'Team member not found'
        });
      }

      // Cannot remove owner
      if (teamMember.role === MemberRole.OWNER) {
        return res.status(400).json({
          success: false,
          message: 'Cannot remove team owner'
        });
      }

      // Send notification email to removed member
      await TeamInvitationEmailService.sendRemovalNotificationEmail(
        (teamMember.memberId as any).email,
        (teamMember.memberId as any).fullName,
        user.fullName
      );

      // Remove team member record
      await TeamMember.findByIdAndDelete(teamMember._id);

      res.status(200).json({
        success: true,
        message: 'Team member removed successfully'
      });

    } catch (error) {
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
  static async cancelInvitation(req: AuthenticatedRequest, res: Response) {
    try {
      const { invitationId } = req.params;
      const user = req.user;

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const invitation = await TeamInvitation.findOne({
        _id: new mongoose.Types.ObjectId(invitationId),
        inviterId: new mongoose.Types.ObjectId(user.id),
        status: InvitationStatus.PENDING
      });

      if (!invitation) {
        return res.status(404).json({
          success: false,
          message: 'Pending invitation not found'
        });
      }

      // Delete invitation
      await TeamInvitation.findByIdAndDelete(invitation._id);

      res.status(200).json({
        success: true,
        message: 'Invitation cancelled successfully'
      });

    } catch (error) {
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
  static async getInvitationDetails(req: Request, res: Response) {
    try {
      const { token } = req.params;

      // Verify token
      const tokenPayload = InviteTokenService.verifyInviteToken(token);
      if (!tokenPayload) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or expired invitation token'
        });
      }

      // Find invitation
      const invitation = await TeamInvitation.findById(tokenPayload.invitationId)
        .populate('inviterId', 'fullName email');

      if (!invitation) {
        return res.status(404).json({
          success: false,
          message: 'Invitation not found'
        });
      }

      // Check if expired
      if (InviteTokenService.isTokenExpired(invitation.expiresAt)) {
        invitation.status = InvitationStatus.EXPIRED;
        await invitation.save();
        
        return res.status(400).json({
          success: false,
          message: 'Invitation has expired'
        });
      }

      // Check status
      if (invitation.status !== InvitationStatus.PENDING) {
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
          inviterName: (invitation.inviterId as any).fullName,
          inviterEmail: (invitation.inviterId as any).email,
          expiresAt: invitation.expiresAt,
          token: token
        }
      });

    } catch (error) {
      console.error('Error getting invitation details:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}