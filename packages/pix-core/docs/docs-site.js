/**
 * Shared pix-galaxy documentation site builder.
 *
 * Provides the template functions used by every component's docs site.
 * Each component's src/docs/index.js imports from here and supplies
 * its specific examples and metadata.
 */
import sharedDocsCSS from './docs.css?raw';
import { Marked, Renderer } from 'marked';

/* ── Register pix-color-scheme-selector for all docs sites ──────── */
import '@pix-galaxy/pix-color-scheme-selector';

/* ── Adopt shared docs CSS on first import ──────────────────────── */

(function adoptSharedDocsCSS() {
  if (typeof document === 'undefined' || typeof CSSStyleSheet !== 'function') return;
  const sheet = new CSSStyleSheet();
  sheet.replaceSync(sharedDocsCSS);
  if (!document.adoptedStyleSheets.includes(sheet)) {
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
  }
})();

/* ── Helpers ────────────────────────────────────────────────────── */

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function titleFromMarkdown(markdown, fallback) {
  const match = markdown.match(/^#\s+(.+)$/mu);
  return match?.[1]?.trim() || fallback;
}

function slugFromPath(path) {
  return path.split('/').pop().replace(/\.md$/u, '');
}

function createMarked() {
  const renderer = new Renderer();

  renderer.code = ({ text, lang = '' }) => {
    const language =
      String(lang || 'text')
        .trim()
        .toLowerCase() || 'text';
    return `<pre is="pix-highlighter" tabindex="0" data-lang="${escapeHtml(language)}"><code>${escapeHtml(text)}</code></pre>`;
  };

  return new Marked({ renderer, gfm: true });
}

/* ── Page building ──────────────────────────────────────────────── */

/**
 * Build rendered docs pages from raw markdown entries.
 *
 * @param {Array<{ markdown: string, sourcePath: string }>} entries Markdown entries.
 * @returns {Array<{ slug: string, title: string, html: string, sourcePath: string }>} Rendered pages.
 */
export function buildDocsPages(entries) {
  const marked = createMarked();
  return entries.map(({ markdown, sourcePath }) => ({
    slug: slugFromPath(sourcePath),
    title: titleFromMarkdown(markdown, slugFromPath(sourcePath)),
    html: marked.parse(markdown),
    sourcePath,
  }));
}

/* ── Examples rendering ─────────────────────────────────────────── */

function escapeExampleCode(code) {
  return escapeHtml(code);
}

/**
 * Render example cards for component docs pages.
 *
 * @param {Array<{ title: string, description: string, lang: string, code: string }>} exampleEntries Examples to render.
 * @param {string} [cardPartName='example-card'] data-part value for cards.
 * @returns {string} HTML string containing example cards.
 */
export function renderExamples(exampleEntries, cardPartName = 'example-card') {
  return exampleEntries
    .map(
      (example) => `
        <article data-part="${escapeHtml(cardPartName)}">
          <section data-part="example-copy">
            <h3>${escapeHtml(example.title)}</h3>
            <p>${escapeHtml(example.description)}</p>
          </section>
          <pre is="pix-highlighter" tabindex="0" data-lang="${escapeHtml(example.lang)}"><code>${escapeExampleCode(example.code)}</code></pre>
        </article>
      `
    )
    .join('');
}

/* ── Site builder ───────────────────────────────────────────────── */

/**
 * Create an interactive docs site inside a mount element.
 *
 * @param {object} options Docs site options.
 * @param {HTMLElement} options.mount Mount element.
 * @param {Array<{ slug: string, title: string, html: string }>} options.docs Rendered docs pages.
 * @param {Array<{ title: string, description: string, lang: string, code: string }>} options.examples Example cards.
 * @param {{ componentName?: string, componentTag?: string, description?: string, version: string, liveHtml?: string }} options.meta Site metadata.
 * @param {(root: HTMLElement, activeDoc: object) => void} [options.afterRender] Optional render hook.
 * @returns {{ getActiveDoc(): object | null, selectDoc(slug: string): void }} Docs site controller.
 */
export function createDocsSite({ mount, docs, examples: exampleEntries, meta, afterRender }) {
  const state = {
    activeSlug: docs[0]?.slug || '',
  };

  mount.addEventListener('click', (event) => {
    const docButton = event.target.closest('[data-site-doc]');
    if (docButton) {
      state.activeSlug = docButton.dataset.siteDoc;
      render();
      return;
    }
  });

  function render() {
    const activeDoc = docs.find((doc) => doc.slug === state.activeSlug) || docs[0];

    const docButtons = docs
      .filter((doc) => doc.slug !== 'examples')
      .map(
        (doc) => `
          <button
            type="button"
            data-part="nav-link"${doc.slug === activeDoc.slug ? ' data-active' : ''}
            data-site-doc="${escapeHtml(doc.slug)}"
          >
            ${escapeHtml(doc.title)}
          </button>
        `
      )
      .join('');

    const componentName = meta.componentName || 'pix-*';
    const componentTag = meta.componentTag || componentName;

    mount.innerHTML = `
      <section data-part="shell">
        <header data-part="hero">
          <section data-part="hero-copy">
            <p data-part="eyebrow">pix-galaxy suite</p>
            <h1>${escapeHtml(componentName)}</h1>
            <p data-part="summary">
              ${escapeHtml(meta.description || '')}
            </p>
            <p data-part="use-tag">Usage: <code>&lt;${escapeHtml(componentTag)}&gt;</code></p>
            <section data-part="meta-row">
              <span data-part="meta-pill" data-site-version>v${escapeHtml(meta.version)}</span>
              <span data-part="meta-pill">${docs.length} docs pages</span>
            </section>
          </section>
          <section data-part="hero-panel">
            <pix-color-scheme-selector></pix-color-scheme-selector>
            <section data-part="live-preview">
              <p data-part="eyebrow">Live component</p>
              ${meta.liveHtml || `<p style="color:var(--pix-ds-text-muted);font-size:0.875rem;">Live demo unavailable - open the docs site for this package.</p>`}
            </section>
          </section>
        </header>

        <main data-part="main">
          <aside data-part="nav">
            <p data-part="eyebrow">Documentation</p>
            <section data-part="nav-links">${docButtons}</section>
          </aside>

          <section data-part="content-panel">
            <article data-part="markdown" data-site-doc-content>${activeDoc.html}</article>
          </section>
        </main>

        <section data-part="examples">
          <header data-part="content-header">
            <h2>Examples</h2>
            <span data-part="source-label">curated demo gallery</span>
          </header>
          <section data-part="example-grid">
            ${renderExamples(exampleEntries)}
          </section>
        </section>
      </section>
    `;

    afterRender?.(mount, activeDoc);
  }

  render();

  return {
    getActiveDoc() {
      return docs.find((doc) => doc.slug === state.activeSlug) || docs[0] || null;
    },
    selectDoc(slug) {
      state.activeSlug = slug;
      render();
    },
  };
}
