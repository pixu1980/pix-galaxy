/**
 * Template-engine barrel.
 *
 * @module core/template-engine
 */

export { render } from "./_template.js";
export { compile, getCompiled, getTemplate, TemplateInstance } from "./_template-instance.js";
export { parseExpression, evaluateExpression } from "./_expression-parser.js";
export { FILTERS, registerFilter, applyFilter } from "./_filters.js";
export {
  html,
  directive,
  model,
  rawHtml,
  isDirective,
  isRawHtml,
  isTemplateResult,
  RawHtml,
  TemplateResult,
} from "./_template-helpers.js";
export { clearRange, moveRangeBefore } from "./_range.js";
