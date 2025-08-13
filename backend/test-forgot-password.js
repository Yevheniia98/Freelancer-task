const axios = require('axios');

async function testForgotPassword() {
  try {
    console.log('🧪 Testing Forgot Password API...');
    console.log('Sending request to: http://localhost:3002/api/auth/forgot-password');
    console.log('Email: vickyjosh94@gmail.com');
    console.log('');
    
    const response = await axios.post('http://localhost:3002/api/auth/forgot-password', {
      email: 'vickyjosh94@gmail.com'
    });
    
    console.log('✅ API Response:', response.data);
    console.log('📊 Status Code:', response.status);
    
    if (response.data.success) {
      console.log('');
      console.log('🎉 SUCCESS! Forgot password email sent!');
      console.log('📧 Check your Gmail inbox: vickyjosh94@gmail.com');
      console.log('🔍 Also check spam/junk folder');
      console.log('📤 Email sent from: freelancetasker0@gmail.com');
      console.log('⏰ Code expires in 15 minutes');
    } else {
      console.log('❌ Failed:', response.data.message);
    }
    
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.error('❌ ERROR: Cannot connect to backend server');
      console.error('🔧 Make sure backend is running on port 3002');
    } else {
      console.error('❌ ERROR:', error.response?.data || error.message);
    }
  }
}

testForgotPassword();
