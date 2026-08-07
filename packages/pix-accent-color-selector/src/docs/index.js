/** pix-accent-color-selector - documentation site entry. */
import { createDocsSite, buildDocsPages } from '@pix-galaxy/pix-core/docs/docs-site.js';

export const examples = Object.freeze([
  {
    title: 'HTML declaration',
    description: 'Drop the custom element anywhere in your markup.',
    lang: 'html',
    code: `<pix-accent-color-selector></pix-accent-color-selector>`,
  },
  {
    title: 'Import & use',
    description: 'Import and let the component self-register.',
    lang: 'js',
    code: `import '@pix-galaxy/pix-accent-color-selector';\n\ndocument.body.innerHTML =\n  '<pix-accent-color-selector></pix-accent-color-selector>';
`,
  },
  {
    title: 'Programmatic control',
    description: 'Switch the accent imperatively.',
    lang: 'js',
    code: `import { PixAccentColorSelector } from '@pix-galaxy/pix-accent-color-selector';\n\nconst selector = document.querySelector('pix-accent-color-selector');\nselector.applyAccent('mint');\nconsole.log(selector.currentAccent);`,
  },
  {
    title: 'Listen to accent changes',
    description: 'React to accent color changes via event listener.',
    lang: 'js',
    code: `const selector = document.querySelector('pix-accent-color-selector');\nselector.addEventListener('accent-changed', (event) => {\n  console.log('Accent changed:', event.detail.accentId);\n});`,
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
      componentName: 'pix-accent-color-selector',
      componentTag: 'pix-accent-color-selector',
      description: 'Accent color selector synced with the system.',
      liveHtml: '<pix-accent-color-selector></pix-accent-color-selector>',
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

      const accentSelector = root.querySelector('pix-accent-color-selector');
      const swatchDot = root.querySelector('[data-part="swatch-dot"]');
      const swatchValue = root.querySelector('[data-part="swatch-value"]');

      if (accentSelector && swatchDot && swatchValue) {
        function updateSwatch() {
          const h = getComputedStyle(document.documentElement)
            .getPropertyValue('--pix-accent-h')
            .trim();
          const s = getComputedStyle(document.documentElement)
            .getPropertyValue('--pix-accent-s')
            .trim();
          const l = getComputedStyle(document.documentElement)
            .getPropertyValue('--pix-accent-l')
            .trim();
          swatchDot.style.setProperty('--swatch-color', h && s && l ? `hsl(${h} ${s} ${l})` : null);
          swatchValue.textContent = h && s && l ? `${h} ${s} ${l}` : '';
        }

        updateSwatch();
        accentSelector.addEventListener('accent-changed', updateSwatch);
      }
    },
  });
}

void bootDocsSite();
