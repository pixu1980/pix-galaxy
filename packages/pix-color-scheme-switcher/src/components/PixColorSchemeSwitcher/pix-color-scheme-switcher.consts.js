// @ts-check

/**
 * @typedef {'light' | 'dark' | 'system'} PixColorScheme
 */

export const CHANGE_EVENT = 'pix-color-scheme-switcher:change';

/** @type {PixColorScheme} */
export const DEFAULT_SCHEME = 'system';

/** @type {ReadonlyArray<PixColorScheme>} */
export const SCHEMES = /** @type {const} */ (['light', 'dark', 'system']);

export const STORAGE_KEY = 'color-scheme';
export const CONTROL_PART = 'control';
export const OPTION_PART = 'option';

/** @type {Record<PixColorScheme, string>} */
export const META_CONTENT = {
	light: 'light',
	dark: 'dark',
	system: 'light dark',
};
