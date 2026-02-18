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
    
    // Delete both versions
    await User.deleteOne({ email: 'suprun.jen@gmail.com' });
    await User.deleteOne({ email: 'suprunjen@gmail.com' });
    
    // Hash password
    const hashedPassword = await bcrypt.hash('03101998Polo', 12);

    // Create user with BOTH emails
    const user1 = new User({
      email: 'suprunjen@gmail.com',
      password: hashedPassword,
      firstName: 'Evgeniia',
      lastName: 'Suprun',
    });
    await user1.save();
    console.log('✅ Created: suprunjen@gmail.com');

    const user2 = new User({
      email: 'suprun.jen@gmail.com',
      password: hashedPassword,
      firstName: 'Evgeniia',
      lastName: 'Suprun',
    });
    await user2.save();
    console.log('✅ Created: suprun.jen@gmail.com');

    console.log('\n🔑 Both emails work with password: 03101998Polo');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

setupUser();
