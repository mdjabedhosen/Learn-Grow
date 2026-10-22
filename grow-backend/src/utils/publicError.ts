/**
 * Public-safe error messages.
 *
 * Controller catch blocks used to forward the raw driver message straight to
 * the client, e.g.
 *
 *   Cast to ObjectId failed for value "notanid" (type string) at path "_id"
 *   for model "Event"
 *
 * That leaked the Mongoose model name and the collection path, turned a
 * client-side mistake (a bad id) into a 500, and let a scanner map the
 * schema by feeding the API garbage.
 *
 * `publicErrorMessage` returns a message that is safe to return to an
 * anonymous client, and `publicErrorStatus` maps the error to the right
 * status code (a malformed id is a 400, not a 500).
 */

const isProduction = () => process.env.NODE_ENV === "production";

/** Mongoose threw a CastError - e.g. a malformed ObjectId. */
export const isCastError = (err: any): boolean =>
  !!err &&
  (err.name === "CastError" ||
    err.name === "ObjectParameterError" ||
    err.name === "BSONError");

/** Mongoose schema validation failed. */
export const isValidationError = (err: any): boolean =>
  !!err && err.name === "ValidationError";

/** Mongo duplicate key (E11000). */
export const isDuplicateKeyError = (err: any): boolean =>
  !!err && (err.code === 11000 || err.code === 11001);

/**
 * A message that is safe to send to an anonymous client.
 * In development the original message is kept for debugging.
 */
export const publicErrorMessage = (
  err: any,
  fallback = "Internal Server Error"
): string => {
  if (isCastError(err)) return "Invalid identifier format";
  if (isValidationError(err)) return "Validation failed";
  if (isDuplicateKeyError(err)) return "Duplicate record already exists";

  if (!isProduction()) {
    return err?.message || fallback;
  }

  return fallback;
};

/**
 * The HTTP status an error should produce.
 * A malformed id or a failed schema validation is the client's fault (400),
 * not a server fault (500).
 */
export const publicErrorStatus = (err: any, fallback = 500): number => {
  if (isCastError(err) || isValidationError(err) || isDuplicateKeyError(err)) {
    return 400;
  }
  if (typeof err?.status === "number" && err.status >= 400 && err.status < 600) {
    return err.status;
  }
  return fallback;
};
