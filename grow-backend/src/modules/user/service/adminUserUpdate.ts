/**
 * Pure helpers for building an admin user update payload.
 *
 * These live outside `user.service.ts` so they can be unit tested without a
 * database connection. The bug they exist to prevent: the admin dashboard
 * sends `role` in the `PUT /admin/:id` body, but the service used to build
 * its `$set` from a hand-written whitelist that omitted `role`. The update
 * therefore reported success while the stored role never changed.
 */
import bcrypt from "bcryptjs";

import { USER_ROLES, isValidUserRole } from "../model/user.model";

export interface AdminUserUpdateInput {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  role?: string;
  isBlocked?: boolean;
}

/**
 * Uniform result shape.
 *
 * A discriminated union would read better, but this repo compiles with
 * `strict: false`, which disables the narrowing needed to read `message`
 * off the failure branch. A flat shape keeps the call sites simple.
 */
export interface AdminUserUpdateResult {
  /** true when the payload is valid and `toSet` is ready to apply */
  ok: boolean;
  /** the fields to apply; empty when `ok` is false */
  toSet: Record<string, unknown>;
  /** human-readable reason; present when `ok` is false */
  message?: string;
}

/**
 * Build the `$set` document for `PUT /admin/:id`.
 *
 * Only whitelisted fields are ever applied, so a client cannot smuggle
 * arbitrary keys (e.g. `isAdmin`, `googleId`) into the update.
 */
export const buildAdminUserUpdate = async (
  updates: AdminUserUpdateInput
): Promise<AdminUserUpdateResult> => {
  const toSet: Record<string, unknown> = {};

  if (updates.name) toSet.name = updates.name;
  if (updates.email) toSet.email = updates.email;
  if (updates.phone) toSet.phone = updates.phone;
  if (updates.password) toSet.password = await bcrypt.hash(updates.password, 10);
  if (typeof updates.isBlocked === "boolean") toSet.isBlocked = updates.isBlocked;

  // `role` must be honoured - the admin dashboard relies on it.
  const roleProvided =
    updates.role !== undefined && updates.role !== null && updates.role !== "";

  if (roleProvided) {
    if (!isValidUserRole(updates.role)) {
      return {
        ok: false,
        toSet: {},
        message: `Invalid role "${updates.role}". Must be one of: ${USER_ROLES.join(", ")}`,
      };
    }
    toSet.role = updates.role;
    // An admin assigning the instructor role IS the approval step, so the
    // instructor approval gate must not leave the account pending.
    toSet.isApproved = true;
  }

  return { ok: true, toSet };
};
