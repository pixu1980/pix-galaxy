// @ts-check

import styles from './styles/pix-color-scheme-switcher.css';

import { componentDecorator } from '@pix-galaxy/shared/decorator/index.js';

import attributes from './pix-color-scheme-switcher.attributes.js';
import events from './pix-color-scheme-switcher.events.js';
import {
  CHANGE_EVENT,
  META_CONTENT,
  STORAGE_KEY,
} from './pix-color-scheme-switcher.consts.js';
import { renderSwitcher } from './pix-color-scheme-switcher.template.js';
import {
  ensureColorSchemeMeta,
  getStorage,
  getSystemMedia,
  inferInitialScheme,
  normalizeScheme,
  resolveScheme,
} from './pix-color-scheme-switcher.utils.js';

/**
 * PixColorSchemeSwitcher Web Component.
 *
 * @element pix-color-scheme-switcher
 * @fires pix-color-scheme-switcher:change - Fired after applying a new scheme.
 */
export class PixColorSchemeSwitcher extends HTMLElement {
  static attributes = attributes;
  static events = events;
  static styles = styles;

  static {
    componentDecorator(this);
  }

  /** @type {import('./pix-color-scheme-switcher.consts.js').PixColorScheme} */
  #currentScheme = inferInitialScheme();

  /** @type {MediaQueryList | null} */
  #systemMedia = null;

  #handleSystemChange = () => {
    if (this.#currentScheme !== 'system') {
      return;
    }

    this.#syncDocumentScheme({ persist: false, notify: true });
  };

  /**
   * The selected scheme mode.
   *
   * @returns {import('./pix-color-scheme-switcher.consts.js').PixColorScheme}
   */
  get currentScheme() {
    return this.#currentScheme;
  }

  /**
   * The resolved document scheme.
   *
   * @returns {'light' | 'dark'}
   */
  get resolvedScheme() {
    return resolveScheme(this.#currentScheme, this.#systemMedia ?? getSystemMedia());
  }

  onRender() {
    this.innerHTML = renderSwitcher({});
    this.#syncDocumentScheme({ persist: true, notify: false });
  }

  onConnected() {
    this.#systemMedia = getSystemMedia();
    this.#systemMedia?.addEventListener('change', this.#handleSystemChange);
    this.#syncOptionState();
  }

  onDisconnected() {
    this.#systemMedia?.removeEventListener('change', this.#handleSystemChange);
    this.#systemMedia = null;
  }

  /**
   * Apply a new color scheme.
   *
   * @param {string | null | undefined} scheme
   */
  applyColorScheme(scheme) {
    this.#currentScheme = normalizeScheme(scheme);
    this.#syncDocumentScheme({ persist: true, notify: true });
  }

  /**
   * @param {{ persist: boolean; notify: boolean }} options
   */
  #syncDocumentScheme(options) {
    const root = document.documentElement;
    const meta = ensureColorSchemeMeta(document);
    const resolvedScheme = this.resolvedScheme;

    root.setAttribute('data-color-scheme', resolvedScheme);
    root.setAttribute('data-color-scheme-mode', this.#currentScheme);
    root.style.colorScheme = this.#currentScheme === 'system'
      ? META_CONTENT.system
      : resolvedScheme;
    meta?.setAttribute('content', META_CONTENT[this.#currentScheme]);

    if (options.persist) {
      try {
        getStorage()?.setItem(STORAGE_KEY, this.#currentScheme);
      } catch {
        // Ignore storage failures in restricted environments.
      }
    }

    this.#syncOptionState();

    if (options.notify) {
      this.dispatchEvent(new CustomEvent(CHANGE_EVENT, {
        bubbles: true,
        detail: {
          scheme: this.#currentScheme,
          resolvedScheme,
        },
      }));
    }
  }

  #syncOptionState() {
    const inputs = this.querySelectorAll('input[name="color-scheme"]');

    for (const input of inputs) {
      if (!(input instanceof HTMLInputElement)) {
        continue;
      }

      const isActive = input.value === this.#currentScheme;
      input.checked = isActive;
      input.closest('[data-part="option"]')?.toggleAttribute('data-active', isActive);
    }
  }
}

export { normalizeScheme } from './pix-color-scheme-switcher.utils.js';
export default PixColorSchemeSwitcher;
