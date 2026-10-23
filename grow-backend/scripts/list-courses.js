const mongoose = require('mongoose');
require('dotenv').config();

async function list() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const Course = mongoose.model('Course');
    const courses = await Course.find({}, 'title');
    console.log('Courses in DB:');
    courses.forEach(c => console.log(`- ${c.title}`));
    await mongoose.disconnect();
  } catch (e) {
    console.error(e);
  }
}
list();
