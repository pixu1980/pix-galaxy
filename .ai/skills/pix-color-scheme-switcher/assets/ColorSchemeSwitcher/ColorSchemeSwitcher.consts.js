// @ts-check

/** @type {"color-scheme"} */
export const STORAGE_KEY = 'color-scheme';

/** @type {ReadonlyArray<"light" | "dark" | "system">} */
export const SCHEMES = /** @type {const} */ (['light', 'dark', 'system']);

/** @type {Record<"light" | "dark" | "system", string>} */
export const META_CONTENT = {
  light: 'light',
  dark: 'dark',
  system: 'light dark',
};
