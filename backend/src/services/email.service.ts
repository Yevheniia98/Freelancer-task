import nodemailer from 'nodemailer';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export class EmailService {
  private transporter: any;

  constructor() {
    // Check if real email credentials are provided
    if (process.env.SMTP_USER && process.env.SMTP_PASS && 
        process.env.SMTP_USER !== 'your-email@gmail.com' && 
        process.env.SMTP_PASS !== 'your-app-password') {
      
      // Use real email service
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
        tls: {
          rejectUnauthorized: false
        }
      });
      
      console.log('📧 Real email service initialized with:', process.env.SMTP_USER);
      
    } else {
      // Use mock email service for development
      this.transporter = {
        sendMail: async (options: any) => {
          console.log('\n=== 📧 MOCK EMAIL SENT (Development Mode) ===');
          console.log('To:', options.to);
          console.log('Subject:', options.subject);
          
          // Extract verification code from HTML
          const codeMatch = options.html.match(/class="code">(\d{6})</);
          const verificationCode = codeMatch ? codeMatch[1] : 'Code not found';
          
          console.log('🔑 VERIFICATION CODE:', verificationCode);
          console.log('⏰ Expires in: 15 minutes');
          console.log('💡 To receive real emails, configure SMTP credentials in .env');
          console.log('=============================\n');
          
          return { messageId: 'mock-' + Date.now() };
        }
      };
      
      console.log('📧 Mock email service initialized (Development Mode)');
    }
  }

  public async sendPasswordResetEmail(email: string, verificationCode: string, userName?: string): Promise<boolean> {
    try {
      const emailOptions: EmailOptions = {
        to: email,
        subject: 'Password Reset Verification Code – Freelancer-Task',
        html: this.getPasswordResetEmailTemplate(verificationCode, userName || 'User'),
        text: this.getPasswordResetEmailText(verificationCode, userName || 'User')
      };

      const info = await this.transporter.sendMail(emailOptions);
      
      // Log success differently for real vs mock emails
      if (process.env.SMTP_USER && process.env.SMTP_USER !== 'your-email@gmail.com') {
        console.log('✅ Real email sent successfully to:', email);
        console.log('📧 Message ID:', info.messageId);
      } else {
        console.log('✅ Mock email logged successfully');
        console.log('📧 Use the verification code from the log above');
      }

      return true;
    } catch (error) {
      console.error('❌ Failed to send password reset email:', error);
      
      // If real email fails, provide helpful error message
      if (process.env.SMTP_USER && process.env.SMTP_USER !== 'your-email@gmail.com') {
        console.error('💡 Check your email credentials in .env file');
        console.error('💡 Make sure you\'re using an App Password for Gmail');
      }
      
      return false;
    }
  }

  private getPasswordResetEmailTemplate(verificationCode: string, userName: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset Verification Code – Freelancer-Task</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .verification-code { 
            background: #f4f4f4; 
            padding: 20px; 
            text-align: center; 
            margin: 20px 0; 
            border-radius: 5px; 
          }
          .code { 
            font-size: 24px; 
            font-weight: bold; 
            color: #007bff; 
            letter-spacing: 2px; 
            margin: 10px 0; 
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Hello ${userName},</h2>
          
          <p>We received a request to reset your password for your Freelancer-Task account.</p>
          
          <div class="verification-code">
            <p><strong>Your verification code is:</strong></p>
            <div class="code">${verificationCode}</div>
          </div>
          
          <p>Please enter this code on the website to verify your identity.</p>
          
          <p>If you requested to reset your password, continue to follow the instructions on the site.<br>
          If you did not make this request, you can safely ignore this email — your account will remain secure.</p>
          
          <p>Thank you,<br>
          The Freelancer-Task Team</p>
        </div>
      </body>
      </html>
    `;
  }

  private getPasswordResetEmailText(verificationCode: string, userName: string): string {
    return `
Subject: Password Reset Verification Code – Freelancer-Task

Hello ${userName},

We received a request to reset your password for your Freelancer-Task account.

Your verification code is:
${verificationCode}

Please enter this code on the website to verify your identity.

If you requested to reset your password, continue to follow the instructions on the site.
If you did not make this request, you can safely ignore this email — your account will remain secure.

Thank you,
The Freelancer-Task Team
    `;
  }

  public async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      const info = await this.transporter.sendMail(options);
      console.log('✅ Email sent:', info.messageId);
      return true;
    } catch (error) {
      console.error('❌ Failed to send email:', error);
      return false;
    }
  }
}