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

async function setupUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/freelancer-task');
    
    // Delete existing user
    await User.deleteOne({ email: 'suprun.jen@gmail.com' });
    
    // Hash password
    const hashedPassword = await bcrypt.hash('03101998Polo', 12);

    // Create user
    const newUser = new User({
      email: 'suprun.jen@gmail.com',
      password: hashedPassword,
      firstName: 'Evgeniia',
      lastName: 'Suprun',
    });

    await newUser.save();
    console.log('✅ User created with your password!');
    console.log('Email: suprun.jen@gmail.com');
    console.log('Password: 03101998Polo');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

setupUser();
