// @ts-check

// CSS is loaded as a string by the bundler. Configure the bundler to treat
// component CSS imports as raw text (for esbuild: `loader: { '.css': 'text' }`).
import styles from './styles/pix-card.css';

import { componentDecorator } from '@pix-galaxy/shared/decorator/index.js';

import attributes from './pix-card.attributes.js';
import events from './pix-card.events.js';
import { renderRoot } from './pix-card.template.js';
import { BODY_PART, FOOTER_PART, HEADER_PART, ROOT_PART } from './pix-card.consts.js';
import { filterCardContentNodes, normalizeVariant, partitionSlotNodes } from './pix-card.utils.js';

/**
 * PixCard Web Component.
 *
 * A light-DOM card container that preserves the previous `header`, default,
 * and `footer` content channels while switching to the shared custom-element
 * runtime architecture.
 *
 * @element pix-card
 * @attr {'default' | 'outlined' | 'elevated'} [variant='default'] - Card visual variant.
 * @attr {string} [href] - Optional URL. When set, the card renders as a link.
 * @slot - Default content channel for the card body.
 * @slot header - Content promoted into the card header.
 * @slot footer - Content promoted into the card footer.
 * @cssprop --pix-card-background - Card background color.
 * @cssprop --pix-card-color - Card text color.
 * @cssprop --pix-card-border-color - Card border color.
 * @cssprop --pix-card-radius - Card border radius.
 * @cssprop --pix-card-shadow - Card box shadow.
 * @cssprop --pix-card-padding - Card internal spacing.
 * @csspart card - The outer wrapper element.
 * @csspart header - The header section.
 * @csspart body - The body section.
 * @csspart footer - The footer section.
 */
export class PixCard extends HTMLElement {
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
   * The active card variant.
   *
   * @returns {import('./pix-card.consts.js').PixCardVariant}
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
   * The optional destination URL for link-style cards.
   *
   * @returns {string | null}
   */
  get href() {
    return this.getAttribute('href');
  }

  /**
   * @param {string | null | undefined} value
   */
  set href(value) {
    if (value == null || value === '') {
      this.removeAttribute('href');
      return;
    }

    this.setAttribute('href', value);
  }

  onRender() {
    this.#render();
  }

  /**
   * @param {string} name
   * @param {string | null} _oldValue
   * @param {string | null} newValue
   */
  onAttributeChanged(name, _oldValue, newValue) {
    if (name === 'href') {
      this.#render();
      return;
    }

    if (name === 'variant') {
      this.setAttribute('data-variant', normalizeVariant(newValue));
      this.#syncState();
    }
  }

  /**
   * @returns {HTMLElement | null}
   */
  #root() {
    return /** @type {HTMLElement | null} */ (
      this.querySelector(`:scope > [data-part="${ROOT_PART}"]`)
    );
  }

  /**
   * @param {string} partName
   * @returns {HTMLElement | null}
   */
  #section(partName) {
    return /** @type {HTMLElement | null} */ (
      this.querySelector(`:scope > [data-part="${ROOT_PART}"] > [data-part="${partName}"]`)
    );
  }

  #render() {
    const sections = this.#collectSections();
    this.innerHTML = renderRoot({ href: this.href });
    this.#section(HEADER_PART)?.append(...sections.headerNodes);
    this.#section(BODY_PART)?.append(...sections.bodyNodes);
    this.#section(FOOTER_PART)?.append(...sections.footerNodes);
    this.#syncState();
  }

  /**
   * @returns {ReturnType<typeof partitionSlotNodes>}
   */
  #collectSections() {
    const root = this.#root();

    if (!root) {
      return partitionSlotNodes(filterCardContentNodes(Array.from(this.childNodes)));
    }

    return {
      headerNodes: Array.from(this.#section(HEADER_PART)?.childNodes ?? []),
      bodyNodes: Array.from(this.#section(BODY_PART)?.childNodes ?? []),
      footerNodes: Array.from(this.#section(FOOTER_PART)?.childNodes ?? []),
    };
  }

  #syncState() {
    const variant = this.variant;
    if (this.getAttribute('variant') !== variant) {
      this.setAttribute('variant', variant);
    }

    this.setAttribute('data-variant', variant);
    this.#root()?.setAttribute('data-variant', variant);
  }
}

export { normalizeVariant } from './pix-card.utils.js';
export default PixCard;
