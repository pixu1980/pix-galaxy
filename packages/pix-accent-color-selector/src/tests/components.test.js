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

let ACCENT_OPTIONS, PixAccentColorSelector, STORAGE_KEY;

before(async () => {
  const mod = await import(
    new URL(
      '../components/AccentColorSelector/_AccentColorSelector.js?component-test',
      import.meta.url
    )
  );
  ({ ACCENT_OPTIONS, PixAccentColorSelector, STORAGE_KEY } = mod);
});

beforeEach(() => {
  document.head.innerHTML = '';
  document.body.innerHTML = '';
  document.adoptedStyleSheets = [];
  document.documentElement.style.removeProperty('--pix-accent-h');
  document.documentElement.style.removeProperty('--pix-accent-s');
  document.documentElement.style.removeProperty('--pix-accent-l');
  window.localStorage.clear();
});

function mountSelector() {
  const element = document.createElement('pix-accent-color-selector');
  document.body.appendChild(element);
  return element;
}

describe('PixAccentColorSelector', () => {
  test('registers the custom element and exposes five accent options', () => {
    assert.equal(customElements.get('pix-accent-color-selector'), PixAccentColorSelector);
    assert.equal(ACCENT_OPTIONS.length, 5);
  });

  test('renders buttons and applies the saved accent on connect', () => {
    window.localStorage.setItem(STORAGE_KEY, 'mint');

    const element = mountSelector();
    const activeButton = element.querySelector('[data-accent="mint"]');

    assert.equal(element.querySelectorAll('[data-accent-button]').length, 5);
    assert.equal(activeButton.getAttribute('aria-checked'), 'true');
    assert.equal(activeButton.tabIndex, 0);
    assert.equal(document.documentElement.style.getPropertyValue('--pix-accent-h'), '145');
    assert.equal(document.documentElement.style.getPropertyValue('--pix-accent-s'), '80%');
    assert.equal(document.documentElement.style.getPropertyValue('--pix-accent-l'), '60%');
  });

  test('clicking a button updates the root accent variables and emits an event', () => {
    const element = mountSelector();
    let emittedDetail = null;

    element.addEventListener('accent-changed', (event) => {
      emittedDetail = event.detail;
    });

    const roseButton = element.querySelector('[data-accent="rose"]');
    roseButton.click();

    assert.equal(window.localStorage.getItem(STORAGE_KEY), 'rose');
    assert.equal(document.documentElement.style.getPropertyValue('--pix-accent-h'), '340');
    assert.equal(document.documentElement.style.getPropertyValue('--pix-accent-s'), '90%');
    assert.equal(document.documentElement.style.getPropertyValue('--pix-accent-l'), '62%');
    assert.deepEqual(emittedDetail, { accentId: 'rose', label: 'Rose' });
    assert.equal(roseButton.getAttribute('aria-checked'), 'true');
    assert.equal(
      element.querySelector('[data-accent="coral"]').getAttribute('aria-checked'),
      'false'
    );
  });

  test('supports radiogroup keyboard navigation', () => {
    const element = mountSelector();
    const coralButton = element.querySelector('[data-accent="coral"]');

    coralButton.dispatchEvent(
      new window.KeyboardEvent('keydown', { bubbles: true, key: 'ArrowRight' })
    );

    const roseButton = element.querySelector('[data-accent="rose"]');
    assert.equal(document.activeElement, roseButton);
    assert.equal(roseButton.getAttribute('aria-checked'), 'true');
    assert.equal(window.localStorage.getItem(STORAGE_KEY), 'rose');
  });

  test('loads local component styles and registers them autonomously', async () => {
    mountSelector();

    const componentSource = await readFile(
      new URL('../components/AccentColorSelector/_AccentColorSelector.js', import.meta.url),
      'utf8'
    );
    const componentCss = await readFile(
      new URL('../components/AccentColorSelector/_AccentColorSelector.css', import.meta.url),
      'utf8'
    );

    assert.equal(document.adoptedStyleSheets.length, 1);
    assert.ok(
      document.adoptedStyleSheets[0].cssText.includes(
        'pix-accent-color-selector [data-accent-selector]'
      )
    );
    assert.ok(
      componentSource.includes("import componentCSS from './_AccentColorSelector.css?raw';")
    );
    assert.ok(componentSource.includes('static {'));
    assert.ok(componentSource.includes('globalThis.customElements.define(ELEMENT_NAME, this)'));
    assert.ok(componentCss.includes('pix-accent-color-selector [data-accent-selector]'));
    assert.ok(!componentCss.includes(':host'));
  });

  test('defaults to coral when no saved accent exists', () => {
    const element = mountSelector();

    assert.equal(element.currentAccent, 'coral');
    assert.equal(document.documentElement.style.getPropertyValue('--pix-accent-h'), '16');
    assert.equal(document.documentElement.style.getPropertyValue('--pix-accent-s'), '95%');
    assert.equal(document.documentElement.style.getPropertyValue('--pix-accent-l'), '58%');
  });

  test('applyAccent method works programmatically', () => {
    const element = mountSelector();

    element.applyAccent('sky');

    assert.equal(element.currentAccent, 'sky');
    assert.equal(document.documentElement.style.getPropertyValue('--pix-accent-h'), '200');
    assert.equal(document.documentElement.style.getPropertyValue('--pix-accent-s'), '85%');
    assert.equal(document.documentElement.style.getPropertyValue('--pix-accent-l'), '62%');
    assert.equal(window.localStorage.getItem(STORAGE_KEY), 'sky');
  });

  test('invalid accent falls back to coral', () => {
    const element = mountSelector();

    element.applyAccent('nonexistent');

    assert.equal(element.currentAccent, 'coral');
    assert.equal(document.documentElement.style.getPropertyValue('--pix-accent-h'), '16');
  });

  test('STORAGE_KEY is pix-accent-color', () => {
    assert.equal(STORAGE_KEY, 'pix-accent-color');
  });

  test('ACCENT_OPTIONS contains expected entries', () => {
    const ids = ACCENT_OPTIONS.map((o) => o.id);
    assert.deepEqual(ids, ['coral', 'rose', 'lavender', 'sky', 'mint']);
  });
});

describe('PixAccentColorSelector - keyboard & edge cases', () => {
  test('full keyboard navigation: arrows wrap, Home/End, Enter and Space select', () => {
    const element = mountSelector();
    const buttons = element.querySelectorAll('[data-accent-button]');
    const press = (key) =>
      document.activeElement.dispatchEvent(
        new window.KeyboardEvent('keydown', { bubbles: true, key })
      );

    // ArrowLeft from coral (first) wraps to mint (last).
    buttons[0].focus();
    press('ArrowLeft');
    assert.equal(document.activeElement, buttons[4]);
    assert.equal(window.localStorage.getItem(STORAGE_KEY), 'mint');

    // Home jumps to the first option.
    press('Home');
    assert.equal(document.activeElement, buttons[0]);
    assert.equal(window.localStorage.getItem(STORAGE_KEY), 'coral');

    // End jumps to the last option.
    press('End');
    assert.equal(document.activeElement, buttons[4]);
    assert.equal(window.localStorage.getItem(STORAGE_KEY), 'mint');

    // ArrowDown from the last option wraps to the first.
    press('ArrowDown');
    assert.equal(document.activeElement, buttons[0]);
    assert.equal(window.localStorage.getItem(STORAGE_KEY), 'coral');

    // ArrowUp moves back one.
    press('ArrowUp');
    assert.equal(document.activeElement, buttons[4]);

    // Space selects the focused (last) option.
    press(' ');
    assert.equal(window.localStorage.getItem(STORAGE_KEY), 'mint');

    // Enter re-selects the focused option.
    press('Enter');
    assert.equal(window.localStorage.getItem(STORAGE_KEY), 'mint');

    // Unknown keys are ignored (no crash, focus stays).
    const before = document.activeElement;
    press('F1');
    assert.equal(document.activeElement, before);
  });

  test('starts from coral when a saved accent is invalid', () => {
    window.localStorage.setItem(STORAGE_KEY, 'neon-punk');

    const element = mountSelector();

    assert.equal(element.currentAccent, 'coral');
    assert.equal(
      element.querySelector('[data-accent="coral"]').getAttribute('aria-checked'),
      'true'
    );
  });

  test('keeps working when localStorage is unavailable', () => {
    const descriptor = Object.getOwnPropertyDescriptor(window, 'localStorage');
    try {
      Object.defineProperty(window, 'localStorage', {
        configurable: true,
        get() {
          throw new Error('storage denied');
        },
      });

      const element = mountSelector();
      element.querySelector('[data-accent="sky"]').click();

      assert.equal(element.currentAccent, 'sky');
      assert.equal(document.documentElement.style.getPropertyValue('--pix-accent-h'), '200');
    } finally {
      Object.defineProperty(window, 'localStorage', descriptor);
    }
  });

  test('imports safely without a DOM (SSR)', async () => {
    const base = new URL(
      '../components/AccentColorSelector/_AccentColorSelector.js',
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
    } finally {
      globalThis.HTMLElement = original.HTMLElement;
      globalThis.customElements = original.customElements;
    }
  });
});
