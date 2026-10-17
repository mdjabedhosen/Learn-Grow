import { connectDB } from "../database/mongoose.js";
import { ensureAllTutors } from "../utils/ensureTutors.js";

const run = async () => {
  try {
    console.log("[Seed Tutors] Connecting to database...");
    await connectDB();
    console.log("[Seed Tutors] Running ensureAllTutors...");
    await ensureAllTutors();
    console.log("[Seed Tutors] All tutors successfully seeded and verified!");
    process.exit(0);
  } catch (error) {
    console.error("[Seed Tutors] Error seeding tutors:", error);
    process.exit(1);
  }
};

run();
