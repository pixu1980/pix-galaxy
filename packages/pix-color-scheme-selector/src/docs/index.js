/** pix-color-scheme-selector - documentation site entry. */
import { createDocsSite, buildDocsPages } from '@pix-galaxy/pix-core/docs/docs-site.js';

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
