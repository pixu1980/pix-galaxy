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
    new URL('../components/ColorSchemeSelector/ColorSchemeSelector.js?component-test', import.meta.url)
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

describe('PixColorSchemeSelector', () => {
  test('registers only the correct tag', () => {
    assert.equal(customElements.get('pix-color-scheme-selector'), PixColorSchemeSelector);
    assert.deepEqual(SCHEMES, ['light', 'dark', 'system']);
  });

  test('renders three options and applies a saved explicit scheme', () => {
    window.localStorage.setItem(STORAGE_KEY, 'dark');

    const element = mountSelector();
    const darkInput = element.querySelector('input[value="dark"]');

    assert.equal(element.querySelectorAll('input[name="color-scheme"]').length, 3);
    assert.equal(darkInput.checked, true);
    assert.equal(document.documentElement.dataset.colorScheme, 'dark');
    assert.equal(document.documentElement.style.colorScheme, 'dark');
    assert.equal(
      document.querySelector('meta[name="color-scheme"]')?.getAttribute('content'),
      'dark'
    );
  });

  test('switching back to system clears the explicit dataset', () => {
    const element = mountSelector();
    const darkInput = element.querySelector('input[value="dark"]');
    const systemInput = element.querySelector('input[value="system"]');

    darkInput.checked = true;
    darkInput.dispatchEvent(new window.Event('change', { bubbles: true }));

    assert.equal(document.documentElement.dataset.colorScheme, 'dark');
    assert.equal(window.localStorage.getItem(STORAGE_KEY), 'dark');

    systemInput.checked = true;
    systemInput.dispatchEvent(new window.Event('change', { bubbles: true }));

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
      new URL('../components/ColorSchemeSelector/ColorSchemeSelector.js', import.meta.url),
      'utf8'
    );
    const componentCss = await readFile(
      new URL('../components/ColorSchemeSelector/ColorSchemeSelector.css', import.meta.url),
      'utf8'
    );

    assert.equal(document.adoptedStyleSheets.length, 1);
    assert.ok(
      document.adoptedStyleSheets[0].cssText.includes(
        'pix-color-scheme-selector [data-color-scheme-selector]'
      )
    );
    assert.ok(componentSource.includes("import componentCSS from './ColorSchemeSelector.css?raw';"));
    assert.ok(componentSource.includes('static {'));
    assert.ok(
      componentSource.includes("globalThis.customElements.define(ELEMENT_NAME, this)")
    );
    assert.ok(
      componentCss.includes('pix-color-scheme-selector [data-color-scheme-selector]')
    );
    assert.ok(!componentCss.includes(':host'));
  });

  test('reads meta content when localStorage is empty', () => {
    const meta = document.createElement('meta');
    meta.setAttribute('name', 'color-scheme');
    meta.setAttribute('content', 'dark');
    document.head.appendChild(meta);

    const element = mountSelector();

    assert.equal(element.currentScheme, 'dark');
    assert.equal(document.documentElement.dataset.colorScheme, 'dark');
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
