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

let {%COMPONENT_CLASS%}, STORAGE_KEY;

before(async () => {
  const mod = await import(
    new URL('../components/ComponentName/_ComponentName.js?component-test', import.meta.url)
  );
  ({ {%COMPONENT_CLASS%}, STORAGE_KEY } = mod);
});

beforeEach(() => {
  document.head.innerHTML = '';
  document.body.innerHTML = '';
  document.adoptedStyleSheets = [];
  window.localStorage.clear();
});

function mountComponent() {
  const element = document.createElement('{%ELEMENT_NAME%}');
  document.body.appendChild(element);
  return element;
}

describe('{%COMPONENT_CLASS%}', () => {
  test('registers the custom element', () => {
    assert.equal(customElements.get('{%ELEMENT_NAME%}'), {%COMPONENT_CLASS%});
  });

  test('renders on connect', () => {
    const element = mountComponent();
    assert.ok(element.querySelector('div'));
  });

  test('exposes STORAGE_KEY', () => {
    assert.equal(STORAGE_KEY, '{%STORAGE_KEY%}');
  });

  test('loads component styles and registers them autonomously', async () => {
    mountComponent();

    const componentSource = await readFile(
      new URL('../components/ComponentName/_ComponentName.js', import.meta.url),
      'utf8'
    );
    const componentCss = await readFile(
      new URL('../components/ComponentName/_ComponentName.css', import.meta.url),
      'utf8'
    );

    assert.ok(componentSource.includes("import componentCSS from './ComponentName.css?raw';"));
    assert.ok(componentSource.includes('static {'));
    assert.ok(
      componentSource.includes('globalThis.customElements.define(ELEMENT_NAME, this)')
    );
    assert.ok(componentCss.includes('@layer pix-galaxy'));
    assert.ok(componentCss.includes('{%ELEMENT_NAME%}'));
    assert.ok(!componentCss.includes(':host'));
  });

  // TODO: add more tests for:
  // - default state
  // - persisted state from localStorage
  // - programmatic API methods
  // - event dispatching
  // - keyboard navigation
  // - CSS custom properties set on :root
  // - multiple instances syncing
});
