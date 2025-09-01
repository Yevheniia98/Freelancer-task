require('dotenv').config();
const bcrypt = require('bcrypt');
const { MongoClient } = require('mongodb');

async function testPassword() {
  try {
    const client = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017/freelancer-task-db');
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db();
    const user = await db.collection('users').findOne({ email: 'vickyjosh94@gmail.com' });
    
    if (user) {
      console.log('👤 Found user:', user.email);
      console.log('🔑 Stored password hash:', user.password);
      
      // Test multiple password variations
      const passwords = [
        'Test123456!', 
        'Aa12345678', 
        'test123456', 
        'Test123456', 
        'password123',
        'Password123',
        'brij123',
        'Brij123',
        'jha123',
        'Jha123'
      ];
      
      for (const password of passwords) {
        const isValid = await bcrypt.compare(password, user.password);
        console.log(`🔍 Password "${password}": ${isValid ? '✅ VALID' : '❌ INVALID'}`);
      }
    } else {
      console.log('❌ User not found');
    }
    
    await client.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testPassword();
