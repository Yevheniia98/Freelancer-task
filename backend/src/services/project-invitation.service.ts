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
        subject: `${invitation.inviterName} has invited you to ${invitation.projectName}`,
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
   * Generate invitation email HTML - Figma style
   */
  private generateInvitationEmail(
    projectName: string,
    inviterName: string,
    permission: string,
    invitationLink: string
  ): string {
    const permissionText = permission === 'view_and_edit' || permission === 'edit'
      ? 'Can edit' 
      : 'Can view';

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${inviterName} has invited you to ${projectName}</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif; background-color: #f5f5f5;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
                
                <!-- Logo/Header -->
                <tr>
                  <td style="padding: 32px 40px 24px 40px;">
                    <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #064E47 0%, #0D7C66 100%); border-radius: 8px; display: inline-block; text-align: center; line-height: 48px;">
                      <span style="color: #ffffff; font-size: 24px; font-weight: bold;">F</span>
                    </div>
                  </td>
                </tr>

                <!-- Main Title -->
                <tr>
                  <td style="padding: 0 40px 32px 40px;">
                    <h1 style="color: #1a1a1a; margin: 0; font-size: 28px; font-weight: 600; line-height: 1.3;">
                      ${inviterName} has invited you to "${projectName}"
                    </h1>
                  </td>
                </tr>

                <!-- Project Preview Card -->
                <tr>
                  <td style="padding: 0 40px 32px 40px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                      <tr>
                        <td style="padding: 24px;">
                          <!-- Project Header -->
                          <div style="margin-bottom: 16px;">
                            <h2 style="color: #1a1a1a; margin: 0 0 8px 0; font-size: 20px; font-weight: 600;">
                              ${projectName}
                            </h2>
                            <div style="display: flex; align-items: center;">
                              <div style="width: 32px; height: 32px; background: linear-gradient(135deg, #064E47 0%, #0D7C66 100%); border-radius: 50%; display: inline-block; text-align: center; line-height: 32px; vertical-align: middle;">
                                <span style="color: #ffffff; font-size: 14px; font-weight: 600;">${inviterName.charAt(0).toUpperCase()}</span>
                              </div>
                              <span style="color: #6b7280; font-size: 14px; margin-left: 8px; vertical-align: middle;">
                                Invited by <strong>${inviterName}</strong>
                              </span>
                            </div>
                          </div>

                          <!-- Preview Image Placeholder -->
                          <div style="background: linear-gradient(135deg, #e0f2fe 0%, #dbeafe 50%, #e0e7ff 100%); height: 180px; border-radius: 6px; display: flex; align-items: center; justify-content: center; margin: 16px 0;">
                            <div style="text-align: center;">
                              <div style="font-size: 48px; margin-bottom: 8px;">📋</div>
                              <div style="color: #64748b; font-size: 14px; font-weight: 500;">Project Preview</div>
                            </div>
                          </div>

                          <!-- Permission Badge -->
                          <div style="margin-top: 16px;">
                            <span style="display: inline-block; background-color: #dbeafe; color: #1e40af; padding: 6px 12px; border-radius: 16px; font-size: 13px; font-weight: 500;">
                              ${permissionText}
                            </span>
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Accept Button -->
                <tr>
                  <td style="padding: 0 40px 40px 40px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center">
                          <a href="${invitationLink}" style="display: inline-block; background-color: #1a1a1a; color: #ffffff; text-decoration: none; padding: 14px 48px; border-radius: 8px; font-size: 16px; font-weight: 600; text-align: center; min-width: 200px;">
                            Accept
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Alternative Link -->
                <tr>
                  <td style="padding: 0 40px 32px 40px;">
                    <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 0; text-align: center;">
                      Or copy and paste this link:
                    </p>
                    <p style="color: #0D7C66; font-size: 13px; word-break: break-all; background-color: #f9fafb; padding: 12px; border-radius: 6px; margin: 8px 0 0 0; text-align: center; border: 1px solid #e5e7eb;">
                      ${invitationLink}
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding: 24px 40px; background-color: #f9fafb; border-top: 1px solid #e5e7eb;">
                    <p style="color: #9ca3af; font-size: 13px; line-height: 1.6; margin: 0; text-align: center;">
                      This invitation expires in 7 days. If you didn't expect this, you can safely ignore this email.
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
  }
}
