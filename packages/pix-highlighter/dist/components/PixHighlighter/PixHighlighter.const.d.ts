/**
 * @typedef {'default' | 'prism' | 'prettylights' | 'darcula' | 'cyberpunk' | 'aurora' | 'atlas' | 'ember' | 'paper' | 'tide'} PixHighlighterTheme
 */
/**
 * @typedef {object} PixHighlighterThemeOption
 * @property {PixHighlighterTheme} value
 * @property {string} label
 */
/**
 * @typedef {object} IconButtonState
 * @property {string} icon
 * @property {string} label
 */
/**
 * @typedef {'idle' | 'copied' | 'error'} IconButtonStateKey
 */
export const COPY_RESET_DELAY: 2000;
export const THEME_MENU_OFFSET: 8;
export const THEME_MENU_VIEWPORT_MARGIN: 12;
export const THEME_STORAGE_KEY: "pix-highlighter-theme";
export const ENHANCED_MARKER: unique symbol;
export const COMPONENT_STYLE_ATTRIBUTE: "data-pix-highlighter-styles";
/** @type {readonly PixHighlighterThemeOption[]} */
export const PIX_HIGHLIGHTER_THEME_OPTIONS: readonly PixHighlighterThemeOption[];
/** @type {string} */
export const COMPONENT_STYLE_TEXT: string;
export const COPY_ICON: string;
export const CHECK_ICON: string;
export const ERROR_ICON: string;
export const PALETTE_ICON: string;
export const CHEVRON_ICON: string;
/** @type {Readonly<Record<IconButtonStateKey, Readonly<IconButtonState>>>} */
export const ICON_BUTTON_STATES: Readonly<Record<IconButtonStateKey, Readonly<IconButtonState>>>;
export type PixHighlighterTheme = "default" | "prism" | "prettylights" | "darcula" | "cyberpunk" | "aurora" | "atlas" | "ember" | "paper" | "tide";
export type PixHighlighterThemeOption = {
    value: PixHighlighterTheme;
    label: string;
};
export type IconButtonState = {
    icon: string;
    label: string;
};
export type IconButtonStateKey = "idle" | "copied" | "error";
//# sourceMappingURL=PixHighlighter.const.d.ts.map