/**
 * Create (or reset) an administrator account.
 *
 * Replaces the old behaviour where `ensureAdminUsers()` silently created
 * admin accounts with a hardcoded password on every server boot. This is an
 * explicit, one-off operator action.
 *
 * Usage:
 *   npm run create-admin -- --email you@example.com --name "Your Name" [--password "S3cret!pass"]
 *   npm run create-admin -- --email you@example.com --name "Your Name" --generate
 *
 * Without `--password` or `--generate` the script prompts for one.
 */
import bcrypt from "bcryptjs";
import readline from "readline";
import mongoose from "mongoose";

import { ENV } from "../config/env.js";
import { User } from "../modules/user/model/user.model.js";
import { connectDB } from "../database/mongoose.js";

const parseArgs = (): Record<string, string | boolean> => {
  const args: Record<string, string | boolean> = {};
  const argv = process.argv.slice(2);

  for (let i = 0; i < argv.length; i++) {
    const token = argv[i];
    if (!token.startsWith("--")) continue;
    const key = token.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith("--")) {
      args[key] = true;
    } else {
      args[key] = next;
      i++;
    }
  }
  return args;
};

const prompt = (question: string): Promise<string> =>
  new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });

const promptSecret = (question: string): Promise<string> =>
  new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: true,
    });
    // Suppress echo so the password is not written to the scrollback.
    const onData = (char: string) => {
      if (["\n", "\r", ""].includes(char)) {
        process.stdin.removeListener("data", onData);
      } else {
        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0);
        process.stdout.write(question + "".padEnd(question.length, " "));
      }
    };
    process.stdin.on("data", onData);
    rl.question(question, (answer) => {
      rl.close();
      process.stdout.write("\n");
      resolve(answer.trim());
    });
  });

const run = async () => {
  const args = parseArgs();

  const email = String(args.email || "").trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    console.error("--email must be a valid email address.");
    process.exit(1);
  }

  const name = String(args.name || "").trim();
  if (!name) {
    console.error("--name is required.");
    process.exit(1);
  }

  let password = String(args.password || "");
  if (!password && args.generate) {
    password = require("crypto").randomBytes(18).toString("base64url");
    console.log(`\nGenerated password: ${password}\n`);
  }
  if (!password) {
    password = await promptSecret("Password: ");
  }
  if (password.length < 8) {
    console.error("Password must be at least 8 characters.");
    process.exit(1);
  }

  await connectDB();

  const hashed = await bcrypt.hash(password, 10);
  const existing = await User.findOne({ email });

  if (existing) {
    existing.name = name;
    existing.role = "admin";
    existing.password = hashed;
    existing.isVerified = true;
    existing.isApproved = true;
    existing.isBlocked = false;
    await existing.save();
    console.log(`Updated existing account ${email} to admin.`);
  } else {
    await User.create({
      name,
      email,
      password: hashed,
      role: "admin",
      isVerified: true,
      isApproved: true,
      isBlocked: false,
    });
    console.log(`Created admin account ${email}.`);
  }

  await mongoose.disconnect();
  process.exit(0);
};

run().catch((error) => {
  console.error("create-admin failed:", error);
  process.exit(1);
});
