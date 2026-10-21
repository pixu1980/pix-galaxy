/**
 * Deep cloning helpers that understand Date, RegExp, Map, Set, arrays.
 *
 * @module core/store/clone
 */

import { isObject } from "./_guards.js";

/**
 * Clone a single non-container value, preserving Date and RegExp identity.
 *
 * @param {unknown} value - Value to clone.
 * @returns {unknown} A cloned value, or the original for primitives.
 */
export function clonePlainValue(value) {
  if (value instanceof Date) {
    return new Date(value.getTime());
  }

  if (value instanceof RegExp) {
    return new RegExp(value.source, value.flags);
  }

  return value;
}

/**
 * Recursively deep-clone a value tree (objects, arrays, Map, Set, Date, RegExp).
 *
 * @param {unknown} value - Value to clone.
 * @returns {unknown} A structurally independent copy.
 */
export function deepClone(value) {
  if (!isObject(value)) {
    return value;
  }

  if (value instanceof Date || value instanceof RegExp) {
    return clonePlainValue(value);
  }

  if (value instanceof Map) {
    const out = new Map();

    for (const [key, entry] of value) {
      out.set(key, deepClone(entry));
    }

    return out;
  }

  if (value instanceof Set) {
    const out = new Set();

    for (const entry of value) {
      out.add(deepClone(entry));
    }

    return out;
  }

  if (Array.isArray(value)) {
    return value.map((entry) => deepClone(entry));
  }

  const out = {};

  for (const key of Object.keys(value)) {
    out[key] = deepClone(value[key]);
  }

  return out;
}
