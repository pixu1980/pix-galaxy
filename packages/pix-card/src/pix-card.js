// @ts-check
import { normalizeVariant } from "./normalize-variant.js";

/**
 * Create the inner template based on whether the card is a link.
 * @param {string | null} href
 * @returns {string}
 */
function createTemplate(href) {
  const tag = href ? `a href="${href}"` : "div";
  const closeTag = href ? "a" : "div";

  return `
    <${tag} class="card" part="card">
      <div class="card__header" part="header">
        <slot name="header"></slot>
      </div>
      <div class="card__body" part="body">
        <slot></slot>
      </div>
      <div class="card__footer" part="footer">
        <slot name="footer"></slot>
      </div>
    </${closeTag}>
  `;
}

/**
 * PixCard Web Component.
 *
 * An accessible card container with optional link behavior.
 *
 * @element pix-card
 *
 * @attr {"default" | "outlined" | "elevated"} [variant="default"] - Card visual variant.
 * @attr {string} [href] - Optional URL. When set, the card renders as a link.
 *
 * @slot - Default slot for the card body content.
 * @slot header - Slot for the card header content.
 * @slot footer - Slot for the card footer content.
 *
 * @cssprop --pix-card-background - Card background color.
 * @cssprop --pix-card-color - Card text color.
 * @cssprop --pix-card-border-color - Card border color.
 * @cssprop --pix-card-radius - Card border radius.
 * @cssprop --pix-card-shadow - Card box shadow.
 * @cssprop --pix-card-padding - Card padding.
 *
 * @csspart card - The outer card element (div or a).
 * @csspart header - The header container.
 * @csspart body - The body container.
 * @csspart footer - The footer container.
 */
export class PixCard extends HTMLElement {
  static get observedAttributes() {
    return ["variant", "href"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.#render();
  }

  connectedCallback() {
    this.#update();
  }

  /**
   * @param {string} name
   * @param {string | null} _oldValue
   * @param {string | null} newValue
   */
  attributeChangedCallback(name, _oldValue, newValue) {
    if (name === "href") {
      this.#render();
    } else if (name === "variant") {
      this.#update();
    }
  }

  /**
   * The card variant.
   * @type {"default" | "outlined" | "elevated"}
   */
  get variant() {
    return normalizeVariant(this.getAttribute("variant"));
  }

  set variant(value) {
    this.setAttribute("variant", normalizeVariant(value));
  }

  /**
   * Optional href. When set, the card renders as a link.
   * @type {string | null}
   */
  get href() {
    return this.getAttribute("href");
  }

  set href(value) {
    if (value == null) {
      this.removeAttribute("href");
    } else {
      this.setAttribute("href", value);
    }
  }

  #render() {
    if (!this.shadowRoot) return;
    this.shadowRoot.innerHTML = createTemplate(this.getAttribute("href"));
    this.#update();
  }

  #update() {
    const variant = normalizeVariant(this.getAttribute("variant"));
    this.setAttribute("variant", variant);
  }
}

if (!customElements.get("pix-card")) {
  customElements.define("pix-card", PixCard);
}
