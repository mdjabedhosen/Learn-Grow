import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import { config } from "../config/index.js";

const BACKUP_DIR = "/Users/mjabed3834/Downloads/mongodb-backup-2026-10-16";

const parseJsonFile = (filename: string) => {
  const filePath = path.join(BACKUP_DIR, filename);
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return [];
  }
  const raw = fs.readFileSync(filePath, "utf-8");
  try {
    return JSON.parse(raw);
  } catch (err: any) {
    console.error(`Error parsing ${filename}:`, err.message);
    return [];
  }
};

const convertDocIds = (doc: any): any => {
  if (Array.isArray(doc)) {
    return doc.map(convertDocIds);
  } else if (doc !== null && typeof doc === "object") {
    const newDoc: any = {};
    for (const [key, value] of Object.entries(doc)) {
      if (key === "_id" && typeof value === "string" && mongoose.Types.ObjectId.isValid(value)) {
        newDoc[key] = new mongoose.Types.ObjectId(value);
      } else if (
        (key.endsWith("Id") || key === "author" || key === "category" || key === "course" || key === "module") &&
        typeof value === "string" &&
        mongoose.Types.ObjectId.isValid(value)
      ) {
        newDoc[key] = new mongoose.Types.ObjectId(value);
      } else if (key.endsWith("Date") || key === "createdAt" || key === "updatedAt") {
        newDoc[key] = typeof value === "string" ? new Date(value) : value;
      } else {
        newDoc[key] = convertDocIds(value);
      }
    }
    return newDoc;
  }
  return doc;
};

async function syncCollection(colName: string, jsonFileName: string) {
  const rawDocs = parseJsonFile(jsonFileName);
  if (!Array.isArray(rawDocs) || rawDocs.length === 0) {
    console.log(`Skipping empty or missing ${jsonFileName}`);
    return;
  }

  const db = mongoose.connection.db;
  if (!db) throw new Error("No database connected");

  const collection = db.collection(colName);
  let upsertedCount = 0;

  for (const doc of rawDocs) {
    const formatted = convertDocIds(doc);
    try {
      if (colName === "settings" && formatted.key) {
        const { _id, ...rest } = formatted;
        await collection.updateOne({ key: formatted.key }, { $set: rest }, { upsert: true });
      } else if (colName === "users" && formatted.email) {
        // preserve password if already exists in DB
        const existing = await collection.findOne({ email: formatted.email });
        if (existing) {
          const { _id, password, ...rest } = formatted;
          await collection.updateOne({ email: formatted.email }, { $set: rest });
        } else {
          await collection.insertOne(formatted);
        }
      } else if (colName === "blogcategories" && formatted.slug) {
        const { _id, ...rest } = formatted;
        await collection.updateOne({ slug: formatted.slug }, { $set: rest }, { upsert: true });
      } else {
        const filter = formatted._id ? { _id: formatted._id } : { ...formatted };
        await collection.replaceOne(filter, formatted, { upsert: true });
      }
      upsertedCount++;
    } catch (err: any) {
      console.warn(`Warning syncing doc in ${colName}:`, err.message);
    }
  }

  console.log(`✓ Synced ${colName}: ${upsertedCount} documents.`);
}

async function run() {
  console.log("Connecting to MongoDB Atlas:", config.MONGODB_URI.replace(/:[^:]*@/, ":****@"));
  await mongoose.connect(config.MONGODB_URI);
  console.log("Connected to database:", mongoose.connection.db?.databaseName);

  // Sync core collections from backup
  const collectionsToSync = [
    { col: "roles", file: "roles.json" },
    { col: "teammembers", file: "teammembers.json" },
    { col: "events", file: "events.json" },
    { col: "blogcategories", file: "blogcategories.json" },
    { col: "courses", file: "courses.json" },
    { col: "modules", file: "modules.json" },
    { col: "lessons", file: "lessons.json" },
    { col: "combos", file: "combos.json" },
    { col: "settings", file: "settings.json" },
    { col: "sitecontents", file: "sitecontents.json" },
    { col: "paymentmethods", file: "paymentmethods.json" },
    { col: "jobposts", file: "jobposts.json" },
    { col: "users", file: "users.json" },
  ];

  for (const item of collectionsToSync) {
    await syncCollection(item.col, item.file);
  }

  // Find or create 'Workshop' blog category
  const db = mongoose.connection.db;
  if (!db) throw new Error("No database connected");
  const blogCategoriesCol = db.collection("blogcategories");
  let workshopCategory = await blogCategoriesCol.findOne({ slug: "workshop" });
  if (!workshopCategory) {
    const catResult = await blogCategoriesCol.insertOne({
      name: "Workshop",
      slug: "workshop",
      description: "Hands-on robotics, coding, and STEM workshops for students",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    workshopCategory = { _id: catResult.insertedId, name: "Workshop", slug: "workshop" };
    console.log("Created 'Workshop' blog category.");
  }

  // Find an admin user as author
  const usersCol = db.collection("users");
  const author = (await usersCol.findOne({ role: "admin" })) || (await usersCol.findOne({})) || { _id: new mongoose.Types.ObjectId() };

  // Prepare BPSC Blog Post
  const blogsCol = db.collection("blogs");
  const blogSlug = "screen-time-to-programming-bpsc-robotics-workshop";

  const blogContentHtml = `
<div class="blog-story prose prose-lg max-w-none">
  <p class="lead text-xl text-gray-700 font-medium mb-6">
    What if we could take the same energy a child puts into mobile games and redirect it toward building something real — something they could hold in their hands, something they coded themselves?
  </p>

  <p class="text-gray-600 mb-6">
    That was the question we carried into <strong>Bashundhara Public School & College</strong> on the morning of May 5, 2026. We didn’t carry a slideshow. We carried <strong>300 Roboto Box kits</strong> — each one packed with an Arduino board, a breadboard, jumper wires, LEDs, motors, sensors, and a whole lot of possibility.
  </p>

  <p class="text-gray-600 mb-6">
    Two days later, every single one of those kits had been turned into a working robot. And every single one of those students had written the code that brought it to life. This is the story of how that happened.
  </p>

  <div class="my-8 rounded-2xl overflow-hidden shadow-lg border border-gray-100">
    <img src="/workshop/bpsc-auditorium.jpg" alt="300 Students at BPSC Robotics Workshop" class="w-full object-cover max-h-[500px]" />
    <p class="text-xs text-center text-gray-500 py-2 bg-gray-50">300 students in the auditorium opening their Roboto Box Arduino kits</p>
  </div>

  <h2 class="text-2xl font-bold text-gray-900 mt-10 mb-4">The Problem We Walked In With</h2>
  <p class="text-gray-600 mb-4">
    Bangladesh is home to one of the youngest populations in South Asia. Over 40 million children are enrolled in schools across the country. Yet for the vast majority of them, the word “technology” means one thing: a smartphone screen. They scroll. They watch. They play. But they rarely build.
  </p>
  <p class="text-gray-600 mb-6">
    STEM education — the kind where a student touches a sensor, connects a wire, writes a line of code, and watches a motor spin — is still out of reach for most schools. The equipment is expensive. The teachers aren’t trained. And the curriculum hasn’t caught up. We started <strong>Learn & Grow</strong> because we believe that has to change. The BPSC workshop was our chance to prove it could.
  </p>

  <h2 class="text-2xl font-bold text-gray-900 mt-10 mb-4">What We Brought to the Table</h2>
  <p class="text-gray-600 mb-4">The workshop was designed with one principle: <strong>every student builds something real</strong>. No lectures. No theory-heavy slideshows. Every activity was hands-on.</p>

  <div class="bg-blue-50 border-l-4 border-primary-500 p-6 rounded-r-xl my-6">
    <ul class="space-y-2 text-sm text-gray-700">
      <li><strong>📅 Dates:</strong> May 5, 2026 (Day 1) and May 10, 2026 (Day 2)</li>
      <li><strong>⏰ Time:</strong> 11:00 AM – 1:00 PM each day (4 hours total)</li>
      <li><strong>🎓 Students:</strong> 300 students from Grade 5 through Grade 8 (Ages 10–16)</li>
      <li><strong>💰 Cost:</strong> Completely free — BDT 0 for the school and students</li>
      <li><strong>🗣️ Language:</strong> Bilingual (English & Bengali)</li>
    </ul>
  </div>

  <h2 class="text-2xl font-bold text-gray-900 mt-10 mb-4">Day 1: From “What’s an Arduino?” to “I Made This Work”</h2>
  <p class="text-gray-600 mb-4">
    Three hundred students walked into the main auditorium that Monday morning. Most had never seen a microcontroller. Within 40 minutes, students were plugging LEDs into breadboards, wiring resistors, and connecting buzzers.
  </p>
  <p class="text-gray-600 mb-6">
    We introduced the <strong>Arduino IDE</strong>. Students learned fundamental coding concepts: <code>setup()</code> and <code>loop()</code>. Their first program: blink an LED. Their second: trigger a buzzer pattern. Their third: combine both into a custom sequence. By 1:00 PM, 300 students who had never coded hardware before were successfully debugging their circuits.
  </p>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
    <img src="/workshop/bpsc-students-1.jpg" alt="Students building circuits" class="rounded-xl object-cover h-64 w-full shadow-md" />
    <img src="/workshop/bpsc-students-2.jpg" alt="Sumo Bot Testing" class="rounded-xl object-cover h-64 w-full shadow-md" />
  </div>

  <h2 class="text-2xl font-bold text-gray-900 mt-10 mb-4">Day 2: Robots Come Alive & The Sumo Bot Challenge</h2>
  <p class="text-gray-600 mb-4">
    Day 2 was about motion, autonomy, and competition. Students connected DC motors with L298N motor drivers and mounted ultrasonic sensors to make robots navigate autonomously.
  </p>
  <p class="text-gray-600 mb-6">
    We finished with the <strong>Grand Finale: Sumo Bot Challenge</strong>. A circular ring was marked on the auditorium floor. Two autonomous robots entered, push-battling using only sensor logic and code written by the students. The cheering echoed across the entire school!
  </p>

  <div class="my-10 bg-amber-50 border border-amber-200 rounded-2xl p-8 relative">
    <span class="text-4xl text-amber-500 absolute top-4 left-6">❝</span>
    <blockquote class="text-gray-800 text-lg italic pt-4 pl-4 font-siliguri">
      “আমার ছেলে সবসময় মোবাইলে গেম খেলত। কিন্তু এই ২ দিন সে বাসায় গিয়ে সারাক্ষণ আর্ডুইনোর ওয়্যার কানেক্ট করেছে আর কোড লিখেছে। তার এই পরিবর্তন দেখে আমি সত্যিই আনন্দিত।”
    </blockquote>
    <p class="text-sm font-bold text-amber-800 mt-4 pl-4">— ধানমন্ডির একজন অভিভাবক (Mother of a Grade 6 Student)</p>
  </div>

  <h2 class="text-2xl font-bold text-gray-900 mt-10 mb-4">The Workshop by the Numbers</h2>
  <div class="overflow-x-auto my-6">
    <table class="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-xl">
      <thead class="bg-gray-50">
        <tr>
          <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Metric</th>
          <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Result</th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200 text-sm">
        <tr><td class="px-6 py-4 font-bold text-gray-800">Students Trained</td><td class="px-6 py-4 text-primary-600 font-bold">300 Students</td></tr>
        <tr><td class="px-6 py-4 font-bold text-gray-800">Target Grade Level</td><td class="px-6 py-4 text-gray-600">Ages 10–16 (Grades 5–8)</td></tr>
        <tr><td class="px-6 py-4 font-bold text-gray-800">Completion Rate</td><td class="px-6 py-4 text-green-600 font-bold">100% across both days</td></tr>
        <tr><td class="px-6 py-4 font-bold text-gray-800">Cost to School & Students</td><td class="px-6 py-4 text-gray-600">Completely Free (BDT 0)</td></tr>
        <tr><td class="px-6 py-4 font-bold text-gray-800">Hardware Used</td><td class="px-6 py-4 text-gray-600">300 Roboto Box Arduino Starter Kits</td></tr>
      </tbody>
    </table>
  </div>

  <h2 class="text-2xl font-bold text-gray-900 mt-10 mb-4">What Comes Next</h2>
  <p class="text-gray-600 mb-6">
    We are expanding the workshop model across Dhaka — Dhanmondi, Mohammadpur, Gulshan, Banani, and Uttara. If you are an educator, parent, or school administrator interested in bringing hands-on STEM to your institution, visit our Dhanmondi hub at <strong>Level 4, 35 Green Road, Dhanmondi, Dhaka</strong> or reach out to us at <a href="/contact" class="text-primary-600 underline font-bold">our contact page</a>.
  </p>
</div>
`;

  const existingBlog = await blogsCol.findOne({ slug: blogSlug });
  if (existingBlog) {
    await blogsCol.updateOne(
      { slug: blogSlug },
      {
        $set: {
          title: "Screen Time to Programming: How 300 Students Built Their First Robot in Just 2 Days",
          excerpt:
            "A free 2-day robotics workshop at Bashundhara Public School & College turned 300 students — most of whom had never touched a circuit board — into young engineers who coded, built, and battled their own sumo bots.",
          content: blogContentHtml,
          category: workshopCategory._id,
          author: author._id,
          image: "/workshop/bpsc-main.png",
          isPublished: true,
          isApproved: true,
          readTime: 5,
          metaTags: ["robotics", "arduino", "stem", "education", "workshop", "bangladesh", "coding"],
          updatedAt: new Date(),
        },
      }
    );
    console.log("✓ Updated existing BPSC workshop blog post.");
  } else {
    await blogsCol.insertOne({
      title: "Screen Time to Programming: How 300 Students Built Their First Robot in Just 2 Days",
      slug: blogSlug,
      excerpt:
        "A free 2-day robotics workshop at Bashundhara Public School & College turned 300 students — most of whom had never touched a circuit board — into young engineers who coded, built, and battled their own sumo bots.",
      content: blogContentHtml,
      category: workshopCategory._id,
      author: author._id,
      image: "/workshop/bpsc-main.png",
      isPublished: true,
      isApproved: true,
      readTime: 5,
      viewCount: 300,
      metaTags: ["robotics", "arduino", "stem", "education", "workshop", "bangladesh", "coding"],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log("✓ Inserted BPSC workshop blog post into database!");
  }

  console.log("\nAll tasks completed successfully!");
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error("Migration error:", err);
  process.exit(1);
});
