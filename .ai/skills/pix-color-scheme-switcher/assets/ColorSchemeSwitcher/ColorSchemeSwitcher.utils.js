// @ts-check

import { SCHEMES } from './ColorSchemeSwitcher.consts.js';

/**
 * @param {unknown} value
 * @returns {value is "light" | "dark" | "system"}
 */
export const isSupportedScheme = (value) => SCHEMES.includes(/** @type {any} */ (String(value)));

/**
 * @returns {Storage | null}
 */
export const getStorage = () => {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
};

/**
 * @returns {MediaQueryList | null}
 */
export const getSystemMedia = () => {
  if (typeof globalThis.matchMedia !== 'function') {
    return null;
  }

  return globalThis.matchMedia('(prefers-color-scheme: dark)');
};
