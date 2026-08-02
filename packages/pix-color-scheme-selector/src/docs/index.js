/** pix-color-scheme-selector — documentation site entry. */
import { Marked, Renderer } from 'marked';

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
    return `<pre is="pix-highlighter" data-lang="${escapeHtml(language)}"><code>${escapeHtml(text)}</code></pre>`;
  };

  return new Marked({ renderer, gfm: true });
}

export function buildDocsPages(entries) {
  const marked = createMarked();
  return entries.map(({ markdown, sourcePath }) => ({
    slug: slugFromPath(sourcePath),
    title: titleFromMarkdown(markdown, slugFromPath(sourcePath)),
    html: marked.parse(markdown),
    sourcePath,
  }));
}

export const examples = Object.freeze([
  {
    title: 'HTML declaration',
    description: 'Drop the custom element anywhere in your markup.',
    lang: 'html',
    code: `<pix-color-scheme-selector></pix-color-scheme-selector>`,
  },
  {
    title: 'Import & use',
    description: 'Import and let the component self-register.',
    lang: 'js',
    code: `import '@pix-galaxy/pix-color-scheme-selector';\n\ndocument.body.innerHTML =\n  '<pix-color-scheme-selector></pix-color-scheme-selector>';
`,
  },
  {
    title: 'Programmatic control',
    description: 'Switch the scheme imperatively.',
    lang: 'js',
    code: `import { PixColorSchemeSelector } from '@pix-galaxy/pix-color-scheme-selector';\n\nconst selector = document.querySelector('pix-color-scheme-selector');\nselector.applyScheme('dark');\nconsole.log(selector.currentScheme);`,
  },
  {
    title: 'Detect current scheme',
    description: 'Read the <code>meta[name="color-scheme"]</code> content.',
    lang: 'js',
    code: `const meta = document.querySelector('meta[name="color-scheme"]');\nconsole.log(meta?.getAttribute('content'));`,
  },
]);

function escapeExampleCode(code) {
  return escapeHtml(code);
}

function renderExamples(exampleEntries, cardPartName = 'example-card') {
  return exampleEntries
    .map(
      (example) => `
        <article data-part="${escapeHtml(cardPartName)}">
          <section data-part="example-copy">
            <h3>${escapeHtml(example.title)}</h3>
            <p>${escapeHtml(example.description)}</p>
          </section>
          <pre is="pix-highlighter" data-lang="${escapeHtml(example.lang)}"><code>${escapeExampleCode(example.code)}</code></pre>
        </article>
      `
    )
    .join('');
}

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

    mount.innerHTML = `
      <section data-part="shell">
        <header data-part="hero">
          <section data-part="hero-copy">
            <p data-part="eyebrow">pix-galaxy suite</p>
            <h1>pix-color-scheme-selector</h1>
            <p data-part="summary">
              Browser-native color scheme selector. Docs from markdown. Live examples. Same release tag as npm.
            </p>
            <section data-part="meta-row">
              <span data-part="meta-pill" data-site-version>v${escapeHtml(meta.version)}</span>
              <span data-part="meta-pill">${docs.length} docs pages</span>
            </section>
          </section>
          <section data-part="hero-panel">
            <section data-part="live-preview">
              <p data-part="eyebrow">Live component</p>
              <pix-color-scheme-selector></pix-color-scheme-selector>
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

export async function loadDocsData() {
  const [
    gettingStartedModule,
    howItWorksModule,
    apiModule,
    examplesModule,
    releasingModule,
    packageJsonModule,
  ] = await Promise.all([
    import('./content/getting-started.md?raw'),
    import('./content/how-it-works.md?raw'),
    import('./content/api.md?raw'),
    import('./content/examples.md?raw'),
    import('./content/releasing.md?raw'),
    import('../../package.json'),
  ]);

  const packageJson = packageJsonModule.default;

  return {
    docsPages: Object.freeze(
      buildDocsPages([
        {
          markdown: gettingStartedModule.default,
          sourcePath: 'src/docs/content/getting-started.md',
        },
        { markdown: howItWorksModule.default, sourcePath: 'src/docs/content/how-it-works.md' },
        { markdown: apiModule.default, sourcePath: 'src/docs/content/api.md' },
        { markdown: examplesModule.default, sourcePath: 'src/docs/content/examples.md' },
        { markdown: releasingModule.default, sourcePath: 'src/docs/content/releasing.md' },
      ])
    ),
    siteMeta: Object.freeze({
      version: packageJson.version,
      releaseTag: `v${packageJson.version}`,
      componentName: 'pix-color-scheme-selector',
      componentTag: 'pix-color-scheme-selector',
      description: 'Light / dark / system color scheme toggle.',
      liveHtml: '<pix-color-scheme-selector></pix-color-scheme-selector>',
    }),
  };
}

async function bootDocsSite() {
  if (typeof document === 'undefined') {
    return;
  }

  const mount = document.querySelector('#app');
  if (!mount) {
    return;
  }

  const [{ docsPages, siteMeta }, _componentModule, pixHighlighterModule] = await Promise.all([
    loadDocsData(),
    import('../index.js'),
    import('@pix-galaxy/pix-highlighter'),
  ]);

  void _componentModule;
  const { enhancePixHighlighters } = pixHighlighterModule;

  createDocsSite({
    mount,
    docs: docsPages,
    examples,
    meta: siteMeta,
    afterRender(root) {
      enhancePixHighlighters(root);
    },
  });
}

void bootDocsSite();
