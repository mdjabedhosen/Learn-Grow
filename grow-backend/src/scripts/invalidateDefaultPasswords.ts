/**
 * Invalidate published default passwords.
 *
 * The repository used to ship default credentials (`Admin@123` for the
 * seeded administrators, `teacher123` / `student123` / `guardian123` for
 * seeded demo accounts) and to re-create those accounts on every boot. Those
 * passwords are public, so every account that still uses one is an open
 * door.
 *
 * This script replaces such a password with a random, unguessable value.
 * The account stays enabled and usable - the operator just has to set a new
 * password with `npm run create-admin` (or the in-app password change).
 *
 * Run with:
 *   cd grow-backend && node --import tsx src/scripts/invalidateDefaultPasswords.ts
 */
import bcrypt from "bcryptjs";
import crypto from "crypto";
import mongoose from "mongoose";

import { ENV } from "../config/env.js";
import { User } from "../modules/user/model/user.model.js";

/** Passwords that were ever committed to the repository. */
const PUBLISHED_PASSWORDS = [
  "Admin@123",
  "Admin123",
  "admin123",
  "teacher123",
  "student123",
  "guardian123",
  "@M.jabed3834",
  "password123",
];

const run = async () => {
  await mongoose.connect(ENV.MONGODB_URI);

  const users = await User.find({}).select("name email role phone password");
  const affected: Array<{ id: string; email?: string; name?: string; role: string; password: string }> = [];

  for (const user of users) {
    if (!user.password) continue;

    for (const published of PUBLISHED_PASSWORDS) {
      const matches = await bcrypt.compare(published, user.password);
      if (!matches) continue;

      // Replace the published password with an unguessable one.
      const random = crypto.randomBytes(32).toString("base64url");
      user.password = await bcrypt.hash(random, 10);
      await user.save();

      affected.push({
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
        password: published,
      });
      break;
    }
  }

  console.log(`Scanned ${users.length} accounts.`);
  console.log(`Invalidated ${affected.length} published default password(s):`);

  for (const a of affected) {
    console.log(
      `  - ${(a.email || a.name || a.id).padEnd(38)} role=${a.role.padEnd(10)} was "${a.password}"`
    );
  }

  if (affected.length > 0) {
    console.log("");
    console.log("Set a new password for each of these with:");
    console.log("  npm run create-admin -- --email <email> --name \"<name>\" --generate");
  }

  await mongoose.disconnect();
  process.exit(0);
};

run().catch((error) => {
  console.error("invalidateDefaultPasswords failed:", error);
  process.exit(1);
});
