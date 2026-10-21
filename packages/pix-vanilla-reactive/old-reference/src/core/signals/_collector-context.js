/**
 * Stack-based dependency-tracking context.
 *
 * The collector at the top of the stack captures every signal read via
 * `signal.get()`. A `null` frame disables tracking (see `withoutCollector`).
 *
 * @module core/signals/collector-context
 */

/** @type {Array<object | null>} */
const stack = [];

/**
 * Get the collector currently capturing dependencies.
 *
 * @returns {object | null} Active collector, or `null` when tracking is off.
 */
export function getCurrentCollector() {
  return stack.length === 0 ? null : stack[stack.length - 1];
}

/**
 * Run `fn` with `collector` as the active dependency collector.
 *
 * @param {object} collector - Collector to activate.
 * @param {() => unknown} fn - Function to run.
 * @returns {unknown} The result of `fn`.
 */
export function withCollector(collector, fn) {
  stack.push(collector);

  try {
    return fn();
  } finally {
    stack.pop();
  }
}

/**
 * Run `fn` with dependency tracking suspended.
 *
 * @param {() => unknown} fn - Function to run untracked.
 * @returns {unknown} The result of `fn`.
 */
export function withoutCollector(fn) {
  stack.push(null);

  try {
    return fn();
  } finally {
    stack.pop();
  }
}
