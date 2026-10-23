import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { Course } from '../src/modules/course/model/course.model';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const IMAGE_DIR = '/Users/mjabed3834/Documents/Learn & Grow/Updated course/';
const THUMBNAIL_MAP: Record<string, string> = {
  'Coding with Python & AI for Teens': 'python-course-banner.jpg',
  'Junior Robotics with Arduino': 'robotics-course-banner.jpg',
};

async function uploadThumbnails() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('Connected successfully.');

    for (const [title, fileName] of Object.entries(THUMBNAIL_MAP)) {
      console.log(`\\nProcessing: ${title}`);

      const filePath = path.join(IMAGE_DIR, fileName);
      if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        continue;
      }

      console.log(`Uploading ${fileName} to Cloudinary...`);
      const uploadResult = await cloudinary.uploader.upload(filePath, {
        folder: 'courses',
        use_filename: true,
        unique_filename: false,
      });

      const secureUrl = uploadResult.secure_url;
      console.log(`Uploaded successfully: ${secureUrl}`);

      // Update the course in DB
      const result = await Course.updateOne(
        { title: new RegExp(`^${title}$`, 'i') },
        { $set: { thumbnail: secureUrl } }
      );

      if (result.modifiedCount > 0) {
        console.log(`Updated course ${title} with new thumbnail.`);
      } else {
        console.log(`No course found with title ${title} or thumbnail already set to this URL.`);
      }
    }

    await mongoose.disconnect();
    console.log('\\nAll tasks completed. Disconnected.');
  } catch (e) {
    console.error('Error:', e);
    process.exit(1);
  }
}

uploadThumbnails();
