/**
 * Tests for the request-validation middleware (audit H-1).
 *
 * Zod's parse result used to be thrown away, so the original request body
 * survived with every extra key the client sent. Any service that passed
 * `req.body` into a database update therefore allowed mass assignment -
 * `role`, `isApproved`, `isPublished`, `price` and friends.
 *
 * Run with:
 *   cd grow-backend && node --import tsx --test src/middleware/__tests__/validate.test.ts
 */
import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { z } from "zod";

import { validate } from "../validate";

/** Minimal express-like request/response doubles. */
const runValidate = (
  schema: z.ZodSchema,
  body: any,
  params: any = {},
  query: any = {}
) => {
  let statusCode = 200;
  let payload: any = null;
  let nextCalled = false;

  const req: any = {
    body,
    params,
    query,
    method: "POST",
    path: "/test",
  };

  const res: any = {
    status(code: number) {
      statusCode = code;
      return res;
    },
    json(body: any) {
      payload = body;
      return res;
    },
  };

  validate(schema)(req, res, () => {
    nextCalled = true;
  });

  return { statusCode, payload, nextCalled, req };
};

describe("validate", () => {
  test("strips unknown keys from the body", () => {
    const schema = z.object({
      body: z.object({ title: z.string(), isApproved: z.boolean().optional() }),
    });

    const { nextCalled, req } = runValidate(schema, {
      title: "Hello",
      isApproved: true,
      role: "admin",
      price: 1,
    });

    assert.equal(nextCalled, true);
    assert.deepEqual(req.body, { title: "Hello", isApproved: true });
  });

  test("drops a client-supplied role from an admin payload", () => {
    const schema = z.object({
      body: z.object({ name: z.string() }),
    });

    const { req } = runValidate(schema, { name: "Mallory", role: "admin" });

    assert.equal("role" in req.body, false);
    assert.equal(req.body.name, "Mallory");
  });

  test("drops a client-supplied isApproved from a blog payload", () => {
    const schema = z.object({
      body: z.object({ title: z.string() }),
    });

    const { req } = runValidate(schema, {
      title: "My post",
      isApproved: true,
      isPublished: true,
    });

    assert.equal("isApproved" in req.body, false);
    assert.equal("isPublished" in req.body, false);
  });

  test("rejects a body that does not match the schema", () => {
    const schema = z.object({
      body: z.object({ title: z.string().min(3) }),
    });

    const { statusCode, nextCalled, payload } = runValidate(schema, { title: "x" });

    assert.equal(nextCalled, false);
    assert.equal(statusCode, 400);
    assert.equal(payload.success, false);
  });

  test("leaves route params alone when the schema does not declare them", () => {
    const schema = z.object({
      body: z.object({ title: z.string() }),
    });

    const { req } = runValidate(schema, { title: "x" }, { id: "abc123" });

    assert.equal(req.params.id, "abc123");
  });

  test("leaves query alone when the schema does not declare it", () => {
    const schema = z.object({
      body: z.object({ title: z.string() }),
    });

    const { req } = runValidate(schema, { title: "x" }, {}, { page: "2" });

    assert.equal(req.query.page, "2");
  });

  test("strips unknown query keys when the schema declares the query", () => {
    const schema = z.object({
      body: z.object({ title: z.string() }),
      query: z.object({ page: z.string().optional() }),
    });

    const { req } = runValidate(schema, { title: "x" }, {}, { page: "2", evil: "1" });

    assert.equal(req.query.page, "2");
    assert.equal("evil" in req.query, false);
  });
});
