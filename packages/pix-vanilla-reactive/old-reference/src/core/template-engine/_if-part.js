/**
 * `<if condition="expr">` part — conditionally renders its body.
 *
 * @module core/template-engine/if-part
 */

import { compile, TemplateInstance } from "./_template-instance.js";
import { evaluateExpression } from "./_expression-parser.js";

/**
 * Renders its body only while the condition is truthy.
 */
export class IfPart {
  /**
   * @param {Comment} marker - Anchor comment.
   * @param {{ condition: string, innerHtml?: string }} config - Directive config.
   */
  constructor(marker, config) {
    /** @type {Comment} */
    this.marker = marker;
    /** @type {string} */
    this.condition = config.condition;
    /** @type {object} */
    this.compiled = compile([config.innerHtml || ""]);
    /** @type {TemplateInstance | null} */
    this.instance = null;
    /** @type {Node[]} */
    this.nodes = [];
  }

  /**
   * Evaluate the condition and mount/unmount the body accordingly.
   *
   * @param {unknown[]} _values - Unused interpolated values.
   * @param {object} context - Data context.
   * @returns {void}
   */
  update(_values, context) {
    const truthy = Boolean(evaluateExpression(this.condition, context ?? {}));

    if (truthy) {
      if (!this.instance) {
        this.instance = new TemplateInstance(this.compiled);
        this.nodes = Array.from(this.instance.fragment.childNodes);
        this.marker.parentNode.insertBefore(this.instance.fragment, this.marker);
      }

      this.instance.update([], context ?? {});

      return;
    }

    if (this.instance) {
      for (const node of this.nodes) {
        if (node.parentNode) {
          node.parentNode.removeChild(node);
        }
      }

      this.instance = null;
      this.nodes = [];
    }
  }
}
