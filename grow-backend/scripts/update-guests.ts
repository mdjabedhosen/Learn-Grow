import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import path from 'path';
import fs from 'fs';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const PUBLIC_IMAGES_DIR = '/Users/mjabed3834/Documents/Learn & Grow/learn-grow-fullstack/learn-grow/public/images/tutors/';

const GUEST_MAP: Record<string, { name: string, photo: string | null }> = {
  'IoT Engineer leading live hardware cohort delivery and maker lab logistics.': {
    name: 'Sabbir Bin Sazid',
    photo: 'https://res.cloudinary.com/daq7v0wmf/image/upload/v1792213479/team/members/team-Sabbir%20Bin%20Sazid-1792213479190.png',
  },
  'Hands-on Robotics & IoT Specialist focusing on Microcontrollers, Sensors & Prototyping': {
    name: 'Shovan Parvez',
    photo: 'tutor-sovon.png', // Local path
  },
  'AI/ML Engineer and Data Science researcher pursuing MSc at University of Milano-Bicocca, Italy. Founder & CEO of Learn & Grow.': {
    name: 'Md Jabed Hosen',
    photo: 'tutor-jabed.png', // Local path
  },
};

async function updateGuests() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('Connected successfully.');

    const collection = mongoose.connection.db.collection('eventguests');
    const guests = await collection.find({}).toArray();

    for (const guest of guests) {
      const bio = guest.bio;
      const data = GUEST_MAP[bio];

      if (!data) {
        console.log(`No mapping found for bio: ${bio}`);
        continue;
      }

      let photoUrl = data.photo;

      // If photo is local, upload it
      if (photoUrl && !photoUrl.startsWith('http')) {
        const filePath = path.join(PUBLIC_IMAGES_DIR, photoUrl);
        if (fs.existsSync(filePath)) {
          console.log(`Uploading local photo for ${data.name}...`);
          const uploadResult = await cloudinary.uploader.upload(filePath, {
            folder: 'team',
            use_filename: true,
            unique_filename: false,
          });
          photoUrl = uploadResult.secure_url;
          console.log(`Uploaded: ${photoUrl}`);
        } else {
          console.error(`Local photo file not found: ${filePath}`);
        }
      }

      console.log(`Updating ${data.name}...`);
      await collection.updateOne(
        { _id: guest._id },
        { $set: { name: data.name, photo: photoUrl } }
      );
    }

    await mongoose.disconnect();
    console.log('\\nAll guests updated. Disconnected.');
  } catch (e) {
    console.error('Error:', e);
    process.exit(1);
  }
}

updateGuests();
