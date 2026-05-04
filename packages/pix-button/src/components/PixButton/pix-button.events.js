// @ts-check

import { cancelEvent } from '@pix-galaxy/shared/events/index.js';
import { BUTTON_PART } from './pix-button.consts.js';

/**
 * DOM event handlers for PixButton.
 */
export default {
	/**
	 * @this {import('./pix-button.js').PixButton}
	 * @param {MouseEvent} event
	 */
	click(event) {
		if (!(event.target instanceof Element) || !event.target.closest(`[data-part="${BUTTON_PART}"]`)) {
			return;
		}

		if (this.disabled) {
			cancelEvent(event);
			return;
		}

		this.dispatchEvent(new CustomEvent('pix-button:click', {
			bubbles: true,
			composed: true,
			detail: { variant: this.variant },
		}));
	},
};
