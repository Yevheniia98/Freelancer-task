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

async function resetPassword() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/freelancer-task');
    console.log('✅ Connected to MongoDB\n');

    // Find the user
    const user = await User.findOne({ email: 'suprun.jen@gmail.com' });
    
    if (!user) {
      console.log('❌ User not found');
      process.exit(1);
    }

    console.log('📧 Found user:', user.email);

    // Hash new password
    const newPassword = 'Test123456!';
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    user.password = hashedPassword;
    await user.save();

    console.log('✅ Password reset successfully!');
    console.log('📧 Email:', user.email);
    console.log('🔑 New Password:', newPassword);

    // Verify password works
    const passwordMatch = await bcrypt.compare(newPassword, user.password);
    console.log('🔍 Password verification:', passwordMatch ? '✅ VALID' : '❌ INVALID');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

resetPassword();
