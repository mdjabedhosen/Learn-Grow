import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function listGuests() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);

    // Since we don't have a Guest model registered in this script,
    // we'll use the generic mongoose.connection.db.collection
    const guests = await mongoose.connection.db.collection('eventguests').find({}).toArray();

    console.log('Event Guests in DB:');
    if (guests.length === 0) {
      console.log('No guests found.');
    } else {
      guests.forEach(g => {
        console.log(`- Name: ${g.name} | Photo: ${g.photo} | Bio: ${g.bio || 'None'}`);
      });
    }

    await mongoose.disconnect();
  } catch (e) {
    console.error('Error:', e);
    process.exit(1);
  }
}

listGuests();
