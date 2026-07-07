const app = document.querySelector('#app');
if (!app) throw new Error('no #app');

const RADII = [
  ['--pix--r--xs', '2px', { width: 8, r: 2 }],
  ['--pix--r--sm', '4px', { width: 16, r: 4 }],
  ['--pix--r--md', '8px', { width: 24, r: 8 }],
  ['--pix--r--lg', '12px', { width: 32, r: 12 }],
  ['--pix--r--xl', '16px', { width: 40, r: 16 }],
  ['--pix--r--pill', '999px', { width: 48, r: 24 }],
];

const SPACINGS = [
  ['--pix--s--xs', '0.25rem (4px)'],
  ['--pix--s--sm', '0.5rem (8px)'],
  ['--pix--s--md', '1rem (16px)'],
  ['--pix--s--lg', '1.5rem (24px)'],
  ['--pix--s--xl', '2rem (32px)'],
  ['--pix--s--2xl', '3rem (48px)'],
];

const COLORS = [
  ['--pix--c--page', 'Page background', '#page-bg'],
  ['--pix--c--surface', 'Surface / card bg', '#surface-bg'],
  ['--pix--c--text', 'Primary text', '#text'],
  ['--pix--c--text-muted', 'Muted text', '#text-muted'],
  ['--pix--c--border', 'Subtle borders', '#border'],
  ['--pix--c--border-strong', 'Strong borders', '#border-strong'],
  ['--pix--c--accent', 'Accent / link', '#accent'],
  ['--pix--c--success', 'Success', '#success'],
  ['--pix--c--warning', 'Warning', '#warning'],
  ['--pix--c--danger', 'Danger', '#danger'],
];

const ELEVATIONS = [
  ['--pix--e--sm', '0 1px 3px ...'],
  ['--pix--e--md', '0 4px 12px ...'],
  ['--pix--e--lg', '0 8px 24px ...'],
];

const FOCUS = [
  ['--pix--f--width', '2px'],
  ['--pix--f--style', 'solid'],
  ['--pix--f--offset', '2px'],
];

const TYPOGRAPHY = [
  ['--pix--t--font-family', 'system-ui, -apple-system, …'],
  ['--pix--t--font-family-mono', 'ui-monospace, SF Mono, …'],
  ['--pix--t--line-height', '1.6'],
  ['--pix--t--line-height-tight', '1.2'],
];

const root = document.documentElement;
const gs = (name) => getComputedStyle(root).getPropertyValue(name).trim();

function table(headers, rows) {
  return `<table><thead><tr>${headers.map((h) => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.join('')}</tbody></table>`;
}

function tokenTable(tokens, valueFn) {
  return table(['Token', 'Value', 'Preview'], tokens.map(([token, label, _]) => {
    const val = valueFn ? valueFn(token) : gs(token);
    return `<tr><td><code>${token}</code></td><td>${typeof val === 'string' ? `<code>${val}</code>` : val}</td><td>${label || ''}</td></tr>`;
  }));
}

app.innerHTML = `
  <h1>pix-foundations</h1>
  <p>Design tokens for the pix-galaxy suite. Import via <code>@pix-galaxy/pix-foundations/foundations.css</code>.</p>
  <p>All tokens are defined on <code>:root</code> inside <code>@layer pix.foundations.*</code>. Color tokens use <code>light-dark()</code> for automatic light/dark mode support.</p>

  <h2>Radii (<code>--pix--r--*</code>)</h2>
  ${tokenTable(RADII)}

  <h2>Spacing (<code>--pix--s--*</code>)</h2>
  ${tokenTable(SPACINGS)}

  <h2>Colors (<code>--pix--c--*</code>)</h2>
  <p>All color tokens adapt to light/dark color scheme via <code>light-dark()</code>.</p>
  ${table(['Token', 'Description', 'Value (light → dark)'], COLORS.map(([token, desc]) => {
    const val = gs(token);
    return `<tr><td><code>${token}</code></td><td>${desc}</td><td><code>${val}</code></td></tr>`;
  }))}

  <h2>Elevations (<code>--pix--e--*</code>)</h2>
  ${tokenTable(ELEVATIONS)}

  <h2>Focus (<code>--pix--f--*</code>)</h2>
  <p>Applied globally via <code>:focus-visible</code> to all interactive elements.</p>
  ${tokenTable(FOCUS)}

  <h2>Typography (<code>--pix--t--*</code>)</h2>
  ${tokenTable(TYPOGRAPHY)}
`;
