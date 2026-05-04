// @ts-check

import TemplateEngine from '@pix-galaxy/shared/template-engine/index.js';
import { BUTTON_PART } from './pix-button.consts.js';

const engine = new TemplateEngine();

/**
 * Render the native button used by pix-button.
 */
export const renderRoot = engine.html`
  <button data-part="${BUTTON_PART}" part="${BUTTON_PART}" type="button"></button>
`;
