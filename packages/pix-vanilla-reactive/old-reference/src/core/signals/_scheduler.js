/**
 * Microtask-batched effect scheduler.
 *
 * Runnables are deduplicated by identity within a single microtask, so a burst
 * of synchronous invalidations collapses into one run each.
 *
 * @module core/signals/scheduler
 */

/** @type {Set<{ run: () => void }>} */
const pending = new Set();

/** @type {boolean} */
let flushScheduled = false;

/**
 * Flush every pending runnable exactly once.
 *
 * @returns {void}
 */
function flush() {
  flushScheduled = false;

  const batch = Array.from(pending);

  pending.clear();

  for (const runnable of batch) {
    runnable.run();
  }
}

/**
 * Queue a runnable to run on the next microtask (deduplicated by identity).
 *
 * @param {{ run: () => void }} runnable - Object exposing a `run` method.
 * @returns {void}
 */
export function schedule(runnable) {
  pending.add(runnable);

  if (!flushScheduled) {
    flushScheduled = true;
    queueMicrotask(flush);
  }
}

/**
 * Synchronously flush any pending runnables. Primarily for tests.
 *
 * @returns {void}
 */
export function flushSync() {
  if (flushScheduled || pending.size > 0) {
    flush();
  }
}
