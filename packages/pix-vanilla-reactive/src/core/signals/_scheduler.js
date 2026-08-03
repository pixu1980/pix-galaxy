// @ts-check
/**
 * @module core/signals/_scheduler
 * Microtask-batched effect scheduling.
 *
 * Multiple invalidations of the same effect within one tick collapse into a
 * single run, executed on the microtask queue (after the current script).
 */

/** @type {Set<import('./_effect-collector.js').EffectCollector<any>>} Pending effects. */
const scheduled = new Set();
/** @type {boolean} A flush microtask is already queued. */
let flushing = false;

/**
 * Schedule a job to run once on the microtask queue.
 * @param {import('./_effect-collector.js').EffectCollector<any>} job
 */
export function schedule(job) {
  scheduled.add(job);
  if (flushing) return;
  flushing = true;
  queueMicrotask(() => {
    try {
      while (scheduled.size > 0) {
        const batch = [...scheduled];
        scheduled.clear();
        for (const j of batch) j.run();
      }
    } finally {
      flushing = false;
    }
  });
}
