// @ts-check

import { JSDOM } from 'jsdom';

let systemPrefersDark = false;
let mediaController = null;

function defineGlobal(name, value) {
  Object.defineProperty(globalThis, name, {
    configurable: true,
    writable: true,
    value,
  });
}

function installAdoptedStylesheetPolyfill(window) {
  if (!('adoptedStyleSheets' in window.document)) {
    let sheets = [];
    Object.defineProperty(window.document, 'adoptedStyleSheets', {
      configurable: true,
      get() {
        return sheets;
      },
      set(value) {
        sheets = value;
      },
    });
  }

  if (
    typeof globalThis.CSSStyleSheet !== 'function' ||
    typeof globalThis.CSSStyleSheet.prototype.replaceSync !== 'function'
  ) {
    class TestCSSStyleSheet {
      constructor() {
        this.cssText = '';
      }

      /**
       * @param {string} text
       */
      replaceSync(text) {
        this.cssText = String(text);
      }
    }

    defineGlobal('CSSStyleSheet', TestCSSStyleSheet);
    window.CSSStyleSheet = TestCSSStyleSheet;
  }
}

function createMediaController() {
  const listeners = new Set();

  return {
    media: '(prefers-color-scheme: dark)',
    get matches() {
      return systemPrefersDark;
    },
    addEventListener(type, listener) {
      if (type === 'change') {
        listeners.add(listener);
      }
    },
    removeEventListener(type, listener) {
      if (type === 'change') {
        listeners.delete(listener);
      }
    },
    dispatchChange(matches) {
      systemPrefersDark = matches;

      const event = new window.Event('change');
      Object.defineProperty(event, 'matches', {
        configurable: true,
        value: matches,
      });

      for (const listener of listeners) {
        if (typeof listener === 'function') {
          listener.call(this, event);
          continue;
        }

        listener?.handleEvent?.(event);
      }
    },
    listenerCount() {
      return listeners.size;
    },
  };
}

export function setupDom() {
  const dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', {
    url: 'https://pix-galaxy.dev/',
  });

  defineGlobal('window', dom.window);
  defineGlobal('document', dom.window.document);
  defineGlobal('navigator', dom.window.navigator);
  defineGlobal('HTMLElement', dom.window.HTMLElement);
  defineGlobal('HTMLInputElement', dom.window.HTMLInputElement);
  defineGlobal('Node', dom.window.Node);
  defineGlobal('CustomEvent', dom.window.CustomEvent);
  defineGlobal('Event', dom.window.Event);
  defineGlobal('customElements', dom.window.customElements);
  defineGlobal('localStorage', dom.window.localStorage);

  installAdoptedStylesheetPolyfill(dom.window);
  resetMatchMedia(false);

  return dom;
}

/**
 * @param {boolean} matches
 */
export function resetMatchMedia(matches = false) {
  systemPrefersDark = matches;
  mediaController = createMediaController();

  const matchMedia = () => mediaController;
  defineGlobal('matchMedia', matchMedia);
  window.matchMedia = matchMedia;
}

/**
 * @param {boolean} matches
 */
export function dispatchSystemSchemeChange(matches) {
  mediaController?.dispatchChange(matches);
}

export function getSystemListenerCount() {
  return mediaController?.listenerCount() ?? 0;
}

export function resetDom() {
  document.body.innerHTML = '';
  document.head.innerHTML = '';
  document.documentElement.removeAttribute('data-color-scheme');
  document.documentElement.removeAttribute('data-color-scheme-mode');
  document.documentElement.style.colorScheme = '';
  window.localStorage.clear();
  resetMatchMedia(false);
}
