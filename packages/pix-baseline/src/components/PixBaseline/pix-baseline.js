// @ts-check

// CSS is loaded as a string by the bundler. Configure the bundler to treat
// component CSS imports as raw text (for esbuild: `loader: { '.css': 'text' }`).
import styles from './styles/pix-baseline.css';

import { componentDecorator } from '@pix-galaxy/shared/decorator/index.js';

import attributes from './pix-baseline.attributes.js';
import events from './pix-baseline.events.js';
import { renderRoot } from './pix-baseline.template.js';
import { CONTENT_PART } from './pix-baseline.consts.js';
import { filterRenderableNodes, normalizeVariant } from './pix-baseline.utils.js';

/**
 * PixBaseline Web Component.
 *
 * Placeholder baseline scaffold aligned with the shared custom-element runtime
 * architecture used across pix-galaxy.
 *
 * @element pix-baseline
 * @attr {'default' | 'outlined'} [variant='default'] - Visual variant.
 */
export class PixBaseline extends HTMLElement {
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
   * @returns {import('./pix-baseline.consts.js').PixBaselineVariant}
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

  onRender() {
    const existingRoot = this.querySelector(':scope > [data-part="root"]');

    if (!existingRoot) {
      const nodes = filterRenderableNodes(Array.from(this.childNodes));
      this.innerHTML = renderRoot({});
      this.querySelector(':scope > [data-part="content"]')?.append(...nodes);
    }

    this.#syncState();
  }

  /**
   * @param {string} name
   * @param {string | null} _oldValue
   * @param {string | null} newValue
   */
  onAttributeChanged(name, _oldValue, newValue) {
    if (name === 'variant') {
      this.setAttribute('data-variant', normalizeVariant(newValue));
    }
  }

  #syncState() {
    const variant = this.variant;
    if (this.getAttribute('variant') !== variant) {
      this.setAttribute('variant', variant);
    }

    this.setAttribute('data-variant', variant);
    this.querySelector(':scope > [data-part="' + CONTENT_PART + '"]')?.setAttribute('data-variant', variant);
  }
}

export { normalizeVariant } from './pix-baseline.utils.js';
export default PixBaseline;
