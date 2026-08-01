import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { beforeEach, test } from 'node:test';
import { JSDOM } from 'jsdom';

import { createDocsSite } from '../docs/index.js';

let dom;
let mount;

beforeEach(() => {
  dom = new JSDOM('<!doctype html><html><body><div id="app"></div></body></html>', {
    url: 'https://pix-highlighter.test/',
  });
  mount = dom.window.document.querySelector('#app');
});

test('renders the docs shell and updates active doc/theme interactions', () => {
  const afterRenderCalls = [];
  const selectedThemes = [];
  const app = createDocsSite({
    mount,
    docs: [
      {
        slug: 'getting-started',
        title: 'Getting Started',
        html: '<h1>Getting Started</h1><p>hello</p>',
        sourcePath: 'src/docs/content/getting-started.md',
      },
      {
        slug: 'api',
        title: 'API',
        html: '<h1>API</h1><p>exports</p>',
        sourcePath: 'src/docs/content/api.md',
      },
    ],
    examples: [
      {
        title: 'One',
        description: 'Example card',
        lang: 'js',
        code: 'const ready = true;',
      },
    ],
    meta: {
      version: '0.1.0',
      releaseTag: 'v0.1.0',
    },
    themeOptions: [
      { value: 'default', label: 'Default' },
      { value: 'prism', label: 'Prism' },
    ],
    onThemeChange(theme) {
      selectedThemes.push(theme);
    },
    afterRender(root, activeDoc) {
      afterRenderCalls.push({ root, activeDoc });
    },
  });

  assert.ok(mount.querySelector('[data-part="shell"]'));
  assert.equal(
    mount.querySelectorAll('input[data-site-color-mode][name="docs-color-mode"]').length,
    3
  );
  assert.equal(dom.window.document.documentElement.dataset.siteColorMode, 'system');
  assert.equal(mount.querySelector('[data-part="markdown"] h1').textContent, 'Getting Started');
  assert.equal(afterRenderCalls.length, 1);

  mount.querySelector('[data-site-theme="prism"]').click();

  assert.deepEqual(selectedThemes, ['prism']);
  assert.ok(mount.querySelector('[data-site-theme="prism"]').hasAttribute('data-active'));

  app.selectDoc('api');

  assert.equal(app.getActiveDoc().slug, 'api');
  assert.equal(mount.querySelector('[data-part="markdown"] h1').textContent, 'API');
  assert.equal(afterRenderCalls.at(-1).activeDoc.slug, 'api');
});

test('persists and applies docs light-dark system mode through native radio controls', () => {
  createDocsSite({
    mount,
    docs: [
      {
        slug: 'getting-started',
        title: 'Getting Started',
        html: '<p>hello</p>',
        sourcePath: 'src/docs/content/getting-started.md',
      },
    ],
    examples: [],
    meta: {
      version: '0.1.0',
      releaseTag: 'v0.1.0',
    },
    themeOptions: [{ value: 'default', label: 'Default' }],
  });

  const darkRadio = mount.querySelector('input[data-site-color-mode][value="dark"]');

  darkRadio.checked = true;
  darkRadio.dispatchEvent(new dom.window.Event('change', { bubbles: true }));

  assert.equal(dom.window.document.documentElement.dataset.siteColorMode, 'dark');
  assert.equal(dom.window.localStorage.getItem('pix-highlighter-site-color-mode'), 'dark');
});

test('docs bootstrap imports library entrypoint instead of self-importing docs module', async () => {
  const docsSource = await readFile(new URL('../docs/index.js', import.meta.url), 'utf8');

  assert.match(docsSource, /await import\(\s*'\.\.\/index\.js'\s*\)/u);
  assert.doesNotMatch(docsSource, /await import\(\s*'\.\/index\.js'\s*\)/u);
});

test('docs html declares an inline favicon to avoid runtime 404 noise', async () => {
  const htmlSource = await readFile(new URL('../docs/index.html', import.meta.url), 'utf8');

  assert.match(htmlSource, /<link\s+rel="icon"\s+href="data:image\/svg\+xml,[^"]+"\s*\/?>/u);
});
