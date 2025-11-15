"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamInvitationEmailService = void 0;
const email_service_1 = require("./email.service");
class TeamInvitationEmailService {
    /**
     * Send team collaboration invitation email
     */
    static async sendInvitationEmail(data) {
        try {
            const { inviteeName, inviterName, inviterEmail, inviteToken, inviteEmail } = data;
            // Create the invitation link
            const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
            const inviteLink = `${baseUrl}/invite/accept?token=${encodeURIComponent(inviteToken)}`;
            // Email subject
            const subject = `🤝 You're invited to collaborate on Freelancer Task by ${inviterName}`;
            // HTML email content
            const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Team Collaboration Invitation</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
              line-height: 1.6;
              color: #333;
              background-color: #f5f5f5;
              margin: 0;
              padding: 20px;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background: white;
              border-radius: 12px;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
              overflow: hidden;
            }
            .header {
              background: linear-gradient(135deg, #064E47 0%, #0a5751 100%);
              color: white;
              padding: 30px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
              font-weight: 600;
            }
            .content {
              padding: 40px 30px;
            }
            .greeting {
              font-size: 18px;
              margin-bottom: 20px;
              color: #2c3e50;
            }
            .message {
              font-size: 16px;
              margin-bottom: 25px;
              line-height: 1.7;
            }
            .inviter-info {
              background: #f8f9fa;
              border-left: 4px solid #064E47;
              padding: 15px 20px;
              margin: 20px 0;
              border-radius: 4px;
            }
            .cta-button {
              display: inline-block;
              background: linear-gradient(135deg, #064E47 0%, #0a5751 100%);
              color: white;
              text-decoration: none;
              padding: 15px 30px;
              border-radius: 8px;
              font-weight: 600;
              font-size: 16px;
              margin: 20px 0;
              box-shadow: 0 4px 12px rgba(6, 78, 71, 0.3);
              transition: transform 0.2s ease;
            }
            .cta-button:hover {
              transform: translateY(-2px);
            }
            .footer {
              background: #f8f9fa;
              padding: 20px 30px;
              text-align: center;
              font-size: 14px;
              color: #6c757d;
              border-top: 1px solid #e9ecef;
            }
            .features {
              margin: 25px 0;
            }
            .feature {
              display: flex;
              align-items: center;
              margin: 10px 0;
              font-size: 14px;
            }
            .feature-icon {
              width: 20px;
              height: 20px;
              background: #064E47;
              color: white;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-right: 12px;
              font-size: 12px;
            }
            .note {
              background: #fff3cd;
              border: 1px solid #ffeaa7;
              border-radius: 8px;
              padding: 15px;
              margin: 20px 0;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🤝 Team Collaboration Invitation</h1>
            </div>
            
            <div class="content">
              <div class="greeting">Hi ${inviteeName},</div>
              
              <div class="message">
                You have been invited to collaborate by <strong>${inviterName}</strong> (<a href="mailto:${inviterEmail}">${inviterEmail}</a>) on <strong>Freelancer Task</strong>.
              </div>
              
              <div class="inviter-info">
                <strong>Inviter Details:</strong><br>
                📧 ${inviterEmail}<br>
                👤 ${inviterName}
              </div>
              
              <div class="message">
                By accepting this invitation, you'll get access to:
              </div>
              
              <div class="features">
                <div class="feature">
                  <div class="feature-icon">📋</div>
                  <span>Shared projects and task management</span>
                </div>
                <div class="feature">
                  <div class="feature-icon">💬</div>
                  <span>Team chat and real-time collaboration</span>
                </div>
                <div class="feature">
                  <div class="feature-icon">📊</div>
                  <span>Progress tracking and reporting</span>
                </div>
                <div class="feature">
                  <div class="feature-icon">🔄</div>
                  <span>File sharing and version control</span>
                </div>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${inviteLink}" class="cta-button">
                  🚀 Join Collaboration
                </a>
              </div>
              
              <div class="note">
                <strong>📝 Note:</strong> If you don't have an account yet, clicking the button above will first take you to the account creation page. Once your account is created, you'll automatically get access to ${inviterName}'s projects and chat.
              </div>
              
              <div class="message" style="font-size: 14px; color: #6c757d;">
                This invitation link is valid for 7 days and will expire on ${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}.
              </div>
            </div>
            
            <div class="footer">
              <p>This email was sent by Freelancer Task. If you received this email in error, please ignore it.</p>
              <p style="margin: 5px 0;">© 2024 Freelancer Task. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `;
            // Plain text version
            const textContent = `
Hi ${inviteeName},

You have been invited to collaborate by ${inviterName} (${inviterEmail}) on Freelancer Task.

Inviter Details:
- Email: ${inviterEmail}
- Name: ${inviterName}

By accepting this invitation, you'll get access to:
- Shared projects and task management
- Team chat and real-time collaboration
- Progress tracking and reporting
- File sharing and version control

Please click the link below to join:
${inviteLink}

Note: If you don't have an account yet, clicking the link above will first take you to the account creation page. Once your account is created, you'll automatically get access to ${inviterName}'s projects and chat.

This invitation link is valid for 7 days and will expire on ${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}.

Best regards,
The Freelancer Task Team

---
This email was sent by Freelancer Task. If you received this email in error, please ignore it.
© 2024 Freelancer Task. All rights reserved.
      `;
            // Send the email
            const emailSent = await this.emailService.sendEmail({
                to: inviteEmail,
                subject: subject,
                html: htmlContent,
                text: textContent
            });
            if (emailSent) {
                console.log(`✅ Team invitation email sent successfully to ${inviteEmail}`);
                return true;
            }
            else {
                console.error(`❌ Failed to send team invitation email to ${inviteEmail}`);
                return false;
            }
        }
        catch (error) {
            console.error('Error sending team invitation email:', error);
            return false;
        }
    }
    /**
     * Send notification email when a member is removed from team
     */
    static async sendRemovalNotificationEmail(memberEmail, memberName, ownerName) {
        try {
            const subject = `Team Access Updated - Freelancer Task`;
            const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Team Access Updated</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
              line-height: 1.6;
              color: #333;
              background-color: #f5f5f5;
              margin: 0;
              padding: 20px;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background: white;
              border-radius: 12px;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
              overflow: hidden;
            }
            .header {
              background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
              color: white;
              padding: 30px;
              text-align: center;
            }
            .content {
              padding: 40px 30px;
            }
            .footer {
              background: #f8f9fa;
              padding: 20px 30px;
              text-align: center;
              font-size: 14px;
              color: #6c757d;
              border-top: 1px solid #e9ecef;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔒 Team Access Updated</h1>
            </div>
            
            <div class="content">
              <p>Hi ${memberName},</p>
              
              <p>Your access to ${ownerName}'s team collaboration on Freelancer Task has been updated.</p>
              
              <p>You no longer have access to:</p>
              <ul>
                <li>Shared projects and tasks</li>
                <li>Team chat conversations</li>
                <li>Collaborative workspace</li>
              </ul>
              
              <p>If you believe this was done in error, please contact ${ownerName} directly.</p>
              
              <p>Thank you for your collaboration.</p>
            </div>
            
            <div class="footer">
              <p>This email was sent by Freelancer Task.</p>
              <p>© 2024 Freelancer Task. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `;
            const textContent = `
Hi ${memberName},

Your access to ${ownerName}'s team collaboration on Freelancer Task has been updated.

You no longer have access to:
- Shared projects and tasks
- Team chat conversations  
- Collaborative workspace

If you believe this was done in error, please contact ${ownerName} directly.

Thank you for your collaboration.

---
This email was sent by Freelancer Task.
© 2024 Freelancer Task. All rights reserved.
      `;
            const emailSent = await this.emailService.sendEmail({
                to: memberEmail,
                subject: subject,
                html: htmlContent,
                text: textContent
            });
            if (emailSent) {
                console.log(`✅ Team removal notification sent to ${memberEmail}`);
                return true;
            }
            else {
                console.error(`❌ Failed to send removal notification to ${memberEmail}`);
                return false;
            }
        }
        catch (error) {
            console.error('Error sending removal notification email:', error);
            return false;
        }
    }
}
exports.TeamInvitationEmailService = TeamInvitationEmailService;
TeamInvitationEmailService.emailService = new email_service_1.EmailService();
