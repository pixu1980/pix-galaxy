// @ts-check

/**
 * @typedef {"primary" | "secondary" | "ghost"} PixButtonVariant
 */

/**
 * Normalize a button variant value.
 *
 * @param {string | null | undefined} value
 * @returns {PixButtonVariant}
 */
export function normalizeVariant(value) {
  if (value === "secondary" || value === "ghost") {
    return value;
  }

  return "primary";
}
