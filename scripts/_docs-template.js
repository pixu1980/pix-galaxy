// @ts-check

const SITE_COLOR_MODE_STORAGE_KEY = 'pix-galaxy-site-color-mode';
const SITE_COLOR_MODE_OPTIONS = Object.freeze([
  { value: 'light', label: 'Light', icon: createSunIcon() },
  { value: 'system', label: 'System', icon: createSystemIcon() },
  { value: 'dark', label: 'Dark', icon: createMoonIcon() },
]);
const DEFAULT_THEME_OPTIONS = Object.freeze([{ value: 'default', label: 'Default' }]);

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
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
    // Ignore storage access errors for ephemeral preview sessions.
  }

  return normalizedMode;
}

function readSiteData(targetDocument = globalThis.document) {
  if (!targetDocument) {
    return null;
  }

  const dataNode = targetDocument.querySelector('#pix-docs-data');
  if (!(dataNode instanceof targetDocument.defaultView.HTMLScriptElement)) {
    return null;
  }

  try {
    return JSON.parse(dataNode.textContent ?? '{}');
  } catch {
    return null;
  }
}

function renderExamples(exampleEntries) {
  if (!exampleEntries.length) {
    return `
      <article class="docs-example-card">
        <div class="docs-example-copy">
          <p class="docs-eyebrow">Examples</p>
          <h3>Examples pending</h3>
          <p>Add fenced code blocks under docs/content/examples.md to populate this gallery.</p>
        </div>
      </article>
    `;
  }

  return exampleEntries
    .map(
      (example) => `
        <article class="docs-example-card">
          <div class="docs-example-copy">
            <p class="docs-eyebrow">Example</p>
            <h3>${escapeHtml(example.title)}</h3>
            <p>${escapeHtml(example.description)}</p>
          </div>
          <pre is="pix-highlighter" data-lang="${escapeHtml(example.lang)}"><code>${escapeHtml(example.code)}</code></pre>
        </article>
      `
    )
    .join('');
}

function getDefaultDoc() {
  return {
    slug: 'overview',
    title: 'Overview',
    html: '<p>No documentation content available.</p>',
    sourcePath: 'packages/*/docs/content/',
  };
}

function createDocsSite({
  mount,
  packageName,
  tagName,
  summary,
  docs,
  examples,
  meta,
  themeOptions,
  onThemeChange,
  afterRender,
}) {
  const ownerDocument = mount.ownerDocument;
  const ownerWindow = ownerDocument.defaultView;
  const normalizedDocs = Array.isArray(docs) && docs.length > 0 ? docs : [getDefaultDoc()];
  const normalizedThemeOptions = Array.isArray(themeOptions) && themeOptions.length > 0
    ? themeOptions
    : DEFAULT_THEME_OPTIONS;
  const state = {
    activeSlug: normalizedDocs[0]?.slug || 'overview',
    selectedTheme: normalizedThemeOptions[0]?.value || 'default',
    selectedColorMode: getInitialSiteColorMode(ownerWindow),
  };

  applySiteColorMode(state.selectedColorMode, ownerDocument, ownerWindow);

  mount.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof ownerWindow.Element)) {
      return;
    }

    const docButton = target.closest('[data-site-doc]');
    if (docButton) {
      state.activeSlug = docButton.dataset.siteDoc;
      render();
      return;
    }

    const themeButton = target.closest('[data-site-theme]');
    if (themeButton) {
      state.selectedTheme = themeButton.dataset.siteTheme;
      onThemeChange?.(state.selectedTheme);
      render();
    }
  });

  mount.addEventListener('change', (event) => {
    const target = event.target;
    if (!(target instanceof ownerWindow.Element)) {
      return;
    }

    const colorModeControl = target.closest('[data-site-color-mode]');
    if (!(colorModeControl instanceof ownerWindow.HTMLInputElement)) {
      return;
    }

    state.selectedColorMode = applySiteColorMode(colorModeControl.value, ownerDocument, ownerWindow);
  });

  function render() {
    const activeDoc = normalizedDocs.find((doc) => doc.slug === state.activeSlug) || normalizedDocs[0] || getDefaultDoc();
    const themeButtons = normalizedThemeOptions
      .map(
        (theme) => `
          <button
            type="button"
            class="docs-theme-chip${theme.value === state.selectedTheme ? ' is-active' : ''}"
            data-site-theme="${escapeHtml(theme.value)}"
          >
            ${escapeHtml(theme.label)}
          </button>
        `
      )
      .join('');
    const docButtons = normalizedDocs
      .map(
        (doc) => `
          <button
            type="button"
            class="docs-nav-link${doc.slug === activeDoc.slug ? ' is-active' : ''}"
            data-site-doc="${escapeHtml(doc.slug)}"
          >
            ${escapeHtml(doc.title)}
          </button>
        `
      )
      .join('');
    const colorModeControls = SITE_COLOR_MODE_OPTIONS.map(
      (option) => `
        <label class="docs-color-mode-option">
          <span class="docs-color-mode-icon" aria-hidden="true">${option.icon}</span>
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

    mount.innerHTML = `
      <div class="docs-shell">
        <header class="docs-hero">
          <div class="docs-hero-copy">
            <p class="docs-eyebrow">${escapeHtml(packageName)}</p>
            <h1>${escapeHtml(tagName)}</h1>
            <p class="docs-summary">${escapeHtml(summary)}</p>
            <div class="docs-meta-row">
              <span class="docs-meta-pill" data-site-version>v${escapeHtml(meta.version || '0.0.0')}</span>
              <span class="docs-meta-pill">${escapeHtml(meta.releaseTag || 'v0.0.0')}</span>
              <span class="docs-meta-pill">${normalizedDocs.length} docs pages</span>
            </div>
          </div>
          <div class="docs-hero-panel">
            <section class="docs-color-mode-panel" aria-labelledby="docs-color-mode-title">
              <p class="docs-eyebrow" id="docs-color-mode-title">Light-dark system</p>
              <section class="docs-color-mode-group" aria-label="Color mode">
                ${colorModeControls}
              </section>
            </section>
            <p class="docs-eyebrow">Global theme</p>
            <div class="docs-theme-grid">${themeButtons}</div>
            <pre is="pix-highlighter" data-lang="js">
              <code>
                const theme = '${escapeHtml(state.selectedTheme)}';

                function renderDocs(theme) {
                  // re-render docs with selected theme
                  return theme;
                }

                renderDocs(theme);
              </code>
            </pre>
          </div>
        </header>

        <main class="docs-main">
          <aside class="docs-nav">
            <p class="docs-eyebrow">Documentation</p>
            <div class="docs-nav-links">${docButtons}</div>
          </aside>

          <section class="docs-content-panel">
            <div class="docs-content-header">
              <h2>${escapeHtml(activeDoc.title)}</h2>
              <span class="docs-source-label">${escapeHtml(activeDoc.sourcePath)}</span>
            </div>
            <article class="docs-markdown" data-site-doc-content>${activeDoc.html}</article>
          </section>
        </main>

        <section class="docs-examples">
          <div class="docs-content-header">
            <h2>Examples</h2>
            <span class="docs-source-label">curated demo gallery</span>
          </div>
          <div class="docs-example-grid">
            ${renderExamples(Array.isArray(examples) ? examples : [])}
          </div>
        </section>
      </div>
    `;

    afterRender?.(mount, activeDoc);
  }

  render();

  return {
    getActiveDoc() {
      return normalizedDocs.find((doc) => doc.slug === state.activeSlug) || normalizedDocs[0] || null;
    },
    selectDoc(slug) {
      state.activeSlug = slug;
      render();
    },
  };
}

async function bootDocsSite() {
  if (typeof document === 'undefined') {
    return;
  }

  const mount = document.querySelector('#app');
  if (!(mount instanceof HTMLElement)) {
    return;
  }

  const siteData = readSiteData(document);
  if (!siteData) {
    return;
  }

  let themeOptions = DEFAULT_THEME_OPTIONS;
  let onThemeChange = () => {};
  let afterRender = undefined;

  if (siteData.highlighterModulePath) {
    try {
      const highlighterModule = await import(siteData.highlighterModulePath);
      if (Array.isArray(highlighterModule.PIX_HIGHLIGHTER_THEME_OPTIONS) && highlighterModule.PIX_HIGHLIGHTER_THEME_OPTIONS.length > 0) {
        themeOptions = highlighterModule.PIX_HIGHLIGHTER_THEME_OPTIONS;
      }

      if (typeof highlighterModule.PixHighlighter?.applyTheme === 'function') {
        highlighterModule.PixHighlighter.applyTheme(themeOptions[0]?.value || 'default', {
          persist: false,
          syncInstances: false,
        });
        onThemeChange = (theme) => {
          highlighterModule.PixHighlighter.applyTheme(theme);
        };
      }

      if (typeof highlighterModule.enhancePixHighlighters === 'function') {
        afterRender = (root) => {
          highlighterModule.enhancePixHighlighters(root);
        };
      }
    } catch {
      // Leave docs usable even when shared syntax-highlighter assets are not available.
    }
  }

  createDocsSite({
    mount,
    packageName: siteData.packageName || '@pix-galaxy/component',
    tagName: siteData.tagName || 'pix-component',
    summary: siteData.summary || 'Browser-native component docs built from markdown.',
    docs: Array.isArray(siteData.docs) ? siteData.docs : [],
    examples: Array.isArray(siteData.examples) ? siteData.examples : [],
    meta: siteData.meta || { version: '0.0.0', releaseTag: 'v0.0.0' },
    themeOptions,
    onThemeChange,
    afterRender,
  });
}

void bootDocsSite();
