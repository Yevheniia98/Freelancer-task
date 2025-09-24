// Test script to set JWT token and test task statistics
// Open browser console at http://localhost:8080/task-dashboard and run this

// 1. Set the JWT token in localStorage
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoic3VwcnVuLmplbkBnbWFpbC5jb20iLCJpYXQiOjE3NTgyOTI5NTcsImV4cCI6MTc1ODM3OTM1N30.7xaqaDNp3FIWlSyV24WySUwKaKttrU3yx2i-5PVRvzs";
localStorage.setItem('authToken', token);
localStorage.setItem('token', token);

console.log('✅ JWT token set in localStorage');

// 2. Test the task statistics API directly
fetch('http://localhost:3030/api/tasks/statistics', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => {
  console.log('📊 Task Statistics:', data);
})
.catch(error => {
  console.error('❌ Error fetching statistics:', error);
});

// 3. Test the user tasks API
fetch('http://localhost:3030/api/tasks/my-tasks', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => {
  console.log('📋 User Tasks:', data);
})
.catch(error => {
  console.error('❌ Error fetching tasks:', error);
});

// 4. Create sample tasks for testing
fetch('http://localhost:3030/api/tasks/create-sample', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => {
  console.log('✨ Sample task created:', data);
  // Refresh the page to see the updated data
  setTimeout(() => window.location.reload(), 1000);
})
.catch(error => {
  console.error('❌ Error creating sample task:', error);
});

console.log('🚀 Test script completed. Check the console for results and refresh the page.');
