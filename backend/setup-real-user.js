const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Connect to MongoDB
async function setupRealUser() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect('mongodb://admin:password@localhost:27017/protocol-task-manager?authSource=admin');
    console.log('✅ Connected to MongoDB');

    // Define User schema
    const userSchema = new mongoose.Schema({
      email: { type: String, required: true, unique: true, lowercase: true },
      password: { type: String, required: true },
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      twoFactorEnabled: { type: Boolean, default: false }
    }, { timestamps: true });

    const User = mongoose.model('User', userSchema);

    // Check if user exists
    const existingUser = await User.findOne({ email: 'suprun.jen@gmail.com' });
    if (existingUser) {
      console.log('✅ User already exists:', existingUser.email);
      console.log('🔑 You can login with: suprun.jen@gmail.com / test123');
      return;
    }

    // Create new user
    console.log('👤 Creating real user...');
    const hashedPassword = await bcrypt.hash('test123', 12);
    
    const user = new User({
      email: 'suprun.jen@gmail.com',
      password: hashedPassword,
      firstName: 'Evgeniia',
      lastName: 'Suprun',
      twoFactorEnabled: false
    });

    const savedUser = await user.save();
    console.log('✅ Real user created successfully!');
    console.log('📧 Email:', savedUser.email);
    console.log('🔑 Password: test123');
    console.log('👤 Name:', savedUser.firstName, savedUser.lastName);
    console.log('🆔 ID:', savedUser._id);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

setupRealUser();