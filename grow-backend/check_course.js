const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: String,
  thumbnail: String,
});
const Course = mongoose.model('Course', courseSchema);

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const course = await Course.findOne({ title: { $regex: /Python Programming & AI for Teens/i } });
    if (course) {
      console.log('Course found:');
      console.log('Title:', course.title);
      console.log('Thumbnail:', course.thumbnail);
    } else {
      console.log('Course not found.');
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
run();
