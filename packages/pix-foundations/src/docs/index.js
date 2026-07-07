import { createDocsSite, buildDocsPages } from '@pix-galaxy/shared/docs/docs-site.js';

const examples = [
  {
    title: 'Using radii tokens',
    description: 'Consistent border-radius across components.',
    lang: 'css',
    code: `.card {\n  border-radius: var(--pix--r--md, 8px);\n}\n\npre, code {\n  border-radius: var(--pix--r--md, 8px);\n}\n\nbutton {\n  border-radius: var(--pix--r--md, 8px);\n}`,
  },
  {
    title: 'Semantic colors with light-dark',
    description: 'Colors adapt automatically to color scheme.',
    lang: 'css',
    code: `.box {\n  background: var(--pix--c--surface);\n  color: var(--pix--c--text);\n  border: 1px solid var(--pix--c--border);\n}`,
  },
  {
    title: 'Spacing scale',
    description: 'Use spacing tokens for consistent gaps.',
    lang: 'css',
    code: `.panel {\n  padding: var(--pix--s--md);\n  gap: var(--pix--s--sm);\n}\n\n@media (min-width: 48rem) {\n  .panel {\n    padding: var(--pix--s--lg);\n  }\n}`,
  },
  {
    title: 'Focus ring',
    description: 'WCAG 2.2 compliant focus indicator, auto-applied.',
    lang: 'css',
    code: `/* Applied automatically to all interactive elements.\n   To customise:\n   :focus-visible {\n     outline-width: var(--pix--f--width);\n     outline-offset: var(--pix--f--offset);\n   } */`,
  },
];

async function bootDocsSite() {
  if (typeof document === 'undefined') return;
  const mount = document.querySelector('#app');
  if (!mount) return;

  const [
    { default: gettingStarted }, { default: howItWorks }, { default: api },
    { default: examplesMd }, { default: releasing },
    { default: packageJson },
  ] = await Promise.all([
    import('./content/getting-started.md?raw'), import('./content/how-it-works.md?raw'),
    import('./content/api.md?raw'), import('./content/examples.md?raw'),
    import('./content/releasing.md?raw'), import('../../package.json'),
  ]);

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
      componentName: 'pix-foundations',
      componentTag: 'pix-foundations',
      description: 'Centralised design tokens for radii, spacing, colors, typography, focus, and elevations.',
      liveHtml: `
        <div style="display:flex;flex-wrap:wrap;gap:0.5rem;margin-top:0.5rem;">
          <span style="padding:0.25rem 0.5rem;border:1px solid var(--pix--c--border);border-radius:var(--pix--r--md,8px);background:var(--pix--c--surface);font-size:0.75rem;">radius: 8px</span>
          <span style="padding:0.25rem 0.5rem;border:1px solid var(--pix--c--border);border-radius:var(--pix--r--pill,999px);background:var(--pix--c--surface);font-size:0.75rem;">pill shape</span>
          <span style="padding:0.25rem 0.5rem;border:1px solid var(--pix--c--border);border-radius:var(--pix--r--lg,12px);background:var(--pix--c--surface);font-size:0.75rem;">radius: 12px</span>
        </div>
      `,
    },
  });
}

void bootDocsSite();
