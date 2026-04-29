// @ts-check

/**
 * @typedef {"default" | "outlined" | "elevated"} PixCardVariant
 */

/**
 * Normalize a card variant value.
 *
 * @param {string | null | undefined} value
 * @returns {PixCardVariant}
 */
export function normalizeVariant(value) {
  if (value === "outlined" || value === "elevated") {
    return value;
  }

  return "default";
}
