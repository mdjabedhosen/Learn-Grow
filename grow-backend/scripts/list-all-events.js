const mongoose = require('mongoose');
require('dotenv').config();
async function list() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const events = await mongoose.connection.db.collection('events').find().toArray();
    console.log('Events:');
    events.forEach(e => console.log(`- ${e.title} (ID: ${e._id})`));
    await mongoose.disconnect();
  } catch (e) {
    console.error(e);
  }
}
list();
