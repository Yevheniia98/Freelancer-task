const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  firstName: String,
  lastName: String,
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function testLogin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/freelancer-task');
    console.log('✅ Connected to MongoDB\n');

    // Find the test user
    const user = await User.findOne({ email: 'bkjitproducts@gmail.com' });
    
    if (!user) {
      console.log('❌ User not found');
      process.exit(1);
    }

    console.log('📧 Found user:', user.email);
    console.log('Name:', user.firstName, user.lastName);
    console.log('Current password hash:', user.password);

    // Test password
    if (user.password) {
      const match = await bcrypt.compare('test123', user.password);
      console.log('\n🔑 Does password "test123" match?', match ? '✅ YES' : '❌ NO');
    } else {
      console.log('\n⚠️  User has no password set!');
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

testLogin();
