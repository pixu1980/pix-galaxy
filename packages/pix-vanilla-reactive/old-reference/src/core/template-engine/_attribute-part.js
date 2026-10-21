/**
 * Attribute parts: plain attributes, boolean attributes, `{{ }}`-interpolated
 * attributes, and the two-way `model` binding.
 *
 * @module core/template-engine/attribute-part
 */

import { evaluateExpression } from "./_expression-parser.js";

/**
 * Sets a plain attribute from a `${}` value (`null`/`false` removes it).
 */
export class AttributePart {
  /**
   * @param {Element} element - Target element.
   * @param {string} name - Attribute name.
   * @param {number} valueIndex - Index into the values array.
   */
  constructor(element, name, valueIndex) {
    /** @type {Element} */
    this.element = element;
    /** @type {string} */
    this.name = name;
    /** @type {number} */
    this.valueIndex = valueIndex;
  }

  /**
   * Reflect the current value onto the attribute.
   *
   * @param {unknown[]} values - Interpolated values.
   * @returns {void}
   */
  update(values) {
    const value = values[this.valueIndex];

    if (value == null || value === false) {
      this.element.removeAttribute(this.name);
    } else if (value === true) {
      this.element.setAttribute(this.name, "");
    } else {
      this.element.setAttribute(this.name, String(value));
    }
  }
}

/**
 * Toggles a boolean attribute from a `?attr=${value}` value.
 */
export class BooleanAttributePart {
  /**
   * @param {Element} element - Target element.
   * @param {string} name - Attribute name.
   * @param {number} valueIndex - Index into the values array.
   */
  constructor(element, name, valueIndex) {
    /** @type {Element} */
    this.element = element;
    /** @type {string} */
    this.name = name;
    /** @type {number} */
    this.valueIndex = valueIndex;
  }

  /**
   * Toggle the attribute based on truthiness.
   *
   * @param {unknown[]} values - Interpolated values.
   * @returns {void}
   */
  update(values) {
    this.element.toggleAttribute(this.name, Boolean(values[this.valueIndex]));
  }
}

/**
 * Sets an attribute whose value contains `{{ }}` context expressions.
 */
export class ContextAttributePart {
  /**
   * @param {Element} element - Target element.
   * @param {string} name - Attribute name.
   * @param {string} template - Attribute value template with `{{ }}` holes.
   */
  constructor(element, name, template) {
    /** @type {Element} */
    this.element = element;
    /** @type {string} */
    this.name = name;
    /** @type {string} */
    this.template = template;
  }

  /**
   * Recompute and set the attribute value from context.
   *
   * @param {unknown[]} _values - Unused interpolated values.
   * @param {object} context - Data context.
   * @returns {void}
   */
  update(_values, context) {
    const out = this.template.replace(/\{\{([\s\S]+?)\}\}/g, (_match, expr) => {
      const value = evaluateExpression(expr.trim(), context ?? {});

      return value == null ? "" : String(value);
    });

    this.element.setAttribute(this.name, out);
  }
}

/**
 * Two-way `model=${{ get, set }}` binding for form controls.
 */
export class ModelPart {
  /**
   * @param {Element} element - Target form control.
   * @param {number} valueIndex - Index into the values array (the model config).
   */
  constructor(element, valueIndex) {
    /** @type {Element} */
    this.element = element;
    /** @type {number} */
    this.valueIndex = valueIndex;
    /** @type {object | null} */
    this.config = null;
    /** @type {boolean} */
    this.wired = false;
  }

  /**
   * Resolve the DOM event that signals user edits for this control.
   *
   * @returns {string} Event name.
   */
  _inputEvent() {
    const type = this.element.getAttribute("type");

    if (type === "checkbox" || type === "radio" || this.element.tagName === "SELECT") {
      return "change";
    }

    return "input";
  }

  /**
   * Attach the change listener once.
   *
   * @returns {void}
   */
  _wire() {
    this.element.addEventListener(this._inputEvent(), () => {
      if (!this.config || typeof this.config.set !== "function") {
        return;
      }

      const type = this.element.getAttribute("type");
      const value = type === "checkbox" ? this.element.checked : this.element.value;

      this.config.set(value);
    });
  }

  /**
   * Reflect the model's current value onto the control (guarding the caret).
   *
   * @returns {void}
   */
  _writeToElement() {
    if (!this.config || typeof this.config.get !== "function") {
      return;
    }

    const value = this.config.get();
    const type = this.element.getAttribute("type");

    if (type === "checkbox") {
      this.element.checked = Boolean(value);

      return;
    }

    const next = value == null ? "" : String(value);

    if (this.element.value !== next) {
      this.element.value = next;
    }
  }

  /**
   * Refresh the config and synchronise the control.
   *
   * @param {unknown[]} values - Interpolated values.
   * @returns {void}
   */
  update(values) {
    this.config = values[this.valueIndex];

    if (!this.wired) {
      this._wire();
      this.wired = true;
    }

    this._writeToElement();
  }
}
