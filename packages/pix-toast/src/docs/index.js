import { createDocsSite, buildDocsPages } from '@pix-galaxy/shared/docs/docs-site.js';

const examples = [
  {
    title: 'All variants',
    description: 'Info, success, warning, and error toasts.',
    lang: 'js',
    code: `const stack = document.querySelector('pix-toast-stack');\nstack.add({ title: 'Update', message: 'New version available', variant: 'info' });\nstack.add({ title: 'Saved', message: 'Changes saved', variant: 'success' });\nstack.add({ title: 'Warning', message: 'Disk space low', variant: 'warning' });\nstack.add({ title: 'Error', message: 'Connection lost', variant: 'error', duration: 0 });`,
  },
  {
    title: 'Smart queuing',
    description: 'Add 10 rapid toasts - stack shows max 5, queues the rest.',
    lang: 'js',
    code: `const stack = document.querySelector('pix-toast-stack');\nfor (let i = 0; i < 10; i++) {\n  stack.add({ message: 'Toast #' + (i + 1) });\n}`,
  },
  {
    title: 'Dedup by ID',
    description: 'Repeated ID bumps the timer instead of duplicating.',
    lang: 'js',
    code: `const stack = document.querySelector('pix-toast-stack');\nstack.add({ id: 'unique-alert', message: 'This deduplicates' });\nstack.add({ id: 'unique-alert', message: 'This deduplicates' });`,
  },
  {
    title: 'Persistent toast',
    description: 'Set duration=0 for sticky notifications.',
    lang: 'js',
    code: `const stack = document.querySelector('pix-toast-stack');\nstack.add({ message: 'Stays until dismissed', duration: 0 });`,
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
      componentName: 'pix-toast',
      componentTag: 'pix-toast-stack',
      description: 'Accessible toast notification system with smart queuing, deduplication, and auto-dismiss. Includes both individual toast and stack manager.',
      liveHtml: `
        <pix-color-scheme-selector></pix-color-scheme-selector>
        <div style="display:flex;gap:0.5rem;flex-wrap:wrap;margin-top:0.5rem;">
          <button type="button" id="demo-toast-btn" style="font:inherit;font-size:0.875rem;padding:0.4rem 0.75rem;border:1px solid var(--pix-ds-line-soft);border-radius:6px;background:var(--pix-ds-surface);cursor:pointer;">Show toast</button>
        </div>
      `,
    },
    afterRender(root) {
      enhancePixHighlighters(root);

      const btn = root.querySelector('#demo-toast-btn');
      const stack = document.querySelector('pix-toast-stack') || document.createElement('pix-toast-stack');
      if (!stack.isConnected) {
        stack.setAttribute('position', 'top-right');
        document.body.appendChild(stack);
      }

      let count = 0;
      btn?.addEventListener('click', () => {
        count++;
        const variants = ['info', 'success', 'warning', 'error'];
        stack.add({
          title: `Toast #${count}`,
          message: `Demo notification ${count}`,
          variant: variants[count % variants.length],
        });
      });
    },
  });
}

void bootDocsSite();
