const axios = require('axios');

async function testProjectCreation() {
  try {
    // First login to get a token
    console.log('Step 1: Logging in...');
    const loginResponse = await axios.post('http://localhost:3002/api/auth/login', {
      email: 'test@example.com',
      password: 'password123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login successful, token:', token.substring(0, 20) + '...');
    
    // Create project
    console.log('\nStep 2: Creating project...');
    const projectData = {
      title: 'Test Project',
      name: 'Test Project',
      description: 'This is a test project description',
      priority: 'medium',
      status: 'pending',
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      privacy: 'private',
      category: 'development',
      skills: ['JavaScript', 'Node.js'],
      teamLead: 'John Doe',
      teamMembers: []
    };
    
    console.log('Project data:', JSON.stringify(projectData, null, 2));
    
    const response = await axios.post('http://localhost:3002/api/projects', projectData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('\n✅ Project created successfully!');
    console.log('Response:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('\n❌ Error:', error.response?.data || error.message);
    console.error('Status:', error.response?.status);
    console.error('Full error:', error.response?.data);
  }
}

testProjectCreation();
