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

const GITHUB_ORG = 'pixu1980';
const isDev = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV;

/**
 * Retrieve the dev port for a component from the dynamic port map
 * injected by dev-all.mjs via VITE_DEV_PORTS env var.
 */
function getDevPort(compName) {
  try {
    const raw = import.meta.env.VITE_DEV_PORTS;
    if (!raw) return null;
    const map = JSON.parse(raw);
    return map[compName] ?? null;
  } catch {
    return null;
  }
}

const ICONS = Object.freeze({
  sky: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 2.5v2.25M12 19.25v2.25M21.5 12h-2.25M4.75 12H2.5M18.72 5.28l-1.6 1.6M6.88 17.12l-1.6 1.6M18.72 18.72l-1.6-1.6M6.88 6.88l-1.6-1.6" stroke="currentColor" stroke-linecap="round" stroke-width="1.8" /><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.8" fill="currentColor" fill-opacity="0.15" /></svg>`,
  coral: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 5a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v2.5c0 .5-.1 1-.3 1.5L17 15H7L4.3 9A3.5 3.5 0 0 1 4 7.5V5Z" stroke="currentColor" stroke-width="1.8" /><path d="M7 15v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-5" stroke="currentColor" stroke-width="1.8" /><path d="M12 8v4m-2-2h4" stroke="currentColor" stroke-linecap="round" stroke-width="1.6" /></svg>`,
  mint: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="8.5" stroke="currentColor" stroke-width="1.8" /><circle cx="12" cy="12" r="3.5" stroke="currentColor" stroke-width="1.8" fill="currentColor" fill-opacity="0.15" /><path d="M12 3.5V1M12 23v-2.5M3.5 12H1M23 12h-2.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.6" /></svg>`,
  violet: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 2L4 8v8l8 6 8-6V8l-8-6Z" stroke="currentColor" stroke-width="1.8" /><path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" stroke="currentColor" stroke-width="1.8" fill="currentColor" fill-opacity="0.15" /><path d="M12 14v6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" /></svg>`,
  indigo: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="4" y="5" width="16" height="14" rx="2" stroke="currentColor" stroke-width="1.8" /><path d="M7 9h3M7 12h6M7 15h9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" /><rect x="7" y="13" width="4" height="2" fill="currentColor" fill-opacity="0.15" /></svg>`,
  amber: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" stroke-width="1.8" /><path d="M12 4v16" stroke="currentColor" stroke-width="1.8" /><circle cx="9" cy="12" r="1.5" fill="currentColor" fill-opacity="0.15" /><circle cx="15" cy="12" r="1.5" fill="currentColor" fill-opacity="0.15" /></svg>`,
  rose: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3a9 9 0 0 0-4 17l-3 3 5-1a9 9 0 1 0 2-19Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" /><path d="M12 9v4l2 2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /><circle cx="12" cy="9" r="1" fill="currentColor" fill-opacity="0.15" /></svg>`,
  emerald: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8" /><path d="M7 12l3 3 7-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /><circle cx="12" cy="12" r="4" fill="currentColor" fill-opacity="0.15" /></svg>`,
  aqua: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8" /><path d="M12 7v5l3 3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /><circle cx="9" cy="9" r="1" fill="currentColor" fill-opacity="0.15" /><circle cx="15" cy="15" r="1" fill="currentColor" fill-opacity="0.15" /></svg>`,
  gold: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" stroke-width="1.8" /><path d="M8 12l2 2 6-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /><circle cx="12" cy="12" r="3" fill="currentColor" fill-opacity="0.15" /></svg>`,
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
      const docUrl = isDev && devPort
        ? `http://localhost:${devPort}/`
        : comp.homepage;

      return `
        <a
          data-part="card"
          data-component-accent="${escapeAttr(comp.accent)}"
          href="${escapeAttr(docUrl)}"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="${escapeAttr(comp.title)} - opens documentation in new tab"
        >
          <header data-part="card-header">
            <span data-part="card-badge" aria-hidden="true">${ICONS[comp.accent] || ''}</span>
            <h2 data-part="card-title">${escapeHtml(comp.title)}</h2>
          </header>
          <p data-part="card-desc">${escapeHtml(comp.description)}</p>
          <footer data-part="card-footer">
            <span data-part="card-tag">${escapeHtml(comp.packageName)}</span>
            ${comp.keywords
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
          <span data-part="meta-pill"><pix-color-scheme-selector></pix-color-scheme-selector></span>
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
