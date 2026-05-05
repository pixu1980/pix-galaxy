// @ts-check

import {
  DEFAULT_SCHEME,
  SCHEMES,
  STORAGE_KEY,
} from './pix-color-scheme-switcher.consts.js';

/**
 * @param {unknown} value
 * @returns {value is import('./pix-color-scheme-switcher.consts.js').PixColorScheme}
 */
export function isSupportedScheme(value) {
  return SCHEMES.includes(/** @type {any} */ (String(value)));
}

/**
 * Normalize a color scheme value.
 *
 * @param {string | null | undefined} value
 * @returns {import('./pix-color-scheme-switcher.consts.js').PixColorScheme}
 */
export function normalizeScheme(value) {
  return isSupportedScheme(value)
    ? /** @type {import('./pix-color-scheme-switcher.consts.js').PixColorScheme} */ (value)
    : DEFAULT_SCHEME;
}

/**
 * @returns {Storage | null}
 */
export function getStorage() {
  try {
    return globalThis.window?.localStorage ?? globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

/**
 * @returns {MediaQueryList | null}
 */
export function getSystemMedia() {
  if (typeof globalThis.matchMedia !== 'function') {
    return null;
  }

  return globalThis.matchMedia('(prefers-color-scheme: dark)');
}

/**
 * @param {string | null | undefined} scheme
 * @param {MediaQueryList | null} [systemMedia=getSystemMedia()]
 * @returns {'light' | 'dark'}
 */
export function resolveScheme(scheme, systemMedia = getSystemMedia()) {
  const normalizedScheme = normalizeScheme(scheme);

  if (normalizedScheme !== 'system') {
    return normalizedScheme;
  }

  return systemMedia?.matches ? 'dark' : 'light';
}

/**
 * @param {Document} [targetDocument=globalThis.document]
 * @returns {HTMLMetaElement | null}
 */
export function getColorSchemeMeta(targetDocument = globalThis.document) {
  if (!targetDocument) {
    return null;
  }

  const existingMeta = targetDocument.querySelector('meta[name="color-scheme"]');
  const HTMLMetaElementCtor = targetDocument.defaultView?.HTMLMetaElement;

  if (!HTMLMetaElementCtor || !(existingMeta instanceof HTMLMetaElementCtor)) {
    return null;
  }

  return existingMeta;
}

/**
 * @param {Document} [targetDocument=globalThis.document]
 * @returns {HTMLMetaElement | null}
 */
export function ensureColorSchemeMeta(targetDocument = globalThis.document) {
  if (!targetDocument) {
    return null;
  }

  const existingMeta = getColorSchemeMeta(targetDocument);
  if (existingMeta) {
    return existingMeta;
  }

  const meta = targetDocument.createElement('meta');
  meta.setAttribute('name', 'color-scheme');
  targetDocument.head.append(meta);
  return meta;
}

/**
 * @param {Document} [targetDocument=globalThis.document]
 * @returns {import('./pix-color-scheme-switcher.consts.js').PixColorScheme}
 */
export function inferInitialScheme(targetDocument = globalThis.document) {
  const storedValue = getStorage()?.getItem(STORAGE_KEY);

  if (isSupportedScheme(storedValue)) {
    return storedValue;
  }

  const metaContent = getColorSchemeMeta(targetDocument)?.getAttribute('content') ?? '';
  if (metaContent === 'light') {
    return 'light';
  }

  if (metaContent === 'dark') {
    return 'dark';
  }

  return DEFAULT_SCHEME;
}
