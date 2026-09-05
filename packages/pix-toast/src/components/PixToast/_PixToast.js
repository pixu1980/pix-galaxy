/**
 * <pix-toast></pix-toast>
 *
 * Individual toast notification element.
 * Use via <pix-toast-stack> for queue management.
 *
 * @fires toast-dismiss - when the user clicks dismiss
 */
import componentCSS from './_PixToast.css?raw';

const ELEMENT_NAME = 'pix-toast';

/* ── Icons ───────────────────────────────────────────────────────── */

const INFO_ICON =
  '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/><path d="M12 8v5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="12" cy="16.5" r="1" fill="currentColor"/></svg>';
const SUCCESS_ICON =
  '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/><path d="M8 12.5 11 15.5 16 9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const WARNING_ICON =
  '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><path d="M12 4 2 20h20L12 4Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M12 10v4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="12" cy="17" r="1" fill="currentColor"/></svg>';
const ERROR_ICON =
  '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/><path d="M9 9l6 6M15 9l-6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
const CLOSE_ICON =
  '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';

const VARIANT_ICONS = {
  info: INFO_ICON,
  success: SUCCESS_ICON,
  warning: WARNING_ICON,
  error: ERROR_ICON,
};

let componentStyleSheet = null;

function adoptComponentStyles() {
  if (
    typeof document === 'undefined' ||
    !('adoptedStyleSheets' in document) ||
    typeof globalThis.CSSStyleSheet !== 'function' ||
    typeof globalThis.CSSStyleSheet.prototype.replaceSync !== 'function'
  ) {
    return null;
  }

  if (!componentStyleSheet) {
    componentStyleSheet = new CSSStyleSheet();
    componentStyleSheet.replaceSync(componentCSS);
  }

  if (!document.adoptedStyleSheets.includes(componentStyleSheet)) {
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, componentStyleSheet];
  }

  return componentStyleSheet;
}

const ComponentBase = globalThis.HTMLElement ?? class {};
class PixToast extends ComponentBase {
  static observedAttributes = ['variant', 'duration', 'dismissible'];

  static ensureComponentStyles() {
    return adoptComponentStyles();
  }

  static {
    this.ensureComponentStyles();
    if (
      typeof globalThis.customElements !== 'undefined' &&
      !globalThis.customElements.get(ELEMENT_NAME)
    ) {
      globalThis.customElements.define(ELEMENT_NAME, this);
    }
  }

  #toastId = '';
  #duration = 5000;
  #dismissTimer = 0;
  #onPointerEnter = this.#handlePause.bind(this);
  #onPointerLeave = this.#handleResume.bind(this);
  #onFocusIn = this.#handlePause.bind(this);
  #onFocusOut = this.#handleResume.bind(this);
  #onClick = (e) => {
    if (e.target.closest('[data-toast-dismiss]')) this.dismiss();
  };
  #leaving = false;

  constructor() {
    super();
  }

  connectedCallback() {
    this.constructor.ensureComponentStyles();
    if (!this.dataset.variant) {
      this.dataset.variant = 'info';
    }
    this.#startTimer();
    this.addEventListener('pointerenter', this.#onPointerEnter);
    this.addEventListener('pointerleave', this.#onPointerLeave);
    this.addEventListener('focusin', this.#onFocusIn);
    this.addEventListener('focusout', this.#onFocusOut);
    this.addEventListener('click', this.#onClick);
  }

  disconnectedCallback() {
    this.removeEventListener('pointerenter', this.#onPointerEnter);
    this.removeEventListener('pointerleave', this.#onPointerLeave);
    this.removeEventListener('focusin', this.#onFocusIn);
    this.removeEventListener('focusout', this.#onFocusOut);
    this.removeEventListener('click', this.#onClick);
    this.#clearTimer();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'variant') {
      const variant = newValue || 'info';
      this.dataset.variant = variant;
      if (variant === 'error') {
        this.setAttribute('role', 'alert');
        this.setAttribute('aria-live', 'assertive');
      } else if (variant === 'warning') {
        this.setAttribute('role', 'alert');
        this.setAttribute('aria-live', 'assertive');
      } else {
        this.setAttribute('role', 'status');
        this.setAttribute('aria-live', 'polite');
      }
      this.setAttribute('aria-atomic', 'true');
    }

    if (name === 'duration') {
      this.#duration = parseInt(newValue, 10) || 5000;
      this.style.setProperty('--pix-toast--duration', `${this.#duration}ms`);
      if (this.#duration <= 0) {
        this.#clearTimer();
        this.removeAttribute('data-timer');
      } else {
        this.setAttribute('data-timer', '');
        this.#restartTimer();
      }
    }

    if (name === 'dismissible') {
      const btn = this.querySelector('[data-toast-dismiss]');
      if (btn) {
        btn.hidden = newValue === 'false' || newValue === null;
      }
    }
  }

  /* ── Public API ────────────────────────────────────────────────── */

  get toastId() {
    return this.#toastId;
  }

  set toastId(value) {
    this.#toastId = value;
  }

  get toastDuration() {
    return this.#duration;
  }

  set toastDuration(value) {
    this.#duration = value;
    this.style.setProperty('--pix-toast--duration', `${value}ms`);
    if (value <= 0) {
      this.#clearTimer();
      this.removeAttribute('data-timer');
    } else {
      this.setAttribute('data-timer', '');
      this.#restartTimer();
    }
  }

  dismiss() {
    if (this.#leaving) return;
    this.#leaving = true;
    this.#clearTimer();
    this.dataset.leaving = '';
    this.addEventListener(
      'animationend',
      () => {
        this.remove();
        this.dispatchEvent(
          new CustomEvent('toast-dismiss', {
            detail: { id: this.#toastId },
            bubbles: true,
          })
        );
      },
      { once: true }
    );

    // Fallback: remove after animation timeout
    setTimeout(() => {
      if (this.isConnected) {
        this.remove();
      }
    }, 350);
  }

  /* ── Timer management ──────────────────────────────────────────── */

  #startTimer() {
    if (this.#duration > 0) {
      this.setAttribute('data-timer', '');
      this.style.setProperty('--pix-toast--duration', `${this.#duration}ms`);
      this.#clearTimer();
      this.#dismissTimer = setTimeout(() => {
        this.dismiss();
      }, this.#duration + 250); // +250ms for slide-in animation
    } else {
      this.removeAttribute('data-timer');
    }
  }

  #restartTimer() {
    this.#clearTimer();
    if (this.#duration > 0) {
      this.#dismissTimer = setTimeout(() => {
        this.dismiss();
      }, this.#duration + 250);
    }
  }

  #clearTimer() {
    clearTimeout(this.#dismissTimer);
    this.#dismissTimer = 0;
  }

  #handlePause() {
    if (this.#duration > 0) {
      this.#clearTimer();
    }
  }

  #handleResume() {
    if (this.#duration > 0) {
      this.#restartTimer();
    }
  }

  /* ── Render ────────────────────────────────────────────────────── */

  static render(config) {
    const id = config.id || `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const variant = config.variant || 'info';
    const duration = config.duration !== undefined ? config.duration : 5000;
    const dismissible = config.dismissible !== undefined ? config.dismissible : true;
    const icon = VARIANT_ICONS[variant] || INFO_ICON;

    const el = document.createElement('pix-toast');
    el.dataset.variant = variant;
    el.toastId = id;
    el.toastDuration = duration;
    el.setAttribute('role', variant === 'warning' || variant === 'error' ? 'alert' : 'status');
    el.setAttribute(
      'aria-live',
      variant === 'warning' || variant === 'error' ? 'assertive' : 'polite'
    );
    el.setAttribute('aria-atomic', 'true');

    const titleHtml = config.title ? `<div data-toast-title>${escapeHtml(config.title)}</div>` : '';
    const messageHtml = config.message
      ? `<div data-toast-message>${escapeHtml(config.message)}</div>`
      : '';

    el.innerHTML = `
      <span data-toast-icon>${icon}</span>
      <div data-toast-body>${titleHtml}${messageHtml}</div>
      ${dismissible ? `<button data-toast-dismiss type="button" aria-label="Dismiss notification">${CLOSE_ICON}</button>` : ''}
      ${duration > 0 ? '<div data-toast-progress></div>' : ''}
    `;

    return el;
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

export { PixToast };
