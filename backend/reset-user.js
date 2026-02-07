const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  firstName: String,
  lastName: String,
  twoFactorEnabled: Boolean,
  twoFactorSecret: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function resetUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://admin:password@localhost:27017/protocol-task-manager?authSource=admin');
    console.log('✅ Connected to MongoDB');

    // Delete existing user
    const deleted = await User.deleteOne({ email: 'suprun.jen@gmail.com' });
    console.log('🗑️  Deleted:', deleted.deletedCount);

    // Create new user
    const hashedPassword = await bcrypt.hash('test123', 10);
    const user = new User({
      email: 'suprun.jen@gmail.com',
      password: hashedPassword,
      firstName: 'Evgeniia',
      lastName: 'Suprun',
      twoFactorEnabled: false
    });

    const saved = await user.save();
    console.log('✅ User created:');
    console.log('   Email:', saved.email);
    console.log('   Password: test123');
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error.message);
    await mongoose.disconnect();
  }
}

resetUser();
