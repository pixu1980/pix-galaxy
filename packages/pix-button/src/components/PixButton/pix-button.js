// @ts-check

// CSS is loaded as a string by the bundler. Configure the bundler to treat
// component CSS imports as raw text (for esbuild: `loader: { '.css': 'text' }`).
import styles from './styles/pix-button.css';

import { componentDecorator } from '@pix-galaxy/shared/decorator/index.js';

import attributes from './pix-button.attributes.js';
import events from './pix-button.events.js';
import { BUTTON_PART } from './pix-button.consts.js';
import { renderRoot } from './pix-button.template.js';
import { filterButtonContentNodes, normalizeVariant } from './pix-button.utils.js';

/**
 * PixButton Web Component.
 *
 * An accessible button wrapper that keeps the native `<button>` semantics in
 * light DOM while exposing the legacy `pix-button:click` event.
 *
 * @element pix-button
 * @attr {'primary' | 'secondary' | 'ghost'} [variant='primary'] - Button visual variant.
 * @attr {boolean} [disabled] - Disables the internal button.
 * @fires {CustomEvent} pix-button:click - Fired when the button is activated.
 * @cssprop --pix-button-background - Button background color.
 * @cssprop --pix-button-color - Button foreground color.
 * @cssprop --pix-button-border-color - Button border color.
 * @cssprop --pix-button-radius - Button border radius.
 * @cssprop --pix-button-padding-block - Button block padding.
 * @cssprop --pix-button-padding-inline - Button inline padding.
 * @csspart button - The managed native button element.
 */
export class PixButton extends HTMLElement {
  static attributes = attributes;
  static events = events;
  static styles = styles;

  static {
    componentDecorator(this);
  }

  constructor() {
    super();
  }

  /**
   * The active button variant.
   *
   * @returns {import('./pix-button.consts.js').PixButtonVariant}
   */
  get variant() {
    return normalizeVariant(this.getAttribute('variant'));
  }

  /**
   * @param {string | null | undefined} value
   */
  set variant(value) {
    this.setAttribute('variant', normalizeVariant(value));
  }

  /**
   * Whether the button is disabled.
   *
   * @returns {boolean}
   */
  get disabled() {
    return this.hasAttribute('disabled');
  }

  /**
   * @param {boolean} value
   */
  set disabled(value) {
    if (value) {
      this.setAttribute('disabled', '');
      return;
    }

    this.removeAttribute('disabled');
  }

  onRender() {
    const existingButton = this.#button();

    if (!existingButton) {
      const nodes = filterButtonContentNodes(Array.from(this.childNodes));
      this.innerHTML = renderRoot({});
      this.#button()?.append(...nodes);
    }

    this.#syncState();
  }

  /**
   * @param {string} name
   * @param {string | null} _oldValue
   * @param {string | null} newValue
   */
  onAttributeChanged(name, _oldValue, newValue) {
    if (name === 'variant' || name === 'disabled') {
      if (name === 'variant') {
        this.setAttribute('data-variant', normalizeVariant(newValue));
      }

      this.#syncState();
    }
  }

  /**
   * @returns {HTMLButtonElement | null}
   */
  #button() {
    return /** @type {HTMLButtonElement | null} */ (
      this.querySelector(`:scope > [data-part="${BUTTON_PART}"]`)
    );
  }

  #syncState() {
    const variant = this.variant;
    if (this.getAttribute('variant') !== variant) {
      this.setAttribute('variant', variant);
    }

    this.setAttribute('data-variant', variant);

    const button = this.#button();
    if (!button) {
      return;
    }

    button.disabled = this.disabled;
    button.setAttribute('aria-disabled', String(this.disabled));
    button.setAttribute('data-variant', variant);
  }
}

export { normalizeVariant } from './pix-button.utils.js';
export default PixButton;
