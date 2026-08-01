/** pix-foundations — documentation site entry. */
import { createDocsSite, buildDocsPages } from '@pix-galaxy/pix-core/docs/docs-site.js';

const examples = [
  {
    title: 'Use tokens in CSS',
    description: 'Consistent spacing, radii, and colors across components.',
    lang: 'css',
    code: `.card {\n  padding: var(--pix-ds--s--md);\n  border-radius: var(--pix-ds--r--md);\n  background: var(--pix-ds--c--surface);\n  color: var(--pix-ds--c--text);\n  border: 1px solid var(--pix-ds--c--border);\n}\n\n/* Focus ring comes from pix-foundations. Do not redefine locally. */`,
  },
  {
    title: 'Import in project',
    description: 'Add foundations once, use tokens everywhere.',
    lang: 'css',
    code: `/* main.css */\n@import '@pix-galaxy/pix-foundations/foundations.css';\n\n/* Now use any --pix--* token */\nbody {\n  background: var(--pix-ds--c--page);\n  color: var(--pix-ds--c--text);\n}`,
  },
  {
    title: 'Theme-aware colors',
    description: 'light-dark() handles light/dark mode automatically.',
    lang: 'css',
    code: `.box {\n  background: var(--pix-ds--c--surface);\n  color: var(--pix-ds--c--text);\n  border: 1px solid var(--pix-ds--c--border);\n}\n\n/* Switch theme via pix-color-scheme-selector → <html style=\"color-scheme: dark\">\n   light-dark() reads this, adapts all --pix-ds--c--* tokens automatically */`,
  },
  {
    title: 'Override tokens per scope',
    description: 'Customize tokens inside a subtree.',
    lang: 'css',
    code: `.dark-section {\n  --pix-ds--c--surface: oklch(0.18 0.01 260);\n  --pix-ds--c--text: oklch(0.88 0.01 85);\n  --pix-ds--c--border: oklch(from gray 0.3 0.01 0 / 0.5);\n}\n\n.dark-section .card {\n  background: var(--pix-ds--c--surface);\n  color: var(--pix-ds--c--text);\n}`,
  },
];

async function bootDocsSite() {
  if (typeof document === 'undefined') return;
  const mount = document.querySelector('#app');
  if (!mount) return;

  const [
    { default: gettingStarted },
    { default: api },
    { default: howItWorks },
    { default: examplesMd },
    { default: releasing },
    { default: packageJson },
  ] = await Promise.all([
    import('./content/getting-started.md?raw'),
    import('./content/api.md?raw'),
    import('./content/how-it-works.md?raw'),
    import('./content/examples.md?raw'),
    import('./content/releasing.md?raw'),
    import('../../package.json'),
  ]);

  createDocsSite({
    mount,
    docs: buildDocsPages([
      { markdown: gettingStarted, sourcePath: 'src/docs/content/getting-started.md' },
      { markdown: api, sourcePath: 'src/docs/content/api.md' },
      { markdown: howItWorks, sourcePath: 'src/docs/content/how-it-works.md' },
      { markdown: examplesMd, sourcePath: 'src/docs/content/examples.md' },
      { markdown: releasing, sourcePath: 'src/docs/content/releasing.md' },
    ]),
    examples,
    meta: {
      version: packageJson.version,
      componentName: 'pix-foundations',
      componentTag: 'pix-foundations',
      description:
        'CSS custom property tokens for radii, spacing, colors, typography, focus, and elevations. Zero-runtime, light-dark() ready.',
      liveHtml: `
        <div style="display:flex;flex-direction:column;gap:0.5rem;font-size:0.75rem;margin-top:0.5rem;">
          <div style="display:flex;gap:0.5rem;">
            <span style="padding:0.2rem 0.5rem;border:1px solid var(--pix-ds--c--border);border-radius:var(--pix-ds--r--md,8px);background:var(--pix-ds--c--surface);">radius md (8px)</span>
            <span style="padding:0.2rem 0.5rem;border:1px solid var(--pix-ds--c--border);border-radius:var(--pix-ds--r--pill,999px);background:var(--pix-ds--c--surface);">radius pill</span>
          </div>
          <div style="display:flex;gap:0.5rem;">
            <span style="padding:0.2rem 0.5rem;border:1px solid var(--pix-ds--c--border);border-radius:var(--pix-ds--r--md,8px);background:var(--pix-ds--c--accent);color:white;">accent</span>
            <span style="padding:0.2rem 0.5rem;border:1px solid var(--pix-ds--c--border);border-radius:var(--pix-ds--r--md,8px);background:var(--pix-ds--c--success);color:white;">success</span>
            <span style="padding:0.2rem 0.5rem;border:1px solid var(--pix-ds--c--border);border-radius:var(--pix-ds--r--md,8px);background:var(--pix-ds--c--warning);color:white;">warning</span>
            <span style="padding:0.2rem 0.5rem;border:1px solid var(--pix-ds--c--border);border-radius:var(--pix-ds--r--md,8px);background:var(--pix-ds--c--danger);color:white;">danger</span>
          </div>
        </div>
      `,
    },
  });
}

void bootDocsSite();
