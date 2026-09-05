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
global.HTMLInputElement = dom.window.HTMLInputElement;
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

let BODY_FONT_OPTIONS,
  CODE_FONT_OPTIONS,
  DEFAULT_PREFERENCES,
  FONT_SCALE_OPTIONS,
  HEADING_FONT_OPTIONS,
  LINE_HEIGHT_OPTIONS,
  PixA11y,
  RADIUS_PRESET_OPTIONS,
  STORAGE_KEY,
  ACCESSIBILITY_OPTIONS,
  applyPreferencesToDocument,
  readPreferences;

before(async () => {
  const mod = await import(
    new URL('../components/A11y/_A11y.js?component-test', import.meta.url)
  );
  ({
    ACCESSIBILITY_OPTIONS,
    BODY_FONT_OPTIONS,
    CODE_FONT_OPTIONS,
    DEFAULT_PREFERENCES,
    FONT_SCALE_OPTIONS,
    HEADING_FONT_OPTIONS,
    LINE_HEIGHT_OPTIONS,
    PixA11y,
    RADIUS_PRESET_OPTIONS,
    STORAGE_KEY,
    applyPreferencesToDocument,
    readPreferences,
  } = mod);
});

beforeEach(() => {
  document.head.innerHTML = '';
  document.body.innerHTML = '';
  document.adoptedStyleSheets = [];
  document.documentElement.removeAttribute('data-color-scheme');
  document.documentElement.removeAttribute('data-reduce-motion');
  document.documentElement.removeAttribute('data-reduce-animations');
  document.documentElement.removeAttribute('data-reduce-transparency');
  document.documentElement.removeAttribute('data-increase-contrast');
  document.documentElement.removeAttribute('data-radius-preset');
  document.documentElement.style.removeProperty('colorScheme');
  document.documentElement.style.removeProperty('color-scheme');
  document.documentElement.style.removeProperty('font-size');
  document.documentElement.style.removeProperty('--pix-ds-font-display');
  document.documentElement.style.removeProperty('--pix-ds-font-sans');
  document.documentElement.style.removeProperty('--pix-ds-font-mono');
  document.documentElement.style.removeProperty('--pix-accent-h');
  document.documentElement.style.removeProperty('--pix-accent-s');
  document.documentElement.style.removeProperty('--pix-accent-l');
  window.localStorage.clear();
});

function mountPreferences() {
  const element = document.createElement('pix-a11y');
  document.body.appendChild(element);
  return element;
}

/* ───────────────────────────────────────────────
   Rendering & structure
   ─────────────────────────────────────────────── */

describe('PixA11y - rendering & structure', () => {
  test('registers the custom element as pix-a11y', () => {
    const element = mountPreferences();
    assert.equal(customElements.get('pix-a11y'), PixA11y);
    assert.equal(element.tagName.toLowerCase(), 'pix-a11y');
  });

  test('renders the toggle button', () => {
    const element = mountPreferences();
    const toggle = element.querySelector('[data-preferences-toggle]');
    assert.ok(toggle);
    assert.equal(toggle.getAttribute('aria-label'), 'Open display preferences');
    assert.equal(toggle.getAttribute('aria-haspopup'), 'dialog');
    assert.equal(toggle.getAttribute('aria-expanded'), 'false');
  });

  test('renders the popover panel with correct role and aria attributes', () => {
    const element = mountPreferences();
    const panel = element.querySelector('[data-preferences-panel]');
    assert.ok(panel);
    assert.equal(panel.getAttribute('role'), 'dialog');
    assert.ok(panel.getAttribute('aria-labelledby'));
    assert.ok(panel.id.startsWith('a11y-panel-'));
  });

  test('renders all four preference cards in visual order: Accent color, Accessibility, Typography, Corners', () => {
    const element = mountPreferences();
    const groups = Array.from(
      element.querySelectorAll('[data-preferences-panel] > [data-preferences-card]')
    );
    const labels = groups.map((group) => group.querySelector('h3')?.textContent.trim());
    assert.deepEqual(labels, ['Accent color', 'Accessibility', 'Typography', 'Corners']);
  });

  test('renders the Accent color card with accent-color-selector only', () => {
    const element = mountPreferences();
    const groups = element.querySelectorAll('[data-preferences-panel] [data-preferences-card]');
    const accentGroup = groups[0];
    assert.ok(accentGroup);
    assert.equal(accentGroup.querySelector('h3').textContent.trim(), 'Accent color');
    assert.equal(accentGroup.querySelector('pix-color-scheme-selector'), null);
    assert.ok(accentGroup.querySelector('pix-accent-color-selector'));
  });

  test('renders three accessibility checkboxes', () => {
    const element = mountPreferences();
    const checkboxes = element.querySelectorAll('input[type="checkbox"]');
    assert.equal(checkboxes.length, 3);
    assert.ok(element.querySelector('input[name="reduceMotion"]'));
    assert.ok(element.querySelector('input[name="reduceTransparency"]'));
    assert.ok(element.querySelector('input[name="increaseContrast"]'));
    assert.equal(element.querySelector('input[name="reduceAnimations"]'), null);
  });

  test('renders five typography selects (font scale, line-height, heading, body, code)', () => {
    const element = mountPreferences();
    const selects = element.querySelectorAll('select');
    assert.equal(selects.length, 5);
    assert.ok(element.querySelector('select[name="fontScale"]'));
    assert.ok(element.querySelector('select[name="lineHeight"]'));
    assert.ok(element.querySelector('select[name="headingFont"]'));
    assert.ok(element.querySelector('select[name="bodyFont"]'));
    assert.ok(element.querySelector('select[name="codeFont"]'));
  });

  test('renders three radius radio buttons with correct defaults', () => {
    const element = mountPreferences();
    const radios = element.querySelectorAll('input[type="radio"][name="radiusPreset"]');
    assert.equal(radios.length, 3);
    assert.equal(
      element.querySelector('input[name="radiusPreset"][value="rounded"]').checked,
      true
    );
    assert.equal(
      element.querySelector('input[name="radiusPreset"][value="square"]').checked,
      false
    );
    assert.equal(
      element.querySelector('input[name="radiusPreset"][value="squircle"]').checked,
      false
    );
  });

  test('font scale defaults to 100%', () => {
    const element = mountPreferences();
    assert.equal(element.querySelector('select[name="fontScale"]').value, '100%');
  });
});

/* ───────────────────────────────────────────────
   Document application & persistence
   ─────────────────────────────────────────────── */

describe('PixA11y - document application & persistence', () => {
  test('applies saved preferences including legacy reduceAnimations', () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        bodyFont: 'book-serif',
        codeFont: 'system-mono',
        fontScale: '125%',
        headingFont: 'system-sans',
        increaseContrast: true,
        radiusPreset: 'rounded',
        reduceAnimations: true,
        reduceMotion: false,
        reduceTransparency: true,
      })
    );

    mountPreferences();

    assert.equal(document.documentElement.getAttribute('data-reduce-motion'), 'true');
    assert.equal(document.documentElement.getAttribute('data-reduce-animations'), null);
    assert.equal(document.documentElement.getAttribute('data-reduce-transparency'), 'true');
    assert.equal(document.documentElement.getAttribute('data-increase-contrast'), 'true');
    assert.equal(document.documentElement.getAttribute('data-radius-preset'), 'rounded');
    assert.equal(document.documentElement.style.fontSize, '125%');
    assert.match(
      document.documentElement.style.getPropertyValue('--pix-ds-font-display'),
      /system-ui/i
    );
    assert.match(document.documentElement.style.getPropertyValue('--pix-ds-font-sans'), /Georgia/i);
    assert.match(
      document.documentElement.style.getPropertyValue('--pix-ds-font-mono'),
      /ui-monospace/i
    );
  });

  test('applies all defaults when no storage is present', () => {
    mountPreferences();

    assert.equal(document.documentElement.hasAttribute('data-reduce-motion'), false);
    assert.equal(document.documentElement.hasAttribute('data-reduce-transparency'), false);
    assert.equal(document.documentElement.hasAttribute('data-increase-contrast'), false);
    assert.equal(document.documentElement.getAttribute('data-radius-preset'), 'rounded');
    assert.equal(document.documentElement.style.fontSize, '');
    assert.match(
      document.documentElement.style.getPropertyValue('--pix-ds-font-sans'),
      /system-ui/i
    );
  });

  test('updatePreference changes a single preference and persists it', () => {
    const element = mountPreferences();
    element.updatePreference('fontScale', '125%');

    assert.equal(document.documentElement.style.fontSize, '125%');
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
    assert.equal(saved.fontScale, '125%');

    element.updatePreference('reduceMotion', true);
    assert.equal(document.documentElement.getAttribute('data-reduce-motion'), 'true');
    assert.equal(JSON.parse(window.localStorage.getItem(STORAGE_KEY)).reduceMotion, true);
  });

  test('preference controls update the document and storage on change', () => {
    const element = mountPreferences();

    const reduceMotion = element.querySelector('input[name="reduceMotion"]');
    const fontScale = element.querySelector('select[name="fontScale"]');
    const lineHeight = element.querySelector('select[name="lineHeight"]');
    const radiusPreset = element.querySelector('input[name="radiusPreset"][value="squircle"]');
    const headingFont = element.querySelector('select[name="headingFont"]');
    const bodyFont = element.querySelector('select[name="bodyFont"]');
    const codeFont = element.querySelector('select[name="codeFont"]');

    reduceMotion.checked = true;
    reduceMotion.dispatchEvent(new window.Event('change', { bubbles: true }));
    fontScale.value = '80%';
    fontScale.dispatchEvent(new window.Event('change', { bubbles: true }));
    lineHeight.value = 'relaxed';
    lineHeight.dispatchEvent(new window.Event('change', { bubbles: true }));
    radiusPreset.dispatchEvent(new window.Event('change', { bubbles: true }));
    headingFont.value = 'rounded-sans';
    headingFont.dispatchEvent(new window.Event('change', { bubbles: true }));
    bodyFont.value = 'readable-serif';
    bodyFont.dispatchEvent(new window.Event('change', { bubbles: true }));
    codeFont.value = 'classic-mono';
    codeFont.dispatchEvent(new window.Event('change', { bubbles: true }));

    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY));

    assert.equal(document.documentElement.getAttribute('data-reduce-motion'), 'true');
    assert.equal(document.documentElement.getAttribute('data-radius-preset'), 'squircle');
    assert.equal(document.documentElement.style.fontSize, '80%');
    assert.equal(saved.fontScale, '80%');
    assert.equal(saved.lineHeight, 'relaxed');
    assert.equal(saved.radiusPreset, 'squircle');
    assert.equal(saved.headingFont, 'rounded-sans');
    assert.equal(saved.bodyFont, 'readable-serif');
    assert.equal(saved.codeFont, 'classic-mono');
    assert.equal('reduceAnimations' in saved, false);
    assert.match(
      document.documentElement.style.getPropertyValue('--pix-ds-font-display'),
      /Optima/i
    );
    assert.match(document.documentElement.style.getPropertyValue('--pix-ds-font-sans'), /Charter/i);
    assert.match(
      document.documentElement.style.getPropertyValue('--pix-ds-font-mono'),
      /Courier New/i
    );
    assert.equal(document.documentElement.style.getPropertyValue('--pix-ds-leading-normal'), '1.8');
  });

  test('setting font scale back to default removes the inline font-size', () => {
    const element = mountPreferences();
    element.updatePreference('fontScale', '125%');
    assert.equal(document.documentElement.style.fontSize, '125%');

    element.updatePreference('fontScale', '100%');
    assert.equal(document.documentElement.style.fontSize, '');
  });

  test('setting reduce-motion to false removes the data attribute', () => {
    const element = mountPreferences();
    element.updatePreference('reduceMotion', true);
    assert.equal(document.documentElement.getAttribute('data-reduce-motion'), 'true');

    element.updatePreference('reduceMotion', false);
    assert.equal(document.documentElement.hasAttribute('data-reduce-motion'), false);
  });
});

/* ───────────────────────────────────────────────
   Exported API surface
   ─────────────────────────────────────────────── */

describe('PixA11y - exported API surface', () => {
  test('exports STORAGE_KEY', () => {
    assert.equal(STORAGE_KEY, 'pix-a11y');
  });

  test('exports FONT_SCALE_OPTIONS', () => {
    assert.deepEqual(FONT_SCALE_OPTIONS, ['75%', '80%', '90%', '100%', '110%', '120%', '125%']);
  });

  test('exports LINE_HEIGHT_OPTIONS', () => {
    assert.deepEqual(
      LINE_HEIGHT_OPTIONS.map((option) => option.id),
      ['compact', 'normal', 'relaxed']
    );
  });

  test('exports ACCESSIBILITY_OPTIONS with correct shape', () => {
    assert.equal(ACCESSIBILITY_OPTIONS.length, 3);
    for (const opt of ACCESSIBILITY_OPTIONS) {
      assert.ok(opt.attribute);
      assert.ok(opt.description);
      assert.ok(opt.label);
      assert.ok(opt.name);
    }
    assert.equal(ACCESSIBILITY_OPTIONS[0].name, 'reduceMotion');
    assert.equal(ACCESSIBILITY_OPTIONS[1].name, 'reduceTransparency');
    assert.equal(ACCESSIBILITY_OPTIONS[2].name, 'increaseContrast');
  });

  test('exports RADIUS_PRESET_OPTIONS with correct defaults', () => {
    assert.equal(RADIUS_PRESET_OPTIONS.length, 3);
    assert.equal(RADIUS_PRESET_OPTIONS[0].id, 'square');
    assert.equal(RADIUS_PRESET_OPTIONS[1].id, 'rounded');
    assert.equal(RADIUS_PRESET_OPTIONS[2].id, 'squircle');
  });

  test('exports HEADING_FONT_OPTIONS with first option being editorial-serif', () => {
    assert.ok(HEADING_FONT_OPTIONS.length > 0);
    assert.equal(HEADING_FONT_OPTIONS[0].id, 'editorial-serif');
    assert.ok(HEADING_FONT_OPTIONS.find((o) => o.id === 'open-dyslexic'));
  });

  test('exports BODY_FONT_OPTIONS with first option being system-sans', () => {
    assert.ok(BODY_FONT_OPTIONS.length > 0);
    assert.equal(BODY_FONT_OPTIONS[0].id, 'system-sans');
    assert.ok(BODY_FONT_OPTIONS.find((o) => o.id === 'book-serif'));
  });

  test('exports CODE_FONT_OPTIONS with first option being system-mono', () => {
    assert.ok(CODE_FONT_OPTIONS.length > 0);
    assert.equal(CODE_FONT_OPTIONS[0].id, 'system-mono');
    assert.ok(CODE_FONT_OPTIONS.find((o) => o.id === 'classic-mono'));
  });

  test('DEFAULT_PREFERENCES is frozen and has all expected keys', () => {
    assert.ok(Object.isFrozen(DEFAULT_PREFERENCES));
    assert.equal(DEFAULT_PREFERENCES.fontScale, '100%');
    assert.equal(DEFAULT_PREFERENCES.headingFont, 'editorial-serif');
    assert.equal(DEFAULT_PREFERENCES.lineHeight, 'normal');
    assert.equal(DEFAULT_PREFERENCES.bodyFont, 'system-sans');
    assert.equal(DEFAULT_PREFERENCES.codeFont, 'system-mono');
    assert.equal(DEFAULT_PREFERENCES.radiusPreset, 'rounded');
    assert.equal(DEFAULT_PREFERENCES.reduceMotion, false);
    assert.equal(DEFAULT_PREFERENCES.reduceTransparency, false);
    assert.equal(DEFAULT_PREFERENCES.increaseContrast, false);
  });
});

/* ───────────────────────────────────────────────
   readPreferences / writePreferences
   ─────────────────────────────────────────────── */

describe('PixA11y - readPreferences & normalizePreferences', () => {
  test('readPreferences returns defaults when storage is empty', () => {
    const prefs = readPreferences();
    assert.deepEqual(prefs, DEFAULT_PREFERENCES);
  });

  test('readPreferences parses saved JSON correctly', () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        bodyFont: 'humanist-sans',
        codeFont: 'plex-mono',
        fontScale: '110%',
        headingFont: 'rounded-sans',
        lineHeight: 'compact',
        increaseContrast: true,
        radiusPreset: 'square',
        reduceMotion: true,
        reduceTransparency: false,
      })
    );

    const prefs = readPreferences();
    assert.equal(prefs.bodyFont, 'humanist-sans');
    assert.equal(prefs.codeFont, 'plex-mono');
    assert.equal(prefs.fontScale, '110%');
    assert.equal(prefs.headingFont, 'rounded-sans');
    assert.equal(prefs.lineHeight, 'compact');
    assert.equal(prefs.radiusPreset, 'square');
    assert.equal(prefs.reduceMotion, true);
    assert.equal(prefs.increaseContrast, true);
    assert.equal(prefs.reduceTransparency, false);
  });

  test('readPreferences falls back to defaults on corrupt JSON', () => {
    window.localStorage.setItem(STORAGE_KEY, 'not-valid-json{{{');
    const prefs = readPreferences();
    assert.deepEqual(prefs, DEFAULT_PREFERENCES);
  });

  test('normalizePreferences sanitises unknown font IDs to first option', () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        bodyFont: 'nonexistent-font',
        codeFont: 'also-missing',
        fontScale: '200%',
        headingFont: 'missing-too',
      })
    );

    const prefs = readPreferences();
    assert.equal(prefs.bodyFont, 'system-sans');
    assert.equal(prefs.codeFont, 'system-mono');
    assert.equal(prefs.fontScale, '100%');
    assert.equal(prefs.headingFont, 'editorial-serif');
    assert.equal(prefs.lineHeight, 'normal');
  });

  test('normalizePreferences handles partial preferences', () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        fontScale: '90%',
        reduceMotion: true,
      })
    );

    const prefs = readPreferences();
    assert.equal(prefs.fontScale, '90%');
    assert.equal(prefs.reduceMotion, true);
    assert.equal(prefs.bodyFont, 'system-sans'); // default fallback
    assert.equal(prefs.headingFont, 'editorial-serif');
    assert.equal(prefs.lineHeight, 'normal');
  });

  test('normalizePreferences handles null/undefined preferences', () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(null));
    const prefs = readPreferences();
    assert.deepEqual(prefs, DEFAULT_PREFERENCES);
  });
});

/* ───────────────────────────────────────────────
   applyPreferencesToDocument
   ─────────────────────────────────────────────── */

describe('PixA11y - applyPreferencesToDocument', () => {
  test('applies defaults directly to the document without component', () => {
    const applied = applyPreferencesToDocument(DEFAULT_PREFERENCES);
    assert.equal(applied.radiusPreset, 'rounded');
    assert.equal(applied.fontScale, '100%');
    assert.equal(applied.headingFont, 'editorial-serif');
    assert.equal(applied.lineHeight, 'normal');
    assert.equal(applied.bodyFont, 'system-sans');
    assert.equal(applied.codeFont, 'system-mono');
  });

  test('sets accessibility data attributes correctly', () => {
    applyPreferencesToDocument({
      ...DEFAULT_PREFERENCES,
      reduceMotion: true,
      reduceTransparency: true,
      increaseContrast: true,
    });

    assert.equal(document.documentElement.getAttribute('data-reduce-motion'), 'true');
    assert.equal(document.documentElement.getAttribute('data-reduce-transparency'), 'true');
    assert.equal(document.documentElement.getAttribute('data-increase-contrast'), 'true');
  });

  test('sets font-family custom properties', () => {
    applyPreferencesToDocument({
      ...DEFAULT_PREFERENCES,
      headingFont: 'book-serif',
      bodyFont: 'readable-serif',
      codeFont: 'cascadia-mono',
    });

    assert.match(
      document.documentElement.style.getPropertyValue('--pix-ds-font-display'),
      /Baskerville/i
    );
    assert.match(document.documentElement.style.getPropertyValue('--pix-ds-font-sans'), /Charter/i);
    assert.match(
      document.documentElement.style.getPropertyValue('--pix-ds-font-mono'),
      /Cascadia/i
    );
  });

  test('sets font-scale correctly', () => {
    applyPreferencesToDocument({ ...DEFAULT_PREFERENCES, fontScale: '125%' });
    assert.equal(document.documentElement.style.fontSize, '125%');

    applyPreferencesToDocument({ ...DEFAULT_PREFERENCES, fontScale: '100%' });
    assert.equal(document.documentElement.style.fontSize, '');
  });

  test('sets data-radius-preset correctly', () => {
    applyPreferencesToDocument({ ...DEFAULT_PREFERENCES, radiusPreset: 'square' });
    assert.equal(document.documentElement.getAttribute('data-radius-preset'), 'square');
  });

  test('supports OpenDyslexic as heading and body font', () => {
    applyPreferencesToDocument({
      ...DEFAULT_PREFERENCES,
      bodyFont: 'open-dyslexic',
      headingFont: 'open-dyslexic',
    });

    assert.match(
      document.documentElement.style.getPropertyValue('--pix-ds-font-display'),
      /OpenDyslexic/
    );
    assert.match(
      document.documentElement.style.getPropertyValue('--pix-ds-font-sans'),
      /OpenDyslexic/
    );
  });

  test('cleans up legacy data-reduce-animations attribute', () => {
    document.documentElement.setAttribute('data-reduce-animations', 'true');
    applyPreferencesToDocument(DEFAULT_PREFERENCES);
    assert.equal(document.documentElement.hasAttribute('data-reduce-animations'), false);
  });

  test('returns a normalized copy of the input', () => {
    const input = { fontScale: '90%' };
    const result = applyPreferencesToDocument(input);
    assert.notStrictEqual(result, input);
    assert.equal(result.fontScale, '90%');
    assert.equal(result.radiusPreset, 'rounded');
  });
});

/* ───────────────────────────────────────────────
   Popover behaviour
   ─────────────────────────────────────────────── */

describe('PixA11y - popover behaviour', () => {
  test('click-driven fallback toggles open/close state', () => {
    const element = mountPreferences();
    const toggle = element.querySelector('[data-preferences-toggle]');

    toggle.click();
    assert.equal(element.dataset.open, 'true');
    assert.equal(
      element.querySelector('[data-preferences-panel]').getAttribute('data-open'),
      'true'
    );
    assert.equal(toggle.getAttribute('aria-expanded'), 'true');

    toggle.click();
    assert.equal(element.dataset.open, 'false');
  });

  test('Escape key closes the popover in fallback mode', () => {
    const element = mountPreferences();
    const toggle = element.querySelector('[data-preferences-toggle]');

    toggle.click();
    assert.equal(element.dataset.open, 'true');

    document.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape' }));
    assert.equal(element.dataset.open, 'false');
    assert.equal(toggle.getAttribute('aria-expanded'), 'false');
  });

  test('pointerdown outside closes the popover in fallback mode', () => {
    const element = mountPreferences();
    const toggle = element.querySelector('[data-preferences-toggle]');

    toggle.click();
    assert.equal(element.dataset.open, 'true');

    document.dispatchEvent(new window.PointerEvent('pointerdown', { target: document.body }));
    assert.equal(element.dataset.open, 'false');
  });

  test('pointerdown inside the element does not close the popover', () => {
    const element = mountPreferences();
    const toggle = element.querySelector('[data-preferences-toggle]');

    toggle.click();
    assert.equal(element.dataset.open, 'true');

    // Simulate pointerdown on the element itself (should not close)
    const pointerEvent = new window.PointerEvent('pointerdown', {
      bubbles: true,
      cancelable: true,
    });
    Object.defineProperty(pointerEvent, 'target', {
      configurable: true,
      value: element,
    });
    document.dispatchEvent(pointerEvent);
    assert.equal(element.dataset.open, 'true');
  });

  test('isOpen() returns correct open state in fallback mode', () => {
    const element = mountPreferences();
    assert.equal(element.isOpen(), false);

    element.querySelector('[data-preferences-toggle]').click();
    assert.equal(element.isOpen(), true);
  });
});

describe('PixA11y - popover mode & edge branches', () => {
  test('uses native popover mode when the API is available', () => {
    const proto = window.HTMLElement.prototype;

    // Simulate a browser with popover support so the next mount enters
    // popover mode (protected by try/finally cleanup).
    Object.defineProperty(proto, 'showPopover', { configurable: true, value: () => {} });
    Object.defineProperty(proto, 'hidePopover', { configurable: true, value: () => {} });
    try {
      const element = mountPreferences();

      // Panel not open yet.
      assert.equal(element.isOpen(), false);

      const panel = element.querySelector('[data-preferences-panel]');
      Object.defineProperty(panel, 'matches', {
        value: (sel) => sel === ':popover-open',
      });
      panel.dispatchEvent(new window.CustomEvent('toggle'));
      assert.equal(element.dataset.open, 'true');

      // The fallback toggle handler is a no-op in popover mode.
      const click = new window.MouseEvent('click', { bubbles: true, cancelable: true });
      element.querySelector('[data-preferences-toggle]').dispatchEvent(click);
      assert.equal(click.defaultPrevented, false);

      // Calling the fallback toggle directly returns early in popover mode.
      let prevented = false;
      element._onFallbackToggle({ preventDefault: () => (prevented = true) });
      assert.equal(prevented, false);
    } finally {
      delete proto.showPopover;
      delete proto.hidePopover;
    }
  });

  test('Escape and outside pointerdown are no-ops while closed, Escape closes when open', () => {
    const element = mountPreferences();

    document.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape' }));
    document.dispatchEvent(
      new window.MouseEvent('pointerdown', { bubbles: true, clientX: 5, clientY: 5 })
    );
    assert.equal(element.isOpen(), false);

    element.querySelector('[data-preferences-toggle]').click();
    assert.equal(element.isOpen(), true);

    document.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape' }));
    assert.equal(element.isOpen(), false);
  });

  test('position update queue is skipped while closed', () => {
    const element = mountPreferences();
    element.queuePanelPositionUpdate();
    assert.equal(element.isOpen(), false);
  });

  test('tolerates panels without scrollTo', () => {
    const element = mountPreferences();
    const panel = element.querySelector('[data-preferences-panel]');
    if ('scrollTo' in panel) {
      delete panel.scrollTo;
    }
    element.querySelector('[data-preferences-toggle]').click();
    assert.equal(element.isOpen(), true);
  });

  test('uses requestAnimationFrame when available and positions the panel', () => {
    const element = mountPreferences();
    const originalRaf = window.requestAnimationFrame;
    window.requestAnimationFrame = (cb) => {
      cb();
      return 0;
    };
    try {
      const panel = element.querySelector('[data-preferences-panel]');
      Object.defineProperty(panel, 'scrollTo', {
        configurable: true,
        value: () => {},
      });
      // Opening while a rAF is available runs updatePanelPosition once.
      element.querySelector('[data-preferences-toggle]').click();
      assert.equal(element.isOpen(), true);
      assert.ok(panel.style.left || panel.style.top);
    } finally {
      window.requestAnimationFrame = originalRaf;
    }
  });

  test('falls back to defaults when stored preferences are invalid JSON', () => {
    window.localStorage.setItem(STORAGE_KEY, '{definitely not json');
    const element = mountPreferences();
    assert.equal(element.preferences.reduceMotion, false);
    assert.equal(element.preferences.radiusPreset, 'rounded');
    assert.equal(element.preferences.headingFont, 'editorial-serif');
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
      const element = mountPreferences();
      assert.equal(element.preferences.reduceMotion, false);
    } finally {
      Object.defineProperty(window, 'localStorage', descriptor);
    }
  });

  test('ensureComponentStyles returns null without CSSStyleSheet support', () => {
    const original = globalThis.CSSStyleSheet;
    try {
      globalThis.CSSStyleSheet = undefined;
      assert.equal(PixA11y.ensureComponentStyles(), null);
    } finally {
      globalThis.CSSStyleSheet = original;
    }
  });
});

/* ───────────────────────────────────────────────
   CSS & component styles
   ─────────────────────────────────────────────── */

describe('PixA11y - CSS & component styles', () => {
  test('loads local component styles and registers them autonomously', async () => {
    mountPreferences();

    const componentSource = await readFile(
      new URL('../components/A11y/_A11y.js', import.meta.url),
      'utf8'
    );
    const componentCss = await readFile(
      new URL('../components/A11y/_A11y.css', import.meta.url),
      'utf8'
    );

    assert.ok(document.adoptedStyleSheets.length >= 1);
    assert.ok(
      document.adoptedStyleSheets[0].cssText.includes('pix-a11y [data-preferences-toggle]')
    );
    assert.ok(componentSource.includes("import componentCSS from './_A11y.css?raw';"));
    assert.ok(componentSource.includes('static {'));
    assert.ok(componentSource.includes('globalThis.customElements.define(ELEMENT_NAME, this)'));
    assert.ok(componentCss.includes('pix-a11y [data-preferences-panel]'));
    assert.ok(componentCss.includes('pix-a11y [data-preferences-choice]'));
    assert.ok(componentCss.includes('pix-a11y [data-preferences-grid]'));
    assert.ok(componentCss.includes('min-height: var(--pix-ds--ctrl--h'));
    assert.ok(!componentCss.includes(':host'));
  });

  test('component CSS includes accent-color-selector integration styles', async () => {
    const componentCss = await readFile(
      new URL('../components/A11y/_A11y.css', import.meta.url),
      'utf8'
    );

    assert.ok(componentCss.includes('accent-color-selector [data-accent-selector]'));
    assert.ok(componentCss.includes('accent-color-selector [data-accent-selector-label]'));
    assert.ok(componentCss.includes('flex-wrap: wrap'));
    assert.ok(componentCss.includes('@layer pix-galaxy'));
    assert.ok(componentCss.includes('@layer pix-a11y'));
  });

  test('component CSS uses pix-ds custom properties with fallbacks', async () => {
    const componentCss = await readFile(
      new URL('../components/A11y/_A11y.css', import.meta.url),
      'utf8'
    );

    assert.ok(componentCss.includes('var(--pix-ds-surface-elevated'));
    assert.ok(componentCss.includes('var(--pix-ds-line-soft'));
    assert.ok(componentCss.includes('var(--pix-ds-text-strong'));
    assert.ok(componentCss.includes('var(--pix-ds-accent-primary'));
    assert.ok(componentCss.includes('var(--pix-ds--r--lg'));
    assert.ok(componentCss.includes('var(--pix-ds-space-4'));
    assert.doesNotMatch(componentCss, /--dout-/);
  });

  test('component CSS includes backdrop and reduce-transparency support', async () => {
    const componentCss = await readFile(
      new URL('../components/A11y/_A11y.css', import.meta.url),
      'utf8'
    );

    assert.ok(componentCss.includes('backdrop-filter'));
    assert.ok(componentCss.includes('data-reduce-transparency'));
    assert.ok(componentCss.includes('data-reduce-motion'));
  });
});

/* ───────────────────────────────────────────────
   Re-initialisation & multiple instances
   ─────────────────────────────────────────────── */

describe('PixA11y - re-initialisation & multiple instances', () => {
  test('two instances write to shared localStorage', () => {
    // Each instance writes independently - the last write wins for any given key
    const el1 = mountPreferences();
    el1.updatePreference('fontScale', '125%');
    assert.equal(JSON.parse(window.localStorage.getItem(STORAGE_KEY)).fontScale, '125%');

    const el2 = mountPreferences();
    el2.updatePreference('radiusPreset', 'square');
    assert.equal(JSON.parse(window.localStorage.getItem(STORAGE_KEY)).radiusPreset, 'square');
    // Both updates persisted
    assert.equal(JSON.parse(window.localStorage.getItem(STORAGE_KEY)).fontScale, '125%');
  });

  test('disconnectedCallback cleans up event listeners without errors', () => {
    const element = mountPreferences();
    element.remove();
    // Should not throw
    assert.doesNotThrow(() => {
      element.disconnectedCallback();
    });
  });
});

/* ───────────────────────────────────────────────
   Docs site adaptation
   ─────────────────────────────────────────────── */

describe('PixA11y - docs site adaptation', () => {
  test('applyPreferencesToDocument sets attributes readable by getAttribute', () => {
    applyPreferencesToDocument({
      ...DEFAULT_PREFERENCES,
      radiusPreset: 'squircle',
      reduceMotion: true,
    });

    assert.equal(document.documentElement.getAttribute('data-radius-preset'), 'squircle');
    assert.equal(document.documentElement.getAttribute('data-reduce-motion'), 'true');
  });

  test('applyPreferencesToDocument triggers inline style changes readable by polling', () => {
    applyPreferencesToDocument({ ...DEFAULT_PREFERENCES, fontScale: '125%' });
    assert.equal(document.documentElement.style.fontSize, '125%');

    applyPreferencesToDocument({ ...DEFAULT_PREFERENCES, fontScale: '75%' });
    assert.equal(document.documentElement.style.fontSize, '75%');
  });

  test('imports safely without a DOM (SSR)', async () => {
    const base = new URL('../components/A11y/_A11y.js', import.meta.url);
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
