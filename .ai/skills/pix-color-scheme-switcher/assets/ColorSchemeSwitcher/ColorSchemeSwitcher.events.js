// @ts-check

/**
 * DOM event handlers for PixColorSchemeSwitcher. The decorator registers the
 * host element as the EventListener and delegates bubbled form changes here.
 */
export default {
  /**
   * @this {import('./ColorSchemeSwitcher.js').PixColorSchemeSwitcher}
   * @param {Event} event
   * @returns {void}
   */
  change(event) {
    const input = event.target;

    if (!(input instanceof HTMLInputElement)) return;
    if (input.name !== 'color-scheme') return;

    this.applyColorScheme(input.value);
  },
};
