/**
 * Copy only the listed fields from an untrusted object.
 *
 * Route bodies arrive straight from the client. Passing them into
 * `findByIdAndUpdate(id, body)` lets a caller set any field on the model -
 * `isApproved`, `isPublished`, `role`, `price` - which is mass assignment.
 *
 * This helper is the whitelist counterpart to the request schemas: it DROPS
 * unknown keys instead of rejecting the request, so adding a field to a model
 * can never silently make it client-writable.
 */

/** Fields that are present but not set (undefined) are skipped. */
export const pickDefined = <T extends Record<string, any>>(
  source: T | undefined | null,
  fields: readonly (keyof T & string)[]
): Partial<T> => {
  const result: Partial<T> = {};
  if (!source || typeof source !== "object") return result;

  for (const field of fields) {
    const value = (source as Record<string, unknown>)[field];
    if (value !== undefined) {
      (result as Record<string, unknown>)[field] = value;
    }
  }

  return result;
};

/**
 * Like `pickDefined`, but also drops `null` and empty-string values, which
 * the services treat as "clear this field".
 */
export const pickPresent = <T extends Record<string, any>>(
  source: T | undefined | null,
  fields: readonly (keyof T & string)[]
): Partial<T> => {
  const result: Partial<T> = {};
  if (!source || typeof source !== "object") return result;

  for (const field of fields) {
    const value = (source as Record<string, unknown>)[field];
    if (value !== undefined && value !== null && value !== "") {
      (result as Record<string, unknown>)[field] = value;
    }
  }

  return result;
};
