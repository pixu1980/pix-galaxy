/**
 * Template authoring helpers: the `html` tag, directives, two-way `model`,
 * and the `rawHtml` unsafe-HTML marker.
 *
 * @module core/template-engine/template-helpers
 */

/** Brand identifying a {@link TemplateResult}. */
export const TEMPLATE_RESULT_BRAND = Symbol("pix.templateResult");

/** Brand identifying a directive function. */
export const DIRECTIVE_BRAND = Symbol("pix.directive");

/** Brand identifying a raw-HTML marker. */
export const RAW_HTML_BRAND = Symbol("pix.rawHtml");

/**
 * The value produced by an `html` tagged template — packaged strings + values.
 */
export class TemplateResult {
  /**
   * @param {TemplateStringsArray} strings - Static string parts.
   * @param {unknown[]} values - Interpolated `${}` values.
   */
  constructor(strings, values) {
    /** @type {TemplateStringsArray} */
    this.strings = strings;
    /** @type {unknown[]} */
    this.values = values;
    /** @type {object | null} */
    this._context = null;
    this[TEMPLATE_RESULT_BRAND] = true;
  }
}

/**
 * Tagged-template function that packages strings and values for rendering.
 *
 * @param {TemplateStringsArray} strings - Static string parts.
 * @param {...unknown} values - Interpolated `${}` values.
 * @returns {TemplateResult} A renderable template result.
 */
export function html(strings, ...values) {
  return new TemplateResult(strings, values);
}

/**
 * Test whether a value is a {@link TemplateResult}.
 *
 * @param {unknown} value - Candidate value.
 * @returns {boolean} True when `value` is a template result.
 */
export function isTemplateResult(value) {
  return Boolean(value) && typeof value === "object" && value[TEMPLATE_RESULT_BRAND] === true;
}

/**
 * A marker wrapping a trusted HTML string to be inserted verbatim.
 */
export class RawHtml {
  /**
   * @param {string} value - Trusted HTML markup.
   */
  constructor(value) {
    /** @type {string} */
    this.value = value;
    this[RAW_HTML_BRAND] = true;
  }
}

/**
 * Wrap a trusted HTML string so a part inserts it as markup, not text.
 *
 * @param {string} value - Trusted HTML markup.
 * @returns {RawHtml} Raw-HTML marker.
 */
export function rawHtml(value) {
  return new RawHtml(value == null ? "" : String(value));
}

/**
 * Test whether a value is a {@link RawHtml} marker.
 *
 * @param {unknown} value - Candidate value.
 * @returns {boolean} True when `value` is a raw-HTML marker.
 */
export function isRawHtml(value) {
  return Boolean(value) && typeof value === "object" && value[RAW_HTML_BRAND] === true;
}

/**
 * Mark a function as a directive invoked with its owning part.
 *
 * @param {(part: object) => unknown} fn - Directive implementation.
 * @returns {(part: object) => unknown} The branded directive.
 */
export function directive(fn) {
  fn[DIRECTIVE_BRAND] = true;

  return fn;
}

/**
 * Test whether a value is a directive function.
 *
 * @param {unknown} value - Candidate value.
 * @returns {boolean} True when `value` is a directive.
 */
export function isDirective(value) {
  return typeof value === "function" && value[DIRECTIVE_BRAND] === true;
}

/**
 * Build a two-way binding descriptor for the `model` attribute.
 *
 * @param {object} config - Binding config.
 * @param {() => unknown} config.get - Read the current value.
 * @param {(value: unknown) => void} config.set - Write a new value.
 * @param {object} [config.signal] - Optional signal read to establish reactivity.
 * @returns {object} The (branded) model config.
 */
export function model(config) {
  return config;
}
