/**
 * Deterministic number and currency formatting helpers.
 *
 * `Number.prototype.toLocaleString()` called WITHOUT an explicit locale renders
 * differently depending on the host: the server's locale, the browser's locale
 * and the installed ICU data all change the output (grouping separator, decimal
 * separator, digit shapes). That makes a price rendered on the server differ
 * from the same price rendered on the client, and makes the output differ
 * between deployments.
 *
 * Every price rendered by the app must therefore go through an explicit, fixed
 * locale. `en-US` is used because the admin/instructor surfaces render plain
 * Western digits; the Bengali surfaces use `utils/bengaliNumerals.ts`, which
 * builds on the same fixed `en-US` grouping.
 */

const NUMBER_FORMATTER = new Intl.NumberFormat("en-US");

/**
 * Formats a number using the fixed `en-US` locale, e.g. `2999` -> `"2,999"`.
 *
 * Returns an empty string for null / undefined / non-finite input so callers
 * never render "NaN" or "undefined" inside a price slot.
 */
export const formatNumber = (
  value: number | string | null | undefined
): string => {
  if (value === null || value === undefined || value === "") return "";

  const num =
    typeof value === "string" ? Number(value.replace(/,/g, "").trim()) : value;

  if (!Number.isFinite(num)) return "";

  return NUMBER_FORMATTER.format(num);
};

/**
 * Formats an amount as Bangladeshi Taka, e.g. `2999` -> `"৳2,999"`.
 */
export const formatBDT = (
  value: number | string | null | undefined,
  prefix: string = "৳"
): string => {
  const formatted = formatNumber(value);
  return formatted ? `${prefix}${formatted}` : "";
};
