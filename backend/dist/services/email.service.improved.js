"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
class EmailService {
    constructor() {
        this.serviceEmail = process.env.SMTP_USER || 'freelancertask.noreply@gmail.com';
        this.isProductionMode = this.isValidEmailConfig();
        if (this.isProductionMode) {
            this.initializeProductionEmail();
        }
        else {
            this.initializeMockEmail();
        }
    }
    isValidEmailConfig() {
        const user = process.env.SMTP_USER;
        const pass = process.env.SMTP_PASS;
        // Check if credentials exist and are not placeholder values
        const isValid = !!(user &&
            pass &&
            user !== 'your-email@gmail.com' &&
            user !== 'freelancertask.noreply@gmail.com' && // Example placeholder
            pass !== 'your-app-password' &&
            pass !== 'your-business-gmail-app-password' &&
            pass !== 'your-gmail-app-password' &&
            user.includes('@') &&
            pass.length > 10);
        return isValid;
    }
    initializeProductionEmail() {
        this.transporter = nodemailer_1.default.createTransport({
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
        console.log('📧 Production email service initialized');
        console.log('📤 Service email:', this.serviceEmail);
        console.log('🎯 Ready to send emails to customers');
    }
    initializeMockEmail() {
        this.transporter = {
            sendMail: async (options) => {
                console.log('\n=== 📧 MOCK EMAIL SENT (Development Mode) ===');
                console.log('From:', this.serviceEmail, '(Service Account)');
                console.log('To:', options.to, '(Customer Email)');
                console.log('Subject:', options.subject);
                // Extract verification code from HTML
                const codeMatch = options.html.match(/class="verification-code">(\d{6})</);
                const verificationCode = codeMatch ? codeMatch[1] : 'Code not found in HTML';
                console.log('');
                console.log('🔑 VERIFICATION CODE:', verificationCode);
                console.log('⏰ Expires in: 15 minutes');
                console.log('');
                console.log('📋 HOW TO TEST:');
                console.log('1. Copy the verification code above');
                console.log('2. Go to your frontend reset password form');
                console.log('3. Enter the code to complete password reset');
                console.log('');
                console.log('🚀 FOR PRODUCTION:');
                console.log('- Configure service email credentials in .env');
                console.log('- Service sends FROM: your-service@company.com');
                console.log('- Service sends TO: customer email addresses');
                console.log('- Customers receive real emails in their inbox');
                console.log('=============================\n');
                return { messageId: 'mock-' + Date.now() };
            }
        };
        console.log('📧 Mock email service initialized (Development Mode)');
        console.log('💡 Configure service email credentials for production');
    }
    async sendPasswordResetEmail(email, verificationCode, userName) {
        try {
            const emailOptions = {
                to: email,
                subject: 'Password Reset Verification Code – Freelancer Task',
                html: this.getPasswordResetEmailTemplate(verificationCode, userName || 'User'),
                text: this.getPasswordResetEmailText(verificationCode, userName || 'User')
            };
            const info = await this.transporter.sendMail({
                from: `"Freelancer Task" <${this.serviceEmail}>`,
                ...emailOptions
            });
            if (this.isProductionMode) {
                console.log('✅ Password reset email sent successfully');
                console.log('📤 From:', this.serviceEmail);
                console.log('📥 To:', email);
                console.log('📧 Message ID:', info.messageId);
            }
            else {
                console.log('✅ Mock email logged successfully');
                console.log('📧 Use the verification code from the log above');
            }
            return true;
        }
        catch (error) {
            console.error('❌ Failed to send password reset email:', error);
            if (this.isProductionMode) {
                console.error('💡 Check your email service credentials in .env file');
                console.error('💡 For Gmail: Make sure you\'re using an App Password');
                console.error('💡 For other services: Verify SMTP settings');
            }
            return false;
        }
    }
    getPasswordResetEmailTemplate(verificationCode, userName) {
        return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset Verification Code</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .verification-box { 
            background: #f8f9fa; 
            padding: 25px; 
            text-align: center; 
            margin: 25px 0; 
            border-radius: 8px; 
            border-left: 4px solid #007bff;
          }
          .verification-code { 
            font-size: 32px; 
            font-weight: bold; 
            color: #007bff; 
            letter-spacing: 4px; 
            margin: 15px 0; 
            padding: 10px;
            background: white;
            border-radius: 4px;
            display: inline-block;
          }
          .footer { margin-top: 30px; font-size: 14px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Password Reset Request</h1>
          </div>
          
          <p>Hello <strong>${userName}</strong>,</p>
          
          <p>We received a request to reset your password for your Freelancer Task account.</p>
          
          <div class="verification-box">
            <h3>Your Verification Code:</h3>
            <div class="verification-code">${verificationCode}</div>
            <p><small>This code expires in 15 minutes</small></p>
          </div>
          
          <p>Please enter this code on the password reset page to continue.</p>
          
          <p><strong>Security Notice:</strong><br>
          If you did not request this password reset, please ignore this email. Your account remains secure.</p>
          
          <div class="footer">
            <p>Best regards,<br>
            <strong>The Freelancer Task Team</strong></p>
            
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
            <p><small>This is an automated message. Please do not reply to this email.</small></p>
          </div>
        </div>
      </body>
      </html>
    `;
    }
    getPasswordResetEmailText(verificationCode, userName) {
        return `
Password Reset Verification Code - Freelancer Task

Hello ${userName},

We received a request to reset your password for your Freelancer Task account.

Your verification code is: ${verificationCode}

This code expires in 15 minutes.

Please enter this code on the password reset page to continue.

Security Notice: If you did not request this password reset, please ignore this email. Your account remains secure.

Best regards,
The Freelancer Task Team

---
This is an automated message. Please do not reply to this email.
    `;
    }
    async sendEmail(options) {
        try {
            const info = await this.transporter.sendMail({
                from: `"Freelancer Task" <${this.serviceEmail}>`,
                ...options
            });
            console.log('✅ Email sent successfully:', info.messageId);
            return true;
        }
        catch (error) {
            console.error('❌ Failed to send email:', error);
            return false;
        }
    }
}
exports.EmailService = EmailService;
