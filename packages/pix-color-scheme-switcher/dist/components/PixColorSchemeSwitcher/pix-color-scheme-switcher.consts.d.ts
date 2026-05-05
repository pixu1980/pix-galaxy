/**
 * @typedef {'light' | 'dark' | 'system'} PixColorScheme
 */
export const CHANGE_EVENT: "pix-color-scheme-switcher:change";
/** @type {PixColorScheme} */
export const DEFAULT_SCHEME: PixColorScheme;
/** @type {ReadonlyArray<PixColorScheme>} */
export const SCHEMES: ReadonlyArray<PixColorScheme>;
export const STORAGE_KEY: "color-scheme";
export const CONTROL_PART: "control";
export const OPTION_PART: "option";
/** @type {Record<PixColorScheme, string>} */
export const META_CONTENT: Record<PixColorScheme, string>;
export type PixColorScheme = "light" | "dark" | "system";
//# sourceMappingURL=pix-color-scheme-switcher.consts.d.ts.map