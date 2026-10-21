/**
 * Type guards for the Store.
 *
 * @module core/store/guards
 */

/**
 * Test whether a value is a non-null object (plain object or array).
 *
 * @param {unknown} value - Candidate value.
 * @returns {boolean} True when `value` is a non-null object.
 */
export function isObject(value) {
  return value !== null && typeof value === "object";
}

/**
 * Test whether a value is a plain object literal (not an array, Date, Map, …).
 *
 * @param {unknown} value - Candidate value.
 * @returns {boolean} True when `value` is a plain object.
 */
export function isPlainObject(value) {
  if (!isObject(value) || Array.isArray(value)) {
    return false;
  }

  const proto = Object.getPrototypeOf(value);

  return proto === Object.prototype || proto === null;
}
