/**
 * ssr-safe.js - Centralised SSR guards for pix-galaxy components.
 *
 * Every component currently duplicates the same guards:
 *   if (typeof document === 'undefined') return null;
 *   if (!('adoptedStyleSheets' in document)) return null;
 *   if (typeof CSSStyleSheet !== 'function') return null;
 *
 * This module exposes them once so components can do:
 *   import { adoptStyles, safeDefine } from '@pix-galaxy/pix-core/dom/ssr-safe.js';
 */

/**
 * Adopt a CSSStyleSheet into the document.
 * Returns the stylesheet or null in SSR / unsupported environments.
 */
let _adopted = null;
export function adoptStyles(cssText) {
  if (typeof document === 'undefined') return null;
  if (!_adopted) {
    if (
      typeof CSSStyleSheet !== 'function' ||
      typeof CSSStyleSheet.prototype.replaceSync !== 'function'
    )
      return null;
    _adopted = new CSSStyleSheet();
    _adopted.replaceSync(cssText);
  }
  if (!document.adoptedStyleSheets.includes(_adopted)) {
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, _adopted];
  }
  return _adopted;
}

/**
 * Define a custom element if we're in a browser environment.
 */
export function safeDefine(name, cls) {
  if (
    typeof document !== 'undefined' &&
    typeof customElements !== 'undefined' &&
    !customElements.get(name)
  ) {
    customElements.define(name, cls);
  }
}

/**
 * Check if the component can adopt stylesheets.
 */
export function canAdoptStyles() {
  return (
    typeof document !== 'undefined' &&
    'adoptedStyleSheets' in document &&
    typeof CSSStyleSheet === 'function' &&
    typeof CSSStyleSheet.prototype.replaceSync === 'function'
  );
}

/**
 * Reset the cached stylesheet (useful for testing).
 */
export function _resetAdopted() {
  _adopted = null;
}
