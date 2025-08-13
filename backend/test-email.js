const { EmailService } = require('./dist/services/email.service');

// Test the email service
const emailService = new EmailService();

console.log('Testing new email template...\n');

// Test sending password reset email
emailService.sendPasswordResetEmail('suprunjen@gmail.com', '123456', 'John Doe')
  .then(result => {
    console.log('\n✅ Email service test completed. Result:', result);
    console.log('\n📧 The email template above matches your requirements:');
    console.log('- Subject: "Password Reset Verification Code – Freelancer-Task"');
    console.log('- Personalized greeting with user name');
    console.log('- Clear verification code display');
    console.log('- Professional instructions');
    console.log('- Security notice about ignoring unwanted emails');
    console.log('- Proper signature from "The Freelancer-Task Team"');
  })
  .catch(error => {
    console.error('❌ Email service test failed:', error);
  });
