import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { beforeEach, test } from 'node:test';
import { JSDOM } from 'jsdom';

// jsdom globals must exist BEFORE pix-core docs-site.js is imported: the
// shared template registers @pix-galaxy/pix-color-scheme-selector at module
// scope, which requires HTMLElement at load time.
const bootDom = new JSDOM('<!doctype html><html><body></body></html>', {
  url: 'https://pix-highlighter.test/',
  pretendToBeVisual: true,
});
globalThis.window = bootDom.window;
globalThis.document = bootDom.window.document;
globalThis.HTMLElement = bootDom.window.HTMLElement;
globalThis.customElements = bootDom.window.customElements;
globalThis.CSSStyleSheet = bootDom.window.CSSStyleSheet;
if (!document.adoptedStyleSheets) document.adoptedStyleSheets = [];

let createDocsSite;
let dom;
let mount;

beforeEach(async () => {
  dom = new JSDOM('<!doctype html><html><body><div id="app"></div></body></html>', {
    url: 'https://pix-highlighter.test/',
  });
  mount = dom.window.document.querySelector('#app');
  // Dynamic import AFTER jsdom globals are set (pix-core docs template pulls
  // in @pix-galaxy/pix-color-scheme-selector which needs HTMLElement).
  const mod = await import('@pix-galaxy/pix-core/docs/docs-site.js');
  createDocsSite = mod.createDocsSite;
});

test('renders the docs shell and updates active doc', () => {
  const afterRenderCalls = [];
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
      componentName: 'pix-highlighter',
      componentTag: 'pre[is="pix-highlighter"]',
      releaseTag: 'v0.1.0',
    },
    afterRender(root, activeDoc) {
      afterRenderCalls.push({ root, activeDoc });
    },
  });

  assert.ok(mount.querySelector('[data-part="shell"]'));
  assert.ok(mount.querySelector('pix-color-scheme-selector'));
  assert.equal(mount.querySelector('[data-part="markdown"] h1').textContent, 'Getting Started');
  assert.equal(afterRenderCalls.length, 1);

  app.selectDoc('api');

  assert.equal(app.getActiveDoc().slug, 'api');
  assert.equal(mount.querySelector('[data-part="markdown"] h1').textContent, 'API');
  assert.equal(afterRenderCalls.at(-1).activeDoc.slug, 'api');
});

test('docs shell embeds the shared color-scheme-selector', () => {
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
  });

  // Theme switching is delegated to the shared color-scheme-selector
  // component (ADR-007); the docs shell must embed it.
  const selector = mount.querySelector('pix-color-scheme-selector');
  assert.ok(selector, 'docs shell must include pix-color-scheme-selector');
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
