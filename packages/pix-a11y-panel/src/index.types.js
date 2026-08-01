/**
 * @typedef {'75%' | '80%' | '90%' | '100%' | '110%' | '120%' | '125%'} FontScale
 */

/**
 * @typedef {{ id: string, label: string, stack: string }} FontOption
 */

/**
 * @typedef {{ attribute: string, description: string, label: string, name: string }} AccessibilityOption
 */

/**
 * @typedef {{ description: string, id: string, label: string }} RadiusOption
 */

/**
 * @typedef {Object} A11yPanelPreferences
 * @property {string} bodyFont
 * @property {string} codeFont
 * @property {FontScale} fontScale
 * @property {string} headingFont
 * @property {string} lineHeight
 * @property {boolean} increaseContrast
 * @property {string} radiusPreset
 * @property {boolean} reduceMotion
 * @property {boolean} reduceTransparency
 */

/**
 * @typedef {A11yPanelPreferences} DisplayPreferences
 * @deprecated Use {@link A11yPanelPreferences} instead. Kept as alias for
 * backward compatibility with the former pix-display-preferences API.
 */

/**
 * Browser-native display preferences popover custom element.
 * Manages color scheme, accent color, accessibility, typography, and corner
 * radius preferences in a native popover panel.
 */
export class PixA11yPanel extends HTMLElement {
  /** @type {A11yPanelPreferences} */
  preferences = { ...DEFAULT_PREFERENCES };

  /** @returns {CSSStyleSheet | null} */
  static ensureComponentStyles() {
    return null;
  }

  /** @returns {void} */
  render() {}

  /** @returns {void} */
  attachEventListeners() {}

  /** @returns {void} */
  connectedCallback() {}

  /** @returns {void} */
  disconnectedCallback() {}

  /** @returns {boolean} */
  isOpen() {
    return false;
  }

  /** @returns {void} */
  queuePanelPositionUpdate() {}

  /** @returns {void} */
  updatePanelPosition() {}

  /** @returns {void} */
  syncFormControls() {}

  /** @returns {void} */
  syncOpenState(isOpen) {
    void isOpen;
  }

  /**
   * @param {string} name
   * @param {string | boolean} value
   * @returns {void}
   */
  updatePreference(name, value) {
    void name;
    void value;
  }
}

/**
 * @type {Readonly<A11yPanelPreferences>}
 */
export const DEFAULT_PREFERENCES = Object.freeze({
  bodyFont: 'system-sans',
  codeFont: 'system-mono',
  fontScale: '100%',
  headingFont: 'editorial-serif',
  lineHeight: 'normal',
  increaseContrast: false,
  radiusPreset: 'rounded',
  reduceMotion: false,
  reduceTransparency: false,
});

/**
 * @type {ReadonlyArray<{ attribute: string, description: string, label: string, name: string }>}
 */
export const ACCESSIBILITY_OPTIONS = Object.freeze([
  {
    attribute: 'data-reduce-motion',
    description:
      'Minimize motion-heavy interactions, animations, transitions, and smooth scrolling.',
    label: 'Reduce Motion',
    name: 'reduceMotion',
  },
  {
    attribute: 'data-reduce-transparency',
    description: 'Swap blurred glass surfaces for solid layers.',
    label: 'Reduce transparency',
    name: 'reduceTransparency',
  },
  {
    attribute: 'data-increase-contrast',
    description: 'Boost text, borders, and surface separation.',
    label: 'Increase contrast',
    name: 'increaseContrast',
  },
]);

/**
 * @type {ReadonlyArray<{ id: string, label: string, value: string }>}
 */
export const LINE_HEIGHT_OPTIONS = Object.freeze([
  { id: 'compact', label: 'Compact', value: '1.35' },
  { id: 'normal', label: 'Normal', value: '1.6' },
  { id: 'relaxed', label: 'Relaxed', value: '1.8' },
]);

/**
 * @type {ReadonlyArray<{ id: string, label: string, stack: string }>}
 */
export const HEADING_FONT_OPTIONS = Object.freeze([
  {
    id: 'system-sans',
    label: 'System Sans',
    stack: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  {
    id: 'humanist-sans',
    label: 'Humanist Sans',
    stack: "'Avenir Next', 'Segoe UI Variable Text', 'Helvetica Neue', sans-serif",
  },
  {
    id: 'editorial-serif',
    label: 'Editorial Serif',
    stack: "'Iowan Old Style', 'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, serif",
  },
  {
    id: 'book-serif',
    label: 'Book Serif',
    stack: "Baskerville, 'Times New Roman', Georgia, serif",
  },
  {
    id: 'rounded-sans',
    label: 'Rounded Sans',
    stack: "Optima, Candara, 'Trebuchet MS', 'Gill Sans', sans-serif",
  },
  {
    id: 'open-dyslexic',
    label: 'OpenDyslexic',
    stack: "'OpenDyslexic', 'Atkinson Hyperlegible', system-ui, sans-serif",
  },
]);

/**
 * @type {ReadonlyArray<{ id: string, label: string, stack: string }>}
 */
export const BODY_FONT_OPTIONS = Object.freeze([
  {
    id: 'system-sans',
    label: 'System Sans',
    stack: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  {
    id: 'humanist-sans',
    label: 'Humanist Sans',
    stack: "'Avenir Next', 'Segoe UI Variable Text', 'Helvetica Neue', sans-serif",
  },
  {
    id: 'book-serif',
    label: 'Book Serif',
    stack: "Georgia, Cambria, 'Times New Roman', serif",
  },
  {
    id: 'editorial-serif',
    label: 'Editorial Serif',
    stack: "'Iowan Old Style', 'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, serif",
  },
  {
    id: 'readable-serif',
    label: 'Readable Serif',
    stack: "Charter, 'Bitstream Charter', 'Sitka Text', Georgia, serif",
  },
  {
    id: 'open-dyslexic',
    label: 'OpenDyslexic',
    stack: "'OpenDyslexic', 'Atkinson Hyperlegible', system-ui, sans-serif",
  },
]);

/**
 * @type {ReadonlyArray<{ id: string, label: string, stack: string }>}
 */
export const CODE_FONT_OPTIONS = Object.freeze([
  {
    id: 'system-mono',
    label: 'System Mono',
    stack: "ui-monospace, 'SFMono-Regular', Menlo, Consolas, monospace",
  },
  {
    id: 'plex-mono',
    label: 'Plex Mono',
    stack: "'IBM Plex Mono', 'SFMono-Regular', 'Cascadia Code', Consolas, monospace",
  },
  {
    id: 'cascadia-mono',
    label: 'Cascadia Mono',
    stack: "'Cascadia Code', 'SFMono-Regular', Menlo, Consolas, monospace",
  },
  {
    id: 'classic-mono',
    label: 'Classic Mono',
    stack: "'Courier New', Courier, monospace",
  },
]);

/**
 * @type {ReadonlyArray<{ description: string, id: string, label: string }>}
 */
export const RADIUS_PRESET_OPTIONS = Object.freeze([
  {
    description: 'Zero radius, sharp edges across cards and controls.',
    id: 'square',
    label: 'Square',
  },
  {
    description: 'A restrained 4px radius for the full interface.',
    id: 'rounded',
    label: 'Rounded',
  },
  {
    description: 'A softer superellipse silhouette for a more sculpted UI.',
    id: 'squircle',
    label: 'Squircle',
  },
]);

/**
 * @type {ReadonlyArray<FontScale>}
 */
export const FONT_SCALE_OPTIONS = Object.freeze([
  '75%',
  '80%',
  '90%',
  '100%',
  '110%',
  '120%',
  '125%',
]);

/**
 * @type {string}
 */
export const STORAGE_KEY = 'pix-a11y-panel';

/**
 * @param {A11yPanelPreferences} preferences
 * @returns {A11yPanelPreferences}
 */
export function applyPreferencesToDocument(preferences) {
  return preferences;
}

/**
 * @returns {A11yPanelPreferences}
 */
export function readPreferences() {
  return { ...DEFAULT_PREFERENCES };
}
