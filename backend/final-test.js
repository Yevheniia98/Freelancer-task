const { EmailService } = require('./dist/services/email.service');

// Test the email service with the exact specification
const emailService = new EmailService();

// Final comprehensive test for email functionality
const axios = require('axios');

async function finalTest() {
  console.log('🎯 FINAL EMAIL TEST');
  console.log('===================');
  
  try {
    // Step 1: Register user
    console.log('Step 1: Registering user vickyjosh94@gmail.com...');
    try {
      const regResponse = await axios.post('http://localhost:3002/api/auth/register', {
        fullName: 'Vicky Josh',
        email: 'vickyjosh94@gmail.com',
        password: 'Test123456!',
        confirmPassword: 'Test123456!'
      });
      console.log('✅ User registered successfully');
    } catch (error) {
      if (error.response?.data?.message?.includes('already registered')) {
        console.log('✅ User already exists - perfect!');
      } else {
        console.log('ℹ️ Registration response:', error.response?.data?.message || error.message);
      }
    }
    
    // Step 2: Request password reset
    console.log('Step 2: Requesting password reset...');
    const forgotResponse = await axios.post('http://localhost:3002/api/auth/forgot-password', {
      email: 'vickyjosh94@gmail.com'
    });
    
    console.log('✅ Password reset response:', JSON.stringify(forgotResponse.data, null, 2));
    
    if (forgotResponse.data.success) {
      console.log('🎉 SUCCESS! Password reset email has been sent!');
      console.log('📧 EMAIL DETAILS:');
      console.log('   From: freelancetasker0@gmail.com');
      console.log('   To: vickyjosh94@gmail.com');
      console.log('   Subject: Password Reset Verification Code – Freelancer-Task');
      console.log('🔍 WHERE TO CHECK:');
      console.log('   1. Gmail inbox for vickyjosh94@gmail.com');
      console.log('   2. Gmail spam/junk folder');
      console.log('   3. Gmail promotions tab');
      console.log('⏰ TIMING:');
      console.log('   - Email should arrive within 1-2 minutes');
      console.log('   - Verification code expires in 15 minutes');
      console.log('💡 IF YOU DONT SEE THE EMAIL:');
      console.log('   - Wait 2-3 minutes');
      console.log('   - Check ALL Gmail folders and tabs');
      console.log('   - Search Gmail for "freelancetasker0"');
      console.log('   - Search Gmail for "Password Reset"');
    } else {
      console.log('❌ Password reset failed:', forgotResponse.data);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

finalTest();
