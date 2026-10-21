/**
 * Tests for the admin user update payload builder.
 *
 * Regression guard for the "admin changes a user's role from the dashboard,
 * the UI says it worked, but the stored role never changes" bug: the service
 * built its `$set` from a whitelist that silently omitted `role`.
 *
 * Run with:
 *   cd grow-backend && node --import tsx --test src/modules/user/service/__tests__/adminUserUpdate.test.ts
 */
import { describe, test } from "node:test";
import assert from "node:assert/strict";

import { buildAdminUserUpdate } from "../adminUserUpdate";
import { USER_ROLES } from "../../model/user.model";

describe("buildAdminUserUpdate", () => {
  test("applies the role when one is supplied", async () => {
    const result = await buildAdminUserUpdate({ role: "instructor" });

    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.equal(result.toSet.role, "instructor");
  });

  test("the role survives alongside the other editable fields", async () => {
    const result = await buildAdminUserUpdate({
      name: "Md Jabed Hosen",
      email: "m.riyad3834@gmail.com",
      phone: "+8801700000000",
      role: "instructor",
    });

    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.equal(result.toSet.role, "instructor");
    assert.equal(result.toSet.name, "Md Jabed Hosen");
    assert.equal(result.toSet.email, "m.riyad3834@gmail.com");
    assert.equal(result.toSet.phone, "+8801700000000");
  });

  test("every supported role can be assigned", async () => {
    for (const role of USER_ROLES) {
      const result = await buildAdminUserUpdate({ role });
      assert.equal(result.ok, true, `role ${role} should be accepted`);
      if (!result.ok) continue;
      assert.equal(result.toSet.role, role);
    }
  });

  test("rejects a role that is not in the allowed list", async () => {
    const result = await buildAdminUserUpdate({ role: "superadmin" });

    assert.equal(result.ok, false);
    if (result.ok) return;
    assert.match(result.message, /Invalid role/);
    assert.match(result.message, /superadmin/);
  });

  test("rejects a non-string role", async () => {
    const result = await buildAdminUserUpdate({
      role: { $ne: "student" } as unknown as string,
    });

    assert.equal(result.ok, false);
  });

  test("leaves the role untouched when it is omitted", async () => {
    const result = await buildAdminUserUpdate({ name: "Only Name" });

    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.equal("role" in result.toSet, false);
    assert.equal("isApproved" in result.toSet, false);
  });

  test("treats an empty role string as 'not provided'", async () => {
    const result = await buildAdminUserUpdate({ role: "" });

    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.equal("role" in result.toSet, false);
  });

  test("treats a null role as 'not provided'", async () => {
    const result = await buildAdminUserUpdate({
      role: null as unknown as string,
    });

    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.equal("role" in result.toSet, false);
  });

  test("approves the account when the instructor role is assigned", async () => {
    const result = await buildAdminUserUpdate({ role: "instructor" });

    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.equal(result.toSet.isApproved, true);
  });

  test("keeps isBlocked as a boolean only", async () => {
    const blocked = await buildAdminUserUpdate({ isBlocked: true });
    assert.equal(blocked.ok, true);
    if (blocked.ok) assert.equal(blocked.toSet.isBlocked, true);

    const notBlocked = await buildAdminUserUpdate({ isBlocked: false });
    assert.equal(notBlocked.ok, true);
    if (notBlocked.ok) assert.equal(notBlocked.toSet.isBlocked, false);

    const garbage = await buildAdminUserUpdate({
      isBlocked: "yes" as unknown as boolean,
    });
    assert.equal(garbage.ok, true);
    if (garbage.ok) assert.equal("isBlocked" in garbage.toSet, false);
  });

  test("hashes the password instead of storing it in plain text", async () => {
    const result = await buildAdminUserUpdate({ password: "Secret@123" });

    assert.equal(result.ok, true);
    if (!result.ok) return;
    const hash = result.toSet.password as string;
    assert.notEqual(hash, "Secret@123");
    assert.match(hash, /^\$2[aby]\$/);
  });

  test("ignores keys that are not on the whitelist", async () => {
    const result = await buildAdminUserUpdate({
      name: "Safe",
      googleId: "attacker-controlled",
      isVerified: true,
      _id: "attacker-controlled",
    } as never);

    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.deepEqual(Object.keys(result.toSet).sort(), ["name"]);
  });
});
