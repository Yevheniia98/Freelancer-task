require('dotenv').config();
const { EmailService } = require('./dist/services/email.service');

console.log('🧪 Testing Email Service Configuration...\n');

// Create email service instance
const emailService = new EmailService();

console.log('📧 Current Configuration:');
console.log('SMTP_USER:', process.env.SMTP_USER || 'Not set');
console.log('SMTP_HOST:', process.env.SMTP_HOST || 'Not set');
console.log('SMTP_PORT:', process.env.SMTP_PORT || 'Not set');

console.log('\n' + '='.repeat(50));

if (process.env.SMTP_USER && process.env.SMTP_USER !== 'your-email@gmail.com') {
  console.log('🎯 REAL EMAIL MODE DETECTED');
  console.log('✅ Will send actual emails to your inbox');
  console.log('📧 Configure your email and test the forgot password demo!');
} else {
  console.log('🔧 MOCK EMAIL MODE (Development)');
  console.log('📝 Will log verification codes to console');
  console.log('💡 To enable real emails, update your .env file with Gmail credentials');
}

console.log('='.repeat(50));

// Test sending an email
console.log('\n🧪 Testing email sending...\n');

emailService.sendPasswordResetEmail('suprunjen@gmail.com', '123456', 'John Doe')
  .then(result => {
    console.log('\n✅ Email test completed successfully!');
    console.log('📋 Next steps:');
    
    if (process.env.SMTP_USER && process.env.SMTP_USER !== 'your-email@gmail.com') {
      console.log('1. Check your email inbox for the password reset email');
      console.log('2. Test the forgot password demo at: http://localhost:8080/forgot-password-demo.html');
      console.log('3. Enter your real email address to receive verification codes');
    } else {
      console.log('1. Update .env file with your Gmail credentials (see EMAIL_SETUP_GUIDE.md)');
      console.log('2. Rebuild: npm run build');  
      console.log('3. Test again to receive real emails');
    }
  })
  .catch(error => {
    console.error('❌ Email test failed:', error.message);
  });
