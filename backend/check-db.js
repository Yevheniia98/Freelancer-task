const mongoose = require('mongoose');

async function checkDatabase() {
  const uri = 'mongodb://admin:password@localhost:27017/protocol-task-manager?authSource=admin';

  try {
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    
    // List all collections
    const collections = await db.listCollections().toArray();
    console.log('\n📚 Collections in database:');
    console.log('================================');
    
    if (collections.length === 0) {
      console.log('No collections found in the database.');
      return;
    }

    for (const collection of collections) {
      console.log(`\n🗂️  Collection: ${collection.name}`);
      console.log('-'.repeat(40));
      
      try {
        const coll = db.collection(collection.name);
        const count = await coll.countDocuments();
        console.log(`📊 Document count: ${count}`);
        
        if (count > 0) {
          // Get a few sample documents
          const sampleDocs = await coll.find({}).limit(3).toArray();
          console.log('\n📄 Sample documents:');
          sampleDocs.forEach((doc, index) => {
            console.log(`\nDocument ${index + 1}:`);
            console.log(JSON.stringify(doc, null, 2));
          });
          
          if (count > 3) {
            console.log(`\n... and ${count - 3} more documents`);
          }
        }
      } catch (err) {
        console.log(`❌ Error reading collection ${collection.name}: ${err.message}`);
      }
    }

  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

checkDatabase().catch(console.error);
