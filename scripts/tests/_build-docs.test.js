// @ts-check
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildDocsPages,
  buildExamplesGallery,
  renderPackageDocsHtml,
  renderPackageDocsScript,
  renderPackageDocsStyles,
  renderRootIndex,
  resolvePackages,
} from '../_build-docs.js';
import { renderPackageDocsTokens } from '../_docs/index.js';

test('resolvePackages returns all packages when no target is set', () => {
  assert.deepEqual(resolvePackages(['pix-button', 'pix-card'], null), ['pix-button', 'pix-card']);
});

test('resolvePackages throws when target package is missing', () => {
  assert.throws(() => resolvePackages(['pix-button'], 'pix-card'), /package not found/u);
});

test('renderRootIndex includes package links', () => {
  const html = renderRootIndex([
    { folder: 'pix-button', packageName: '@pix-galaxy/pix-button' },
  ]);

  assert.match(html, /@pix-galaxy\/pix-button/u);
  assert.match(html, /\.\/pix-button\//u);
});

test('buildDocsPages renders fenced code blocks as pix-highlighter elements', () => {
  const pages = buildDocsPages([
    {
      markdown: '# Getting Started\n\n```js\nconst ready = true;\n```\n',
      sourcePath: 'packages/pix-button/docs/content/getting-started.md',
    },
  ]);

  assert.equal(pages.length, 1);
  assert.equal(pages[0].slug, 'getting-started');
  assert.equal(pages[0].title, 'Getting Started');
  assert.match(pages[0].html, /<pre is="pix-highlighter" data-lang="js"><code>const ready = true;\n?<\/code><\/pre>/u);
});

test('buildExamplesGallery derives example cards from examples markdown headings', () => {
  const examplesMarkdown = [
    '# Examples',
    '',
    '## Variants',
    '',
    'Use default and secondary variants.',
    '',
    '```html',
    '<pix-button>Primary</pix-button>',
    '```',
    '',
  ].join('\n');

  const examples = buildExamplesGallery(examplesMarkdown);

  assert.equal(examples.length, 1);
  assert.equal(examples[0].title, 'Variants');
  assert.equal(examples[0].lang, 'html');
  assert.equal(examples[0].description, 'Use default and secondary variants.');
  assert.match(examples[0].code, /<pix-button>Primary<\/pix-button>/u);
});

test('renderPackageDocsHtml embeds docs app shell and serialized payload', () => {
  const html = renderPackageDocsHtml({
    packageName: '@pix-galaxy/pix-button',
    tagName: 'pix-button',
    description: 'Accessible button Web Component.',
    docs: [
      {
        slug: 'getting-started',
        title: 'Getting Started',
        html: '<p>hello</p>',
        sourcePath: 'packages/pix-button/docs/content/getting-started.md',
      },
    ],
    examples: [
      {
        title: 'Variants',
        description: 'Use default and secondary variants.',
        lang: 'html',
        code: '<pix-button>Primary</pix-button>',
      },
    ],
    meta: {
      version: '0.0.1',
      releaseTag: 'v0.0.1',
    },
    highlighterModulePath: '../pix-highlighter/dist/index.js',
    colorSchemeSwitcherModulePath: '../pix-color-scheme-switcher/dist/index.js',
  });

  assert.match(html, /<title>@pix-galaxy\/pix-button docs<\/title>/u);
  assert.match(html, /<div id="app"><\/div>/u);
  assert.match(html, /<script type="module" src="\.\/index\.js"><\/script>/u);
  assert.match(html, /<script type="application\/json" id="pix-docs-data">/u);
  assert.match(html, /"highlighterModulePath":"\.\.\/pix-highlighter\/dist\/index\.js"/u);
  assert.match(html, /"colorSchemeSwitcherModulePath":"\.\.\/pix-color-scheme-switcher\/dist\/index\.js"/u);
});

test('renderPackageDocsScript and styles expose shared docs template assets', () => {
  const css = renderPackageDocsStyles();
  const js = renderPackageDocsScript();
  const tokens = renderPackageDocsTokens();

  assert.match(css, /\.docs-shell/u);
  assert.match(css, /\.docs-hero/u);
  assert.doesNotMatch(css, /\.docs-color-mode-group/u);
  assert.match(js, /function createDocsSite/u);
  assert.match(js, /pix-docs-data/u);
  assert.match(js, /colorSchemeSwitcherModulePath/u);
  assert.match(js, /pix-color-scheme-switcher/u);
  assert.doesNotMatch(js, /data-site-color-mode/u);
  assert.match(tokens, /--pix-ds-font-display/u);
});
