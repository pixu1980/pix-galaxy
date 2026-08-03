// @ts-check
/**
 * @module core/template-engine/_expr-part
 * `{{ }}` interpolation part with filter pipes and signal support.
 */

import { evaluateExpression } from './_expression-parser.js';
import { isSignalLike } from '../signals/index.js';
import { clearRange, normalizeExprValue } from './_range.js';
import { defineDisposable } from '../disposable/index.js';

/**
 * Renders the result of a parsed `{{ }}` expression between two comment
 * markers. Supports raw-HTML via a trailing `| raw` filter and live updates
 * when the expression evaluates to a signal.
 */
export class ExprPart {
  /**
   * @param {Comment} start
   * @param {Comment} end
   */
  constructor(start, end) {
    this.start = start;
    this.end = end;
    /** @type {Node | null} Currently committed node. */
    this.currentNode = null;
    /** @type {import('./_expression-parser.js').ParsedExpression | null} */
    this.parsedExpr = null;
    /** @type {(() => void) | null} Signal unsubscribe handle. */
    this.signalCleanup = null;
  }

  /**
   * Evaluate `parsedExpr` against `ctx` and commit.
   * @param {import('./_expression-parser.js').ParsedExpression} parsedExpr
   * @param {object} ctx
   */
  setValue(parsedExpr, ctx) {
    this.parsedExpr = parsedExpr;
    this.disposeSignal();
    let value = evaluateExpression(parsedExpr, ctx);
    if (isSignalLike(value)) {
      this.bindSignal(value);
      return;
    }
    this.commit(value, this.hasRaw());
  }

  /**
   * Subscribe to a signal-valued expression result.
   * @param {import('../signals/index.js').ReadableSignal} sig
   */
  bindSignal(sig) {
    this.disposeSignal();
    this.signalCleanup = sig.subscribe(() => {
      if (!this.start.isConnected) {
        this.disposeSignal();
        return;
      }
      this.commit(sig.get(), this.hasRaw());
    });
    this.commit(sig.get(), this.hasRaw());
  }

  /**
   * True when the pipeline ends with the `raw` filter (HTML passthrough).
   * @returns {boolean}
   */
  hasRaw() {
    return Boolean(
      this.parsedExpr &&
        this.parsedExpr.filters.length > 0 &&
        this.parsedExpr.filters[this.parsedExpr.filters.length - 1].name === 'raw'
    );
  }

  /** Unsubscribe from the bound signal, if any. */
  disposeSignal() {
    if (this.signalCleanup) {
      this.signalCleanup();
      this.signalCleanup = null;
    }
  }

  /** Release the signal subscription, if any. */
  dispose() {
    this.disposeSignal();
  }

  /**
   * Replace the range content with the rendered node.
   * @param {unknown} value
   * @param {boolean} useRaw
   */
  commit(value, useRaw) {
    clearRange(this.start, this.end);
    const node = normalizeExprValue(value, useRaw);
    this.currentNode = node;
    if (this.start.parentNode) this.start.parentNode.insertBefore(node, this.end);
  }
}

defineDisposable(ExprPart);
