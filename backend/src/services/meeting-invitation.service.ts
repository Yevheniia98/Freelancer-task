import { EmailService, EmailOptions } from './email.service';

export interface MeetingInvitationData {
  recipientEmail: string;
  recipientName?: string; // Optional, if known
  organizerName: string;
  organizerEmail: string;
  meetingTitle: string;
  meetingDescription?: string;
  meetingDate: Date;
  meetingStartTime: string;
  meetingEndTime: string;
  meetingLink?: string;
  platform?: string; // zoom, meet, custom
}

export class MeetingInvitationService {
  private emailService: EmailService;

  constructor() {
    this.emailService = new EmailService();
  }

  /**
   * Send meeting invitation email to a participant
   */
  async sendMeetingInvitation(invitationData: MeetingInvitationData): Promise<boolean> {
    try {
      const emailOptions = this.createInvitationEmail(invitationData);
      return await this.emailService.sendEmail(emailOptions);
    } catch (error) {
      console.error('❌ Failed to send meeting invitation:', error);
      return false;
    }
  }

  /**
   * Send meeting invitations to multiple participants
   */
  async sendMeetingInvitations(
    participants: Array<{ email: string; name?: string }>,
    meetingData: Omit<MeetingInvitationData, 'recipientEmail' | 'recipientName'>
  ): Promise<{ success: string[]; failed: string[] }> {
    const results: { success: string[]; failed: string[] } = { 
      success: [], 
      failed: [] 
    };

    for (const participant of participants) {
      const invitationData: MeetingInvitationData = {
        ...meetingData,
        recipientEmail: participant.email,
        recipientName: participant.name
      };

      const sent = await this.sendMeetingInvitation(invitationData);
      if (sent) {
        results.success.push(participant.email);
      } else {
        results.failed.push(participant.email);
      }
    }

    return results;
  }

  /**
   * Create email options for meeting invitation
   */
  private createInvitationEmail(data: MeetingInvitationData): EmailOptions {
    const subject = `Meeting Invitation: ${data.meetingTitle}`;
    const html = this.generateInvitationHTML(data);
    const text = this.generateInvitationText(data);

    return {
      to: data.recipientEmail,
      subject,
      html,
      text
    };
  }

  /**
   * Generate HTML email template for meeting invitation
   */
  private generateInvitationHTML(data: MeetingInvitationData): string {
    const greeting = data.recipientName ? 
      `Dear ${data.recipientName},` : 
      `Hi! You were invited by ${data.organizerEmail} to this meeting.`;

    const formattedDate = this.formatMeetingDate(data.meetingDate);
    const timeRange = `${data.meetingStartTime} - ${data.meetingEndTime}`;
    
    const joinButtonHtml = data.meetingLink ? 
      `<div style="text-align: center; margin: 30px 0;">
        <a href="${data.meetingLink}" 
           style="background-color: #4CAF50; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 16px;">
          Join ${data.platform ? this.getPlatformName(data.platform) : 'Meeting'}
        </a>
      </div>` : '';

    const meetingLinkSection = data.meetingLink ? 
      `<div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #495057; margin-top: 0;">Meeting Link:</h3>
        <p style="margin: 0;"><a href="${data.meetingLink}" style="color: #007bff; word-break: break-all;">${data.meetingLink}</a></p>
      </div>` : '';

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Meeting Invitation</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">🎯 Meeting Invitation</h1>
        </div>
        
        <div style="background-color: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
            <p style="font-size: 18px; margin-bottom: 20px;">${greeting}</p>
            
            <p style="font-size: 16px;">You're invited to join the following meeting:</p>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h2 style="color: #495057; margin-top: 0; margin-bottom: 15px;">📅 ${data.meetingTitle}</h2>
                
                ${data.meetingDescription ? `
                <div style="margin-bottom: 15px;">
                    <h3 style="color: #6c757d; font-size: 16px; margin-bottom: 8px;">Description:</h3>
                    <p style="margin: 0; color: #495057; font-style: italic;">${data.meetingDescription}</p>
                </div>
                ` : ''}
                
                <div style="margin-bottom: 15px;">
                    <h3 style="color: #6c757d; font-size: 16px; margin-bottom: 8px;">📅 Date & Time:</h3>
                    <p style="margin: 0; color: #495057; font-weight: bold;">${formattedDate}</p>
                    <p style="margin: 5px 0 0 0; color: #495057; font-weight: bold;">⏰ ${timeRange}</p>
                </div>
                
                <div style="margin-bottom: 15px;">
                    <h3 style="color: #6c757d; font-size: 16px; margin-bottom: 8px;">👤 Organizer:</h3>
                    <p style="margin: 0; color: #495057;">${data.organizerName} (${data.organizerEmail})</p>
                </div>
            </div>
            
            ${meetingLinkSection}
            
            ${joinButtonHtml}
            
            <div style="background-color: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0; font-size: 14px; color: #1565c0;">
                    💡 <strong>Tip:</strong> Add this meeting to your calendar to receive reminders before it starts.
                </p>
            </div>
            
            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
            
            <p style="font-size: 14px; color: #666; text-align: center; margin: 0;">
                This invitation was sent from the Freelancer Task Manager<br>
                If you have any questions, please contact the organizer directly.
            </p>
        </div>
    </body>
    </html>
    `;
  }

  /**
   * Generate plain text version of the invitation
   */
  private generateInvitationText(data: MeetingInvitationData): string {
    const greeting = data.recipientName ? 
      `Dear ${data.recipientName},` : 
      `Hi! You were invited by ${data.organizerEmail} to this meeting.`;

    const formattedDate = this.formatMeetingDate(data.meetingDate);
    const timeRange = `${data.meetingStartTime} - ${data.meetingEndTime}`;
    
    let text = `
${greeting}

You're invited to join the following meeting:

MEETING: ${data.meetingTitle}

${data.meetingDescription ? `DESCRIPTION: ${data.meetingDescription}\n\n` : ''}

DATE & TIME: ${formattedDate}
TIME: ${timeRange}

ORGANIZER: ${data.organizerName} (${data.organizerEmail})
`;

    if (data.meetingLink) {
      text += `\nJOIN MEETING: ${data.meetingLink}`;
    }

    text += `\n\nTip: Add this meeting to your calendar to receive reminders before it starts.

---
This invitation was sent from the Freelancer Task Manager
If you have any questions, please contact the organizer directly.
`;

    return text;
  }

  /**
   * Format meeting date for display
   */
  private formatMeetingDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    
    return date.toLocaleDateString('en-US', options);
  }

  /**
   * Get platform display name
   */
  private getPlatformName(platform: string): string {
    switch (platform.toLowerCase()) {
      case 'zoom':
        return 'Zoom Meeting';
      case 'meet':
        return 'Google Meet';
      case 'teams':
        return 'Microsoft Teams';
      default:
        return 'Meeting';
    }
  }
}
