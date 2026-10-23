/** Throwaway student for the local UI checks. Writes /tmp/student.json. */
import fs from "fs";
import mongoose from "mongoose";
import { ENV } from "../src/config/env.js";
import { User } from "../src/modules/user/model/user.model.js";
import { Course } from "../src/modules/course/model/course.model.js";

const BASE = "http://localhost:5005/api";

(async () => {
  await mongoose.connect(ENV.MONGODB_URI);
  const bcrypt = (await import("bcryptjs")).default;
  const email = `ui-shot-${Date.now()}@example.test`;
  const password = "UiShotTest!123";

  const user = await User.create({
    name: "UI Shot Student",
    email,
    phone: `+88017${Math.floor(Math.random() * 900000000 + 100000000)}`,
    password: await bcrypt.hash(password, 10),
    role: "student",
  });

  const res = await fetch(`${BASE}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const json: any = await res.json();
  const token = json?.data?.accessToken || json?.data?.token || "";

  const course = await Course.findOne({ isPublished: true }).lean();

  fs.writeFileSync(
    "/tmp/student.json",
    JSON.stringify({ email, password, token, userId: String(user._id), courseId: String(course!._id) })
  );
  console.log(`  student created: ${email}  course=${course!._id}  token=${token ? "yes" : "NO"}`);
  await mongoose.disconnect();
  process.exit(token ? 0 : 1);
})();
