import { JSDOM } from 'jsdom';

let clipboardText = '';

class TestHighlight {
  constructor() {
    this.ranges = [];
  }

  add(range) {
    this.ranges.push(range);
  }
}

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

      replaceSync(text) {
        this.cssText = String(text);
      }
    }

    defineGlobal('CSSStyleSheet', TestCSSStyleSheet);
    window.CSSStyleSheet = TestCSSStyleSheet;
  }
}

export function setupDom() {
  const dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', {
    url: 'https://pix-galaxy.dev/',
  });

  defineGlobal('window', dom.window);
  defineGlobal('document', dom.window.document);
  defineGlobal('navigator', dom.window.navigator);
  defineGlobal('HTMLElement', dom.window.HTMLElement);
  defineGlobal('HTMLPreElement', dom.window.HTMLPreElement);
  defineGlobal('Node', dom.window.Node);
  defineGlobal('MutationObserver', dom.window.MutationObserver);
  defineGlobal('CustomEvent', dom.window.CustomEvent);
  defineGlobal('customElements', dom.window.customElements);

  installAdoptedStylesheetPolyfill(dom.window);
  enableHighlightSupport();
  stubClipboard();

  return dom;
}

export function enableHighlightSupport() {
  const registry = new Map();
  const css = {
    highlights: registry,
    supports: () => false,
  };

  defineGlobal('CSS', css);
  defineGlobal('Highlight', TestHighlight);
  window.CSS = css;
  window.Highlight = TestHighlight;
}

export function disableHighlightSupport() {
  defineGlobal('CSS', undefined);
  defineGlobal('Highlight', undefined);
  window.CSS = undefined;
  window.Highlight = undefined;
}

export function stubClipboard() {
  clipboardText = '';

  Object.defineProperty(window.navigator, 'clipboard', {
    configurable: true,
    value: {
      writeText: async (value) => {
        clipboardText = value;
      },
    },
  });
}

export function getClipboardText() {
  return clipboardText;
}

export function resetDom(PixHighlighter) {
  document.body.innerHTML = '';
  document.head.innerHTML = '';
  document.adoptedStyleSheets = [];
  document.querySelector('[data-pix-highlighter-styles]')?.remove();
  delete document.documentElement.dataset.pixHighlighterTheme;
  window.localStorage.clear();

  if (!PixHighlighter) {
    return;
  }

  for (const instance of Array.from(PixHighlighter.instances ?? [])) {
    instance.disconnectedCallback?.();
    instance.remove?.();
  }

  PixHighlighter._uid = 0;
  PixHighlighter._themeInitialized = false;
  PixHighlighter.instances.clear();
  PixHighlighter.clearManagedHighlights();
}
