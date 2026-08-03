// @ts-check
/**
 * @module core/template-engine/_for-part
 * `<for each="item in items">` directive: keyed list reconciliation with
 * signal support.
 */

import { evaluateExpression, parseExpression } from './_expression-parser.js';
import { isSignalLike } from '../signals/index.js';
import { clearRange, isRangeBeforeReference, moveRangeBefore } from './_range.js';
import { renderInnerTemplate } from './_inner-template.js';
import { ChildNodePart } from './_child-node-part.js';

/**
 * @typedef {object} ForBlock
 * @property {string | number} key Stable identity.
 * @property {Comment} start
 * @property {Comment} end
 * @property {unknown} item Last rendered item.
 * @property {import('./_child-node-part.js').ChildNodePart | null} part
 *   Component-mode part (string mode keeps this null).
 */

/**
 * Renders a `<for each="item in items">` block with keyed reconciliation.
 * The `items` expression may resolve to a signal — the list then re-renders
 * on signal changes.
 */
export class ForPart {
  /**
   * @param {Comment} start
   * @param {Comment} end
   * @param {string} itemVar Variable name bound per iteration.
   * @param {import('./_expression-parser.js').ParsedExpression} itemsParsed
   * @param {string} innerTemplate Raw inner HTML (string mode).
   * @param {((item: unknown, index: number) => unknown) | null} [renderFn]
   *   Component mode renderer (from `render=${...}`).
   */
  constructor(start, end, itemVar, itemsParsed, innerTemplate, renderFn) {
    this.start = start;
    this.end = end;
    this.itemVar = itemVar;
    this.itemsParsed = itemsParsed;
    this.innerTemplate = innerTemplate;
    /** @type {((item: unknown, index: number) => unknown) | null} Component mode renderer. */
    this.renderFn = renderFn ?? null;
    /** @type {number} ${} slot index carrying the render function (-1 = string mode). */
    this._renderAttrIdx = -1;
    /** @type {Map<string | number, ForBlock>} Keyed block state. */
    this.blocks = new Map();
    /** @type {import('../signals/index.js').ReadableSignal | null} */
    this.itemsSignal = null;
    /** @type {(() => void) | null} */
    this.itemsCleanup = null;
    /** @type {object | null} */
    this.ctx = null;
  }

  /**
   * Resolve the items expression, subscribe to a signal if present, and
   * reconcile the DOM.
   * @param {object} ctx
   */
  init(ctx) {
    this.ctx = ctx;
    const signalOrValue = evaluateExpression(this.itemsParsed, ctx);
    if (isSignalLike(signalOrValue)) {
      if (signalOrValue !== this.itemsSignal) {
        this.itemsSignal = signalOrValue;
        this.itemsCleanup = signalOrValue.subscribe(() => this.reconcile());
      }
    } else {
      this.disposeItemsSignal();
    }
    this.reconcile();
  }

  /**
   * Key an item: `id` for objects, JSON for objects without id, string for
   * primitives.
   * @param {unknown} item
   * @returns {string | number}
   */
  keyOf(item) {
    if (typeof item === 'object' && item !== null) {
      const record = /** @type {Record<string, unknown>} */ (item);
      return /** @type {string | number} */ (record.id ?? JSON.stringify(item));
    }
    return String(item);
  }

  /**
   * Reconcile the list: move existing blocks, create new ones, remove stale.
   */
  reconcile() {
    const items = this.itemsSignal
      ? this.itemsSignal.get()
      : evaluateExpression(this.itemsParsed, this.ctx ?? {});
    const raw = items ?? [];
    const list = Array.isArray(raw)
      ? raw
      : typeof (/** @type {Record<PropertyKey, unknown>} */ (raw)[Symbol.iterator]) === 'function'
        ? [.../** @type {Iterable<unknown>} */ (raw)]
        : [];
    const nextBlocks = new Map();
    const seen = new Set();
    let ref = this.end;

    for (let i = list.length - 1; i >= 0; i--) {
      const item = list[i];
      const key = this.keyOf(item);
      if (seen.has(key)) continue;
      seen.add(key);

      let block = this.blocks.get(key);
      if (!block) {
        const start = document.createComment(`for:${key}:s`);
        const end = document.createComment(`for:${key}:e`);
        ref.parentNode?.insertBefore(start, ref);
        ref.parentNode?.insertBefore(end, ref);
        block = { key, start, end, item, part: null };
        this.renderBlock(block, item);
      } else {
        if (!isRangeBeforeReference(block.start, block.end, ref)) {
          moveRangeBefore(block.start, block.end, ref);
        }
        if (block.item !== item) {
          this.renderBlock(block, item);
          block.item = item;
        }
      }
      nextBlocks.set(key, block);
      ref = block.start;
    }

    for (const [key, block] of this.blocks) {
      if (!nextBlocks.has(key)) {
        clearRange(block.start, block.end);
        block.start.remove();
        block.end.remove();
      }
    }
    this.blocks = nextBlocks;
  }

  /**
   * Render one block: component mode via `renderFn`, else string mode via
   * {@link renderInnerTemplate}. Disposes the previous component part.
   * @param {ForBlock} block
   * @param {unknown} item
   */
  renderBlock(block, item) {
    clearRange(block.start, block.end);
    if (this.renderFn) {
      if (block.part) block.part.dispose();
      const childPart = new ChildNodePart(block.start, block.end);
      block.part = childPart;
      childPart.setValue(this.renderFn(item, 0));
    } else {
      block.part = null;
      const itemCtx = { ...this.ctx, [this.itemVar]: item };
      const rendered = renderInnerTemplate(this.innerTemplate, itemCtx);
      const tmp = document.createElement('template');
      tmp.innerHTML = rendered;
      const children = [...tmp.content.childNodes];
      const insertPoint = block.end;
      for (let i = children.length - 1; i >= 0; i--) {
        insertPoint.parentNode?.insertBefore(children[i], insertPoint);
      }
    }
  }

  /** Unsubscribe from the items signal, if any. */
  disposeItemsSignal() {
    if (this.itemsCleanup) {
      this.itemsCleanup();
      this.itemsCleanup = null;
    }
    this.itemsSignal = null;
  }

  /** Tear down subscriptions and remove all blocks. */
  destroy() {
    this.disposeItemsSignal();
    for (const block of this.blocks.values()) {
      if (block.part) block.part.dispose();
      clearRange(block.start, block.end);
      block.start.remove();
      block.end.remove();
    }
    this.blocks.clear();
  }
}
