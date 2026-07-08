/** pix-command — documentation site entry. */
import { createDocsSite, buildDocsPages } from '@pix-galaxy/shared/docs/docs-site.js';

const examples = [
  {
    title: 'HTML declaration',
    description: 'Drop the custom element anywhere in your markup.',
    lang: 'html',
    code: '<pix-command>\n  <script type="application/json">\n    [\n      { "id": "hello", "label": "Say Hello" }\n    ]\n  </script>\n</pix-command>',
  },
  {
    title: 'Import & use',
    description: 'Import and let the component self-register.',
    lang: 'js',
    code: `import '@pix-galaxy/pix-command';\n\ndocument.body.innerHTML =\n  '<pix-command src="/api/commands.json"></pix-command>';`,
  },
  {
    title: 'Programmatic control',
    description: 'Open/close and listen for selection.',
    lang: 'js',
    code: `const cmd = document.querySelector('pix-command');\ncmd.open = true;\n\ncmd.addEventListener('command-selected', (event) => {\n  console.log('Selected:', event.detail.label);\n});`,
  },
  {
    title: 'Remote data',
    description: 'Fetch commands from a JSON endpoint.',
    lang: 'html',
    code: '<pix-command src="/api/commands.json"></pix-command>',
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
      componentName: 'pix-command',
      componentTag: 'pix-command',
      description: 'Accessible command palette Web Component with fuzzy search, keyboard navigation, and category grouping.',
      liveHtml: `
        <pix-color-scheme-selector></pix-color-scheme-selector>
        <div style="display:flex;gap:0.5rem;align-items:center;margin-top:0.5rem;">
          <button type="button" id="cmd-demo-btn" style="font:inherit;font-size:0.875rem;padding:0.4rem 0.75rem;border:1px solid var(--pix-ds-line-soft);border-radius:6px;background:var(--pix-ds-surface);cursor:pointer;">Open commands</button>
          <span style="font-size:0.75rem;color:var(--pix-ds-text-muted);"><kbd>⌘K</kbd></span>
        </div>
      `,
    },
    afterRender(root) {
      enhancePixHighlighters(root);

      // Ensure a <pix-command> instance exists in the live preview
      const livePreview = root.querySelector('[data-part="live-preview"]');
      if (livePreview && !livePreview.querySelector('pix-command')) {
        const cmd = document.createElement('pix-command');
        cmd.items = [
          { id: 'open-home', label: 'Open Home', description: 'Navigate to home', category: 'Navigation' },
          { id: 'search', label: 'Search', description: 'Search the documentation', category: 'Navigation' },
          { id: 'theme', label: 'Toggle Theme', description: 'Switch between light and dark', category: 'Appearance' },
          { id: 'share', label: 'Share Page', description: 'Copy link to clipboard', category: 'Actions', shortcut: 'Mod+Shift+C' },
        ];
        livePreview.append(cmd);
      }

      // Wire the demo button
      const btn = root.querySelector('#cmd-demo-btn');
      const cmd = document.querySelector('pix-command');
      btn?.addEventListener('click', () => {
        if (cmd) cmd.open = !cmd.open;
      });
    },
  });
}

void bootDocsSite();
