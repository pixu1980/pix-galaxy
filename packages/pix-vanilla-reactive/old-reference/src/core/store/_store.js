/**
 * Proxy-based reactive state container.
 *
 * Mutating `store.state` (directly, or through `set`/`update`) emits a
 * `store:change` CustomEvent carrying `{ path, oldValue, newValue }`. The
 * signal layer bridges those events into fine-grained reactivity.
 *
 * @module core/store/store
 */

import { deepClone } from "./_clone.js";
import { isObject } from "./_guards.js";
import { pathToString, toPathArray } from "./_paths.js";

/**
 * Resolve the event target used to broadcast `store:change`.
 *
 * Falls back to a private EventTarget when no global `window` exists (SSR,
 * worker, or test runners without a DOM).
 *
 * @returns {EventTarget} Broadcast target.
 */
function resolveEventTarget() {
  if (typeof window !== "undefined") {
    return window;
  }

  return new EventTarget();
}

/**
 * Reactive Proxy-backed store.
 */
export class Store {
  /**
   * @param {object} [initialState] - Initial state tree.
   * @param {object} [options] - Store options.
   * @param {EventTarget} [options.eventTarget] - Custom broadcast target.
   */
  constructor(initialState = {}, options = {}) {
    /** @type {EventTarget} */
    this._eventTarget = options.eventTarget ?? resolveEventTarget();
    /** @type {object} */
    this._raw = deepClone(initialState);
    /** @type {object} */
    this._proxy = this._wrap(this._raw, []);
  }

  /**
   * The Proxy-wrapped state tree. Mutate directly to trigger change events.
   *
   * @returns {object} Reactive state proxy.
   */
  get state() {
    return this._proxy;
  }

  /**
   * Wrap an object (or array) in a change-tracking Proxy.
   *
   * @param {object} target - Object to wrap.
   * @param {Array<string | number>} basePath - Path of `target` in the tree.
   * @returns {object} Proxy over `target`.
   */
  _wrap(target, basePath) {
    const store = this;

    return new Proxy(target, {
      get(obj, key, receiver) {
        const value = Reflect.get(obj, key, receiver);

        if (isObject(value) && typeof key !== "symbol") {
          return store._wrap(value, [...basePath, key]);
        }

        return value;
      },

      set(obj, key, value, receiver) {
        if (typeof key === "symbol") {
          return Reflect.set(obj, key, value, receiver);
        }

        const oldValue = obj[key];

        if (Object.is(oldValue, value)) {
          return true;
        }

        const ok = Reflect.set(obj, key, value, receiver);

        store._emit([...basePath, key], oldValue, value);

        return ok;
      },

      deleteProperty(obj, key) {
        if (typeof key === "symbol" || !(key in obj)) {
          return Reflect.deleteProperty(obj, key);
        }

        const oldValue = obj[key];
        const ok = Reflect.deleteProperty(obj, key);

        store._emit([...basePath, key], oldValue, undefined);

        return ok;
      },
    });
  }

  /**
   * Broadcast a `store:change` event.
   *
   * @param {Array<string | number>} segments - Mutated path.
   * @param {unknown} oldValue - Previous value.
   * @param {unknown} newValue - Next value.
   * @returns {void}
   */
  _emit(segments, oldValue, newValue) {
    const detail = { path: pathToString(segments), oldValue, newValue };

    this._eventTarget.dispatchEvent(new CustomEvent("store:change", { detail }));
  }

  /**
   * Read a value by dot-path.
   *
   * @param {string | Array<string | number>} [path] - Path to read (whole tree when omitted).
   * @returns {unknown} Value at `path`.
   */
  get(path) {
    const segments = toPathArray(path);
    let cursor = this._raw;

    for (const segment of segments) {
      if (!isObject(cursor)) {
        return undefined;
      }

      cursor = cursor[segment];
    }

    return cursor;
  }

  /**
   * Write a value by dot-path (emits a change event).
   *
   * @param {string | Array<string | number>} path - Path to write.
   * @param {unknown} value - Value to set.
   * @returns {void}
   */
  set(path, value) {
    const segments = toPathArray(path);

    if (segments.length === 0) {
      throw new Error("Store.set requires a non-empty path");
    }

    const parentSegments = segments.slice(0, -1);
    const key = segments[segments.length - 1];
    let cursor = this._proxy;

    for (const segment of parentSegments) {
      cursor = cursor[segment];
    }

    cursor[key] = value;
  }

  /**
   * Update a value by dot-path using a transform function.
   *
   * @param {string | Array<string | number>} path - Path to update.
   * @param {(current: unknown) => unknown} fn - Transform receiving the current value.
   * @returns {void}
   */
  update(path, fn) {
    this.set(path, fn(this.get(path)));
  }

  /**
   * Replace the entire state tree. Does not emit per-field change events —
   * callers should bump the tick bridge manually afterwards.
   *
   * @param {object} nextState - New state tree.
   * @returns {void}
   */
  replace(nextState) {
    this._raw = deepClone(nextState);
    this._proxy = this._wrap(this._raw, []);
  }

  /**
   * Produce a deep-cloned, proxy-free snapshot of the current state.
   *
   * @returns {object} Detached snapshot.
   */
  snapshot() {
    return deepClone(this._raw);
  }

  /**
   * Subscribe to `store:change` events.
   *
   * @param {(detail: { path: string, oldValue: unknown, newValue: unknown }) => void} listener - Change listener.
   * @returns {() => void} Unsubscribe function.
   */
  subscribe(listener) {
    const handler = (event) => listener(event.detail);

    this._eventTarget.addEventListener("store:change", handler);

    return () => this._eventTarget.removeEventListener("store:change", handler);
  }
}
