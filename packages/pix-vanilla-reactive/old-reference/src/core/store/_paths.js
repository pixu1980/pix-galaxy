/**
 * Dot-path utilities for reading and writing nested state.
 *
 * @module core/store/paths
 */

/**
 * Normalize a path into an array of string/number segments.
 *
 * Accepts `"a.b[0].c"`, `"a.b.0.c"`, or `["a", "b", 0, "c"]`.
 *
 * @param {string | Array<string | number>} path - Path to normalize.
 * @returns {Array<string | number>} Path segments.
 */
export function toPathArray(path) {
  if (Array.isArray(path)) {
    return path.slice();
  }

  if (typeof path !== "string" || path.length === 0) {
    return [];
  }

  return path
    .replace(/\[(\w+)\]/g, ".$1")
    .split(".")
    .filter((segment) => segment.length > 0);
}

/**
 * Join path segments into a canonical dot-path string.
 *
 * @param {Array<string | number>} segments - Path segments.
 * @returns {string} Dot-path string.
 */
export function pathToString(segments) {
  return segments.join(".");
}
