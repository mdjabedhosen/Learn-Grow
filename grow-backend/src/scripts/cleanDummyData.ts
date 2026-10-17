import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import { config } from "../config/index.js";

const BACKUP_DIR = "/Users/mjabed3834/Downloads/mongodb-backup-2026-10-16";

const parseJsonFile = (filename: string) => {
  const filePath = path.join(BACKUP_DIR, filename);
  if (!fs.existsSync(filePath)) return [];
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch (err: any) {
    console.error(`Error parsing ${filename}:`, err.message);
    return [];
  }
};

async function clean() {
  console.log("Connecting to MongoDB Atlas...");
  await mongoose.connect(config.MONGODB_URI);
  const db = mongoose.connection.db;
  if (!db) throw new Error("No database connected");

  console.log("Connected to:", db.databaseName);

  // 1. CLEAN COURSES
  // Real courses from backup:
  const backupCourses = parseJsonFile("courses.json");
  const validCourseIds = backupCourses.map((c: any) => new mongoose.Types.ObjectId(c._id));
  const delCoursesResult = await db.collection("courses").deleteMany({ _id: { $nin: validCourseIds } });
  console.log(`✓ Removed ${delCoursesResult.deletedCount} dummy courses (kept ${validCourseIds.length} real courses).`);

  // 2. CLEAN MODULES
  const backupModules = parseJsonFile("modules.json");
  const validModuleIds = backupModules.map((m: any) => new mongoose.Types.ObjectId(m._id));
  const delModulesResult = await db.collection("modules").deleteMany({ _id: { $nin: validModuleIds } });
  console.log(`✓ Removed ${delModulesResult.deletedCount} dummy modules (kept ${validModuleIds.length} real modules).`);

  // 3. CLEAN LESSONS
  const backupLessons = parseJsonFile("lessons.json");
  const validLessonIds = backupLessons.map((l: any) => new mongoose.Types.ObjectId(l._id));
  const delLessonsResult = await db.collection("lessons").deleteMany({ _id: { $nin: validLessonIds } });
  console.log(`✓ Removed ${delLessonsResult.deletedCount} dummy lessons (kept ${validLessonIds.length} real lessons).`);

  // 4. CLEAN LIVE CLASSES
  const backupLive = parseJsonFile("liveclasses.json");
  const validLiveIds = backupLive.map((lc: any) => new mongoose.Types.ObjectId(lc._id));
  const delLiveResult = await db.collection("liveclasses").deleteMany({ _id: { $nin: validLiveIds } });
  console.log(`✓ Removed ${delLiveResult.deletedCount} dummy live classes (kept ${validLiveIds.length} real live classes).`);

  // 5. CLEAN EVENTS
  const backupEvents = parseJsonFile("events.json");
  const validEventIds = backupEvents.map((e: any) => new mongoose.Types.ObjectId(e._id));
  const delEventsResult = await db.collection("events").deleteMany({ _id: { $nin: validEventIds } });
  console.log(`✓ Removed ${delEventsResult.deletedCount} dummy events (kept ${validEventIds.length} real events).`);

  // 6. CLEAN BLOGS
  // Keep only the real BPSC blog post
  const delBlogsResult = await db.collection("blogs").deleteMany({
    slug: { $ne: "screen-time-to-programming-bpsc-robotics-workshop" },
  });
  console.log(`✓ Removed ${delBlogsResult.deletedCount} dummy blogs (kept 1 real BPSC workshop blog).`);

  // 7. CLEAN TEAM MEMBERS
  // Keep only the 12 real team members from backup
  const backupTeam = parseJsonFile("teammembers.json");
  const validTeamIds = backupTeam.map((t: any) => new mongoose.Types.ObjectId(t._id));
  const delTeamResult = await db.collection("teammembers").deleteMany({ _id: { $nin: validTeamIds } });
  console.log(`✓ Removed ${delTeamResult.deletedCount} dummy team members (kept ${validTeamIds.length} real team members).`);

  // 8. CLEAN JOB POSTS
  const backupJobs = parseJsonFile("jobposts.json");
  const validJobIds = backupJobs.map((j: any) => new mongoose.Types.ObjectId(j._id));
  const delJobsResult = await db.collection("jobposts").deleteMany({ _id: { $nin: validJobIds } });
  console.log(`✓ Removed ${delJobsResult.deletedCount} dummy jobs (kept ${validJobIds.length} real jobs).`);

  // 9. CLEAN DUMMY USERS
  const delUsersResult = await db.collection("users").deleteMany({
    email: {
      $in: [
        "test@gmail.com",
        "test1@gmail.com",
        "admin@admin.com",
        "demo@learngrow.com",
        "instructor@learngrow.com",
      ],
    },
  });
  console.log(`✓ Removed ${delUsersResult.deletedCount} test dummy users.`);

  console.log("\n==========================================");
  console.log("FINAL CLEAN DATABASE STATE:");
  const collections = ["courses", "modules", "lessons", "liveclasses", "events", "blogs", "teammembers", "jobposts", "users"];
  for (const c of collections) {
    const count = await db.collection(c).countDocuments();
    console.log(`- ${c}: ${count}`);
  }
  console.log("==========================================");

  await mongoose.disconnect();
}

clean().catch((err) => {
  console.error("Cleanup error:", err);
  process.exit(1);
});
