// @ts-check

// CSS is loaded as a string by the bundler. Configure the bundler to treat
// component CSS imports as raw text (for esbuild: `loader: { '.css': 'text' }`).
import styles from './styles/pix-highlighter.css';

import { componentDecorator } from '@pix-galaxy/shared/decorator/index.js';

import attributes from './pix-highlighter.attributes.js';
import events from './pix-highlighter.events.js';
import { renderRoot } from './pix-highlighter.template.js';
import { CONTENT_PART } from './pix-highlighter.consts.js';
import { filterRenderableNodes, normalizeVariant } from './pix-highlighter.utils.js';

/**
 * PixHighlighter Web Component.
 *
 * Placeholder highlighter scaffold aligned with the shared custom-element
 * runtime architecture used across pix-galaxy.
 *
 * @element pix-highlighter
 * @attr {'default' | 'outlined'} [variant='default'] - Visual variant.
 */
export class PixHighlighter extends HTMLElement {
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
   * @returns {import('./pix-highlighter.consts.js').PixHighlighterVariant}
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

export { normalizeVariant } from './pix-highlighter.utils.js';
export default PixHighlighter;
