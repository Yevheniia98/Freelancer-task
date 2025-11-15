// Simple test to check financial API endpoints
const testFinancialAPI = async () => {
  console.log('🧪 Testing Financial API endpoints...');
  
  try {
    // Test status endpoint (no auth required)
    console.log('1. Testing /api/financial/status...');
    const statusResponse = await fetch('http://localhost:3002/api/financial/status');
    const statusData = await statusResponse.text();
    console.log('Status Response:', statusData);
    
    // Test summary endpoint (requires auth)
    console.log('2. Testing /api/financial/summary...');
    const summaryResponse = await fetch('http://localhost:3002/api/financial/summary');
    console.log('Summary Response Status:', summaryResponse.status);
    console.log('Summary Response:', await summaryResponse.text());
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

testFinancialAPI();