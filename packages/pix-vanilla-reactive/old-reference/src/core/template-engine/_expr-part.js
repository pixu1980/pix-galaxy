/**
 * Expression part: renders a `{{ expr | filter }}` value from the data context.
 *
 * @module core/template-engine/expr-part
 */

import { ContentRegion } from "./_child-node-part.js";
import { evaluateExpression } from "./_expression-parser.js";

/**
 * Binds a text-position `{{ }}` expression to its marker.
 */
export class ExprPart {
  /**
   * @param {Comment} marker - Anchor comment.
   * @param {string} expression - Raw expression text.
   */
  constructor(marker, expression) {
    /** @type {ContentRegion} */
    this.region = new ContentRegion(marker);
    /** @type {string} */
    this.expression = expression;
  }

  /**
   * Evaluate the expression against context and render the result.
   *
   * @param {unknown[]} _values - Unused interpolated values.
   * @param {object} context - Data context.
   * @returns {void}
   */
  update(_values, context) {
    this.region.setValue(evaluateExpression(this.expression, context ?? {}));
  }
}
