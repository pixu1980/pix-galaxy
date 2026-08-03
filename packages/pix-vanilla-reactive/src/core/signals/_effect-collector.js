// @ts-check
/**
 * @module core/signals/_effect-collector
 * Auto-tracking side-effect runner.
 *
 * An effect runs its function once immediately, collecting every signal read
 * through `get()` as a dependency, then re-runs (via the scheduler) whenever
 * any of those dependencies changes. The dependency graph is rebuilt on every
 * run, so branches added/removed dynamically stay in sync.
 */

import { withCollector } from './_collector-context.js';
import { schedule } from './_scheduler.js';

/**
 * @typedef {import('./_base-signal.js').BaseSignal} BaseSignal
 */

/**
 * Effect collector: owns the dependency set of one effect and its lifecycle.
 * @template T
 */
export class EffectCollector {
  /**
   * @param {() => T} fn Effect body. Runs immediately; tracked reads become
   *   dependencies.
   */
  constructor(fn) {
    /** @type {() => T} */
    this.fn = fn;
    /** @type {Map<BaseSignal, () => void>} Dependency → unsubscribe. */
    this.deps = new Map();
    /** @type {boolean} Whether the effect still runs. */
    this.active = true;
    /** @type {() => void} Bound runner for scheduler batches. */
    this.run = this.run.bind(this);
    this.run();
  }

  /**
   * Register a dependency (called by {@link BaseSignal#track}).
   * @param {BaseSignal} sig
   */
  addDependency(sig) {
    if (this.deps.has(sig)) return;
    this.deps.set(
      sig,
      sig.subscribe(() => schedule(this))
    );
  }

  /** Unsubscribe from every tracked dependency. */
  cleanup() {
    for (const unsubscribe of this.deps.values()) unsubscribe();
    this.deps.clear();
  }

  /**
   * Re-run the effect body with a fresh dependency set.
   * @returns {void}
   */
  run() {
    if (!this.active) return;
    this.cleanup();
    withCollector(this, () => {
      this.fn();
    });
  }

  /**
   * Permanently stop the effect and release its dependencies.
   * @returns {void}
   */
  stop() {
    this.active = false;
    this.cleanup();
  }
}
