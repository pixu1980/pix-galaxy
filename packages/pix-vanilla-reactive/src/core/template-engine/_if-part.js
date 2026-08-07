// @ts-check
/**
 * @module core/template-engine/_if-part
 * `<if condition="expr">` directive: conditional block with signal support.
 */

import { evaluateExpression, parseExpression } from './_expression-parser.js';
import { isSignalLike } from '../signals/index.js';
import { clearRange } from './_range.js';
import { renderInnerTemplate } from './_inner-template.js';

/**
 * Renders the inner template only while the condition is truthy. The
 * condition expression may resolve to a signal - the block then toggles
 * automatically.
 */
export class IfPart {
  /**
   * @param {Comment} start
   * @param {Comment} end
   * @param {import('./_expression-parser.js').ParsedExpression} conditionParsed
   * @param {string} innerTemplate Raw inner HTML.
   */
  constructor(start, end, conditionParsed, innerTemplate) {
    this.start = start;
    this.end = end;
    this.conditionParsed = conditionParsed;
    this.innerTemplate = innerTemplate;
    /** @type {Comment | null} Content range markers while visible. */
    this.contentStart = null;
    /** @type {Comment | null} */
    this.contentEnd = null;
    /** @type {import('../signals/index.js').ReadableSignal | null} */
    this.conditionSignal = null;
    /** @type {(() => void) | null} */
    this.conditionCleanup = null;
    /** @type {boolean} Whether content is currently mounted. */
    this.visible = false;
    /** @type {object | null} */
    this.ctx = null;
  }

  /**
   * Resolve the condition, subscribe to a signal if present, and evaluate.
   * @param {object} ctx
   */
  init(ctx) {
    this.ctx = ctx;
    const result = evaluateExpression(this.conditionParsed, ctx);
    if (isSignalLike(result)) {
      if (result !== this.conditionSignal) {
        this.conditionSignal = result;
        this.conditionCleanup = result.subscribe(() => this.evaluate());
      }
    } else {
      this.disposeConditionSignal();
    }
    this.evaluate();
  }
  evaluate() {
    const value = this.conditionSignal
      ? this.conditionSignal.get()
      : evaluateExpression(this.conditionParsed, this.ctx ?? {});
    if (Boolean(value)) this.render();
    else this.clear();
  }

  /**
   * Mount the inner template between two fresh comment markers.
   */
  render() {
    this.clear();
    this.contentStart = document.createComment('if:cs');
    this.contentEnd = document.createComment('if:ce');
    this.end.parentNode?.insertBefore(this.contentStart, this.end);
    this.end.parentNode?.insertBefore(this.contentEnd, this.end);

    if (this.innerTemplate) {
      const rendered = renderInnerTemplate(this.innerTemplate, this.ctx ?? {});
      const tmp = document.createElement('template');
      tmp.innerHTML = rendered;
      const children = [...tmp.content.childNodes];
      const insertPoint = this.contentEnd;
      for (let i = children.length - 1; i >= 0; i--) {
        insertPoint.parentNode?.insertBefore(children[i], insertPoint);
      }
    }
    this.visible = true;
  }

  /**
   * Remove the mounted content.
   */
  clear() {
    if (this.contentStart && this.contentEnd) {
      clearRange(this.contentStart, this.contentEnd);
      this.contentStart.remove();
      this.contentEnd.remove();
      this.contentStart = null;
      this.contentEnd = null;
    }
    this.visible = false;
  }

  /** Unsubscribe from the condition signal, if any. */
  disposeConditionSignal() {
    if (this.conditionCleanup) {
      this.conditionCleanup();
      this.conditionCleanup = null;
    }
    this.conditionSignal = null;
  }

  /** Tear down subscriptions and clear content. */
  destroy() {
    this.disposeConditionSignal();
    this.clear();
  }
}
