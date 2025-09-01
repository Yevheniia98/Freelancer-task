require('dotenv').config();
const bcrypt = require('bcrypt');
const { MongoClient } = require('mongodb');

async function resetPassword() {
  try {
    const client = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017/freelancer-task-db');
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db();
    
    // Generate new password hash
    const newPassword = 'Test123456!';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // Update user password
    const result = await db.collection('users').updateOne(
      { email: 'vickyjosh94@gmail.com' },
      { $set: { password: hashedPassword } }
    );
    
    if (result.matchedCount > 0) {
      console.log('✅ Password reset successfully!');
      console.log('📧 Email: vickyjosh94@gmail.com');
      console.log('🔑 New Password: Test123456!');
      
      // Verify the new password works
      const user = await db.collection('users').findOne({ email: 'vickyjosh94@gmail.com' });
      const isValid = await bcrypt.compare(newPassword, user.password);
      console.log(`🔍 Password verification: ${isValid ? '✅ VALID' : '❌ INVALID'}`);
    } else {
      console.log('❌ User not found');
    }
    
    await client.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

resetPassword();
