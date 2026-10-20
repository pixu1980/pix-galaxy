/**
 * Shared pix-galaxy documentation site builder.
 *
 * Built on `@pix-galaxy/pix-vanilla-reactive` (Store + Signals + html``),
 * matching the budget-manager app pattern. Navigation updates parts in place
 * so the live preview and theme controls survive doc switches (DSL-07).
 *
 * Relative import to the sibling artifact avoids a pix-core ↔ pix-vanilla-reactive
 * package cycle (pix-core is private to the monorepo).
 */
import sharedDocsCSS from './docs.css?raw';
import { Marked, Renderer } from 'marked';
import {
  Store,
  Signal,
  html,
  render,
  createTickState,
  repeat,
} from '../../pix-vanilla-reactive/artifact/index.js';

/* ── Register pix-color-scheme-selector for all docs sites ──────── */
import '@pix-galaxy/pix-color-scheme-selector';

/* ── Register pix-a11y (display preferences) for all docs sites ─── */
import '@pix-galaxy/pix-a11y';

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

/**
 * Escape a value for safe HTML text / attribute interpolation.
 * @param {unknown} value
 * @returns {string}
 */
function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

/**
 * Extract a title from the first markdown H1, or return a fallback.
 * @param {string} markdown
 * @param {string} fallback
 * @returns {string}
 */
function titleFromMarkdown(markdown, fallback) {
  const match = markdown.match(/^#\s+(.+)$/mu);
  return match?.[1]?.trim() || fallback;
}

/**
 * Derive a slug from a markdown source path.
 * @param {string} path
 * @returns {string}
 */
function slugFromPath(path) {
  return path.split('/').pop().replace(/\.md$/u, '');
}

/**
 * Create a Marked instance that emits `pre is="pix-highlighter"` code blocks.
 * @returns {Marked}
 */
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

/**
 * Render example cards for component docs pages.
 *
 * Kept as a string helper for callers that still need the HTML fragment;
 * `createDocsSite` uses the reactive `repeat` path instead.
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
          <pre is="pix-highlighter" tabindex="0" data-lang="${escapeHtml(example.lang)}"><code>${escapeHtml(example.code)}</code></pre>
        </article>
      `
    )
    .join('');
}

/**
 * Render one nav button for the docs sidebar.
 * @param {{ slug: string, title: string, active: boolean }} doc
 * @returns {import('../../pix-vanilla-reactive/artifact/index.js').TemplateResult}
 */
function NavLink(doc) {
  const result = html`
    <button
      type="button"
      data-part="nav-link"
      data-active=${doc.active}
      aria-current=${doc.active ? 'page' : false}
      data-site-doc=${doc.slug}
    >
      ${doc.title}
    </button>
  `;
  result._context = {};
  return result;
}

/**
 * Render one curated example card.
 * @param {{ id: string, title: string, description: string, lang: string, code: string }} example
 * @returns {import('../../pix-vanilla-reactive/artifact/index.js').TemplateResult}
 */
function ExampleCard(example) {
  const result = html`
    <article data-part="example-card">
      <section data-part="example-copy">
        <h3>${example.title}</h3>
        <p>${example.description}</p>
      </section>
      <pre
        is="pix-highlighter"
        tabindex="0"
        data-lang=${example.lang}
      ><code>${example.code}</code></pre>
    </article>
  `;
  result._context = {};
  return result;
}

/**
 * Inject live preview HTML once into a stable slot so navigations do not
 * destroy interactive demos (DSL-07).
 * @param {HTMLElement} mount
 * @param {string} liveHtml
 */
function mountLivePreviewOnce(mount, liveHtml) {
  const slot = mount.querySelector('[data-part="live-slot"]');
  if (!slot || slot.childNodes.length > 0) return;
  if (liveHtml) {
    slot.innerHTML = liveHtml;
    return;
  }
  slot.innerHTML =
    '<p data-part="live-unavailable">Live demo unavailable — open the docs site for this package.</p>';
}

/**
 * Move focus to the markdown panel after a doc switch (keyboard / SR friendly).
 * @param {HTMLElement} mount
 */
function focusActiveContent(mount) {
  const panel = mount.querySelector('[data-part="markdown"]');
  if (!(panel instanceof HTMLElement)) return;
  if (!panel.hasAttribute('tabindex')) panel.tabIndex = -1;
  panel.focus({ preventScroll: true });
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
  const store = new Store({
    activeSlug: docs[0]?.slug || '',
  });
  const tick = createTickState(store);

  const examples = exampleEntries.map((example, index) => ({
    id: `example-${index}-${example.title}`,
    ...example,
  }));

  const componentName = meta.componentName || 'pix-*';
  const componentTag = meta.componentTag || componentName;
  const description = meta.description || '';
  const version = meta.version;
  const liveHtml = meta.liveHtml || '';
  let liveMounted = false;
  let lastFocusedSlug = '';

  mount.addEventListener('click', (event) => {
    const docButton = /** @type {HTMLElement | null} */ (
      /** @type {HTMLElement} */ (event.target).closest('[data-site-doc]')
    );
    if (!docButton) return;
    const slug = docButton.dataset.siteDoc;
    if (!slug || slug === store.state.activeSlug) return;
    store.state.activeSlug = slug;
    paint({ focusContent: true });
  });

  /**
   * Build the reactive view tree for the current store state.
   * @returns {import('../../pix-vanilla-reactive/artifact/index.js').TemplateResult}
   */
  function DocsApp() {
    tick.get();
    const activeSlug = store.state.activeSlug;
    const activeDoc = docs.find((doc) => doc.slug === activeSlug) || docs[0];
    const navDocs = docs
      .filter((doc) => doc.slug !== 'examples')
      .map((doc) => ({
        id: doc.slug,
        slug: doc.slug,
        title: doc.title,
        active: doc.slug === activeDoc?.slug,
      }));

    const result = html`
      <section data-part="shell">
        <header data-part="hero">
          <h1><span>${componentName}</span></h1>
          <pix-color-scheme-selector></pix-color-scheme-selector>
          <pix-a11y></pix-a11y>
          <p data-part="hero-summary">${description}</p>
          <p data-part="hero-meta">
            <span data-part="meta-pill" data-site-version>v${version}</span>
            <span data-part="meta-pill">${docs.length} docs pages</span>
          </p>
        </header>

        <section data-part="live-preview">
          <p data-part="eyebrow">Live component</p>
          <p data-part="use-tag">Usage: <code>&lt;${componentTag}&gt;</code></p>
          <div data-part="live-slot"></div>
        </section>

        <section data-part="main">
          <aside data-part="nav">
            <p data-part="eyebrow">Documentation</p>
            <section data-part="nav-links">
              ${repeat(
                navDocs,
                (doc) => /** @type {{ id: string }} */ (doc).id,
                (doc) =>
                  NavLink(/** @type {{ slug: string, title: string, active: boolean }} */ (doc))
              )}
            </section>
          </aside>

          <section data-part="content-panel">
            <article data-part="markdown" data-site-doc-content>{{ activeHtml | raw }}</article>
          </section>
        </section>

        <section data-part="examples">
          <header data-part="content-header">
            <h2>Examples</h2>
            <span data-part="source-label">curated demo gallery</span>
          </header>
          <section data-part="example-grid">
            ${repeat(
              examples,
              (example) => /** @type {{ id: string }} */ (example).id,
              (example) =>
                ExampleCard(
                  /** @type {{ id: string, title: string, description: string, lang: string, code: string }} */ (
                    example
                  )
                )
            )}
          </section>
        </section>
      </section>
    `;
    result._context = {
      activeHtml: activeDoc?.html || '',
    };
    return result;
  }

  const view = new Signal.Computed(() => DocsApp());

  /**
   * Paint the docs site into the mount element.
   *
   * Synchronous (no effect microtask) so `selectDoc` stays await-free for
   * unit tests and the public controller API.
   *
   * @param {{ focusContent?: boolean }} [options]
   */
  function paint({ focusContent = false } = {}) {
    const result = view.get();
    render(result, mount);

    if (!liveMounted) {
      mountLivePreviewOnce(mount, liveHtml);
      liveMounted = true;
    }

    const activeDoc = docs.find((doc) => doc.slug === store.state.activeSlug) || docs[0] || null;
    afterRender?.(mount, activeDoc);

    if (focusContent && activeDoc && activeDoc.slug !== lastFocusedSlug) {
      focusActiveContent(mount);
    }
    lastFocusedSlug = activeDoc?.slug || '';
  }

  paint();

  return {
    getActiveDoc() {
      return docs.find((doc) => doc.slug === store.state.activeSlug) || docs[0] || null;
    },
    selectDoc(slug) {
      store.state.activeSlug = slug;
      paint({ focusContent: true });
    },
  };
}
