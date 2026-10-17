/**
 * ReDoS & Regex Injection Protection Utility
 * Sanitizes and escapes raw user query inputs for safe MongoDB $regex matching.
 */

/**
 * Escapes special regex metacharacters in a string so it can be safely used
 * inside a new RegExp or a MongoDB { $regex: ... } query.
 * Truncates excessive input lengths to 100 characters to prevent memory exhaustion.
 */
export const escapeRegex = (value: unknown): string => {
  if (typeof value !== "string" || !value.trim()) {
    return "";
  }
  // Trim and cap at 100 characters to prevent payload bloat
  const trimmed = value.trim().slice(0, 100);
  // Escape all regular expression special characters
  return trimmed.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
};

/**
 * Constructs a safe MongoDB case-insensitive regex object.
 * Returns null if the search term is empty or invalid.
 */
export const safeRegex = (value: unknown) => {
  const escaped = escapeRegex(value);
  if (!escaped) return null;
  return { $regex: escaped, $options: "i" };
};
