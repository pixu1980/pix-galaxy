// @ts-check

import TemplateEngine from '@pix-galaxy/shared/template-engine/index.js';
import { CONTENT_PART, ROOT_PART } from './pix-highlighter.consts.js';

const engine = new TemplateEngine();

/**
 * Render the structural wrapper for pix-highlighter.
 */
export const renderRoot = engine.html`
  <div data-part="${ROOT_PART}">
    <div data-part="${CONTENT_PART}"></div>
  </div>
`;
