const mongoose = require('mongoose');
const MONGODB_URI = "mongodb+srv://admin_user:h%23yXa4XQxf3i6R-@cluster0.kbnvgdd.mongodb.net/learn-grow?retryWrites=true&w=majority&appName=Cluster0";

async function findCourse() {
  try {
    await mongoose.connect(MONGODB_URI);
    const course = await mongoose.connection.db.collection('courses').findOne({
      title: { $regex: /Python Programming & AI for Teens/i }
    });
    console.log(JSON.stringify(course, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

findCourse();
