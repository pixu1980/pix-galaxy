/* eslint-env browser */

/**
 * pix-galaxy · Component portal
 *
 * Renders a card grid for every component in the suite.
 * Each card links to the component's documentation site.
 * In dev mode (import.meta.env.DEV), links point to local dev servers.
 * In production, links point to GitHub Pages.
 */

import '@pix-galaxy/pix-color-scheme-selector';
import '@pix-galaxy/pix-a11y-panel';

const GITHUB_ORG = 'pixu1980';
const isDev = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV;

/**
 * Retrieve the dev port for a component from the dynamic port map
 * injected by dev-all.mjs via VITE_DEV_PORTS env var.
 * Falls back to computing the port from the component index when
 * the server was started independently (without dev-all.mjs).
 */
import { devPortFor } from '../../scripts/port-map.mjs';

function getDevPort(compName) {
  // Try VITE_DEV_PORTS first (set by dev-all.mjs)
  try {
    const raw = import.meta.env.VITE_DEV_PORTS;
    if (raw) {
      const map = JSON.parse(raw);
      if (map[compName]) return map[compName];
    }
  } catch {
    /* fall through */
  }

  // Fallback: canonical order shared with dev-all.mjs
  return devPortFor(compName);
}

const ICONS = Object.freeze({
  // Per-component icons (unique logo per card)
  'pix-highlighter': `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 5l-5 7 5 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 5l5 7-5 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="2" fill="currentColor" fill-opacity="0.2"/></svg>`,
  'pix-foundations': `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="3" stroke="currentColor" stroke-width="1.8"/><path d="M7 10l3 3 7-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="3" fill="currentColor" fill-opacity="0.15"/></svg>`,
  'pix-toast': `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18 8A6 6 0 0 0 6 8c0 3-1 5-2 7h16c-1-2-2-4-2-7" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M9 19a3 3 0 0 0 6 0" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="10" r="1.5" fill="currentColor" fill-opacity="0.15"/></svg>`,
  'pix-sortable': `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="5" y="3" width="14" height="4" rx="1" stroke="currentColor" stroke-width="1.8"/><rect x="5" y="10" width="14" height="4" rx="1" stroke="currentColor" stroke-width="1.8"/><rect x="5" y="17" width="14" height="4" rx="1" stroke="currentColor" stroke-width="1.8"/><circle cx="9" cy="5" r="1" fill="currentColor" fill-opacity="0.15"/><circle cx="9" cy="12" r="1" fill="currentColor" fill-opacity="0.15"/><circle cx="9" cy="19" r="1" fill="currentColor" fill-opacity="0.15"/></svg>`,
  'pix-splitter': `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="M12 4v16" stroke="currentColor" stroke-width="1.8"/><circle cx="9" cy="12" r="1.5" fill="currentColor" fill-opacity="0.15"/><circle cx="15" cy="12" r="1.5" fill="currentColor" fill-opacity="0.15"/></svg>`,
  'pix-color': `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/><path d="M12 3a5 5 0 0 0-5 5c0 2 1 3 2 4l3 5 3-5c1-1 2-2 2-4a5 5 0 0 0-5-5Z" fill="currentColor" fill-opacity="0.15"/><circle cx="12" cy="8" r="1.5" fill="currentColor"/></svg>`,
  'pix-recorder': `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="4" fill="currentColor" fill-opacity="0.15"/><path d="M12 7v5l3 3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  'pix-command': `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="4" y="5" width="16" height="14" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="M7 9l3 3-3 3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 15h3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><rect x="8" y="13" width="3" height="2" fill="currentColor" fill-opacity="0.15"/></svg>`,
  'pix-a11y-panel': `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.8"/><path d="M12 1v3M12 20v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M1 12h3M20 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="12" cy="12" r="1" fill="currentColor" fill-opacity="0.15"/></svg>`,
  'pix-accent-color-selector': `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 3l4 4-4 4-4-4 4-4" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M9 7h12v2H9z" fill="currentColor" fill-opacity="0.15"/><path d="M5 13l4 4-4 4-4-4 4-4" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M9 17h12v2H9z" fill="currentColor" fill-opacity="0.15"/></svg>`,
  'pix-color-scheme-selector': `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="1.8"/><path d="M12 1v3M12 20v3M1 12h3M20 12h3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="12" cy="12" r="2" fill="currentColor" fill-opacity="0.15"/></svg>`,
  // Fallback by accent (backward compat)
  sky: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 2.5v2.25M12 19.25v2.25M21.5 12h-2.25M4.75 12H2.5M18.72 5.28l-1.6 1.6M6.88 17.12l-1.6 1.6M18.72 18.72l-1.6-1.6M6.88 6.88l-1.6-1.6" stroke="currentColor" stroke-linecap="round" stroke-width="1.8" /><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.8" fill="currentColor" fill-opacity="0.15" /></svg>`,
  coral: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 5a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v2.5c0 .5-.1 1-.3 1.5L17 15H7L4.3 9A3.5 3.5 0 0 1 4 7.5V5Z" stroke="currentColor" stroke-width="1.8" /><path d="M7 15v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-5" stroke="currentColor" stroke-width="1.8" /><path d="M12 8v4m-2-2h4" stroke="currentColor" stroke-linecap="round" stroke-width="1.6" /></svg>`,
});

async function bootPortal() {
  const mount = document.querySelector('#app');
  if (!mount) {
    return;
  }

  /** @type {Array<import('./content/components.json')>} */
  const { default: components } = await import('./content/components.json');

  const cardsHtml = components
    .map((comp) => {
      const devPort = getDevPort(comp.name);
      const docUrl = isDev && devPort ? `http://localhost:${devPort}/` : comp.homepage || '#';
      const isComingSoon = !comp.homepage;

      return `
        <a
          data-part="card"
          role="listitem"
          data-component-accent="${escapeAttr(comp.accent)}"
          href="${escapeAttr(docUrl)}"
          ${isComingSoon ? '' : 'target="_blank" rel="noopener noreferrer"'}
          aria-label="${escapeAttr(comp.title)}${isComingSoon ? '' : ' - opens documentation in new tab'}"
          ${isComingSoon ? 'style="cursor:default;opacity:0.6;"' : ''}
        >
          <header data-part="card-header">
            <span data-part="card-badge" aria-hidden="true">${ICONS[comp.name] || ICONS[comp.accent] || ''}</span>
            <h2 data-part="card-title">${escapeHtml(comp.title)}</h2>
          </header>
          <p data-part="card-desc">${escapeHtml(comp.description)}</p>
          <footer data-part="card-footer">
            ${comp.packageName ? `<span data-part="card-tag">${escapeHtml(comp.packageName)}</span>` : ''}
            ${(comp.keywords || [])
              .slice(0, 3)
              .map((kw) => `<span data-part="card-tag">${escapeHtml(kw)}</span>`)
              .join('')}
          </footer>
        </a>
      `;
    })
    .join('');

  mount.innerHTML = `
    <section data-part="shell">
      <div data-part="topbar">
        <pix-color-scheme-selector></pix-color-scheme-selector>
        <pix-a11y-panel></pix-a11y-panel>
      </div>
      <header data-part="hero">
        <h1>
          <span>pix-galaxy</span>
        </h1>
        <p data-part="hero-summary">
          A suite of zero-runtime-dependency vanilla JS Web Components.
          Accessible, performant, and built for the modern web platform.
        </p>
        <p data-part="hero-meta">
          <span data-part="meta-pill">${components.length} components</span>
          <span data-part="meta-pill">Custom Elements v1</span>
          <span data-part="meta-pill">WCAG 2.2 AA</span>
        </p>
      </header>

      <section data-part="grid" role="list">
        ${cardsHtml}
      </section>

      <footer data-part="footer">
        <a
          href="https://github.com/${escapeAttr(GITHUB_ORG)}/pix-galaxy"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub &middot; pixu1980/pix-galaxy
        </a>
      </footer>
    </section>
  `;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function escapeAttr(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

void bootPortal();
