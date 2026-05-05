// @ts-check

import { readFileSync } from 'node:fs';

const docsDirectoryUrl = new URL('.', import.meta.url);

const docsAssetSource = Object.freeze({
  styles: readFileSync(new URL('./_docs-template.css', docsDirectoryUrl), 'utf8'),
  script: readFileSync(new URL('./_docs-template.js', docsDirectoryUrl), 'utf8'),
  tokens: readFileSync(new URL('./_docs-tokens.css', docsDirectoryUrl), 'utf8'),
});

/**
 * @returns {string}
 */
export function renderPackageDocsStyles() {
  return docsAssetSource.styles;
}

/**
 * @returns {string}
 */
export function renderPackageDocsScript() {
  return docsAssetSource.script;
}

/**
 * @returns {string}
 */
export function renderPackageDocsTokens() {
  return docsAssetSource.tokens;
}
