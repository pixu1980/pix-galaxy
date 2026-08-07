/** pix-vanilla-reactive - documentation site entry. */
import { createDocsSite, buildDocsPages } from '@pix-galaxy/pix-core/docs/docs-site.js';

const examples = [
  {
    title: 'Signals',
    description: 'Fine-grained reactivity without a framework.',
    lang: 'js',
    code: `import { Signal, effect } from '@pix-galaxy/pix-vanilla-reactive';

const count = new Signal.State(0);
const doubled = new Signal.Computed(() => count.get() * 2);

effect(() => console.log(doubled.get())); // 0
count.set(5);                             // → 10`,
  },
  {
    title: 'Store + render',
    description: 'A Proxy store drives the html template engine.',
    lang: 'js',
    code: `import { Store, Signal, effect, html, render, createTickState }
  from '@pix-galaxy/pix-vanilla-reactive';

const store = new Store({ name: 'pix' });
const tick = createTickState(store);

const view = new Signal.Computed(() => {
  tick.get();
  const result = html\`<h1>Hello {{ name | upper }}</h1>\`;
  result._context = store.snapshot();
  return result;
});

effect(() => render(view.get(), document.querySelector('#app')));
store.state.name = 'galaxy'; // re-renders automatically`,
  },
  {
    title: 'Two-way binding',
    description: 'The model directive syncs inputs with state.',
    lang: 'js',
    code: `html\`<input model=\${{
  get: () => store.state.email,
  set: (v) => { store.state.email = v; },
}} />\`;`,
  },
  {
    title: 'Reactive lists',
    description: 'Keyed reconciliation via the repeat directive.',
    lang: 'js',
    code: `const todos = new Signal.State([
  { id: 1, title: 'one' },
  { id: 2, title: 'two' },
]);

html\`<ul>\${repeat(
  todos,
  (todo) => todo.id,
  (todo) => html\`<li>\${todo.title}</li>\`,
)}</ul>\`;`,
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
    _frameworkModule,
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

  void _frameworkModule;
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
      componentName: 'pix-vanilla-reactive',
      componentTag: 'pix-vanilla-reactive',
      description:
        'Zero-dependency reactive UI framework: Proxy Store, fine-grained Signals, html`` template engine, and custom elements.',
      liveHtml: `
        <pix-color-scheme-selector></pix-color-scheme-selector>
        <div style="margin-top:0.5rem;font-size:0.875rem;">Signals · Store · html\`\` templates</div>
      `,
    },
    afterRender(root) {
      enhancePixHighlighters(root);
    },
  });
}

void bootDocsSite();
