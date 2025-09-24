const nodemailer = require('nodemailer');
require('dotenv').config();

// Test email function
async function testEmail() {
  try {
    console.log('🧪 Testing email functionality...');
    
    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    // Verify transporter
    await transporter.verify();
    console.log('✅ SMTP connection verified');

    // Send test email
    const mailOptions = {
      from: `"Freelancer Task Manager" <${process.env.SMTP_USER}>`,
      to: 'suprun.jen@gmail.com',
      subject: '🚀 Team Invitation - Freelancer Task Manager',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; border-radius: 15px;">
          <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
            <h1 style="color: #333; text-align: center; margin-bottom: 30px;">🎉 You're Invited to Join Our Team!</h1>
            <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
              Hello! You have been invited to join our team on the Freelancer Task Manager platform.
            </p>
            <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
              Test invitation from freelancer task manager - this email is working! 🎊
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="http://localhost:8080/my-team" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block; box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);">
                🚀 Join Team Now
              </a>
            </div>
            <p style="color: #999; font-size: 14px; text-align: center; margin-top: 30px;">
              Freelancer Task Manager - Streamline your team collaboration
            </p>
          </div>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully!');
    console.log('📧 Message ID:', result.messageId);
    console.log('📬 Email sent to: suprun.jen@gmail.com');
    
  } catch (error) {
    console.error('❌ Email test failed:', error.message);
  }
}

testEmail();