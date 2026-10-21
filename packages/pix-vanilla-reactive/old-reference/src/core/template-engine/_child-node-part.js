/**
 * Child-node part: renders a `${}` value into the document at a marker.
 *
 * Handles strings/numbers (as text), nested {@link TemplateResult}s (as reused
 * child instances), {@link RawHtml} markers, arrays, and raw DOM nodes.
 *
 * @module core/template-engine/child-node-part
 */

import { getCompiled, TemplateInstance } from "./_template-instance.js";
import { clearRange } from "./_range.js";
import { isRawHtml, isTemplateResult } from "./_template-helpers.js";

/**
 * Parse a trusted HTML string into a list of top-level nodes.
 *
 * @param {string} markup - Trusted HTML.
 * @returns {Node[]} Parsed nodes.
 */
function parseRaw(markup) {
  const template = document.createElement("template");

  template.innerHTML = markup;

  return Array.from(template.content.childNodes);
}

/**
 * A managed region of DOM anchored immediately before a marker comment.
 */
export class ContentRegion {
  /**
   * @param {Comment} marker - Anchor comment; content is inserted before it.
   */
  constructor(marker) {
    /** @type {Comment} */
    this.marker = marker;
    /** @type {Node[]} */
    this.nodes = [];
    /** @type {TemplateInstance | null} */
    this.childInstance = null;
    /** @type {TemplateStringsArray | null} */
    this.childStrings = null;
    /** @type {string} */
    this.mode = "empty";
    /** @type {string | null} */
    this.lastRaw = null;
  }

  /**
   * Insert a node before the marker and track it.
   *
   * @param {Node} node - Node to insert.
   * @returns {void}
   */
  _insert(node) {
    this.marker.parentNode.insertBefore(node, this.marker);
    this.nodes.push(node);
  }

  /**
   * Remove all managed nodes and reset region state.
   *
   * @returns {void}
   */
  clear() {
    clearRange(this.nodes);
    this.nodes = [];
    this.childInstance = null;
    this.childStrings = null;
    this.lastRaw = null;
    this.mode = "empty";
  }

  /**
   * Render an arbitrary value into the region.
   *
   * @param {unknown} value - Value to render.
   * @returns {void}
   */
  setValue(value) {
    if (value == null || value === false) {
      if (this.mode !== "empty") {
        this.clear();
      }

      return;
    }

    if (isTemplateResult(value)) {
      this._setTemplate(value);

      return;
    }

    if (isRawHtml(value)) {
      this._setRaw(value.value);

      return;
    }

    if (Array.isArray(value)) {
      this._setArray(value);

      return;
    }

    if (value instanceof Node) {
      this._setNode(value);

      return;
    }

    this._setText(String(value));
  }

  /**
   * Render plain text, reusing an existing text node when possible.
   *
   * @param {string} text - Text content.
   * @returns {void}
   */
  _setText(text) {
    if (this.mode === "text" && this.nodes.length === 1) {
      if (this.nodes[0].data !== text) {
        this.nodes[0].data = text;
      }

      return;
    }

    this.clear();
    this._insert(document.createTextNode(text));
    this.mode = "text";
  }

  /**
   * Render trusted raw HTML, skipping work when unchanged.
   *
   * @param {string} markup - Trusted HTML.
   * @returns {void}
   */
  _setRaw(markup) {
    if (this.mode === "raw" && this.lastRaw === markup) {
      return;
    }

    this.clear();

    for (const node of parseRaw(markup)) {
      this._insert(node);
    }

    this.lastRaw = markup;
    this.mode = "raw";
  }

  /**
   * Render a nested template result, updating in place when reusable.
   *
   * @param {import("./_template-helpers.js").TemplateResult} result - Nested result.
   * @returns {void}
   */
  _setTemplate(result) {
    if (this.mode === "template" && this.childStrings === result.strings) {
      this.childInstance.update(result.values, result._context ?? null);

      return;
    }

    this.clear();

    const compiled = getCompiled(result.strings);
    const instance = new TemplateInstance(compiled);

    this.nodes = Array.from(instance.fragment.childNodes);
    this.marker.parentNode.insertBefore(instance.fragment, this.marker);
    this.childInstance = instance;
    this.childStrings = result.strings;
    this.mode = "template";
    instance.update(result.values, result._context ?? null);
  }

  /**
   * Render a single DOM node.
   *
   * @param {Node} node - Node to render.
   * @returns {void}
   */
  _setNode(node) {
    if (this.mode === "node" && this.nodes.length === 1 && this.nodes[0] === node) {
      return;
    }

    this.clear();
    this._insert(node);
    this.mode = "node";
  }

  /**
   * Render an array of values by rebuilding the region.
   *
   * @param {unknown[]} items - Values to render in order.
   * @returns {void}
   */
  _setArray(items) {
    this.clear();
    this.mode = "array";

    for (const item of items) {
      if (item == null || item === false) {
        continue;
      }

      if (isTemplateResult(item)) {
        const compiled = getCompiled(item.strings);
        const instance = new TemplateInstance(compiled);
        const nodes = Array.from(instance.fragment.childNodes);

        this.marker.parentNode.insertBefore(instance.fragment, this.marker);
        this.nodes.push(...nodes);
        instance.update(item.values, item._context ?? null);
        continue;
      }

      if (isRawHtml(item)) {
        for (const node of parseRaw(item.value)) {
          this._insert(node);
        }

        continue;
      }

      if (item instanceof Node) {
        this._insert(item);
        continue;
      }

      this._insert(document.createTextNode(String(item)));
    }
  }
}

/**
 * Binds a top-level `${}` child value to its marker.
 */
export class ChildNodePart {
  /**
   * @param {Comment} marker - Anchor comment.
   * @param {number} valueIndex - Index into the values array.
   */
  constructor(marker, valueIndex) {
    /** @type {ContentRegion} */
    this.region = new ContentRegion(marker);
    /** @type {number} */
    this.valueIndex = valueIndex;
  }

  /**
   * Render the current value.
   *
   * @param {unknown[]} values - Interpolated values.
   * @returns {void}
   */
  update(values) {
    this.region.setValue(values[this.valueIndex]);
  }
}
