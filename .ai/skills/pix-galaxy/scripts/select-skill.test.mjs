// @ts-check

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { selectSkill } from './select-skill.mjs';

const currentFile = fileURLToPath(import.meta.url);
const registryPath = path.join(path.dirname(currentFile), '../assets/registry.json');

/**
 * @returns {Promise<any>}
 */
const loadRegistry = async () => {
  const raw = await readFile(registryPath, 'utf8');
  return JSON.parse(raw);
};

test('routes to pix-styleguides with high confidence from prompt matches', async () => {
  const registry = await loadRegistry();
  const result = selectSkill(
    registry,
    'Review semantic html and css architecture for accessibility and consistency',
    ['docs/index.html', 'src/styles.css'],
    'review'
  );

  assert.equal(result.selectedSkill, 'pix-styleguides');
  assert.equal(result.confidence, 'high');
  assert.equal(result.fallbackUsed, false);
});

test('falls back when confidence is below minimum threshold', async () => {
  const registry = await loadRegistry();
  const result = selectSkill(registry, 'do something generic');

  assert.equal(result.selectedSkill, registry.defaultSkill);
  assert.equal(result.fallbackUsed, true);
  assert.equal(result.confidence, 'low');
});

test('uses file extension signals when prompt text is weak', async () => {
  const registry = await loadRegistry();
  const result = selectSkill(registry, 'quick cleanup', ['README.md', 'site/config.json']);

  assert.equal(result.selectedSkill, 'pix-styleguides');
  assert.equal(result.fallbackUsed, false);
});

test('uses operation signal when operation is provided', async () => {
  const registry = await loadRegistry();
  const result = selectSkill(registry, 'small task', [], 'lint');

  assert.equal(result.selectedSkill, 'pix-styleguides');
  assert.equal(result.fallbackUsed, false);
});

test('breaks ties by explicit priority, then by name', async () => {
  const registry = await loadRegistry();
  registry.skills.push({
    name: 'pix-secondary',
    priority: 10,
    description: 'Secondary test skill',
    triggers: {
      keywords: ['styleguide'],
      regex: [],
      fileExtensions: [],
      operations: [],
      intents: []
    }
  });

  const result = selectSkill(registry, 'styleguide');

  assert.equal(result.selectedSkill, 'pix-styleguides');
});

test('routes to pix-template-engine for template engine + SSR requests', async () => {
  const registry = await loadRegistry();
  const result = selectSkill(
    registry,
    'Install a template engine for SSR and static site generation with include and extends support',
    ['templates/layout.html', 'scripts/build.mjs'],
    'install'
  );

  assert.equal(result.selectedSkill, 'pix-template-engine');
  assert.equal(result.fallbackUsed, false);
});

test('supports /pix-galaxy command prefix and routes from remaining prompt', async () => {
  const registry = await loadRegistry();
  const result = selectSkill(
    registry,
    '/pix-galaxy install template engine for ssg and ssr',
    ['templates/base.html', 'scripts/build.mjs'],
    'install'
  );

  assert.equal(result.slashCommandUsed, true);
  assert.equal(result.routedPrompt, 'install template engine for ssg and ssr');
  assert.equal(result.selectedSkill, 'pix-template-engine');
  assert.equal(result.recommendedSkills.length > 0, true);
  assert.equal(result.recommendedSkills[0].name, 'pix-template-engine');
});

test('routes to pix-a11y for WCAG 2.2 AA and axe-core integration requests', async () => {
  const registry = await loadRegistry();
  const result = selectSkill(
    registry,
    '/pix-galaxy integrate axe-core accessibility tests and generate wcag 2.2 aa report',
    ['src/page.html', 'scripts/a11y.mjs'],
    'audit'
  );

  assert.equal(result.selectedSkill, 'pix-a11y');
  assert.equal(result.fallbackUsed, false);
  assert.equal(result.slashCommandUsed, true);
});

test('routes to pix-design-system for design system foundations requests', async () => {
  const registry = await loadRegistry();
  const result = selectSkill(
    registry,
    '/pix-galaxy create a design system with typography spacing radii elevations colors and css variables',
    ['src/styles/tokens.css', 'docs/design-system.md'],
    'scaffold'
  );

  assert.equal(result.selectedSkill, 'pix-design-system');
  assert.equal(result.fallbackUsed, false);
  assert.equal(result.slashCommandUsed, true);
});

test('routes to pix-custom-element for scaffolding a customized built-in element', async () => {
  const registry = await loadRegistry();
  const result = selectSkill(
    registry,
    '/pix-galaxy scaffold a new custom element PixDetails extending HTMLDetailsElement with adoptedStyleSheets and componentDecorator',
    ['src/components/PixDetails/pix-details.js'],
    'scaffold'
  );

  assert.equal(result.selectedSkill, 'pix-custom-element');
  assert.equal(result.fallbackUsed, false);
  assert.equal(result.slashCommandUsed, true);
});

test('routes to pix-custom-element for autonomous web component requests', async () => {
  const registry = await loadRegistry();
  const result = selectSkill(
    registry,
    '/pix-galaxy create a new web component pix-card that extends HTMLElement and registers in customElements.define',
    ['src/components/PixCard/pix-card.js'],
    'create'
  );

  assert.equal(result.selectedSkill, 'pix-custom-element');
  assert.equal(result.fallbackUsed, false);
});

test('routes to pix-color-scheme-switcher for persisted theme controls', async () => {
  const registry = await loadRegistry();
  const result = selectSkill(
    registry,
    '/pix-galaxy add a light dark system color scheme switcher with persisted preference and prefers-color-scheme fallback',
    ['src/components/ColorSchemeSwitcher/pix-color-scheme-switcher.js'],
    'add'
  );

  assert.equal(result.selectedSkill, 'pix-color-scheme-switcher');
  assert.equal(result.fallbackUsed, false);
  assert.equal(result.slashCommandUsed, true);
});

test('routes data-color-scheme theme toggle work to pix-color-scheme-switcher', async () => {
  const registry = await loadRegistry();
  const result = selectSkill(
    registry,
    'Create a theme toggle that updates data-color-scheme and meta color-scheme',
    ['src/styles/theme.css', 'src/main.js'],
    'create'
  );

  assert.equal(result.selectedSkill, 'pix-color-scheme-switcher');
  assert.equal(result.fallbackUsed, false);
});

test('keeps generic CSS styleguide cleanup on pix-styleguides', async () => {
  const registry = await loadRegistry();
  const result = selectSkill(
    registry,
    '/pix-galaxy review css architecture and fix styleguide issues',
    ['src/styles.css'],
    'review'
  );

  assert.equal(result.selectedSkill, 'pix-styleguides');
  assert.equal(result.fallbackUsed, false);
});

test('routes repository governance and changelog work to pix-styleguides', async () => {
  const registry = await loadRegistry();
  const result = selectSkill(
    registry,
    '/pix-galaxy add contributing guide codeowners funding config and changelog generation from conventional commits',
    ['CONTRIBUTING.md', '.github/CODEOWNERS', '.github/FUNDING.yml', 'CHANGELOG.md'],
    'setup'
  );

  assert.equal(result.selectedSkill, 'pix-styleguides');
  assert.equal(result.fallbackUsed, false);
  assert.equal(result.slashCommandUsed, true);
});
