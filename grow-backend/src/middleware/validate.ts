import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";

/**
 * Validate a request and REPLACE it with the parsed result.
 *
 * Zod strips unknown keys by default. Previously the parse result was thrown
 * away and the ORIGINAL `req.body` survived, so every extra key a client sent
 * (e.g. `role`, `isApproved`, `isPublished`, `price`) reached the service and
 * from there the database - a mass-assignment hole on every validated route.
 *
 * Writing the parsed value back makes the schema a real whitelist.
 */
export const validate =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      }) as {
        body?: unknown;
        params?: unknown;
        query?: unknown;
      };

      // Only replace a section when the schema actually declared it. A schema
      // that only defines `body` leaves `parsed.params` undefined, and
      // assigning that would wipe the route's `:id` parameters.
      if (parsed.body !== undefined) {
        req.body = parsed.body;
      }
      if (parsed.params !== undefined) {
        req.params = parsed.params as typeof req.params;
      }
      if (parsed.query !== undefined) {
        // Express 5 exposes `req.query` through a getter, so it cannot be
        // reassigned. Mutate the existing object in place instead.
        const target = req.query as Record<string, unknown>;
        for (const key of Object.keys(target)) {
          delete target[key];
        }
        Object.assign(target, parsed.query as Record<string, unknown>);
      }

      next();
    } catch (error: any) {
      const issues = error.issues || error.errors || [];
      const errorDetails = issues.map((err: any) => ({
        field: err.path.join("."),
        message: err.message,
        code: err.code,
      })) || [];

      const firstMessage = errorDetails.length > 0 ? errorDetails[0].message : "Validation failed";
      console.log(`[Validation Error] ${req.method} ${req.path}`, { body: req.body, errors: errorDetails });

      return res.status(400).json({
        success: false,
        message: firstMessage,
        errors: errorDetails,
      });
    }
  };
