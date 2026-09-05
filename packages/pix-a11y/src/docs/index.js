/** pix-a11y - documentation site entry. */
import { createDocsSite, buildDocsPages } from '@pix-galaxy/pix-core/docs/docs-site.js';

export const examples = Object.freeze([
  {
    title: 'HTML declaration',
    description: 'Drop the custom element anywhere in your markup.',
    lang: 'html',
    code: `<pix-a11y></pix-a11y>`,
  },
  {
    title: 'Import & use',
    description: 'Import and let the component self-register.',
    lang: 'js',
    code: `import '@pix-galaxy/pix-a11y';\n\ndocument.body.innerHTML =\n  '<pix-a11y></pix-a11y>';
`,
  },
  {
    title: 'Read preferences',
    description: 'Read saved display preferences.',
    lang: 'js',
    code: `import { readPreferences, DEFAULT_PREFERENCES } from '@pix-galaxy/pix-a11y';\n\nconst prefs = readPreferences();\nconsole.log(prefs.fontScale); // '100%'`,
  },
  {
    title: 'Apply programmatically',
    description: 'Apply preferences without mounting the component.',
    lang: 'js',
    code: `import { applyPreferencesToDocument } from '@pix-galaxy/pix-a11y';\n\napplyPreferencesToDocument({\n  fontScale: '125%',\n  increaseContrast: true,\n  radiusPreset: 'square',\n});`,
  },
]);

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
      componentName: 'pix-a11y',
      componentTag: 'pix-a11y',
      description: 'Accessibility, typography, and radius preferences popover.',
      liveHtml: '<pix-a11y></pix-a11y>',
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
