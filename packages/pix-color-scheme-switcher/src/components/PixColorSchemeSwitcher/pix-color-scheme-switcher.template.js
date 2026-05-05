// @ts-check

import TemplateEngine from '@pix-galaxy/shared/template-engine/index.js';

import darkIcon from './icons/dark.svg';
import lightIcon from './icons/light.svg';
import systemIcon from './icons/system.svg';

import { CONTROL_PART, OPTION_PART } from './pix-color-scheme-switcher.consts.js';

const engine = new TemplateEngine();

/**
 * Render the structural light-DOM switcher shell.
 */
export const renderSwitcher = engine.html`
  <section data-part="${CONTROL_PART}" aria-label="Color scheme" role="radiogroup">
    <label data-part="${OPTION_PART}" data-scheme="light">
      <input type="radio" name="color-scheme" value="light" />
      ${lightIcon}
      <span sr-only>Light</span>
    </label>

    <label data-part="${OPTION_PART}" data-scheme="dark">
      <input type="radio" name="color-scheme" value="dark" />
      ${darkIcon}
      <span sr-only>Dark</span>
    </label>

    <label data-part="${OPTION_PART}" data-scheme="system">
      <input type="radio" name="color-scheme" value="system" />
      ${systemIcon}
      <span sr-only>System</span>
    </label>
  </section>
`;
