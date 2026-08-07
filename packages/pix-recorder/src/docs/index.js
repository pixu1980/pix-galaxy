/** pix-recorder - documentation site entry. */
import { createDocsSite, buildDocsPages } from '@pix-galaxy/pix-core/docs/docs-site.js';

const examples = [
  {
    title: 'Basic recorder',
    description: 'Record, pause, stop, and download audio.',
    lang: 'html',
    code: '<pix-recorder max-duration="300" format="webm"></pix-recorder>',
  },
  {
    title: 'Custom filename',
    description: 'Set the download file name.',
    lang: 'html',
    code: '<pix-recorder filename="my-memo"></pix-recorder>',
  },
  {
    title: 'Programmatic control',
    description: 'Start/stop from JS.',
    lang: 'js',
    code: "const r = document.querySelector('pix-recorder');\nr.start();\n\nr.addEventListener('recorder-complete', (e) => {\n  console.log('Duration:', e.detail.duration);\n  // Upload e.detail.blob\n});",
  },
  {
    title: 'Limit duration',
    description: 'Auto-stop after N seconds.',
    lang: 'html',
    code: '<pix-recorder max-duration="30"></pix-recorder>',
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
      componentName: 'pix-recorder',
      componentTag: 'pix-recorder',
      description:
        'Accessible audio recorder Web Component with waveform visualization, pause/resume, and download.',
      liveHtml: '<pix-recorder max-duration="15" style="max-width:24rem;"></pix-recorder>',
    },
    afterRender(root) {
      enhancePixHighlighters(root);
    },
  });
}
void bootDocsSite();
