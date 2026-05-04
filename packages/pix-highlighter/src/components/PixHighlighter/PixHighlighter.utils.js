// @ts-nocheck

import {
  COMPONENT_STYLE_ATTRIBUTE,
  COMPONENT_STYLE_TEXT,
  PIX_HIGHLIGHTER_THEME_OPTIONS,
} from './PixHighlighter.const.js';

let componentStyleSheet = null;
let componentStyleElement = null;
let floatingLayerElement = null;

const FLOATING_LAYER_ATTRIBUTE = 'data-pix-highlighter-floating-layer';

export function supportsAnchorPositioning() {
  if (typeof globalThis.CSS?.supports !== 'function') {
    return false;
  }

  try {
    return (
      globalThis.CSS.supports('anchor-name: --pix-highlighter--anchor') &&
      globalThis.CSS.supports('position-anchor: --pix-highlighter--anchor') &&
      globalThis.CSS.supports('top: anchor(bottom)')
    );
  } catch {
    return false;
  }
}

function removeFallbackStyleElement() {
  componentStyleElement?.remove();
}

function ensureFallbackStyleElement() {
  if (typeof document === 'undefined') {
    return null;
  }

  componentStyleElement ||=
    document.head?.querySelector(`style[${COMPONENT_STYLE_ATTRIBUTE}]`) ||
    document.querySelector(`style[${COMPONENT_STYLE_ATTRIBUTE}]`) ||
    document.createElement('style');

  componentStyleElement.setAttribute(COMPONENT_STYLE_ATTRIBUTE, '');
  if (componentStyleElement.textContent !== COMPONENT_STYLE_TEXT) {
    componentStyleElement.textContent = COMPONENT_STYLE_TEXT;
  }

  if (!componentStyleElement.isConnected) {
    (document.head || document.documentElement).appendChild(componentStyleElement);
  }

  return componentStyleElement;
}

export function adoptComponentStyles() {
  if (typeof document === 'undefined') {
    return null;
  }

  const supportsAdoptedStyleSheets =
    'adoptedStyleSheets' in document &&
    typeof globalThis.CSSStyleSheet === 'function' &&
    typeof globalThis.CSSStyleSheet.prototype.replaceSync === 'function';

  if (!supportsAdoptedStyleSheets) {
    return ensureFallbackStyleElement();
  }

  removeFallbackStyleElement();

  if (!componentStyleSheet) {
    componentStyleSheet = new CSSStyleSheet();
    componentStyleSheet.replaceSync(COMPONENT_STYLE_TEXT);
  }

  if (!document.adoptedStyleSheets.includes(componentStyleSheet)) {
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, componentStyleSheet];
  }

  return componentStyleSheet;
}

export function ensureFloatingLayer() {
  if (typeof document === 'undefined') {
    return null;
  }

  floatingLayerElement ||=
    document.body?.querySelector(`[${FLOATING_LAYER_ATTRIBUTE}]`) ||
    document.querySelector(`[${FLOATING_LAYER_ATTRIBUTE}]`) ||
    document.createElement('div');

  floatingLayerElement.setAttribute(FLOATING_LAYER_ATTRIBUTE, '');

  if (!floatingLayerElement.isConnected) {
    (document.body || document.documentElement).appendChild(floatingLayerElement);
  }

  return floatingLayerElement;
}

export function getStorage() {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function getThemeLabel(theme) {
  return PIX_HIGHLIGHTER_THEME_OPTIONS.find((option) => option.value === theme)?.label || 'Default';
}

export function setIconButtonContent(button, iconMarkup, label) {
  if (!button) {
    return;
  }

  button.innerHTML = `${iconMarkup}<span class="pix-highlighter__sr-only">${label}</span>`;
  button.setAttribute('aria-label', label);
  button.title = label;
}
