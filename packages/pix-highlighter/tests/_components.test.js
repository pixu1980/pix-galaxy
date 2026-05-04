import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { before, beforeEach, describe, test } from 'node:test';

import {
  disableHighlightSupport,
  enableHighlightSupport,
  getClipboardText,
  resetDom,
  setupDom,
  stubClipboard,
} from './_mocks.js';

setupDom();

let PixHighlighter;
let PIX_HIGHLIGHTER_THEME_OPTIONS;
let enhancePixHighlighters;
let normalizeLang;
let lexJS;
let lexTS;
let lexCSS;
let lexJSON;
let lexHTML;
let lexPython;
let lexRust;
let lexC;
let lexCPP;
let lexPHP;
let lexCSharp;
let lexGo;
let lexMarkdown;
let lexYAML;
let lexBash;

function createPseudoInstance({ code = 'const answer = 42;', lang = 'js' } = {}) {
  const host = document.createElement('pre');
  host.setAttribute('is', 'pix-highlighter');
  host.setAttribute('lang', lang);

  const codeElement = document.createElement('code');
  codeElement.textContent = code;
  host.appendChild(codeElement);
  document.body.appendChild(host);

  enhancePixHighlighters(document);
  return host;
}

function createPseudoInstanceWithMarkup({
  code = 'const answer = 42;',
  lang = 'js',
  trim,
  codeTrim,
} = {}) {
  const host = document.createElement('pre');
  host.setAttribute('is', 'pix-highlighter');
  host.setAttribute('lang', lang);

  trim !== undefined && host.setAttribute('data-trim', trim);

  const codeElement = document.createElement('code');
  codeTrim !== undefined && codeElement.setAttribute('data-trim', codeTrim);
  codeElement.textContent = code;
  host.appendChild(codeElement);
  document.body.appendChild(host);

  enhancePixHighlighters(document);
  return host;
}

function ensureTokens(lexer, code) {
  const tokens = lexer(code);
  assert.ok(tokens.length > 0, 'expected some tokens');

  for (const token of tokens.slice(0, 10)) {
    assert.equal(typeof token.type, 'string');
    assert.ok(Number.isInteger(token.start));
    assert.ok(Number.isInteger(token.end));
    assert.ok(token.end >= token.start);
  }
}

function dispatchKey(target, key, options = {}) {
  target.dispatchEvent(
    new window.KeyboardEvent('keydown', {
      bubbles: true,
      cancelable: true,
      key,
      ...options,
    })
  );
}

before(async () => {
  const mod = await import(new URL(`../src/index.js?component-test=${Date.now()}`, import.meta.url));

  ({
    PixHighlighter,
    PIX_HIGHLIGHTER_THEME_OPTIONS,
    enhancePixHighlighters,
    normalizeLang,
    lexJS,
    lexTS,
    lexCSS,
    lexJSON,
    lexHTML,
    lexPython,
    lexRust,
    lexC,
    lexCPP,
    lexPHP,
    lexCSharp,
    lexGo,
    lexMarkdown,
    lexYAML,
    lexBash,
  } = mod);
});

beforeEach(() => {
  enableHighlightSupport();
  stubClipboard();
  resetDom(PixHighlighter);
});

describe('PixHighlighter', () => {
  test('maps language aliases used in content', () => {
    assert.equal(normalizeLang('javascript'), 'js');
    assert.equal(normalizeLang('JS'), 'js');
    assert.equal(normalizeLang('yaml'), 'yml');
    assert.equal(normalizeLang('shell'), 'bash');
    assert.equal(normalizeLang('scss'), 'css');
    assert.equal(normalizeLang('zsh'), 'bash');
    assert.equal(normalizeLang(''), 'js');
  });

  test('applies a theme without treating the dataset assignment as callable', () => {
    assert.doesNotThrow(() => {
      PixHighlighter.applyTheme('default', { persist: false, syncInstances: false });
    });

    assert.equal(document.documentElement.dataset.pixHighlighterTheme, 'default');
    assert.equal(window.localStorage.getItem('pix-highlighter-theme'), null);
  });

  test('registers shared highlight names and installs component styles', () => {
    createPseudoInstance({ code: 'const answer = 42; // comment', lang: 'js' });

    assert.equal(document.adoptedStyleSheets.length, 1);
    assert.ok(globalThis.CSS.highlights.has('pix-kw'));
    assert.ok(globalThis.CSS.highlights.has('pix-num'));
    assert.ok(globalThis.CSS.highlights.has('pix-com'));
    assert.equal(globalThis.CSS.highlights.get('pix-kw').ranges.length, 1);
  });

  test('keeps theme selection centralized across instances', () => {
    const first = createPseudoInstance({ code: 'const first = true;', lang: 'js' });
    const second = createPseudoInstance({ code: '<div>hi</div>', lang: 'html' });
    const firstPrismOption = first.querySelector(
      'button[data-pix-highlighter-theme-option="prism"]'
    );
    const firstThemeValue = first.querySelector('[data-pix-highlighter-theme-value]');
    const secondThemeValue = second.querySelector('[data-pix-highlighter-theme-value]');

    assert.equal(firstThemeValue.textContent, 'Default');
    assert.equal(secondThemeValue.textContent, 'Default');
    assert.equal(PIX_HIGHLIGHTER_THEME_OPTIONS.length, 10);

    firstPrismOption.click();

    assert.equal(document.documentElement.dataset.pixHighlighterTheme, 'prism');
    assert.equal(window.localStorage.getItem('pix-highlighter-theme'), 'prism');
    assert.equal(secondThemeValue.textContent, 'Prism');
  });

  test('trims surrounding whitespace by default like highlight.js data-trim', async () => {
    const instance = createPseudoInstanceWithMarkup({
      code: '\n    const greeting = formatMessage("pix-galaxy");\n',
      lang: 'js',
    });
    const code = instance.querySelector('code');
    const copyButton = instance.querySelector('button[data-pix-highlighter-copy]');

    assert.equal(code.textContent, 'const greeting = formatMessage("pix-galaxy");');

    copyButton.click();
    await Promise.resolve();
    await Promise.resolve();

    assert.equal(getClipboardText(), 'const greeting = formatMessage("pix-galaxy");');
  });

  test('dedents multi-line code while preserving relative indentation when data-trim is enabled', async () => {
    const instance = createPseudoInstanceWithMarkup({
      code:
        '\n' +
        '                const theme = "default";\n' +
        '                \n' +
        '                function renderDocs(theme) {\n' +
        '                  // re-render docs with the selected theme\n' +
        '                  ...\n' +
        '                }\n' +
        '                \n' +
        '                renderDocs(theme);\n' +
        '              ',
      lang: 'js',
    });
    const code = instance.querySelector('code');
    const copyButton = instance.querySelector('button[data-pix-highlighter-copy]');
    const expected =
      'const theme = "default";\n' +
      '\n' +
      'function renderDocs(theme) {\n' +
      '  // re-render docs with the selected theme\n' +
      '  ...\n' +
      '}\n' +
      '\n' +
      'renderDocs(theme);';

    assert.equal(code.textContent, expected);

    copyButton.click();
    await Promise.resolve();
    await Promise.resolve();

    assert.equal(getClipboardText(), expected);
  });

  test('preserves surrounding whitespace when data-trim is false', () => {
    const instance = createPseudoInstanceWithMarkup({
      code: '\n    const greeting = formatMessage("pix-galaxy");\n',
      lang: 'js',
      trim: 'false',
    });

    assert.equal(
      instance.querySelector('code').textContent,
      '\n    const greeting = formatMessage("pix-galaxy");\n'
    );

    const codeOverrideInstance = createPseudoInstanceWithMarkup({
      code: '\n    const second = true;\n',
      lang: 'js',
      trim: 'true',
      codeTrim: 'false',
    });

    assert.equal(codeOverrideInstance.querySelector('code').textContent, '\n    const second = true;\n');
  });

  test('renders theme trigger as details summary dropdown in a document-level floating layer', () => {
    const instance = createPseudoInstance({ code: 'const portal = true;', lang: 'js' });
    const themePicker = instance.querySelector('details[data-pix-highlighter-theme-picker]');
    const themeSummary = themePicker?.querySelector('summary');
    const copyButton = instance.querySelector('button[data-pix-highlighter-copy]');
    const themeList = instance.querySelector('section[data-pix-highlighter-theme-list]');
    const themeMenu = themeList?.querySelector('menu');

    assert.equal(themePicker?.tagName, 'DETAILS');
    assert.equal(themeSummary?.tagName, 'SUMMARY');
    assert.equal(copyButton?.tagName, 'BUTTON');
    assert.equal(themeList?.tagName, 'SECTION');
    assert.equal(themeMenu?.tagName, 'MENU');

    themeSummary.click();

    const floatingLayer = document.querySelector('[data-pix-highlighter-floating-layer]');

    assert.ok(floatingLayer);
    assert.equal(themeList.parentElement, floatingLayer);
    assert.equal(themeList.hidden, false);
    assert.equal(themePicker.open, true);
    assert.equal(themeSummary.getAttribute('aria-expanded'), 'true');

    themeSummary.click();

    assert.equal(themeList.parentElement, instance.querySelector('[data-pix-highlighter-toolbar]'));
    assert.equal(themeList.hidden, true);
    assert.equal(themePicker.open, false);
    assert.equal(themeSummary.getAttribute('aria-expanded'), 'false');
  });

  test('supports dropdown keyboard navigation for theme menu', () => {
    const instance = createPseudoInstance({ code: 'const keys = true;', lang: 'js' });
    const themePicker = instance.querySelector('details[data-pix-highlighter-theme-picker]');
    const themeSummary = themePicker.querySelector('summary');
    const themeOptions = Array.from(
      instance.querySelectorAll('button[data-pix-highlighter-theme-option]')
    );
    const defaultOption = themeOptions.find(
      (button) => button.dataset.pixHighlighterThemeOption === 'default'
    );
    const prismOption = themeOptions.find(
      (button) => button.dataset.pixHighlighterThemeOption === 'prism'
    );

    themeSummary.focus();
    dispatchKey(themeSummary, 'ArrowDown');

    assert.equal(document.activeElement, defaultOption);
    assert.equal(themePicker.open, true);
    assert.equal(themeSummary.getAttribute('aria-expanded'), 'true');

    dispatchKey(defaultOption, 'ArrowDown');
    assert.equal(document.activeElement, prismOption);

    dispatchKey(prismOption, 'Home');
    assert.equal(document.activeElement, themeOptions[0]);

    dispatchKey(themeOptions[0], 'End');
    assert.equal(document.activeElement, themeOptions.at(-1));

    dispatchKey(themeOptions.at(-1), 'Escape');
    assert.equal(document.activeElement, themeSummary);
    assert.equal(themePicker.open, false);
    assert.equal(themeSummary.getAttribute('aria-expanded'), 'false');
  });

  test('copies the current code block content', async () => {
    const instance = createPseudoInstance({ code: 'const copied = true;', lang: 'js' });
    const copyButton = instance.querySelector('button[data-pix-highlighter-copy]');

    copyButton.click();
    await Promise.resolve();
    await Promise.resolve();

    assert.equal(getClipboardText(), 'const copied = true;');
    assert.equal(copyButton.dataset.copyState, 'copied');
    assert.ok(copyButton.querySelector('svg'));
  });

  test('renders token spans when the highlight API is unavailable', () => {
    disableHighlightSupport();

    const instance = createPseudoInstance({ code: 'const plain = true;', lang: 'js' });

    assert.ok(instance.querySelector('.pix-token--kw'));
    assert.equal(document.adoptedStyleSheets.length, 1);
  });

  test('keeps lexer coverage across supported languages', () => {
    ensureTokens(lexJS, 'const x = 42; // comment');
    ensureTokens(lexTS, 'interface Box { value: number }');
    ensureTokens(lexCSS, 'body { color: red; }');
    ensureTokens(lexHTML, '<div class="x">Hi</div>');
    ensureTokens(lexJSON, '{"a":1,"b":[true,false,null]}');
    ensureTokens(lexMarkdown, '# Title\n\nSome **bold** `code`');
    ensureTokens(lexBash, 'echo "hello" && ls -la');
    ensureTokens(lexPython, 'def f(x):\n    return x + 1');
    ensureTokens(lexGo, 'package main\nfunc main(){println("hi")}');
    ensureTokens(lexRust, 'fn main(){ let x: i32 = 5; }');
    ensureTokens(lexC, 'int main(){ return 0; }');
    ensureTokens(lexCPP, 'int main(){ std::string s; }');
    ensureTokens(lexPHP, '<?php echo $x + 1; // comment');
    ensureTokens(lexCSharp, 'class X { int Y => 1; }');
    ensureTokens(lexYAML, 'a: 1\nlist:\n  - item');
  });

  test('ships self-contained component CSS and tokenized style assets', async () => {
    const themeFiles = [
      '_default.css',
      '_prism.css',
      '_prettylights.css',
      '_darcula.css',
      '_cyberpunk.css',
      '_aurora.css',
      '_atlas.css',
      '_ember.css',
      '_paper.css',
      '_tide.css',
    ];
    const [componentSource, constantsSource, componentCss, tokensCss, ...themeSources] = await Promise.all([
      readFile(new URL('../src/components/PixHighlighter/PixHighlighter.js', import.meta.url), 'utf8'),
      readFile(new URL('../src/components/PixHighlighter/PixHighlighter.const.js', import.meta.url), 'utf8'),
      readFile(new URL('../src/components/PixHighlighter/PixHighlighter.css', import.meta.url), 'utf8'),
      readFile(new URL('../src/components/PixHighlighter/styles/_ds-tokens.css', import.meta.url), 'utf8'),
      ...themeFiles.map((file) =>
        readFile(new URL(`../src/components/PixHighlighter/styles/themes/${file}`, import.meta.url), 'utf8')
      ),
    ]);

    assert.ok(constantsSource.includes("import designSystemCSS from './styles/_ds-tokens.css';"));
    assert.ok(constantsSource.includes("import mainCSS from './PixHighlighter.css';"));
    assert.ok(componentSource.includes('registry.define("pix-highlighter", this, { extends: "pre" });'));
    assert.ok(componentCss.includes('--pix-ds-radius-lg'));
    assert.ok(componentCss.includes('::highlight(pix-kw)'));
    assert.ok(componentCss.includes('[data-pix-highlighter-floating-layer]'));
    assert.ok(componentCss.includes('details[data-pix-highlighter-theme-picker] > summary'));
    assert.ok(componentCss.includes('[data-pix-highlighter-theme-list] menu'));
    assert.ok(!componentCss.includes('backdrop-filter'));
    assert.ok(!componentCss.includes('@import'));
    assert.ok(tokensCss.includes('--pix-ds-color-ink-950'));
    assert.ok(tokensCss.includes('--pix-ds-elevation-2'));
    assert.ok(tokensCss.includes('--pix-ds-duration-fast'));

    themeSources.forEach((source, index) => {
      assert.ok(source.includes('light-dark('), `theme ${themeFiles[index]} should use light-dark()`);
    });
  });
});
