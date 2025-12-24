const axios = require('axios');

async function testRegister() {
  try {
    console.log('Testing registration with phone and country...\n');
    
    const response = await axios.post('http://localhost:3002/api/auth/register', {
      fullName: 'Test User France',
      email: 'testfrance@example.com',
      phoneNumber: '+33 6 12 34 56 78',
      country: 'France',
      password: 'TestPass123!',
      confirmPassword: 'TestPass123!'
    });
    
    console.log('✅ Registration successful!');
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.error('❌ Registration failed:');
    console.error('Status:', error.response?.status);
    console.error('Error:', error.response?.data);
  }
}

testRegister();
