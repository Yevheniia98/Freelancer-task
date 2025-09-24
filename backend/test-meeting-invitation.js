const axios = require('axios');

async function testMeetingInvitation() {
  try {
    console.log('🧪 Testing meeting invitation API...');
    
    const response = await axios.post('http://localhost:3030/api/meeting-invitations/send-multiple', {
      recipients: [
        { email: 'test@example.com', name: 'Test User' }
      ],
      meetingData: {
        title: 'Test Meeting',
        date: '2025-09-24',
        startTime: '10:00',
        endTime: '11:00',
        organizerName: 'Test Organizer',
        organizerEmail: 'organizer@example.com',
        description: 'This is a test meeting invitation'
      }
    });
    
    console.log('✅ Success:', response.data);
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    console.error('Status:', error.response?.status);
  }
}

testMeetingInvitation();