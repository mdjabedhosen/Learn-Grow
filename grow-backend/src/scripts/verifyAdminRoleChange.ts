/**
 * End-to-end verification of the admin role-change fix.
 *
 * Exercises the REAL `updateUserAdmin` service function against the real
 * database, using a throwaway user that is created and deleted in the same
 * run. Run with:
 *
 *   cd grow-backend && node --import tsx src/scripts/verifyAdminRoleChange.ts
 */
import mongoose from "mongoose";

import { ENV } from "../config/env.js";
import { User } from "../modules/user/model/user.model.js";
import * as service from "../modules/user/service/user.service.js";

const stamp = Date.now();
const email = `role-verify-${stamp}@example.test`;

const run = async () => {
  await mongoose.connect(ENV.MONGODB_URI);
  console.log("connected");

  const created = await User.create({
    name: "Role Verify Fixture",
    email,
    phone: `+8809${String(stamp).slice(-9)}`,
    password: "Temporary@123",
    role: "student",
    isVerified: true,
  });
  console.log(`created fixture user ${created._id} (role=student)`);

  let failed = false;

  try {
    // ---- 1. the exact call the admin dashboard makes -------------------
    console.log("\n[1] PUT /admin/:id  ->  updateUserAdmin({ role: 'instructor' })");
    const result = await service.updateUserAdmin(String(created._id), {
      name: "Role Verify Fixture",
      email,
      role: "instructor",
    });

    if (!result.success) {
      failed = true;
      console.log(`    FAIL: service returned success=false: ${result.message}`);
    } else {
      const persisted = await User.findById(created._id).select("role isApproved");
      console.log(`    service success  : ${result.success}`);
      console.log(`    DB role          : ${persisted?.role}`);
      console.log(`    DB isApproved    : ${persisted?.isApproved}`);
      if (persisted?.role !== "instructor") {
        failed = true;
        console.log("    FAIL: role was NOT persisted (this is the reported bug)");
      } else {
        console.log("    PASS: role persisted in the database");
      }
    }

    // ---- 2. demote back to student ------------------------------------
    console.log("\n[2] demote to student");
    const demote = await service.updateUserAdmin(String(created._id), { role: "student" });
    const afterDemote = await User.findById(created._id).select("role");
    console.log(`    DB role          : ${afterDemote?.role}`);
    if (!demote.success || afterDemote?.role !== "student") {
      failed = true;
      console.log("    FAIL: demotion did not persist");
    } else {
      console.log("    PASS: demotion persisted");
    }

    // ---- 3. an invalid role must be rejected ---------------------------
    console.log("\n[3] invalid role must be rejected");
    const bad = await service.updateUserAdmin(String(created._id), { role: "superadmin" });
    const afterBad = await User.findById(created._id).select("role");
    console.log(`    success          : ${bad.success}`);
    console.log(`    message          : ${bad.message}`);
    console.log(`    DB role (unchanged): ${afterBad?.role}`);
    if (bad.success || afterBad?.role !== "student") {
      failed = true;
      console.log("    FAIL: invalid role was accepted or applied");
    } else {
      console.log("    PASS: invalid role rejected, DB untouched");
    }

    // ---- 4. the dedicated PATCH /admin/:id/role endpoint ---------------
    console.log("\n[4] PATCH /admin/:id/role -> updateUserRoleAdmin('manager')");
    const viaPatch = await service.updateUserRoleAdmin(String(created._id), "manager");
    const afterPatch = await User.findById(created._id).select("role");
    console.log(`    DB role          : ${afterPatch?.role}`);
    if (!viaPatch.success || afterPatch?.role !== "manager") {
      failed = true;
      console.log("    FAIL: dedicated role endpoint did not persist");
    } else {
      console.log("    PASS: dedicated role endpoint persisted");
    }

    // ---- 5. other fields still work alongside a role change -----------
    console.log("\n[5] name change alongside a role change");
    const both = await service.updateUserAdmin(String(created._id), {
      name: "Renamed Verify Fixture",
      role: "guardian",
    });
    const afterBoth = await User.findById(created._id).select("name role");
    console.log(`    DB name          : ${afterBoth?.name}`);
    console.log(`    DB role          : ${afterBoth?.role}`);
    if (!both.success || afterBoth?.name !== "Renamed Verify Fixture" || afterBoth?.role !== "guardian") {
      failed = true;
      console.log("    FAIL: combined update did not apply");
    } else {
      console.log("    PASS: combined update applied");
    }
  } finally {
    await User.deleteOne({ _id: created._id });
    const stillThere = await User.findById(created._id);
    console.log(`\ncleanup: fixture removed = ${stillThere === null}`);
    await mongoose.disconnect();
  }

  console.log(failed ? "\nRESULT: FAILED" : "\nRESULT: ALL CHECKS PASSED");
  process.exit(failed ? 1 : 0);
};

run().catch((error) => {
  console.error("script error:", error);
  process.exit(1);
});
