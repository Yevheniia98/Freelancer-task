const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Define User schema matching the backend
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  firstName: String,
  lastName: String,
  fullName: String,
  phoneNumber: String,
  country: String,
  profileImage: String,
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  twoFactorSecret: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  isInvitedUser: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function createRealUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/freelancer-task');
    console.log('✅ Connected to MongoDB\n');

    // Delete existing user if found
    const existingUser = await User.findOne({ email: 'suprun.jen@gmail.com' });
    if (existingUser) {
      await User.deleteOne({ email: 'suprun.jen@gmail.com' });
      console.log('🗑️  Deleted existing user\n');
    }

    // Create real user with proper password
    const email = 'suprun.jen@gmail.com';
    const password = 'Test123456!';
    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      email: email,
      password: hashedPassword,
      firstName: 'Evgeniia',
      lastName: 'Suprun',
      fullName: 'Evgeniia Suprun',
      phoneNumber: '+1234567890',
      country: 'USA',
      twoFactorEnabled: false
    });

    const savedUser = await newUser.save();

    console.log('✅ Real user created successfully!');
    console.log('\n📧 Email:', email);
    console.log('🔑 Password:', password);
    console.log('👤 Name:', savedUser.firstName, savedUser.lastName);
    console.log('📱 User ID:', savedUser._id);

    // Verify password
    const passwordMatch = await bcrypt.compare(password, savedUser.password);
    console.log('\n🔍 Password verification:', passwordMatch ? '✅ VALID' : '❌ INVALID');

    await mongoose.connection.close();
    console.log('\n✅ Done! You can now login with these credentials.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createRealUser();
