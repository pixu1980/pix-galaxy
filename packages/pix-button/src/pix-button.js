// @ts-check
import { normalizeVariant } from "./normalize-variant.js";

const template = document.createElement("template");
template.innerHTML = `
  <button part="button" type="button">
    <slot></slot>
  </button>
`;

/**
 * PixButton Web Component.
 *
 * An accessible button wrapper with variants and a custom click event.
 *
 * @element pix-button
 *
 * @attr {"primary" | "secondary" | "ghost"} [variant="primary"] - Button visual variant.
 * @attr {boolean} [disabled] - Disables the button.
 *
 * @fires {CustomEvent} pix-button:click - Fired when the button is clicked (composed, bubbles).
 *
 * @cssprop --pix-button-background - Button background color.
 * @cssprop --pix-button-color - Button text color.
 * @cssprop --pix-button-border-color - Button border color.
 * @cssprop --pix-button-radius - Button border radius.
 * @cssprop --pix-button-padding-block - Button block padding.
 * @cssprop --pix-button-padding-inline - Button inline padding.
 *
 * @csspart button - The native button element.
 */
export class PixButton extends HTMLElement {
  static get observedAttributes() {
    return ["variant", "disabled"];
  }

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    shadow.appendChild(template.content.cloneNode(true));
    this.#button().addEventListener("click", this.#handleClick.bind(this));
  }

  connectedCallback() {
    this.#update();
  }

  /**
   * @param {string} name
   * @param {string | null} _oldValue
   * @param {string | null} _newValue
   */
  attributeChangedCallback(name, _oldValue, _newValue) {
    if (name === "variant" || name === "disabled") {
      this.#update();
    }
  }

  /**
   * The button variant.
   * @type {"primary" | "secondary" | "ghost"}
   */
  get variant() {
    return normalizeVariant(this.getAttribute("variant"));
  }

  set variant(value) {
    this.setAttribute("variant", normalizeVariant(value));
  }

  /**
   * Whether the button is disabled.
   * @type {boolean}
   */
  get disabled() {
    return this.hasAttribute("disabled");
  }

  set disabled(value) {
    if (value) {
      this.setAttribute("disabled", "");
    } else {
      this.removeAttribute("disabled");
    }
  }

  /**
   * @returns {HTMLButtonElement}
   */
  #button() {
    return /** @type {HTMLButtonElement} */ (
      this.shadowRoot?.querySelector("button")
    );
  }

  #update() {
    const btn = this.#button();
    if (!btn) return;

    const variant = normalizeVariant(this.getAttribute("variant"));
    this.setAttribute("variant", variant);
    btn.disabled = this.disabled;
    btn.setAttribute("aria-disabled", String(this.disabled));
  }

  /**
   * @param {MouseEvent} event
   */
  #handleClick(event) {
    if (this.disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    this.dispatchEvent(
      new CustomEvent("pix-button:click", {
        bubbles: true,
        composed: true,
        detail: { variant: this.variant },
      })
    );
  }
}

if (!customElements.get("pix-button")) {
  customElements.define("pix-button", PixButton);
}
