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

async function checkUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/freelancer-task');
    console.log('✅ Connected to MongoDB\n');

    const user = await User.findOne({ email: 'suprun.jen@gmail.com' }).select('+password');
    
    if (!user) {
      console.log('❌ User NOT found in database!');
      console.log('\n📋 All users in database:');
      const allUsers = await User.find({}).select('email firstName lastName').lean();
      allUsers.forEach(u => {
        console.log(`  - ${u.email} (${u.firstName} ${u.lastName})`);
      });
    } else {
      console.log('✅ User FOUND!');
      console.log('Email:', user.email);
      console.log('Name:', user.firstName, user.lastName);
      console.log('Has password:', !!user.password);
      
      if (user.password) {
        const match = await bcrypt.compare('Test123456!', user.password);
        console.log('Password "Test123456!" matches:', match ? '✅ YES' : '❌ NO');
      }
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkUser();
