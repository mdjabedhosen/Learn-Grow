/**
 * Full HTTP round-trip proof of the admin role-change fix.
 *
 * Creates a temporary admin + a temporary student against the live dev
 * backend, logs in over HTTP, performs the exact request the admin
 * dashboard performs (`PUT /api/users/admin/:id` with `role` in the body),
 * reads the role back over HTTP, then deletes both fixtures.
 *
 * Run with:
 *   cd grow-backend && node --import tsx src/scripts/verifyAdminRoleChangeHttp.ts
 */
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import { ENV } from "../config/env.js";
import { User } from "../modules/user/model/user.model.js";

const BASE = ENV.PORT ? `http://localhost:${ENV.PORT}/api/users` : "http://localhost:5005/api/users";

const stamp = Date.now();
const adminEmail = `tmp-admin-${stamp}@example.test`;
const studentEmail = `tmp-student-${stamp}@example.test`;
const PASSWORD = "Temporary@123";

const api = async (
  path: string,
  opts: { method?: string; token?: string; body?: unknown } = {}
) => {
  const res = await fetch(`${BASE}${path}`, {
    method: opts.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(opts.token ? { Authorization: `Bearer ${opts.token}` } : {}),
    },
    ...(opts.body ? { body: JSON.stringify(opts.body) } : {}),
  });
  const text = await res.text();
  let json: any = null;
  try {
    json = JSON.parse(text);
  } catch {
    json = { raw: text.slice(0, 200) };
  }
  return { status: res.status, json };
};

const run = async () => {
  await mongoose.connect(ENV.MONGODB_URI);

  const hashed = await bcrypt.hash(PASSWORD, 10);

  const admin = await User.create({
    name: "Tmp Admin",
    email: adminEmail,
    phone: `+8808${String(stamp).slice(-9)}`,
    password: hashed,
    role: "admin",
    isVerified: true,
    isApproved: true,
  });
  const student = await User.create({
    name: "Tmp Student",
    email: studentEmail,
    phone: `+8807${String(stamp).slice(-9)}`,
    password: hashed,
    role: "student",
    isVerified: true,
  });

  let failed = false;
  const fail = (msg: string) => {
    failed = true;
    console.log(`    FAIL: ${msg}`);
  };

  try {
    console.log(`[0] POST ${BASE}/login`);
    const login = await api("/login", {
      method: "POST",
      body: { email: adminEmail, password: PASSWORD },
    });
    const token =
      login.json?.data?.accessToken ?? login.json?.accessToken ?? "";
    console.log(`    status=${login.status} token=${token ? "yes" : "NO"}`);
    if (!token) {
      fail("could not log in as the temporary admin");
      console.log(`    body: ${JSON.stringify(login.json).slice(0, 300)}`);
    }

    if (token) {
      console.log(`\n[1] GET /admin/${student._id}  (before)`);
      const before = await api(`/admin/${student._id}`, { token });
      console.log(`    status=${before.status} role=${before.json?.data?.role}`);
      if (before.json?.data?.role !== "student") {
        fail(`expected role 'student' before the change`);
      }

      console.log(`\n[2] PUT /admin/${student._id}  { role: "instructor" }   <- the dashboard request`);
      const put = await api(`/admin/${student._id}`, {
        method: "PUT",
        token,
        body: { name: "Tmp Student", email: studentEmail, role: "instructor" },
      });
      console.log(`    status=${put.status} success=${put.json?.success}`);
      if (put.status !== 200 || !put.json?.success) {
        fail(`update failed: ${JSON.stringify(put.json).slice(0, 300)}`);
      }

      console.log(`\n[3] GET /admin/${student._id}  (after)`);
      const after = await api(`/admin/${student._id}`, { token });
      const roleAfter = after.json?.data?.role;
      console.log(`    status=${after.status} role=${roleAfter}`);
      if (roleAfter !== "instructor") {
        fail(`role is '${roleAfter}', expected 'instructor'`);
      } else {
        console.log("    PASS: the role change is visible over HTTP");
      }

      console.log(`\n[4] PATCH /admin/${student._id}/role  { role: "manager" }`);
      const patch = await api(`/admin/${student._id}/role`, {
        method: "PATCH",
        token,
        body: { role: "manager" },
      });
      const roleAfterPatch = (await api(`/admin/${student._id}`, { token })).json?.data?.role;
      console.log(`    status=${patch.status} role=${roleAfterPatch}`);
      if (roleAfterPatch !== "manager") {
        fail(`role is '${roleAfterPatch}', expected 'manager'`);
      } else {
        console.log("    PASS: the dedicated role endpoint works too");
      }

      console.log(`\n[5] PUT /admin/${student._id}  { role: "superadmin" }  (must be rejected)`);
      const bad = await api(`/admin/${student._id}`, {
        method: "PUT",
        token,
        body: { role: "superadmin" },
      });
      const roleAfterBad = (await api(`/admin/${student._id}`, { token })).json?.data?.role;
      console.log(`    status=${bad.status} message=${bad.json?.message}`);
      console.log(`    role still = ${roleAfterBad}`);
      if (bad.status !== 400 || roleAfterBad !== "manager") {
        fail("an invalid role was not rejected cleanly");
      } else {
        console.log("    PASS: invalid role rejected, stored role unchanged");
      }
    }
  } finally {
    await User.deleteMany({ _id: { $in: [admin._id, student._id] } });
    const left = await User.countDocuments({ _id: { $in: [admin._id, student._id] } });
    console.log(`\ncleanup: fixtures remaining = ${left}`);
    await mongoose.disconnect();
  }

  console.log(failed ? "\nRESULT: FAILED" : "\nRESULT: ALL CHECKS PASSED");
  process.exit(failed ? 1 : 0);
};

run().catch((error) => {
  console.error("script error:", error);
  process.exit(1);
});
