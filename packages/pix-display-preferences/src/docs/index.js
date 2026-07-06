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
    const language = String(lang || 'text').trim().toLowerCase() || 'text';
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
    code: `<pix-display-preferences></pix-display-preferences>`,
  },
  {
    title: 'Import & use',
    description: 'Import and let the component self-register.',
    lang: 'js',
    code: `import '@pix-galaxy/pix-display-preferences';\n\ndocument.body.innerHTML =\n  '<pix-display-preferences></pix-display-preferences>';
`,
  },
  {
    title: 'Read preferences',
    description: 'Read saved display preferences.',
    lang: 'js',
    code: `import { readPreferences, DEFAULT_PREFERENCES } from '@pix-galaxy/pix-display-preferences';\n\nconst prefs = readPreferences();\nconsole.log(prefs.fontScale); // '100%'`,
  },
  {
    title: 'Apply programmatically',
    description: 'Apply preferences without mounting the component.',
    lang: 'js',
    code: `import { applyPreferencesToDocument } from '@pix-galaxy/pix-display-preferences';\n\napplyPreferencesToDocument({\n  fontScale: '125%',\n  increaseContrast: true,\n  radiusPreset: 'square',\n});`,
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

/**
 * Collect the current preference state from the document.
 */
function readDocumentPreferences() {
  const root = document.documentElement;
  return {
    colorScheme: root.dataset.colorScheme || 'system',
    accentColor: root.style.getPropertyValue('--pix-accent-h').trim()
      ? `${root.style.getPropertyValue('--pix-accent-h').trim()}°`
      : 'default',
    fontScale: root.style.fontSize || '100%',
    radiusPreset: root.dataset.radiusPreset || 'rounded',
    reduceMotion: root.getAttribute('data-reduce-motion') === 'true',
    reduceTransparency: root.getAttribute('data-reduce-transparency') === 'true',
    increaseContrast: root.getAttribute('data-increase-contrast') === 'true',
  };
}

export function createDocsSite({
  mount,
  docs,
  examples: exampleEntries,
  meta,
  afterRender,
}) {
  const state = {
    activeSlug: docs[0]?.slug || '',
    /** @type {ReturnType<typeof readDocumentPreferences>} */
    docPrefs: readDocumentPreferences(),
  };

  function updateStateFromDocument() {
    state.docPrefs = readDocumentPreferences();
  }

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
    updateStateFromDocument();

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

    const prefs = state.docPrefs;
    const preferenceItems = [
      { label: 'Color scheme', value: prefs.colorScheme },
      { label: 'Accent', value: prefs.accentColor },
      { label: 'Font scale', value: prefs.fontScale },
      { label: 'Radius', value: prefs.radiusPreset },
      { label: 'Reduce motion', value: prefs.reduceMotion ? 'on' : 'off' },
      { label: 'Reduce transparency', value: prefs.reduceTransparency ? 'on' : 'off' },
      { label: 'Increase contrast', value: prefs.increaseContrast ? 'on' : 'off' },
    ];

    mount.innerHTML = `
      <section data-part="shell">
        <header data-part="hero">
          <section data-part="hero-copy">
            <p data-part="eyebrow">pix-galaxy suite</p>
            <h1>pix-display-preferences</h1>
            <p data-part="summary">
              Browser-native display preferences popover. Docs from markdown. Live examples. Same release tag as npm.
            </p>
            <section data-part="meta-row">
              <span data-part="meta-pill" data-site-version>v${escapeHtml(meta.version)}</span>
              <span data-part="meta-pill">${docs.length} docs pages</span>
            </section>
          </section>
          <section data-part="hero-panel">
            <section data-part="live-preview">
              <p data-part="eyebrow">Live component</p>
              <pix-display-preferences></pix-display-preferences>
            </section>
            <section data-part="preference-status" aria-label="Current preferences">
              <p data-part="eyebrow">Active preferences</p>
              <ul data-part="preference-list">
                ${preferenceItems
                  .map(
                    (item) => `
                  <li data-part="preference-item">
                    <span data-part="preference-label">${escapeHtml(item.label)}</span>
                    <span data-part="preference-value">${escapeHtml(String(item.value))}</span>
                  </li>
                `
                  )
                  .join('')}
              </ul>
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

  /**
   * Watch document changes that affect preferences and re-render the
   * preference status area without a full page re-render.
   */
  function setupPreferenceWatcher() {
    const OBSERVED_ATTRIBUTES = [
      'data-color-scheme',
      'data-radius-preset',
      'data-reduce-motion',
      'data-reduce-transparency',
      'data-increase-contrast',
    ];
    const OBSERVED_PROPERTIES = ['font-size', '--pix-accent-h'];

    const observer = new MutationObserver(() => {
      const newPrefs = readDocumentPreferences();
      const statusEl = mount.querySelector('[data-part="preference-list"]');
      if (!statusEl) return;

      const changed = Object.keys(newPrefs).some(
        (key) => newPrefs[key] !== state.docPrefs[key]
      );
      if (!changed) return;

      state.docPrefs = newPrefs;

      const items = [
        { label: 'Color scheme', value: newPrefs.colorScheme },
        { label: 'Accent', value: newPrefs.accentColor },
        { label: 'Font scale', value: newPrefs.fontScale },
        { label: 'Radius', value: newPrefs.radiusPreset },
        { label: 'Reduce motion', value: newPrefs.reduceMotion ? 'on' : 'off' },
        { label: 'Reduce transparency', value: newPrefs.reduceTransparency ? 'on' : 'off' },
        { label: 'Increase contrast', value: newPrefs.increaseContrast ? 'on' : 'off' },
      ];

      statusEl.innerHTML = items
        .map(
          (item) => `
            <li data-part="preference-item">
              <span data-part="preference-label">${escapeHtml(item.label)}</span>
              <span data-part="preference-value">${escapeHtml(String(item.value))}</span>
            </li>
          `
        )
        .join('');
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: OBSERVED_ATTRIBUTES,
    });

    // Poll style changes (MutationObserver can't observe inline style changes)
    let lastStyleSnapshot = '';
    setInterval(() => {
      const root = document.documentElement;
      const snapshot = OBSERVED_PROPERTIES
        .map((prop) => prop.startsWith('--') ? root.style.getPropertyValue(prop) : root.style[prop])
        .join('|');
      if (snapshot !== lastStyleSnapshot) {
        lastStyleSnapshot = snapshot;
        state.docPrefs = readDocumentPreferences();
        const statusEl = mount.querySelector('[data-part="preference-list"]');
        if (statusEl) {
          const prefs = state.docPrefs;
          const items = [
            { label: 'Color scheme', value: prefs.colorScheme },
            { label: 'Accent', value: prefs.accentColor },
            { label: 'Font scale', value: prefs.fontScale },
            { label: 'Radius', value: prefs.radiusPreset },
            { label: 'Reduce motion', value: prefs.reduceMotion ? 'on' : 'off' },
            { label: 'Reduce transparency', value: prefs.reduceTransparency ? 'on' : 'off' },
            { label: 'Increase contrast', value: prefs.increaseContrast ? 'on' : 'off' },
          ];
          statusEl.innerHTML = items
            .map(
              (item) => `
                <li data-part="preference-item">
                  <span data-part="preference-label">${escapeHtml(item.label)}</span>
                  <span data-part="preference-value">${escapeHtml(String(item.value))}</span>
                </li>
              `
            )
            .join('');
        }
      }
    }, 200);
  }

  render();
  setupPreferenceWatcher();

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
  const [gettingStartedModule, howItWorksModule, apiModule, examplesModule, releasingModule, packageJsonModule] =
    await Promise.all([
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
        { markdown: gettingStartedModule.default, sourcePath: 'src/docs/content/getting-started.md' },
        { markdown: howItWorksModule.default, sourcePath: 'src/docs/content/how-it-works.md' },
        { markdown: apiModule.default, sourcePath: 'src/docs/content/api.md' },
        { markdown: examplesModule.default, sourcePath: 'src/docs/content/examples.md' },
        { markdown: releasingModule.default, sourcePath: 'src/docs/content/releasing.md' },
      ])
    ),
    siteMeta: Object.freeze({
      version: packageJson.version,
      releaseTag: `v${packageJson.version}`,
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

  const [
    { docsPages, siteMeta },
    _componentModule,
    pixHighlighterModule,
  ] = await Promise.all([
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
