// @ts-check

import TemplateEngine from '@pix-galaxy/shared/template-engine/index.js';
import { BODY_PART, FOOTER_PART, HEADER_PART, ROOT_PART } from './pix-card.consts.js';

const engine = new TemplateEngine();

/**
 * @param {{ href: string | null }} data
 * @returns {'a' | 'div'}
 */
function resolveRootTag(data) {
  return data.href ? 'a' : 'div';
}

/**
 * @param {{ href: string | null }} data
 * @returns {string}
 */
function resolveHrefAttribute(data) {
  return data.href ? `href="${data.href}"` : '';
}

const renderTemplate = engine.html`
  <${resolveRootTag}
    data-part="${ROOT_PART}"
    part="${ROOT_PART}"
    ${resolveHrefAttribute}
  >
    <div data-part="${HEADER_PART}" part="${HEADER_PART}"></div>
    <div data-part="${BODY_PART}" part="${BODY_PART}"></div>
    <div data-part="${FOOTER_PART}" part="${FOOTER_PART}"></div>
  </${resolveRootTag}>
`;

/**
 * Render the outer pix-card container.
 *
 * @param {{ href: string | null }} data
 * @returns {string}
 */
export function renderRoot(data) {
  return renderTemplate(data);
}
