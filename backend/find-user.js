const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    
    // Get the users collection
    const db = mongoose.connection.db;
    const collection = db.collection('users');
    
    // Find user with specific email
    const email = 'vickyjosh94@gmail.com';
    collection.findOne({ email: email })
      .then(user => {
        if (user) {
          console.log(`\n👤 Found user: ${email}`);
          console.log({
            _id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            createdAt: user.createdAt,
            twoFactorEnabled: user.twoFactorEnabled,
            // Don't show password hash for security
            hasPassword: !!user.password
          });
        } else {
          console.log(`\n❌ No user found with email: ${email}`);
          
          // Show all users
          console.log('\n📋 All users in database:');
          collection.find({}).toArray()
            .then(users => {
              users.forEach((user, index) => {
                console.log(`${index + 1}. ${user.email} (${user.firstName} ${user.lastName})`);
              });
            })
            .finally(() => {
              mongoose.connection.close();
            });
        }
      })
      .catch(error => {
        console.error('Error finding user:', error);
        mongoose.connection.close();
      });
  })
  .catch(error => {
    console.error('Failed to connect to MongoDB:', error);
  });
