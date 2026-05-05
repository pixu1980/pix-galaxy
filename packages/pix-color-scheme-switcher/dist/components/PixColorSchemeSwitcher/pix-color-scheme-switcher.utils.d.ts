/**
 * @param {unknown} value
 * @returns {value is import('./pix-color-scheme-switcher.consts.js').PixColorScheme}
 */
export function isSupportedScheme(value: unknown): value is import("./pix-color-scheme-switcher.consts.js").PixColorScheme;
/**
 * Normalize a color scheme value.
 *
 * @param {string | null | undefined} value
 * @returns {import('./pix-color-scheme-switcher.consts.js').PixColorScheme}
 */
export function normalizeScheme(value: string | null | undefined): import("./pix-color-scheme-switcher.consts.js").PixColorScheme;
/**
 * @returns {Storage | null}
 */
export function getStorage(): Storage | null;
/**
 * @returns {MediaQueryList | null}
 */
export function getSystemMedia(): MediaQueryList | null;
/**
 * @param {string | null | undefined} scheme
 * @param {MediaQueryList | null} [systemMedia=getSystemMedia()]
 * @returns {'light' | 'dark'}
 */
export function resolveScheme(scheme: string | null | undefined, systemMedia?: MediaQueryList | null): "light" | "dark";
/**
 * @param {Document} [targetDocument=globalThis.document]
 * @returns {HTMLMetaElement | null}
 */
export function getColorSchemeMeta(targetDocument?: Document): HTMLMetaElement | null;
/**
 * @param {Document} [targetDocument=globalThis.document]
 * @returns {HTMLMetaElement | null}
 */
export function ensureColorSchemeMeta(targetDocument?: Document): HTMLMetaElement | null;
/**
 * @param {Document} [targetDocument=globalThis.document]
 * @returns {import('./pix-color-scheme-switcher.consts.js').PixColorScheme}
 */
export function inferInitialScheme(targetDocument?: Document): import("./pix-color-scheme-switcher.consts.js").PixColorScheme;
//# sourceMappingURL=pix-color-scheme-switcher.utils.d.ts.map