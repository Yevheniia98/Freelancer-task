import { EmailService } from './email.service';
import { User } from '../models/user.model';
import jwt from 'jsonwebtoken';

interface ProjectInvitation {
  projectId: string;
  projectName: string;
  inviterName: string;
  inviterEmail: string;
  inviteeEmail: string;
  permission: 'view_only' | 'view_and_edit';
}

export class ProjectInvitationService {
  private static instance: ProjectInvitationService;
  private emailService: EmailService;

  private constructor() {
    this.emailService = new EmailService();
  }

  public static getInstance(): ProjectInvitationService {
    if (!ProjectInvitationService.instance) {
      ProjectInvitationService.instance = new ProjectInvitationService();
    }
    return ProjectInvitationService.instance;
  }

  /**
   * Send project invitation email
   */
  public async sendInvitation(invitation: ProjectInvitation): Promise<boolean> {
    try {
      console.log('📧 Sending project invitation to:', invitation.inviteeEmail);
      console.log('Project:', invitation.projectName);
      console.log('Inviter:', invitation.inviterName);
      console.log('Permission:', invitation.permission);
      
      // Generate invitation token (valid for 7 days)
      const invitationToken = jwt.sign(
        {
          projectId: invitation.projectId,
          email: invitation.inviteeEmail,
          permission: invitation.permission,
          type: 'project_invitation'
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );

      const invitationLink = `${process.env.FRONTEND_URL || 'http://localhost:3030'}/project-invitation?token=${invitationToken}`;
      
      console.log('Invitation link generated:', invitationLink);

      const emailHtml = this.generateInvitationEmail(
        invitation.projectName,
        invitation.inviterName,
        invitation.permission,
        invitationLink
      );

      const emailSent = await this.emailService.sendEmail({
        to: invitation.inviteeEmail,
        subject: `You've been invited to collaborate on "${invitation.projectName}"`,
        html: emailHtml
      });

      if (emailSent) {
        console.log('✅ Project invitation email sent successfully to:', invitation.inviteeEmail);
      } else {
        console.log('❌ Failed to send project invitation email to:', invitation.inviteeEmail);
      }

      return emailSent;
    } catch (error) {
      console.error('❌ Error sending project invitation:', error);
      return false;
    }
  }

  /**
   * Verify invitation token and get project details
   */
  public async verifyInvitation(token: string): Promise<any> {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
      
      if (decoded.type !== 'project_invitation') {
        throw new Error('Invalid invitation token');
      }

      return {
        projectId: decoded.projectId,
        email: decoded.email,
        permission: decoded.permission
      };
    } catch (error) {
      console.error('Error verifying invitation:', error);
      throw new Error('Invalid or expired invitation token');
    }
  }

  /**
   * Accept project invitation
   */
  public async acceptInvitation(token: string, userId: string): Promise<any> {
    try {
      const invitation = await this.verifyInvitation(token);
      
      // Verify user email matches invitation email
      const user = await User.findById(userId);
      if (!user || user.email !== invitation.email) {
        throw new Error('User email does not match invitation');
      }

      const userName = user.firstName && user.lastName 
        ? `${user.firstName} ${user.lastName}`
        : user.email.split('@')[0];

      return {
        projectId: invitation.projectId,
        userId: userId,
        permission: invitation.permission,
        email: invitation.email,
        name: userName
      };
    } catch (error) {
      console.error('Error accepting invitation:', error);
      throw error;
    }
  }

  /**
   * Generate invitation email HTML
   */
  private generateInvitationEmail(
    projectName: string,
    inviterName: string,
    permission: string,
    invitationLink: string
  ): string {
    const permissionText = permission === 'view_and_edit' 
      ? 'view and edit' 
      : 'view only';

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Project Invitation</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #064E47 0%, #0D7C66 50%, #41B3A2 100%); padding: 40px 30px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">
                      🎉 Project Invitation
                    </h1>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                      Hi there!
                    </p>
                    
                    <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                      <strong>${inviterName}</strong> has invited you to collaborate on the project:
                    </p>

                    <div style="background-color: #f8f9fa; border-left: 4px solid #0D7C66; padding: 20px; margin: 20px 0; border-radius: 4px;">
                      <h2 style="color: #064E47; margin: 0 0 10px 0; font-size: 20px;">
                        ${projectName}
                      </h2>
                      <p style="color: #666666; margin: 0; font-size: 14px;">
                        <strong>Permission:</strong> ${permissionText}
                      </p>
                    </div>

                    <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 20px 0;">
                      Click the button below to accept the invitation and start collaborating:
                    </p>

                    <div style="text-align: center; margin: 30px 0;">
                      <a href="${invitationLink}" style="display: inline-block; background: linear-gradient(135deg, #064E47 0%, #0D7C66 100%); color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 6px; font-size: 16px; font-weight: bold;">
                        Accept Invitation
                      </a>
                    </div>

                    <p style="color: #666666; font-size: 14px; line-height: 1.6; margin: 20px 0;">
                      Or copy and paste this link into your browser:
                    </p>
                    <p style="color: #0D7C66; font-size: 13px; word-break: break-all; background-color: #f8f9fa; padding: 10px; border-radius: 4px;">
                      ${invitationLink}
                    </p>

                    <p style="color: #999999; font-size: 13px; line-height: 1.6; margin: 30px 0 0 0;">
                      This invitation will expire in 7 days. If you didn't expect this invitation, you can safely ignore this email.
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #e0e0e0;">
                    <p style="color: #999999; font-size: 12px; margin: 0;">
                      © ${new Date().getFullYear()} Freelancer Task Manager. All rights reserved.
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
  }
}
