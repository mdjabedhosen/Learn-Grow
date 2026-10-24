import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Course } from '../src/modules/course/model/course.model';

dotenv.config();

async function list() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('Connected successfully.');

    const courses = await Course.find({}, 'title thumbnail');
    console.log('\nCourses in DB:');
    if (courses.length === 0) {
      console.log('No courses found.');
    } else {
      courses.forEach(c => {
        console.log(`- ${c.title} | Thumbnail: ${c.thumbnail || 'None'}`);
      });
    }

    await mongoose.disconnect();
    console.log('\nDisconnected.');
  } catch (e) {
    console.error('Error:', e);
    process.exit(1);
  }
}

list();
