const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

// User schema (simplified version)
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  fullName: String
});

const User = mongoose.model('User', userSchema);

async function resetPassword() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find the user
    const email = 'suprunjen@gmail.com';
    const newPassword = 'TempPassword123!';
    
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log('User not found');
      return;
    }

    // Hash the new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update the user's password
    await User.updateOne(
      { email },
      { password: hashedPassword }
    );

    console.log(`Password reset successful for ${email}`);
    console.log(`New password: ${newPassword}`);
    console.log('Please use this password to login and then change it to something secure.');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

resetPassword();
