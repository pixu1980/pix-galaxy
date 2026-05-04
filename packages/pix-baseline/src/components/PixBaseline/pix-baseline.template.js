// @ts-check

import TemplateEngine from '@pix-galaxy/shared/template-engine/index.js';
import { CONTENT_PART, ROOT_PART } from './pix-baseline.consts.js';

const engine = new TemplateEngine();

/**
 * Render the structural wrapper for pix-baseline.
 */
export const renderRoot = engine.html`
  <div data-part="${ROOT_PART}">
    <div data-part="${CONTENT_PART}"></div>
  </div>
`;
