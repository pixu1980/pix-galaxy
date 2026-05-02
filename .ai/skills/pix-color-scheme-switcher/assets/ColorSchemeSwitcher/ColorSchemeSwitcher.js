// @ts-check

import { componentDecorator } from '../../lib/custom-element/decorator/index.js';

import styles from 'bundle-text:./ColorSchemeSwitcher.css';

import attributes from './ColorSchemeSwitcher.attributes.js';
import { META_CONTENT, STORAGE_KEY } from './ColorSchemeSwitcher.consts.js';
import events from './ColorSchemeSwitcher.events.js';
import { renderSwitcher } from './ColorSchemeSwitcher.template.js';
import { getStorage, getSystemMedia, isSupportedScheme } from './ColorSchemeSwitcher.utils.js';

export class PixColorSchemeSwitcher extends HTMLElement {
  static attributes = attributes;
  static events = events;
  static styles = styles;

  static {
    componentDecorator(this);
  }

  /** @type {"light" | "dark" | "system"} */
  #currentScheme = 'system';

  /** @type {MediaQueryList | null} */
  #systemMedia = null;

  #handleSystemChange = () => {
    if (this.#currentScheme !== 'system') return;

    this.#syncDocumentScheme({ persist: false, notify: true });
  };

  constructor() {
    super();
    this.#currentScheme = this.#getInitialScheme();
  }

  get currentScheme() {
    return this.#currentScheme;
  }

  get resolvedScheme() {
    return this.#resolveScheme(this.#currentScheme);
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
   * @param {string} scheme
   * @returns {void}
   */
  applyColorScheme(scheme) {
    this.#currentScheme = this.#normalizeScheme(scheme);
    this.#syncDocumentScheme({ persist: true, notify: true });
  }

  #getOrCreateMeta() {
    const existing = document.querySelector('meta[name="color-scheme"]');
    if (existing) return existing;

    const meta = document.createElement('meta');
    meta.setAttribute('name', 'color-scheme');
    document.head.append(meta);
    return meta;
  }

  #getInitialScheme() {
    const saved = getStorage()?.getItem(STORAGE_KEY);

    if (isSupportedScheme(saved)) {
      return /** @type {"light" | "dark" | "system"} */ (saved);
    }

    const meta = document.querySelector('meta[name="color-scheme"]');
    const content = meta?.getAttribute('content') ?? '';

    if (content === 'light') return 'light';
    if (content === 'dark') return 'dark';

    return 'system';
  }

  /**
   * @param {string} scheme
   * @returns {"light" | "dark" | "system"}
   */
  #normalizeScheme(scheme) {
    return isSupportedScheme(scheme) ? /** @type {"light" | "dark" | "system"} */ (scheme) : 'system';
  }

  /**
   * @param {"light" | "dark" | "system"} scheme
   * @returns {"light" | "dark"}
   */
  #resolveScheme(scheme) {
    if (scheme !== 'system') return scheme;

    return getSystemMedia()?.matches ? 'dark' : 'light';
  }

  /**
   * @param {{ persist: boolean; notify: boolean }} options
   * @returns {void}
   */
  #syncDocumentScheme(options) {
    const root = document.documentElement;
    const meta = this.#getOrCreateMeta();
    const resolvedScheme = this.#resolveScheme(this.#currentScheme);

    root.setAttribute('data-color-scheme', resolvedScheme);
    root.setAttribute('data-color-scheme-mode', this.#currentScheme);
    root.style.colorScheme = this.#currentScheme === 'system' ? 'light dark' : resolvedScheme;
    meta.setAttribute('content', META_CONTENT[this.#currentScheme]);

    if (options.persist) {
      try {
        getStorage()?.setItem(STORAGE_KEY, this.#currentScheme);
      } catch {
        // Storage can fail in private browsing or locked-down embeds.
      }
    }

    this.#syncOptionState();

    if (options.notify) {
      this.dispatchEvent(new CustomEvent('pix-color-scheme-switcher:change', {
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
      if (!(input instanceof HTMLInputElement)) continue;

      const isActive = input.value === this.#currentScheme;
      input.checked = isActive;
      input.closest('[data-part="option"]')?.toggleAttribute('data-active', isActive);
    }
  }
}

export default PixColorSchemeSwitcher;
