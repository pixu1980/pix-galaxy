// @ts-check

/**
 * Browser-safe tagged template runtime for inline component rendering.
 */
export class TemplateEngine {
  /**
   * The full file-based renderer is not available in the browser-safe runtime.
   *
   * @throws {Error}
   */
  render() {
    throw new Error(
      'TemplateEngine.render is not available in the browser-safe tagged runtime. Use the full pix-template-engine install for SSG/SSR workflows.',
    );
  }

  /**
   * @param {TemplateStringsArray} strings
   * @param {...unknown} values
   * @returns {(data?: object) => string}
   */
  template(strings, ...values) {
    if (!Array.isArray(strings) || !Object.prototype.hasOwnProperty.call(strings, 'raw')) {
      throw new TypeError('TemplateEngine.template must be used as a tagged template literal');
    }

    return (data = {}) => this.createTemplateLiteralSource(strings, values, data);
  }

  /**
   * @param {TemplateStringsArray} strings
   * @param {...unknown} values
   * @returns {(data?: object) => string}
   */
  html(strings, ...values) {
    return this.template(strings, ...values);
  }

  /**
   * @param {TemplateStringsArray} strings
   * @param {unknown[]} values
   * @param {object} data
   * @returns {string}
   */
  createTemplateLiteralSource(strings, values, data) {
    let source = '';

    for (let index = 0; index < strings.length; index++) {
      source += strings[index];

      if (index < values.length) {
        const value = values[index];
        const resolvedValue = typeof value === 'function' ? value(data) : value;
        source += resolvedValue == null ? '' : String(resolvedValue);
      }
    }

    return source;
  }
}

export default TemplateEngine;
