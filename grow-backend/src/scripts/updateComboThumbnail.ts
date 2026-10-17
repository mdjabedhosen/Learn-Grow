import mongoose from "mongoose";
import { config } from "../config/index.js";

async function run() {
  console.log("Connecting to MongoDB Atlas...");
  await mongoose.connect(config.MONGODB_URI);
  const db = mongoose.connection.db;
  if (!db) throw new Error("No database connected");

  const combos = await db.collection("combos").find({}).toArray();
  console.log(`Found ${combos.length} combos:`);
  for (const c of combos) {
    console.log(`- ID: ${c._id}, Name: ${c.name}, Current Thumbnail: ${c.thumbnail}`);
  }

  // Update robotics combo thumbnail to /courses/robotics-course-banner.jpg
  const updateResult = await db.collection("combos").updateMany(
    {},
    {
      $set: {
        thumbnail: "/courses/robotics-course-banner.jpg",
      },
    }
  );
  console.log(`✓ Updated ${updateResult.modifiedCount} combos with new course banner.`);

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
