/** pix-highlighter — documentation site entry. */
import { createDocsSite, buildDocsPages } from '@pix-galaxy/pix-core/docs/docs-site.js';

export const examples = Object.freeze([
  {
    title: 'HTML declaration',
    description: 'Drop a customised built-in <code>pre</code> element anywhere in your markup.',
    lang: 'html',
    code: `<pre is="pix-highlighter" data-lang="js">\n  <code>const greeting = 'Hello World';</code>\n</pre>`,
  },
  {
    title: 'Import & enhance',
    description:
      'Import and activate all <code>pre[is="pix-highlighter"]</code> blocks on the page.',
    lang: 'js',
    code: `import { enhancePixHighlighters } from '@pix-galaxy/pix-highlighter';\n\ndocument.addEventListener('DOMContentLoaded', () => {\n  enhancePixHighlighters(document);\n});`,
  },
  {
    title: 'Theme API',
    description:
      'Switch the global theme programmatically. Persisted to localStorage automatically.',
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

export async function loadDocsData() {
  const [
    apiModule,
    examplesModule,
    gettingStartedModule,
    howItWorksModule,
    lexersModule,
    releasingModule,
    packageJsonModule,
  ] = await Promise.all([
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
        {
          markdown: gettingStartedModule.default,
          sourcePath: 'src/docs/content/getting-started.md',
        },
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
      componentName: 'pix-highlighter',
      componentTag: 'pre[is="pix-highlighter"]',
      description: 'Browser-native syntax highlighting via the CSS Highlight API.',
      liveHtml:
        '<pre is="pix-highlighter" data-lang="js"><code>const greeting = "hello";</code></pre>',
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
