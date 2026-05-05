// @ts-check

/**
 * DOM event handlers for PixColorSchemeSwitcher.
 */
export default {
	/**
	 * @this {import('./pix-color-scheme-switcher.js').PixColorSchemeSwitcher}
	 * @param {Event} event
	 */
	change(event) {
		const input = event.target;

		if (!(input instanceof HTMLInputElement)) {
			return;
		}

		if (input.name !== 'color-scheme') {
			return;
		}

		this.applyColorScheme(input.value);
	},
};
