import { Response } from 'express';
import crypto from 'crypto';
import { ProjectInvite } from '../models/project-invite.model';
import { ProjectEntity } from '../models/project.entity';
import { User } from '../models/user.model';
import { EmailService } from '../services/email.service';
import { AuthRequest } from '../middleware/permissions.middleware';

export class ProjectInviteController {
  private emailService: EmailService;

  constructor() {
    this.emailService = new EmailService();
  }

  /**
   * Create project invite (Owner only)
   */
  createInvite = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { projectId, email, role } = req.body;
      const userId = req.user?.id;

      if (!email || !role) {
        res.status(400).json({
          success: false,
          message: 'Email and role are required'
        });
        return;
      }

      if (!['view', 'edit'].includes(role)) {
        res.status(400).json({
          success: false,
          message: 'Role must be either "view" or "edit"'
        });
        return;
      }

      const project = await ProjectEntity.findById(projectId);
      if (!project) {
        res.status(404).json({
          success: false,
          message: 'Project not found'
        });
        return;
      }

      // Check if user already in project
      const existingMember = project.teamMembers?.find(
        m => m.email.toLowerCase() === email.toLowerCase()
      );

      if (existingMember) {
        res.status(400).json({
          success: false,
          message: 'User is already a team member'
        });
        return;
      }

      // Check if pending invite exists
      const existingInvite = await ProjectInvite.findOne({
        projectId,
        email: email.toLowerCase(),
        expiresAt: { $gt: new Date() },
        acceptedAt: null
      });

      if (existingInvite) {
        res.status(400).json({
          success: false,
          message: 'Invitation already sent to this email'
        });
        return;
      }

      // Create invite token
      const token = crypto.randomUUID();
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

      const invite = await ProjectInvite.create({
        projectId,
        email: email.toLowerCase(),
        role,
        token,
        expiresAt,
        createdBy: userId
      });

      // Add as pending member
      const pendingMember = {
        userId: null,
        name: email.split('@')[0],
        email: email.toLowerCase(),
        role,
        status: 'pending' as const,
        addedAt: new Date(),
        addedBy: userId
      };

      if (!project.teamMembers) {
        project.teamMembers = [];
      }
      project.teamMembers.push(pendingMember as any);
      await project.save();

      // Send email
      const inviteLink = `${process.env.FRONTEND_URL || 'http://localhost:3030'}/invite/accept?token=${token}`;
      const currentUser = await User.findById(userId);
      const inviterName = currentUser?.firstName && currentUser?.lastName
        ? `${currentUser.firstName} ${currentUser.lastName}`
        : currentUser?.email || 'Someone';

      await this.sendInviteEmail(email, inviterName, project.title, role, inviteLink);

      console.log('✅ Invite created:', {
        email,
        role,
        projectId,
        token,
        expiresAt
      });

      res.status(201).json({
        success: true,
        message: 'Invitation sent successfully',
        data: {
          inviteId: invite.id,
          email: invite.email,
          role: invite.role,
          expiresAt: invite.expiresAt,
          inviteLink
        }
      });
    } catch (error: any) {
      console.error('Create invite error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to create invitation'
      });
    }
  };

  /**
   * Accept invite
   */
  acceptInvite = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { token } = req.query;
      const userId = req.user?.id;

      if (!token) {
        res.status(400).json({
          success: false,
          message: 'Invite token is required'
        });
        return;
      }

      const invite = await ProjectInvite.findOne({ token: token as string });

      if (!invite) {
        res.status(404).json({
          success: false,
          message: 'Invalid invite link'
        });
        return;
      }

      if (invite.expiresAt < new Date()) {
        res.status(400).json({
          success: false,
          message: 'This invitation has expired'
        });
        return;
      }

      if (invite.acceptedAt) {
        res.status(400).json({
          success: false,
          message: 'This invitation has already been accepted'
        });
        return;
      }

      const user = await User.findById(userId);
      if (!user) {
        res.status(401).json({
          success: false,
          message: 'User not found. Please log in.'
        });
        return;
      }

      // Verify email matches (optional - allow anyone with link)
      // if (user.email.toLowerCase() !== invite.email.toLowerCase()) {
      //   res.status(403).json({
      //     success: false,
      //     message: 'This invitation was sent to a different email address'
      //   });
      //   return;
      // }

      const project = await ProjectEntity.findById(invite.projectId);
      if (!project) {
        res.status(404).json({
          success: false,
          message: 'Project not found'
        });
        return;
      }

      // Remove pending member
      if (project.teamMembers) {
        project.teamMembers = project.teamMembers.filter(
          m => m.email.toLowerCase() !== invite.email.toLowerCase() || m.status !== 'pending'
        );
      } else {
        project.teamMembers = [];
      }

      // Add as active member
      const memberName = user.firstName && user.lastName
        ? `${user.firstName} ${user.lastName}`
        : user.email.split('@')[0];

      project.teamMembers.push({
        userId: user._id,
        name: memberName,
        email: user.email,
        role: invite.role,
        status: 'active',
        addedAt: new Date(),
        addedBy: invite.createdBy
      } as any);

      await project.save();

      // Mark invite as accepted
      invite.acceptedAt = new Date();
      invite.acceptedBy = user._id as any;
      await invite.save();

      console.log('✅ Invite accepted:', {
        email: user.email,
        projectId: project.id,
        role: invite.role
      });

      res.json({
        success: true,
        message: 'Successfully joined project',
        project: {
          id: project.id,
          name: project.title,
          title: project.title
        },
        role: invite.role
      });
    } catch (error: any) {
      console.error('Accept invite error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to accept invitation'
      });
    }
  };

  /**
   * Send invite email - Concise and professional
   */
  private async sendInviteEmail(
    email: string,
    inviterName: string,
    projectName: string,
    role: string,
    inviteLink: string
  ): Promise<void> {
    const roleText = role === 'edit' ? 'Can edit' : 'Can view';
    
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${inviterName} invited you to ${projectName}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
          
          <!-- Logo/Header -->
          <tr>
            <td style="padding: 40px 40px 32px 40px;">
              <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #064E47 0%, #0D7C66 100%); border-radius: 8px; display: inline-block; text-align: center; line-height: 48px; margin-bottom: 24px;">
                <span style="color: #ffffff; font-size: 24px; font-weight: bold;">F</span>
              </div>
              <h1 style="color: #1a1a1a; margin: 0; font-size: 28px; font-weight: 600; line-height: 1.3;">
                You're invited to collaborate
              </h1>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 0 40px 32px 40px;">
              <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                <strong>${inviterName}</strong> has invited you to join <strong>"${projectName}"</strong> with <span style="color: #0D7C66; font-weight: 600;">${roleText}</span> access.
              </p>

              <!-- Project Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 20px;">
                    <div style="display: flex; align-items: center; margin-bottom: 12px;">
                      <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #064E47 0%, #0D7C66 100%); border-radius: 50%; display: inline-block; text-align: center; line-height: 40px; margin-right: 12px; vertical-align: middle;">
                        <span style="color: #ffffff; font-size: 18px; font-weight: 600;">${inviterName.charAt(0).toUpperCase()}</span>
                      </div>
                      <div style="display: inline-block; vertical-align: middle;">
                        <div style="color: #1a1a1a; font-size: 16px; font-weight: 600; margin-bottom: 2px;">${projectName}</div>
                        <div style="color: #6b7280; font-size: 14px;">From ${inviterName}</div>
                      </div>
                    </div>
                    <div style="background-color: #dbeafe; color: #1e40af; padding: 8px 14px; border-radius: 6px; display: inline-block; font-size: 13px; font-weight: 500;">
                      🔑 ${roleText}
                    </div>
                  </td>
                </tr>
              </table>

              <p style="color: #6b7280; font-size: 15px; line-height: 1.6; margin: 0 0 28px 0;">
                Click below to accept the invitation and start collaborating. This link expires in 7 days.
              </p>
            </td>
          </tr>

          <!-- Accept Button -->
          <tr>
            <td style="padding: 0 40px 40px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${inviteLink}" style="display: inline-block; background-color: #0D7C66; color: #ffffff; text-decoration: none; padding: 16px 56px; border-radius: 8px; font-size: 16px; font-weight: 600; text-align: center;">
                      Accept Invitation
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="color: #9ca3af; font-size: 13px; line-height: 1.5; margin: 20px 0 0 0; text-align: center;">
                Or copy this link: <br>
                <span style="color: #0D7C66; word-break: break-all;">${inviteLink}</span>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; background-color: #f9fafb; border-top: 1px solid #e5e7eb;">
              <p style="color: #9ca3af; font-size: 13px; line-height: 1.6; margin: 0; text-align: center;">
                If you didn't expect this invitation, you can safely ignore this email.
              </p>
              <p style="color: #d1d5db; font-size: 12px; margin: 12px 0 0 0; text-align: center;">
                © ${new Date().getFullYear()} Freelancer Task Manager
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    await this.emailService.sendEmail({
      to: email,
      subject: `${inviterName} invited you to join ${projectName}`,
      html
    });

    console.log('📧 Invite email sent to:', email);
  }
}
