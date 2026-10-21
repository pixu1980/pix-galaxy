/**
 * Auto-tracking effect with dynamic dependency resubscription.
 *
 * @module core/signals/effect-collector
 */

import { withCollector } from "./_collector-context.js";
import { schedule } from "./_scheduler.js";

/**
 * Runs a side-effecting function and re-runs it whenever a tracked signal changes.
 */
export class EffectCollector {
  /**
   * @param {() => void} fn - Effect body.
   */
  constructor(fn) {
    /** @type {() => void} */
    this._fn = fn;
    /** @type {Set<import("./_base-signal.js").BaseSignal>} */
    this._deps = new Set();
    /** @type {boolean} */
    this._disposed = false;
  }

  /**
   * Record a dependency edge (called by `BaseSignal.track`).
   *
   * @param {import("./_base-signal.js").BaseSignal} signal - Signal read during the effect.
   * @returns {void}
   */
  addDependency(signal) {
    this._deps.add(signal);
  }

  /**
   * Drop all dependency edges before a re-run.
   *
   * @returns {void}
   */
  _cleanupDeps() {
    for (const dep of this._deps) {
      dep.removeSubscriber(this);
    }

    this._deps.clear();
  }

  /**
   * Schedule a re-run on the next microtask.
   *
   * @returns {void}
   */
  invalidate() {
    if (this._disposed) {
      return;
    }

    schedule(this);
  }

  /**
   * Run the effect, re-collecting dependencies.
   *
   * @returns {void}
   */
  run() {
    if (this._disposed) {
      return;
    }

    this._cleanupDeps();
    withCollector(this, () => this._fn());
  }

  /**
   * Permanently stop the effect and release its dependencies.
   *
   * @returns {void}
   */
  dispose() {
    this._disposed = true;
    this._cleanupDeps();
  }
}
