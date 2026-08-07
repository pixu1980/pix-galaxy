/** pix-color - documentation site entry. */
import { createDocsSite, buildDocsPages } from '@pix-galaxy/pix-core/docs/docs-site.js';

const examples = [
  {
    title: 'Basic usage',
    description: 'Inline color picker with all formats visible.',
    lang: 'html',
    code: '<pix-color value="#6366F1"></pix-color>',
  },
  {
    title: 'Form integration',
    description: 'Color picker participates in native forms.',
    lang: 'html',
    code: '<form>\n  <label>Brand color:\n    <pix-color name="brand" value="#e11d48"></pix-color>\n  </label>\n  <button>Submit</button>\n</form>',
  },
  {
    title: 'Programmatic control',
    description: 'Get/set value and listen for changes.',
    lang: 'js',
    code: `const picker = document.querySelector('pix-color');\npicker.value = '#22c55e';\n\npicker.addEventListener('color-change', (e) => {\n  console.log('New hex:', e.detail.hex);\n});`,
  },
  {
    title: 'Get color in any format',
    description: 'Access the Color object for any format.',
    lang: 'js',
    code: `import { Color } from '@pix-galaxy/pix-color';\n\nconst c = new Color('#6366F1');\nconsole.log(c.toRGBString());   // rgb(99, 102, 241)\nconsole.log(c.toHSLString());   // hsl(239, 83%, 67%)\nconsole.log(c.toOKLCHString()); // oklch(59%, 0.12, 274)&nbsp;`,
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
      componentName: 'pix-color',
      componentTag: 'pix-color',
      description:
        'Accessible OKLCH/HSL/RGB/HEX color picker Web Component with native form support and WCAG contrast checking.',
      liveHtml: '<pix-color value="#6366F1"></pix-color>',
    },
    afterRender(root) {
      enhancePixHighlighters(root);
    },
  });
}

void bootDocsSite();
