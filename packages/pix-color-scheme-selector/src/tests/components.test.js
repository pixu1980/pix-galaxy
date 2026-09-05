import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { before, beforeEach, describe, test } from 'node:test';
import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', {
  url: 'https://pix-galaxy.dev/',
});

global.window = dom.window;
global.document = dom.window.document;
Object.defineProperty(globalThis, 'navigator', {
  configurable: true,
  value: dom.window.navigator,
});
global.HTMLElement = dom.window.HTMLElement;
global.CustomEvent = dom.window.CustomEvent;
global.customElements = dom.window.customElements;

function installAdoptedStylesheetPolyfill() {
  if (!('adoptedStyleSheets' in document)) {
    let sheets = [];
    Object.defineProperty(document, 'adoptedStyleSheets', {
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

    globalThis.CSSStyleSheet = TestCSSStyleSheet;
    global.CSSStyleSheet = TestCSSStyleSheet;
    window.CSSStyleSheet = TestCSSStyleSheet;
  }
}

installAdoptedStylesheetPolyfill();

let PixColorSchemeSelector, SCHEMES, STORAGE_KEY, META_CONTENT;

before(async () => {
  const mod = await import(
    new URL(
      '../components/ColorSchemeSelector/_ColorSchemeSelector.js?component-test',
      import.meta.url
    )
  );
  ({ PixColorSchemeSelector, SCHEMES, STORAGE_KEY, META_CONTENT } = mod);
});

beforeEach(() => {
  document.head.innerHTML = '';
  document.body.innerHTML = '';
  document.adoptedStyleSheets = [];
  document.documentElement.removeAttribute('data-color-scheme');
  document.documentElement.style.colorScheme = '';
  window.localStorage.clear();
});

function mountSelector(tagName = 'pix-color-scheme-selector') {
  const element = document.createElement(tagName);
  document.body.appendChild(element);
  return element;
}

function stubMatchMedia(matches = false) {
  const listeners = new Set();
  const mq = {
    matches,
    media: '(prefers-color-scheme: dark)',
    addEventListener(type, cb) {
      if (type === 'change') listeners.add(cb);
    },
    removeEventListener(type, cb) {
      if (type === 'change') listeners.delete(cb);
    },
    fire(m) {
      this.matches = m;
      for (const cb of listeners) cb({ matches: m });
    },
  };
  window.matchMedia = (query) =>
    query === '(prefers-color-scheme: dark)'
      ? mq
      : { matches: false, addEventListener() {}, removeEventListener() {} };
  return mq;
}

describe('PixColorSchemeSelector', () => {
  test('registers only the correct tag', () => {
    assert.equal(customElements.get('pix-color-scheme-selector'), PixColorSchemeSelector);
    assert.deepEqual(SCHEMES, ['light', 'dark', 'system']);
  });

  test('renders a single switch button without radio inputs', () => {
    stubMatchMedia(false);
    const element = mountSelector();

    const button = element.querySelector('[data-color-scheme-toggle]');
    assert.ok(button);
    assert.equal(button.getAttribute('role'), 'switch');
    assert.equal(element.querySelectorAll('input').length, 0);
    assert.equal(button.getAttribute('aria-checked'), 'false');
    assert.equal(button.hasAttribute('data-active'), false);
    assert.equal(element.querySelector('[data-icon="sun"]').getAttribute('data-visible'), 'true');
    assert.equal(element.querySelector('[data-icon="moon"]').getAttribute('data-visible'), 'false');
  });

  test('applies a saved dark scheme on mount', () => {
    window.localStorage.setItem(STORAGE_KEY, 'dark');

    const element = mountSelector();
    const button = element.querySelector('[data-color-scheme-toggle]');

    assert.equal(button.getAttribute('aria-checked'), 'true');
    assert.equal(button.hasAttribute('data-active'), true);
    assert.equal(element.querySelector('[data-icon="moon"]').getAttribute('data-visible'), 'true');
    assert.equal(document.documentElement.dataset.colorScheme, 'dark');
    assert.equal(document.documentElement.style.colorScheme, 'dark');
    assert.equal(
      document.querySelector('meta[name="color-scheme"]')?.getAttribute('content'),
      'dark'
    );
  });

  test('clicking the toggle alternates light and dark and persists', () => {
    stubMatchMedia(true); // system resolves to dark
    const element = mountSelector();
    const button = element.querySelector('[data-color-scheme-toggle]');

    assert.equal(button.getAttribute('aria-checked'), 'true'); // system == dark
    assert.equal(document.documentElement.hasAttribute('data-color-scheme'), false);

    button.click();
    assert.equal(element.currentScheme, 'light');
    assert.equal(button.getAttribute('aria-checked'), 'false');
    assert.equal(document.documentElement.dataset.colorScheme, 'light');
    assert.equal(document.documentElement.style.colorScheme, 'light');
    assert.equal(window.localStorage.getItem(STORAGE_KEY), 'light');

    button.click();
    assert.equal(element.currentScheme, 'dark');
    assert.equal(button.getAttribute('aria-checked'), 'true');
    assert.equal(document.documentElement.dataset.colorScheme, 'dark');
    assert.equal(window.localStorage.getItem(STORAGE_KEY), 'dark');
  });

  test('follows OS changes while left on system', () => {
    const mq = stubMatchMedia(false); // system == light
    const element = mountSelector();
    const button = element.querySelector('[data-color-scheme-toggle]');

    assert.equal(button.getAttribute('aria-checked'), 'false');

    // OS flips to dark while the preference is still "system".
    mq.fire(true);
    assert.equal(button.getAttribute('aria-checked'), 'true');
    assert.equal(document.documentElement.hasAttribute('data-color-scheme'), false);

    // After an explicit choice, OS changes are ignored.
    button.click(); // -> light
    mq.fire(false);
    assert.equal(button.getAttribute('aria-checked'), 'false');
    assert.equal(element.currentScheme, 'light');
  });

  test('falls back to light when matchMedia is unavailable', () => {
    window.matchMedia = undefined;
    const element = mountSelector();

    assert.equal(element.isDark(), false);
    assert.equal(
      element.querySelector('[data-color-scheme-toggle]').getAttribute('aria-checked'),
      'false'
    );
  });

  test('applyScheme still supports resetting to system programmatically', () => {
    stubMatchMedia(true);
    const element = mountSelector();

    element.applyScheme('dark');
    assert.equal(document.documentElement.dataset.colorScheme, 'dark');

    element.applyScheme('system');
    assert.equal(document.documentElement.hasAttribute('data-color-scheme'), false);
    assert.equal(document.documentElement.style.colorScheme, 'light dark');
    assert.equal(window.localStorage.getItem(STORAGE_KEY), 'system');
    assert.equal(
      document.querySelector('meta[name="color-scheme"]')?.getAttribute('content'),
      'light dark'
    );
  });

  test('loads local component styles and registers them autonomously', async () => {
    mountSelector();

    const componentSource = await readFile(
      new URL('../components/ColorSchemeSelector/_ColorSchemeSelector.js', import.meta.url),
      'utf8'
    );
    const componentCss = await readFile(
      new URL('../components/ColorSchemeSelector/_ColorSchemeSelector.css', import.meta.url),
      'utf8'
    );

    assert.equal(document.adoptedStyleSheets.length, 1);
    assert.ok(
      document.adoptedStyleSheets[0].cssText.includes(
        'pix-color-scheme-selector [data-color-scheme-toggle]'
      )
    );
    assert.ok(
      componentSource.includes("import componentCSS from './_ColorSchemeSelector.css?raw';")
    );
    assert.ok(componentSource.includes('static {'));
    assert.ok(componentSource.includes('globalThis.customElements.define(ELEMENT_NAME, this)'));
    assert.ok(componentCss.includes('pix-color-scheme-selector [data-color-scheme-toggle]'));
    assert.ok(!componentCss.includes(':host'));
  });

  test('defaults to system when localStorage is empty (stale meta ignored)', () => {
    const meta = document.createElement('meta');
    meta.setAttribute('name', 'color-scheme');
    meta.setAttribute('content', 'dark');
    document.head.appendChild(meta);

    const element = mountSelector();

    assert.equal(element.currentScheme, 'system');
    assert.equal(document.documentElement.hasAttribute('data-color-scheme'), false);
    assert.equal(document.documentElement.style.colorScheme, 'light dark');
  });

  test('defaults to system when no saved or meta scheme exists', () => {
    const element = mountSelector();

    assert.equal(element.currentScheme, 'system');
    assert.equal(document.documentElement.hasAttribute('data-color-scheme'), false);
    assert.equal(document.documentElement.style.colorScheme, 'light dark');
  });

  test('applyScheme method works programmatically', () => {
    const element = mountSelector();

    element.applyScheme('light');

    assert.equal(element.currentScheme, 'light');
    assert.equal(document.documentElement.dataset.colorScheme, 'light');
    assert.equal(document.documentElement.style.colorScheme, 'light');
    assert.equal(window.localStorage.getItem(STORAGE_KEY), 'light');
  });

  test('invalid scheme falls back to system', () => {
    const element = mountSelector();

    element.applyScheme('invalid');

    assert.equal(element.currentScheme, 'system');
    assert.equal(document.documentElement.hasAttribute('data-color-scheme'), false);
    assert.equal(document.documentElement.style.colorScheme, 'light dark');
  });

  test('META_CONTENT matches expected values', () => {
    assert.equal(META_CONTENT.light, 'light');
    assert.equal(META_CONTENT.dark, 'dark');
    assert.equal(META_CONTENT.system, 'light dark');
  });

  test('STORAGE_KEY is pix-color-scheme', () => {
    assert.equal(STORAGE_KEY, 'pix-color-scheme');
  });
});

describe('PixColorSchemeSelector - edge cases', () => {
  test('falls back to system when localStorage is unavailable', () => {
    const descriptor = Object.getOwnPropertyDescriptor(window, 'localStorage');
    try {
      Object.defineProperty(window, 'localStorage', {
        configurable: true,
        get() {
          throw new Error('storage denied');
        },
      });

      const element = mountSelector();

      assert.equal(element.currentScheme, 'system');
      assert.equal(document.documentElement.hasAttribute('data-color-scheme'), false);
      assert.equal(document.documentElement.style.colorScheme, 'light dark');
    } finally {
      Object.defineProperty(window, 'localStorage', descriptor);
    }
  });

  test('reuses an existing meta element when applying a scheme', () => {
    const meta = document.createElement('meta');
    meta.setAttribute('name', 'color-scheme');
    meta.setAttribute('content', 'light');
    document.head.appendChild(meta);

    const element = mountSelector();
    element.applyScheme('dark');

    assert.equal(meta.getAttribute('content'), 'dark');
    assert.equal(document.head.querySelectorAll('meta[name="color-scheme"]').length, 1);
  });

  test('ensureComponentStyles returns null when CSSStyleSheet is unavailable', () => {
    const original = globalThis.CSSStyleSheet;
    try {
      globalThis.CSSStyleSheet = undefined;
      assert.equal(PixColorSchemeSelector.ensureComponentStyles(), null);
    } finally {
      globalThis.CSSStyleSheet = original;
    }
  });

  test('imports safely without a DOM (SSR)', async () => {
    const base = new URL(
      '../components/ColorSchemeSelector/_ColorSchemeSelector.js',
      import.meta.url
    );
    const original = {
      HTMLElement: globalThis.HTMLElement,
      customElements: globalThis.customElements,
    };
    try {
      globalThis.HTMLElement = undefined;
      globalThis.customElements = undefined;
      const mod = await import(`${base.href}?ssr-smoke=${Date.now()}`);
      assert.equal(typeof mod.default, 'function');
      // No registration happened without a customElements registry.
      assert.equal(globalThis.customElements?.get?.('pix-color-scheme-selector'), undefined);
    } finally {
      globalThis.HTMLElement = original.HTMLElement;
      globalThis.customElements = original.customElements;
    }
  });
});
