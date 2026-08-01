/** pix-component-template — documentation site entry. */
import { createDocsSite, buildDocsPages } from '@pix-galaxy/pix-core/docs/docs-site.js';

const examples = [
  {
    title: 'HTML declaration',
    description: 'Drop the custom element anywhere in your markup.',
    lang: 'html',
    code: `<{%ELEMENT_NAME%}></{%ELEMENT_NAME%}>`,
  },
  {
    title: 'Import & use',
    description: 'Import and let the component self-register.',
    lang: 'js',
    code: `import '{%PACKAGE_NAME%}';\ndocument.body.innerHTML = '<{%ELEMENT_NAME%}></{%ELEMENT_NAME%}>';`,
  },
  {
    title: 'Programmatic control',
    description: 'Use the component API imperatively.',
    lang: 'js',
    code: `import { {%COMPONENT_CLASS%} } from '{%PACKAGE_NAME%}';\nconst el = document.querySelector('{%ELEMENT_NAME%}');`,
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
  ] = await Promise.all([
    import('./content/getting-started.md?raw'),
    import('./content/how-it-works.md?raw'),
    import('./content/api.md?raw'),
    import('./content/examples.md?raw'),
    import('./content/releasing.md?raw'),
    import('../../package.json'),
    import('../index.js'),
    import('@pix-galaxy/pix-highlighter'),
  ]);

  void _componentModule;
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
      componentName: '{%COMPONENT_NAME%}',
      componentTag: '{%ELEMENT_NAME%}',
      description: '{%COMPONENT_DESCRIPTION%}',
      liveHtml: '<{%ELEMENT_NAME%}></{%ELEMENT_NAME%}>',
    },
    afterRender(root) {
      enhancePixHighlighters(root);
    },
  });
}

void bootDocsSite();
