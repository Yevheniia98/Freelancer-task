// Simple test to debug email issue
const axios = require('axios');

async function testEmailFlow() {
  console.log('🔍 DEBUGGING EMAIL ISSUE');
  console.log('========================');
  
  try {
    console.log('1. Testing server health...');
    const health = await axios.get('http://localhost:3002/api/health');
    console.log('✅ Server is running:', health.data.status);
    
    console.log('\n2. Testing user registration...');
    try {
      const registerResponse = await axios.post('http://localhost:3002/api/auth/register', {
        fullName: 'Vicky Josh',
        email: 'vickyjosh94@gmail.com',
        password: 'Test123456!',
        confirmPassword: 'Test123456!'
      });
      console.log('✅ Registration success:', registerResponse.data);
    } catch (regError) {
      if (regError.response && regError.response.data.message.includes('already exists')) {
        console.log('✅ User already exists - that\'s good!');
      } else {
        console.log('❌ Registration error:', regError.response?.data || regError.message);
        return;
      }
    }
    
    console.log('\n3. Testing forgot password...');
    const forgotResponse = await axios.post('http://localhost:3002/api/auth/forgot-password', {
      email: 'vickyjosh94@gmail.com'
    });
    console.log('✅ Forgot password response:', forgotResponse.data);
    
    if (forgotResponse.data.success) {
      console.log('\n📧 Email should have been sent!');
      console.log('🔍 Check these locations:');
      console.log('   - Gmail inbox for vickyjosh94@gmail.com');
      console.log('   - Gmail spam/junk folder');
      console.log('   - Check backend terminal for email logs');
      console.log('\n⏰ Wait 1-2 minutes for email delivery');
    } else {
      console.log('❌ Forgot password failed');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testEmailFlow();
