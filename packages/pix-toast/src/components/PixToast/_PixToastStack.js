/**
 * <pix-toast-stack></pix-toast-stack>
 *
 * Toast notification queue manager.
 * Smart queuing with max-visible limit, dedup by id, and
 * position-aware stacking.
 *
 * ## Usage
 * ```html
 * <pix-toast-stack position="top-right" max-visible="5"></pix-toast-stack>
 * <script>
 *   const stack = document.querySelector('pix-toast-stack');
 *   stack.add({ message: 'Hello!', variant: 'success' });
 * </script>
 * ```
 */
import { PixToast } from './_PixToast.js';

const ELEMENT_NAME = 'pix-toast-stack';

class PixToastStack extends HTMLElement {
  static observedAttributes = ['position', 'max-visible'];

  static {
    // Ensure PixToast is registered
    if (!globalThis.customElements?.get(ELEMENT_NAME)) {
      globalThis.customElements.define(ELEMENT_NAME, this);
    }
  }

  /* ── Queue state ───────────────────────────────────────────────── */

  #queue = [];
  #visibleCount = 0;
  #activeToastIds = new Set();
  #maxVisible = 5;
  #position = 'top-right';

  /* ── Config accessors ──────────────────────────────────────────── */

  get maxVisible() {
    return this.#maxVisible;
  }

  set maxVisible(value) {
    const n = Math.max(1, parseInt(value, 10) || 5);
    this.#maxVisible = n;
    this.#processQueue();
  }

  get position() {
    return this.#position;
  }

  set position(value) {
    const valid = ['top-right', 'top-left', 'bottom-right', 'bottom-left'];
    this.#position = valid.includes(value) ? value : 'top-right';
    this.dataset.position = this.#position;
  }

  constructor() {
    super();
  }

  connectedCallback() {
    this.#position = this.getAttribute('position') || 'top-right';
    this.dataset.position = this.#position;
    this.#maxVisible = parseInt(this.getAttribute('max-visible'), 10) || 5;
    this.setAttribute('aria-label', 'Notifications');
  }

  disconnectedCallback() {
    this.#queue = [];
    this.#activeToastIds.clear();
    this.#visibleCount = 0;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'position' && newValue !== oldValue) {
      this.position = newValue;
    }

    if (name === 'max-visible' && newValue !== oldValue) {
      this.maxVisible = parseInt(newValue, 10) || 5;
    }
  }

  /* ── Public API ────────────────────────────────────────────────── */

  /**
   * Add a toast notification.
   * @param {Object} config
   * @param {string} [config.id] - Unique ID for dedup
   * @param {string} config.message - Message text
   * @param {string} [config.title] - Optional heading
   * @param {'info'|'success'|'warning'|'error'} [config.variant='info']
   * @param {number} [config.duration=5000] - Auto-dismiss ms (0 = persistent)
   * @param {boolean} [config.dismissible=true]
   * @returns {string} - The toast ID
   */
  add(config) {
    const id = config.id || `toast-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    // Dedup: if a toast with this ID is already visible, bump it
    if (this.#activeToastIds.has(id)) {
      const existing = this.querySelector(`pix-toast[data-toast-id="${id}"]`);
      if (existing) {
        // Reset its timer by recreating it
        const oldConfig = {
          id,
          title: existing.querySelector('[data-toast-title]')?.textContent || undefined,
          message: existing.querySelector('[data-toast-message]')?.textContent || '',
          variant: existing.dataset.variant || 'info',
          duration: existing.toastDuration || 5000,
          dismissible: true,
        };
        existing.dismiss();
        // Re-add at the right moment (after animation)
        setTimeout(() => {
          this.#addToast(oldConfig);
        }, 50);
        return id;
      }
    }

    this.#addToast(config, id);
    return id;
  }

  /**
   * Dismiss a specific toast by ID.
   * @param {string} id
   */
  dismiss(id) {
    const toast = this.querySelector(`pix-toast[data-toast-id="${id}"]`);
    if (toast) {
      toast.dismiss();
    } else {
      // Remove from queue if not yet visible
      this.#queue = this.#queue.filter((item) => item.id !== id);
    }
  }

  /**
   * Dismiss all visible toasts and clear queue.
   */
  dismissAll() {
    this.#queue = [];
    const toasts = [...this.querySelectorAll('pix-toast')];
    for (const toast of toasts) {
      toast.dismiss();
    }
  }

  /* ── Internal ──────────────────────────────────────────────────── */

  #addToast(config, explicitId) {
    const id = explicitId || config.id || `toast-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const toastConfig = {
      ...config,
      id,
    };

    if (this.#visibleCount < this.#maxVisible) {
      this.#renderToast(toastConfig);
    } else {
      this.#queue.push(toastConfig);
    }
  }

  #renderToast(config) {
    const el = PixToast.render(config);
    el.dataset.toastId = config.id;
    this.#visibleCount++;
    this.#activeToastIds.add(config.id);

    const btn = el.querySelector('[data-toast-dismiss]');
    if (btn) {
      btn.addEventListener('click', () => {
        this.#handleDismiss(config.id);
      });
    }

    el.addEventListener('toast-dismiss', () => {
      this.#handleDismiss(config.id);
    });

    this.appendChild(el);

    this.dispatchEvent(
      new CustomEvent('toast-add', {
        detail: { ...config },
        bubbles: true,
      })
    );
  }

  #handleDismiss(id) {
    const toast = this.querySelector(`pix-toast[data-toast-id="${id}"]`);

    this.#activeToastIds.delete(id);

    if (toast) {
      const removeHandler = () => {
        this.#visibleCount = Math.max(0, this.#visibleCount - 1);
        this.#processQueue();
      };

      // Listen for the actual DOM removal
      const observer = new MutationObserver(() => {
        if (!toast.isConnected) {
          observer.disconnect();
          removeHandler();
        }
      });
      observer.observe(this, { childList: true });

      // Also handle the case where dismiss animation completes
      toast.addEventListener('toast-dismiss', () => {
        // The toast will be removed by its own animationend
      }, { once: true });

      // Fallback if toast was already removed
      setTimeout(() => {
        if (!toast.isConnected) {
          observer.disconnect();
          removeHandler();
        }
      }, 400);

      toast.dismiss();
    } else {
      this.#visibleCount = Math.max(0, this.#visibleCount - 1);
      this.#processQueue();
    }
  }

  #processQueue() {
    while (this.#queue.length > 0 && this.#visibleCount < this.#maxVisible) {
      const next = this.#queue.shift();
      if (next) {
        this.#renderToast(next);
      }
    }
  }
}

export { PixToastStack };
