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

    // Check the specific user
    const user1 = await User.findOne({ email: 'bkj.itproducts@gmail.com' }).lean();
    console.log('📧 User: bkj.itproducts@gmail.com');
    console.log('Data:', JSON.stringify(user1, null, 2));
    console.log('\n---\n');

    // Check the other user
    const user2 = await User.findOne({ email: 'suprun.jen@gmail.com' }).lean();
    console.log('📧 User: suprun.jen@gmail.com');
    console.log('Data:', JSON.stringify(user2, null, 2));

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkUsers();
