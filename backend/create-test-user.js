const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

// User schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  twoFactorEnabled: {
    type: Boolean,
    default: false,
  },
  twoFactorSecret: {
    type: String,
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);

async function createTestUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://admin:password@localhost:27017/protocol-task-manager?authSource=admin');
    console.log('✅ Connected to MongoDB');

    // Check if user already exists
    const existingUser = await User.findOne({ email: 'suprun.jen@gmail.com' });
    if (existingUser) {
      console.log('❌ User already exists:', existingUser.email);
      process.exit(0);
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash('test123', saltRounds);

    // Create user
    const user = new User({
      email: 'suprun.jen@gmail.com',
      password: hashedPassword,
      firstName: 'Evgeniia',
      lastName: 'Suprun',
      twoFactorEnabled: false
    });

    const savedUser = await user.save();
    console.log('✅ Test user created successfully!');
    console.log('📧 Email:', savedUser.email);
    console.log('🔑 Password: test123');
    console.log('👤 Name:', savedUser.firstName, savedUser.lastName);
    console.log('🆔 ID:', savedUser._id);

  } catch (error) {
    console.error('❌ Error creating test user:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

createTestUser();