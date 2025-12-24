const mongoose = require('mongoose');
require('dotenv').config();

const userSchema = new mongoose.Schema({
  email: String,
  firstName: String,
  lastName: String,
  fullName: String,
  phoneNumber: String,
  country: String,
  profileImage: String
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function checkUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/freelancer-task');
    console.log('✅ Connected to MongoDB\n');

    // Find all users with "bkj" in email
    const users = await User.find({ email: /bkj/i }).lean();
    console.log(`Found ${users.length} user(s) with "bkj" in email:\n`);
    
    users.forEach(user => {
      console.log('📧 Email:', user.email);
      console.log('👤 Name:', user.firstName, user.lastName);
      console.log('📱 Full Name:', user.fullName);
      console.log('📱 Phone:', user.phoneNumber);
      console.log('🌍 Country:', user.country);
      console.log('📅 Created:', user.createdAt);
      console.log('---\n');
    });

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkUsers();
