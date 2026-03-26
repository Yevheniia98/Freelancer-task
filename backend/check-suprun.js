const mongoose = require('mongoose');
require('dotenv').config();

async function check() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
    const user = await User.findOne({ email: 'suprun.jen@gmail.com' });
    
    console.log('\n📧 suprun.jen@gmail.com account:');
    console.log(JSON.stringify(user, null, 2));
    
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
  }
  process.exit(0);
}

check();
