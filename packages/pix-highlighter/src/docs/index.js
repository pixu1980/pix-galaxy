import { Marked, Renderer } from 'marked';

const SITE_COLOR_MODE_STORAGE_KEY = 'pix-highlighter-site-color-mode';
const SITE_COLOR_MODE_OPTIONS = Object.freeze([
  { value: 'light', label: 'Light', icon: createSunIcon() },
  { value: 'system', label: 'System', icon: createSystemIcon() },
  { value: 'dark', label: 'Dark', icon: createMoonIcon() },
]);

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

function createSunIcon() {
  return `
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.8" />
      <path d="M12 2.5v2.25M12 19.25v2.25M21.5 12h-2.25M4.75 12H2.5M18.72 5.28l-1.6 1.6M6.88 17.12l-1.6 1.6M18.72 18.72l-1.6-1.6M6.88 6.88l-1.6-1.6" stroke="currentColor" stroke-linecap="round" stroke-width="1.8" />
    </svg>
  `;
}

function createMoonIcon() {
  return `
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M19 14.5A7.5 7.5 0 0 1 9.5 5a8.8 8.8 0 1 0 9.5 9.5Z" stroke="currentColor" stroke-linejoin="round" stroke-width="1.8" />
    </svg>
  `;
}

function createSystemIcon() {
  return `
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3.5" y="4" width="17" height="12.5" rx="2.25" stroke="currentColor" stroke-width="1.8" />
      <path d="M9 20h6M12 16.5V20" stroke="currentColor" stroke-linecap="round" stroke-width="1.8" />
      <path d="M12 7.25v6.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.6" />
      <path d="M12 7.25a3.25 3.25 0 0 0 0 6.5Z" fill="currentColor" opacity="0.18" />
    </svg>
  `;
}

function isSiteColorMode(value) {
  return SITE_COLOR_MODE_OPTIONS.some((option) => option.value === value);
}

function getInitialSiteColorMode(targetWindow = globalThis.window) {
  if (!targetWindow) {
    return 'system';
  }

  try {
    const storedMode = targetWindow.localStorage?.getItem(SITE_COLOR_MODE_STORAGE_KEY);
    return isSiteColorMode(storedMode) ? storedMode : 'system';
  } catch {
    return 'system';
  }
}

function applySiteColorMode(mode, targetDocument = globalThis.document, targetWindow = globalThis.window) {
  if (!targetDocument) {
    return 'system';
  }

  const normalizedMode = isSiteColorMode(mode) ? mode : 'system';
  targetDocument.documentElement.dataset.siteColorMode = normalizedMode;

  try {
    targetWindow?.localStorage?.setItem(SITE_COLOR_MODE_STORAGE_KEY, normalizedMode);
  } catch {
    // Ignore storage access errors, color mode still applies in memory for current session.
  }

  return normalizedMode;
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
    description: 'Drop a customised built-in <code>pre</code> element anywhere in your markup.',
    lang: 'html',
    code: `<pre is="pix-highlighter" data-lang="js">\n  <code>const greeting = 'Hello World';</code>\n</pre>`,
  },
  {
    title: 'Import & enhance',
    description: 'Import and activate all <code>pre[is="pix-highlighter"]</code> blocks on the page.',
    lang: 'js',
    code: `import { enhancePixHighlighters } from '@pix-galaxy/pix-highlighter';\n\ndocument.addEventListener('DOMContentLoaded', () => {\n  enhancePixHighlighters(document);\n});`,
  },
  {
    title: 'Theme API',
    description: 'Switch the global theme programmatically. Persisted to localStorage automatically.',
    lang: 'js',
    code: `import { PixHighlighter } from '@pix-galaxy/pix-highlighter';\n\nPixHighlighter.applyTheme('nord');\nconsole.log(PixHighlighter.getCurrentTheme());`,
  },
  {
    title: 'Programmatic enhance',
    description: 'Enhance a single element or get raw tokens from any lexer.',
    lang: 'js',
    code: `import { PixHighlighter, lexJS, normalizeLang } from '@pix-galaxy/pix-highlighter';\n\nconst lang = normalizeLang('TypeScript');\nconst el = document.querySelector('pre[is="pix-highlighter"]');\nPixHighlighter.enhanceElement(el);\n\nconst tokens = lexJS('const version = "0.1.0";');`,
  },
]);

function renderExamples(exampleEntries, cardPartName = 'example-card') {
  return exampleEntries
    .map(
      (example) => `
        <article data-part="${escapeHtml(cardPartName)}">
          <section data-part="example-copy">
            <h3>${escapeHtml(example.title)}</h3>
            <p>${escapeHtml(example.description)}</p>
          </section>
          <pre is="pix-highlighter" data-lang="${escapeHtml(example.lang)}"><code>${escapeHtml(example.code)}</code></pre>
        </article>
      `
    )
    .join('');
}

export function createDocsSite({
  mount,
  docs,
  examples: exampleEntries,
  meta,
  themeOptions,
  onThemeChange,
  afterRender,
}) {
  const ownerDocument = mount.ownerDocument;
  const ownerWindow = ownerDocument.defaultView;
  const state = {
    activeSlug: docs[0]?.slug || '',
    selectedTheme: themeOptions[0]?.value || 'default',
    selectedColorMode: getInitialSiteColorMode(ownerWindow),
  };

  applySiteColorMode(state.selectedColorMode, ownerDocument, ownerWindow);

  mount.addEventListener('click', (event) => {
    const docButton = event.target.closest('[data-site-doc]');
    if (docButton) {
      state.activeSlug = docButton.dataset.siteDoc;
      render();
      return;
    }

    const themeButton = event.target.closest('[data-site-theme]');
    if (themeButton) {
      state.selectedTheme = themeButton.dataset.siteTheme;
      onThemeChange?.(state.selectedTheme);
      render();
    }
  });

  mount.addEventListener('change', (event) => {
    const colorModeControl = event.target.closest('[data-site-color-mode]');
    if (!ownerWindow || !(colorModeControl instanceof ownerWindow.HTMLInputElement)) {
      return;
    }

    state.selectedColorMode = applySiteColorMode(colorModeControl.value, ownerDocument, ownerWindow);
  });

  function render() {
    const activeDoc = docs.find((doc) => doc.slug === state.activeSlug) || docs[0];
    const themeButtons = themeOptions
      .map(
        (theme) => `
          <button
            type="button"
            data-part="theme-chip"${theme.value === state.selectedTheme ? ' data-active' : ''}
            data-site-theme="${escapeHtml(theme.value)}"
          >
            ${escapeHtml(theme.label)}
          </button>
        `
      )
      .join('');

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
    const colorModeControls = SITE_COLOR_MODE_OPTIONS.map(
      (option) => `
        <label data-part="color-mode-option">
          <span data-part="color-mode-icon" aria-hidden="true">${option.icon}</span>
          <span>${escapeHtml(option.label)}</span>
          <input
            type="radio"
            name="docs-color-mode"
            value="${escapeHtml(option.value)}"
            data-site-color-mode
            ${option.value === state.selectedColorMode ? 'checked' : ''}
          />
        </label>
      `
    ).join('');

    const heroExamples = exampleEntries.slice(0, 2);

    mount.innerHTML = `
      <section data-part="shell">
        <header data-part="hero">
          <section data-part="hero-copy">
            <p data-part="eyebrow">pix-galaxy suite</p>
            <h1>pix-highlighter</h1>
            <p data-part="summary">
              Browser-native syntax highlighting. Docs from markdown. Live examples. Same release tag as npm.
            </p>
            <section data-part="meta-row">
              <span data-part="meta-pill" data-site-version>v${escapeHtml(meta.version)}</span>
              <span data-part="meta-pill">${docs.length} docs pages</span>
            </section>
          </section>
          <section data-part="hero-panel">
            <section data-part="color-mode-panel" aria-labelledby="docs-color-mode-title">
              <p data-part="eyebrow" id="docs-color-mode-title">Light-dark system</p>
              <fieldset data-part="color-mode-group">
                <legend data-visually-hidden>Color mode</legend>
                ${colorModeControls}
              </fieldset>
            </section>
            <p data-part="eyebrow">Global theme</p>
            <section data-part="theme-grid">${themeButtons}</section>
          </section>
          <section data-part="hero-examples">
            ${renderExamples(heroExamples, 'hero-example-card')}
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
  const [apiModule, examplesModule, gettingStartedModule, howItWorksModule, lexersModule, releasingModule, packageJsonModule] =
    await Promise.all([
      import('./content/api.md?raw'),
      import('./content/examples.md?raw'),
      import('./content/getting-started.md?raw'),
      import('./content/how-it-works.md?raw'),
      import('./content/lexers.md?raw'),
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
        { markdown: lexersModule.default, sourcePath: 'src/docs/content/lexers.md' },
        { markdown: releasingModule.default, sourcePath: 'src/docs/content/releasing.md' },
        { markdown: examplesModule.default, sourcePath: 'src/docs/content/examples.md' },
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

  const { docsPages, siteMeta } = await loadDocsData();

  const { PIX_HIGHLIGHTER_THEME_OPTIONS, PixHighlighter, enhancePixHighlighters } = await import(
    '../index.js'
  );

  PixHighlighter.applyTheme(PIX_HIGHLIGHTER_THEME_OPTIONS[0]?.value || 'default', {
    persist: false,
    syncInstances: false,
  });

  createDocsSite({
    mount,
    docs: docsPages,
    examples,
    meta: siteMeta,
    themeOptions: PIX_HIGHLIGHTER_THEME_OPTIONS,
    onThemeChange(theme) {
      PixHighlighter.applyTheme(theme);
    },
    afterRender(root) {
      enhancePixHighlighters(root);
    },
  });
}

void bootDocsSite();
