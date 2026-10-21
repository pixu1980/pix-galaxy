/**
 * `<switch expr="value">` part with `<case value>` / `<default>` branches.
 *
 * @module core/template-engine/switch-part
 */

import { compile, TemplateInstance } from "./_template-instance.js";
import { evaluateExpression } from "./_expression-parser.js";

/**
 * Renders exactly one matching branch of a switch.
 */
export class SwitchPart {
  /**
   * @param {Comment} marker - Anchor comment.
   * @param {{ expr: string, cases: Array<{ value: string, innerHtml: string }>, defaultHtml: string | null }} config - Directive config.
   */
  constructor(marker, config) {
    /** @type {Comment} */
    this.marker = marker;
    /** @type {string} */
    this.expr = config.expr;
    /** @type {Array<{ value: string, compiled: object }>} */
    this.cases = config.cases.map((entry) => ({ value: entry.value, compiled: compile([entry.innerHtml || ""]) }));
    /** @type {object | null} */
    this.defaultCompiled = config.defaultHtml != null ? compile([config.defaultHtml]) : null;
    /** @type {string | null} */
    this.currentId = null;
    /** @type {TemplateInstance | null} */
    this.instance = null;
    /** @type {Node[]} */
    this.nodes = [];
  }

  /**
   * Evaluate the switch expression and mount the matching branch.
   *
   * @param {unknown[]} _values - Unused interpolated values.
   * @param {object} context - Data context.
   * @returns {void}
   */
  update(_values, context) {
    const value = evaluateExpression(this.expr, context ?? {});
    const matched = this.cases.find((entry) => String(entry.value) === String(value)) || null;
    const compiled = matched ? matched.compiled : this.defaultCompiled;
    const id = matched ? `case:${matched.value}` : this.defaultCompiled ? "default" : null;

    if (id !== this.currentId) {
      for (const node of this.nodes) {
        if (node.parentNode) {
          node.parentNode.removeChild(node);
        }
      }

      this.instance = null;
      this.nodes = [];
      this.currentId = id;

      if (compiled) {
        this.instance = new TemplateInstance(compiled);
        this.nodes = Array.from(this.instance.fragment.childNodes);
        this.marker.parentNode.insertBefore(this.instance.fragment, this.marker);
      }
    }

    if (this.instance) {
      this.instance.update([], context ?? {});
    }
  }
}
