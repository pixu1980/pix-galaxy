/** pix-sortable — documentation site entry. */
import { createDocsSite, buildDocsPages } from '@pix-galaxy/pix-core/docs/docs-site.js';

const examples = [
  {
    title: 'Basic list',
    description: 'Drag handles, keyboard, or touch to reorder.',
    lang: 'html',
    code: '<pix-sortable>\n  <div data-sortable-value="1">First item</div>\n  <div data-sortable-value="2">Second item</div>\n  <div data-sortable-value="3">Third item</div>\n</pix-sortable>',
  },
  {
    title: 'Events',
    description: 'Listen for reorder changes.',
    lang: 'js',
    code: "const list = document.querySelector('pix-sortable');\nlist.addEventListener('sortable-change', (e) => {\n  console.log('Moved from', e.detail.fromIndex, 'to', e.detail.toIndex);\n  console.log('New order:', e.detail.items);\n});",
  },
  {
    title: 'Custom content',
    description: 'Rich items with any markup.',
    lang: 'html',
    code: '<pix-sortable>\n  <div data-sortable-value="a"><span style="font-size:1.2rem;">📄</span> Document A</div>\n  <div data-sortable-value="b"><span style="font-size:1.2rem;">📄</span> Document B</div>\n</pix-sortable>',
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
    _colorScheme,
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
  void _colorScheme;
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
      componentName: 'pix-sortable',
      componentTag: 'pix-sortable',
      description:
        'Accessible sortable list with drag & drop, touch, and full keyboard navigation.',
    },
    afterRender(root) {
      enhancePixHighlighters(root);
    },
  });
}
void bootDocsSite();
