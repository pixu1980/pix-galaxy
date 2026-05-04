// @ts-nocheck

import checkIcon from './icons/check.svg';
import chevronDownIcon from './icons/chevron-down.svg';
import copyIcon from './icons/copy.svg';
import designSystemCSS from './styles/_ds-tokens.css';
import errorIcon from './icons/error.svg';
import paletteIcon from './icons/palette.svg';

import mainCSS from './PixHighlighter.css';

import auroraThemeCSS from './styles/themes/_aurora.css';
import atlasThemeCSS from './styles/themes/_atlas.css';
import cyberpunkThemeCSS from './styles/themes/_cyberpunk.css';
import darculaThemeCSS from './styles/themes/_darcula.css';
import defaultThemeCSS from './styles/themes/_default.css';
import emberThemeCSS from './styles/themes/_ember.css';
import paperThemeCSS from './styles/themes/_paper.css';
import prettyLightsThemeCSS from './styles/themes/_prettylights.css';
import prismThemeCSS from './styles/themes/_prism.css';
import tideThemeCSS from './styles/themes/_tide.css';

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

export const COPY_RESET_DELAY = 2000;
export const THEME_MENU_OFFSET = 8;
export const THEME_MENU_VIEWPORT_MARGIN = 12;
export const THEME_STORAGE_KEY = 'pix-highlighter-theme';
export const ENHANCED_MARKER = Symbol('pixHighlighterEnhanced');
export const COMPONENT_STYLE_ATTRIBUTE = 'data-pix-highlighter-styles';

/** @type {readonly PixHighlighterThemeOption[]} */
export const PIX_HIGHLIGHTER_THEME_OPTIONS = Object.freeze([
  { value: 'default', label: 'Default' },
  { value: 'prism', label: 'Prism' },
  { value: 'prettylights', label: 'Pretty Lights' },
  { value: 'darcula', label: 'Darcula' },
  { value: 'cyberpunk', label: 'Cyberpunk' },
  { value: 'aurora', label: 'Aurora' },
  { value: 'atlas', label: 'Atlas' },
  { value: 'ember', label: 'Ember' },
  { value: 'paper', label: 'Paper' },
  { value: 'tide', label: 'Tide' },
]);

/** @type {string} */
export const COMPONENT_STYLE_TEXT = [
  designSystemCSS,
  defaultThemeCSS,
  prismThemeCSS,
  prettyLightsThemeCSS,
  darculaThemeCSS,
  cyberpunkThemeCSS,
  auroraThemeCSS,
  atlasThemeCSS,
  emberThemeCSS,
  paperThemeCSS,
  tideThemeCSS,
  mainCSS,
].join('\n');

export const COPY_ICON = copyIcon.trim();
export const CHECK_ICON = checkIcon.trim();
export const ERROR_ICON = errorIcon.trim();
export const PALETTE_ICON = paletteIcon.trim();
export const CHEVRON_ICON = chevronDownIcon.trim();

/** @type {Readonly<Record<IconButtonStateKey, Readonly<IconButtonState>>>} */
export const ICON_BUTTON_STATES = Object.freeze({
  idle: Object.freeze({ icon: COPY_ICON, label: 'Copy code' }),
  copied: Object.freeze({ icon: CHECK_ICON, label: 'Code copied' }),
  error: Object.freeze({ icon: ERROR_ICON, label: 'Copy failed' }),
});
