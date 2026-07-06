import { createDocsSite, buildDocsPages } from '@pix-galaxy/shared/docs/docs-site.js';

const examples = [
  {
    title: 'Horizontal split',
    description: 'Two panels side by side.',
    lang: 'html',
    code: '<pix-splitter orientation="horizontal" style="height:300px;">\n  <div>Left panel</div>\n  <div>Right panel</div>\n</pix-splitter>',
  },
  {
    title: 'Vertical split',
    description: 'Three panels stacked vertically.',
    lang: 'html',
    code: '<pix-splitter orientation="vertical" style="height:400px;">\n  <div>Top</div>\n  <div>Middle</div>\n  <div>Bottom</div>\n</pix-splitter>',
  },
  {
    title: 'Programmatic control',
    description: 'Get or set panel ratios.',
    lang: 'js',
    code: `const splitter = document.querySelector('pix-splitter');\nconsole.log(splitter.ratios); // [0.5, 0.5]\n\nsplitter.addEventListener('splitter-resize-end', (e) => {\n  console.log('New ratios:', e.detail.ratios);\n});`,
  },
  {
    title: 'Custom min panel size',
    description: 'Prevent panels from collapsing.',
    lang: 'html',
    code: '<pix-splitter min-panel-size="200">\n  <div>Min 200px</div>\n  <div>Flexible</div>\n</pix-splitter>',
  },
];

async function bootDocsSite() {
  if (typeof document === 'undefined') return;

  const mount = document.querySelector('#app');
  if (!mount) return;

  const [
    { default: gettingStarted },
    { default: howItWorks },
    { default: api },
    { default: examplesMd },
    { default: releasing },
    { default: packageJson },
    _componentModule,
    _pixHighlighter,
    _colorSchemeSelector,
  ] = await Promise.all([
    import('./content/getting-started.md?raw'),
    import('./content/how-it-works.md?raw'),
    import('./content/api.md?raw'),
    import('./content/examples.md?raw'),
    import('./content/releasing.md?raw'),
    import('../../package.json'),
    import('../index.js'),
    import('@pix-galaxy/pix-highlighter'),
    import('@pix-galaxy/pix-color-scheme-selector'),
  ]);

  void _componentModule;
  void _colorSchemeSelector;

  const { enhancePixHighlighters } = _pixHighlighter;

  createDocsSite({
    mount,
    docs: buildDocsPages([
      { markdown: gettingStarted, sourcePath: 'src/docs/content/getting-started.md' },
      { markdown: howItWorks, sourcePath: 'src/docs/content/how-it-works.md' },
      { markdown: api, sourcePath: 'src/docs/content/api.md' },
      { markdown: examplesMd, sourcePath: 'src/docs/content/examples.md' },
      { markdown: releasing, sourcePath: 'src/docs/content/releasing.md' },
    ]),
    examples,
    meta: {
      version: packageJson.version,
      componentName: 'pix-splitter',
      componentTag: 'pix-splitter',
      description: 'Accessible resizable panel splitter Web Component. Supports horizontal and vertical layouts with keyboard navigation.',
      liveHtml: `
        <pix-color-scheme-selector></pix-color-scheme-selector>
        <pix-splitter orientation="horizontal" style="height:120px;border:1px solid var(--pix-ds-line-soft);border-radius:8px;overflow:hidden;margin-top:0.5rem;">
          <div style="padding:0.75rem;background:var(--pix-ds-surface);font-size:0.875rem;">← drag →</div>
          <div style="padding:0.75rem;background:var(--pix-ds-surface-page);font-size:0.875rem;">panel</div>
        </pix-splitter>
      `,
    },
    afterRender(root) {
      enhancePixHighlighters(root);
    },
  });
}

void bootDocsSite();
