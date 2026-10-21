/**
 * Store barrel — Proxy-based reactive state container.
 *
 * @module core/store
 */

export { Store } from "./_store.js";
export { deepClone, clonePlainValue } from "./_clone.js";
export { isObject, isPlainObject } from "./_guards.js";
export { toPathArray, pathToString } from "./_paths.js";
