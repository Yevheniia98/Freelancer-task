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
        data: {
          projectId: project.id,
          projectName: project.title,
          role: invite.role
        }
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
   * Send invite email
   */
  private async sendInviteEmail(
    email: string,
    inviterName: string,
    projectName: string,
    role: string,
    inviteLink: string
  ): Promise<void> {
    const roleText = role === 'edit' ? 'edit' : 'view';
    
    const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
    .button { display: inline-block; background: #667eea; color: white; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
    .role-badge { display: inline-block; background: #10b981; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; text-transform: uppercase; }
    .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">🎉 You're Invited!</h1>
    </div>
    <div class="content">
      <p><strong>${inviterName}</strong> has invited you to collaborate on:</p>
      <h2 style="color: #667eea; margin: 10px 0;">${projectName}</h2>
      <p>You'll have <span class="role-badge">${roleText}</span> access to this project.</p>
      
      <p><strong>What you can do:</strong></p>
      <ul>
        ${role === 'edit' ? '<li>✅ View and edit project</li><li>✅ Add comments and files</li><li>✅ Collaborate with team</li>' : '<li>✅ View project</li><li>✅ Add comments</li><li>❌ Cannot edit</li>'}
      </ul>
      
      <div style="text-align: center;">
        <a href="${inviteLink}" class="button">Accept Invitation</a>
      </div>
      
      <p style="font-size: 14px; color: #6b7280; margin-top: 20px;">
        This invitation expires in 7 days. If you don't have an account, you'll be asked to create one.
      </p>
    </div>
    <div class="footer">
      <p>Freelancer Task Manager • Professional Project Collaboration</p>
    </div>
  </div>
</body>
</html>
    `;

    await this.emailService.sendEmail({
      to: email,
      subject: `${inviterName} invited you to "${projectName}"`,
      html
    });

    console.log('📧 Invite email sent to:', email);
  }
}
