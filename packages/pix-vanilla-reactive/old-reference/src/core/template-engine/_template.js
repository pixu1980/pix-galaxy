/**
 * Top-level `render` entry point.
 *
 * @module core/template-engine/template
 */

import { getCompiled, TemplateInstance } from "./_template-instance.js";

/** @type {WeakMap<Element, { instance: TemplateInstance, strings: TemplateStringsArray }>} */
const containerCache = new WeakMap();

/**
 * Render a template result into a container, reusing the instance across calls.
 *
 * @param {import("./_template-helpers.js").TemplateResult} result - Result from an `html` template.
 * @param {Element} container - Element to render into.
 * @returns {void}
 */
export function render(result, container) {
  let entry = containerCache.get(container);

  if (!entry || entry.strings !== result.strings) {
    const compiled = getCompiled(result.strings);
    const instance = new TemplateInstance(compiled);

    container.replaceChildren();
    container.appendChild(instance.fragment);
    entry = { instance, strings: result.strings };
    containerCache.set(container, entry);
  }

  entry.instance.update(result.values, result._context ?? null);
}
