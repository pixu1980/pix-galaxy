/**
 * `<for each="item in items">` part with keyed reconciliation.
 *
 * Two modes:
 *  - inner-template: repeats the element's body per item with a child context
 *    (`{{ item.field }}`).
 *  - component: `<for each="x in xs" of="ComponentName" key="id">` calls
 *    `context.ComponentName.render(item)` per item.
 *
 * @module core/template-engine/for-part
 */

import { compile, getCompiled, TemplateInstance } from "./_template-instance.js";
import { evaluateExpression } from "./_expression-parser.js";

/**
 * Parse a `each` expression such as `"item in items"` or `"(item, i) in items"`.
 *
 * @param {string} expression - The `each` attribute value.
 * @returns {{ itemVar: string, indexVar: string | null, listExpr: string }} Parsed loop head.
 */
function parseEach(expression) {
  const match = expression.trim().match(/^(.+?)\s+in\s+(.+)$/);

  if (!match) {
    throw new Error(`Invalid <for each>: ${expression}`);
  }

  let itemVar = match[1].trim();
  let indexVar = null;
  const paren = itemVar.match(/^\(\s*([\w$]+)\s*,\s*([\w$]+)\s*\)$/);

  if (paren) {
    itemVar = paren[1];
    indexVar = paren[2];
  }

  return { itemVar, indexVar, listExpr: match[2].trim() };
}

/**
 * Repeats content for each item in a list.
 */
export class ForPart {
  /**
   * @param {Comment} marker - Anchor comment.
   * @param {{ each: string, of?: string, key?: string, innerHtml?: string }} config - Directive config.
   */
  constructor(marker, config) {
    /** @type {Comment} */
    this.marker = marker;
    /** @type {{ itemVar: string, indexVar: string | null, listExpr: string }} */
    this.each = parseEach(config.each);
    /** @type {string | null} */
    this.ofName = config.of || null;
    /** @type {string | null} */
    this.keyField = config.key || null;
    /** @type {object | null} */
    this.innerCompiled = this.ofName ? null : compile([config.innerHtml || ""]);
    /** @type {Map<unknown, { instance: TemplateInstance, strings: TemplateStringsArray | null, nodes: Node[] }>} */
    this.records = new Map();
  }

  /**
   * Reconcile the rendered list against the current data.
   *
   * @param {unknown[]} _values - Unused interpolated values.
   * @param {object} context - Data context.
   * @returns {void}
   */
  update(_values, context) {
    const list = evaluateExpression(this.each.listExpr, context ?? {});
    const items = Array.isArray(list) ? list : [];
    const Component = this.ofName && context ? context[this.ofName] : null;
    const next = new Map();
    const ordered = [];

    items.forEach((item, index) => {
      const key = this.keyField ? item[this.keyField] : index;
      let record = this.records.get(key);

      if (!record) {
        record = this._create(item, Component);
      }

      this._render(record, item, index, context, Component);
      next.set(key, record);
      ordered.push(record);
    });

    for (const [key, record] of this.records) {
      if (!next.has(key)) {
        this._remove(record);
      }
    }

    for (const record of ordered) {
      for (const node of record.nodes) {
        this.marker.parentNode.insertBefore(node, this.marker);
      }
    }

    this.records = next;
  }

  /**
   * Create a fresh record (template instance + node snapshot) for an item.
   *
   * @param {unknown} item - List item.
   * @param {{ render: (item: unknown) => import("./_template-helpers.js").TemplateResult } | null} Component - Item component, if in component mode.
   * @returns {{ instance: TemplateInstance, strings: TemplateStringsArray | null, nodes: Node[] }} New record.
   */
  _create(item, Component) {
    let instance;
    let strings = null;

    if (Component) {
      const result = Component.render(item);

      instance = new TemplateInstance(getCompiled(result.strings));
      strings = result.strings;
    } else {
      instance = new TemplateInstance(this.innerCompiled);
    }

    return { instance, strings, nodes: Array.from(instance.fragment.childNodes) };
  }

  /**
   * Update a record with the current item data.
   *
   * @param {{ instance: TemplateInstance, strings: TemplateStringsArray | null, nodes: Node[] }} record - Record to update.
   * @param {unknown} item - List item.
   * @param {number} index - Item index.
   * @param {object} context - Parent data context.
   * @param {{ render: (item: unknown) => import("./_template-helpers.js").TemplateResult } | null} Component - Item component, if any.
   * @returns {void}
   */
  _render(record, item, index, context, Component) {
    if (Component) {
      const result = Component.render(item);

      record.instance.update(result.values, result._context ?? context ?? null);

      return;
    }

    const childContext = { ...(context || {}), [this.each.itemVar]: item, $index: index };

    if (this.each.indexVar) {
      childContext[this.each.indexVar] = index;
    }

    record.instance.update([], childContext);
  }

  /**
   * Detach a record's nodes from the DOM.
   *
   * @param {{ nodes: Node[] }} record - Record to remove.
   * @returns {void}
   */
  _remove(record) {
    for (const node of record.nodes) {
      if (node.parentNode) {
        node.parentNode.removeChild(node);
      }
    }
  }
}
