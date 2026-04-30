# pix-design-system Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the repo-local `pix-design-system` skill with reusable assets, installer scripts, examples, docs, prompts, instructions, orchestration, and tests.

**Architecture:** Add a self-contained skill under `.github/skills/pix-design-system/`. Keep the skill body concise, place detailed design system guidance in `references/`, store copyable starters and examples in `assets/`, and use one Node ESM installer to copy and customize starters into target projects. Update the pix Galaxy registry so design system prompts route to the new skill without breaking generic styleguide routing.

**Tech Stack:** Native CSS, Node.js ESM, `node:test`, JSON registry, GitHub prompt and instruction markdown files.

---

## File Structure

- Create `.github/skills/pix-design-system/SKILL.md`: skill trigger metadata, workflow, resources, and completion criteria.
- Create `.github/skills/pix-design-system/references/FOUNDATIONS.md`: typography, spacing, radii, elevations, and colors.
- Create `.github/skills/pix-design-system/references/ARCHITECTURE.md`: CSS layers, token hierarchy, file layout, and maintenance rules.
- Create `.github/skills/pix-design-system/references/USAGE.md`: installer CLI usage and workflows.
- Create `.github/skills/pix-design-system/references/EXAMPLES.md`: guide to bundled examples.
- Create `.github/skills/pix-design-system/scripts/install-design-system.mjs`: fail-safe installer.
- Create `.github/skills/pix-design-system/scripts/install-design-system.test.mjs`: installer tests.
- Create `.github/skills/pix-design-system/assets/design-system/app/**`: app-mode starter files copied to target root.
- Create `.github/skills/pix-design-system/assets/design-system/package/**`: package-mode starter files copied to package destination.
- Create `.github/skills/pix-design-system/assets/examples/app-basic/**`: app installation example.
- Create `.github/skills/pix-design-system/assets/examples/package-basic/**`: package installation example.
- Create `.github/skills/pix-design-system/assets/examples/web-component-theme/**`: custom element theming example.
- Create `.github/skills/pix-design-system/assets/examples/docs-site/**`: optional static docs site scaffold.
- Create `.github/prompts/pix-design-system.prompt.md`: prompt entrypoint.
- Create `.github/instructions/pix-design-system.instructions.md`: GitHub instructions entrypoint.
- Modify `.github/skills/pix-galaxy/SKILL.md`: add the routed skill to resources and targets.
- Modify `.github/skills/pix-galaxy/assets/registry.json`: add registry object for `pix-design-system`.
- Modify `.github/skills/pix-galaxy/scripts/select-skill.test.mjs`: add routing tests.

## Shared Defaults

Use these defaults in script, docs, and templates:

```text
mode: app
target: current working directory
brandName: pix Design System
accent: #3f6df6
font: Aptos, "Avenir Next", "Helvetica Neue", sans-serif
radius: comfortable
density: comfortable
packageName: @pix-galaxy/pix-design-system
packageDest: packages/pix-design-system
docsSiteDest: docs/design-system-site
layers: reset, foundations, layout, components, helpers
```

Use these replacement tokens in every asset template that needs customization:

```text
__BRAND_NAME__
__ACCENT__
__FONT__
__RADIUS__
__DENSITY__
__PACKAGE_NAME__
```

---

### Task 1: Installer Test Coverage

**Files:**
- Create: `.github/skills/pix-design-system/scripts/install-design-system.test.mjs`
- Create later: `.github/skills/pix-design-system/scripts/install-design-system.mjs`

- [ ] **Step 1: Write failing installer tests**

Create `.github/skills/pix-design-system/scripts/install-design-system.test.mjs` with this test coverage:

```js
// @ts-check

import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const currentFile = fileURLToPath(import.meta.url);
const skillRoot = path.resolve(path.dirname(currentFile), '..');
const scriptPath = path.join(skillRoot, 'scripts', 'install-design-system.mjs');

const createTarget = async () => {
  return mkdtemp(path.join(os.tmpdir(), 'pix-design-system-'));
};

const runInstaller = (target, args = []) => {
  return spawnSync(process.execPath, [scriptPath, '--target', target, ...args], {
    cwd: target,
    encoding: 'utf8',
  });
};

const readTargetFile = (target, relativePath) => {
  return readFile(path.join(target, relativePath), 'utf8');
};

test('installs app design system by default', async () => {
  const target = await createTarget();
  const result = runInstaller(target);

  assert.equal(result.status, 0, result.stderr);

  const indexCss = await readTargetFile(target, 'src/styles/index.css');
  const colorsCss = await readTargetFile(target, 'src/styles/foundations/colors.css');
  const docs = await readTargetFile(target, 'docs/design-system.md');

  assert.match(indexCss, /@layer reset, foundations, layout, components, helpers;/);
  assert.match(indexCss, /@import "\.\/reset\.css" layer\(reset\);/);
  assert.match(colorsCss, /--color-primitive-accent-500: #3f6df6;/);
  assert.match(docs, /# pix Design System/);
});

test('installs package design system with default package name and destination', async () => {
  const target = await createTarget();
  const result = runInstaller(target, ['--mode', 'package']);

  assert.equal(result.status, 0, result.stderr);

  const packageJson = JSON.parse(await readTargetFile(target, 'packages/pix-design-system/package.json'));
  const indexCss = await readTargetFile(target, 'packages/pix-design-system/src/index.css');

  assert.equal(packageJson.name, '@pix-galaxy/pix-design-system');
  assert.equal(packageJson.sideEffects.includes('**/*.css'), true);
  assert.match(indexCss, /@layer reset, foundations, layout, components, helpers;/);
});

test('accepts package name and destination overrides', async () => {
  const target = await createTarget();
  const result = runInstaller(target, [
    '--mode',
    'package',
    '--package-name',
    '@example/tokens',
    '--dest',
    'vendor/design-system',
  ]);

  assert.equal(result.status, 0, result.stderr);

  const packageJson = JSON.parse(await readTargetFile(target, 'vendor/design-system/package.json'));
  assert.equal(packageJson.name, '@example/tokens');
});

test('fails safely when output files already exist without force', async () => {
  const target = await createTarget();
  await mkdir(path.join(target, 'src/styles'), { recursive: true });
  await writeFile(path.join(target, 'src/styles/index.css'), 'existing file\n', 'utf8');

  const result = runInstaller(target);

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /install-design-system error:/);
  assert.match(result.stderr, /src\/styles\/index\.css/);
});

test('force overwrites conflicting files', async () => {
  const target = await createTarget();
  await mkdir(path.join(target, 'src/styles'), { recursive: true });
  await writeFile(path.join(target, 'src/styles/index.css'), 'existing file\n', 'utf8');

  const result = runInstaller(target, ['--force']);

  assert.equal(result.status, 0, result.stderr);

  const indexCss = await readTargetFile(target, 'src/styles/index.css');
  assert.match(indexCss, /@layer reset, foundations, layout, components, helpers;/);
});

test('applies brand, accent, font, radius, and density overrides', async () => {
  const target = await createTarget();
  const result = runInstaller(target, [
    '--brand-name',
    'Nova UI',
    '--accent',
    '#ff5500',
    '--font',
    'Fraunces, serif',
    '--radius',
    'round',
    '--density',
    'compact',
  ]);

  assert.equal(result.status, 0, result.stderr);

  const typographyCss = await readTargetFile(target, 'src/styles/foundations/typography.css');
  const colorsCss = await readTargetFile(target, 'src/styles/foundations/colors.css');
  const radiiCss = await readTargetFile(target, 'src/styles/foundations/radii.css');
  const spacingCss = await readTargetFile(target, 'src/styles/foundations/spacing.css');
  const docs = await readTargetFile(target, 'docs/design-system.md');

  assert.match(typographyCss, /--font-family-sans: Fraunces, serif;/);
  assert.match(colorsCss, /--color-primitive-accent-500: #ff5500;/);
  assert.match(radiiCss, /--radius-control: 1\.6rem;/);
  assert.match(spacingCss, /--density-scale: 0\.875;/);
  assert.match(docs, /# Nova UI/);
});

test('copies optional docs site when requested', async () => {
  const target = await createTarget();
  const result = runInstaller(target, ['--docs-site']);

  assert.equal(result.status, 0, result.stderr);

  const docsSite = await readTargetFile(target, 'docs/design-system-site/index.html');
  assert.match(docsSite, /pix Design System/);
});
```

- [ ] **Step 2: Run test to verify failure**

Run:

```bash
node --test ./.github/skills/pix-design-system/scripts/install-design-system.test.mjs
```

Expected: FAIL because `.github/skills/pix-design-system/scripts/install-design-system.mjs` does not exist yet.

---

### Task 2: Installer Script

**Files:**
- Create: `.github/skills/pix-design-system/scripts/install-design-system.mjs`
- Test: `.github/skills/pix-design-system/scripts/install-design-system.test.mjs`

- [ ] **Step 1: Create installer implementation**

Create `.github/skills/pix-design-system/scripts/install-design-system.mjs` with these exported helpers and CLI behavior:

```js
// @ts-check

import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DEFAULTS = {
  mode: 'app',
  brandName: 'pix Design System',
  accent: '#3f6df6',
  font: 'Aptos, "Avenir Next", "Helvetica Neue", sans-serif',
  radius: 'comfortable',
  density: 'comfortable',
  packageName: '@pix-galaxy/pix-design-system',
  packageDest: 'packages/pix-design-system',
  docsSiteDest: 'docs/design-system-site',
};

const RADIUS_VALUES = {
  subtle: '0.4rem',
  comfortable: '0.8rem',
  round: '1.6rem',
};

const DENSITY_VALUES = {
  compact: '0.875',
  comfortable: '1',
  spacious: '1.125',
};

const getArg = (argv, flag, fallback = '') => {
  const index = argv.findIndex((entry) => entry === flag);
  return index !== -1 ? argv[index + 1] ?? fallback : fallback;
};

export const parseArgs = (argv) => {
  const mode = getArg(argv, '--mode', DEFAULTS.mode);

  if (!['app', 'package'].includes(mode)) {
    throw new Error('Invalid --mode. Use "app" or "package".');
  }

  const radius = getArg(argv, '--radius', DEFAULTS.radius);
  const density = getArg(argv, '--density', DEFAULTS.density);

  if (!Object.hasOwn(RADIUS_VALUES, radius)) {
    throw new Error('Invalid --radius. Use "subtle", "comfortable", or "round".');
  }

  if (!Object.hasOwn(DENSITY_VALUES, density)) {
    throw new Error('Invalid --density. Use "compact", "comfortable", or "spacious".');
  }

  return {
    target: path.resolve(getArg(argv, '--target', process.cwd())),
    mode,
    brandName: getArg(argv, '--brand-name', DEFAULTS.brandName),
    accent: getArg(argv, '--accent', DEFAULTS.accent),
    font: getArg(argv, '--font', DEFAULTS.font),
    radius,
    density,
    packageName: getArg(argv, '--package-name', DEFAULTS.packageName),
    dest: getArg(argv, '--dest', DEFAULTS.packageDest),
    docsSite: argv.includes('--docs-site'),
    force: argv.includes('--force'),
  };
};
```

Add these functions below the parser:

```js
const fileExists = async (filePath) => {
  try {
    await readFile(filePath, 'utf8');
    return true;
  } catch {
    return false;
  }
};

const collectTemplateFiles = async (sourceRoot, targetRoot) => {
  const entries = await readdir(sourceRoot, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const sourcePath = path.join(sourceRoot, entry.name);
    const targetPath = path.join(targetRoot, entry.name);

    if (entry.isDirectory()) {
      files.push(...await collectTemplateFiles(sourcePath, targetPath));
      continue;
    }

    if (entry.isFile()) {
      files.push({ sourcePath, targetPath });
    }
  }

  return files;
};

const applyReplacements = (content, options) => {
  const replacements = {
    __BRAND_NAME__: options.brandName,
    __ACCENT__: options.accent,
    __FONT__: options.font,
    __RADIUS__: RADIUS_VALUES[options.radius],
    __DENSITY__: DENSITY_VALUES[options.density],
    __PACKAGE_NAME__: options.packageName,
  };

  return Object.entries(replacements).reduce((nextContent, [token, value]) => {
    return nextContent.replaceAll(token, value);
  }, content);
};

const assertNoConflicts = async (files, force) => {
  if (force) {
    return;
  }

  const conflicts = [];

  for (const file of files) {
    if (await fileExists(file.targetPath)) {
      conflicts.push(file.targetPath);
    }
  }

  if (conflicts.length > 0) {
    throw new Error(`Refusing to overwrite existing files without --force:\n${conflicts.join('\n')}`);
  }
};

const writeTemplateFiles = async (files, options) => {
  const written = [];

  for (const file of files) {
    const content = await readFile(file.sourcePath, 'utf8');
    const rendered = applyReplacements(content, options);
    await mkdir(path.dirname(file.targetPath), { recursive: true });
    await writeFile(file.targetPath, rendered, 'utf8');
    written.push(file.targetPath);
  }

  return written;
};
```

Add this main flow:

```js
export const installDesignSystem = async (options) => {
  const currentFile = fileURLToPath(import.meta.url);
  const skillRoot = path.resolve(path.dirname(currentFile), '..');
  const starterRoot = path.join(skillRoot, 'assets', 'design-system', options.mode);
  const targetRoot = options.mode === 'package'
    ? path.join(options.target, options.dest)
    : options.target;

  const files = await collectTemplateFiles(starterRoot, targetRoot);
  const docsSiteFiles = options.docsSite
    ? await collectTemplateFiles(
      path.join(skillRoot, 'assets', 'examples', 'docs-site'),
      path.join(options.target, DEFAULTS.docsSiteDest)
    )
    : [];

  const allFiles = [...files, ...docsSiteFiles];
  await assertNoConflicts(allFiles, options.force);
  const writtenFiles = await writeTemplateFiles(allFiles, options);

  return {
    mode: options.mode,
    target: options.target,
    destination: targetRoot,
    writtenFiles,
    docsSite: options.docsSite ? path.join(options.target, DEFAULTS.docsSiteDest) : null,
    nextSteps: options.mode === 'package'
      ? [
        `Import ${options.packageName}/css from consuming apps.`,
        `Review ${path.join(options.dest, 'docs/design-system.md')}.`,
      ]
      : [
        'Import src/styles/index.css from the app entrypoint.',
        'Review docs/design-system.md.',
      ],
  };
};

const main = async () => {
  const options = parseArgs(process.argv.slice(2));
  const summary = await installDesignSystem(options);
  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
};

const currentFile = fileURLToPath(import.meta.url);
const invokedFile = process.argv[1] ? path.resolve(process.argv[1]) : '';

if (invokedFile === currentFile) {
  main().catch((error) => {
    process.stderr.write(`install-design-system error: ${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  });
}
```

- [ ] **Step 2: Run installer tests**

Run:

```bash
node --test ./.github/skills/pix-design-system/scripts/install-design-system.test.mjs
```

Expected: FAIL because asset templates do not exist yet.

---

### Task 3: App Starter Assets

**Files:**
- Create: `.github/skills/pix-design-system/assets/design-system/app/src/styles/index.css`
- Create: `.github/skills/pix-design-system/assets/design-system/app/src/styles/reset.css`
- Create: `.github/skills/pix-design-system/assets/design-system/app/src/styles/foundations/typography.css`
- Create: `.github/skills/pix-design-system/assets/design-system/app/src/styles/foundations/spacing.css`
- Create: `.github/skills/pix-design-system/assets/design-system/app/src/styles/foundations/radii.css`
- Create: `.github/skills/pix-design-system/assets/design-system/app/src/styles/foundations/elevations.css`
- Create: `.github/skills/pix-design-system/assets/design-system/app/src/styles/foundations/colors.css`
- Create: `.github/skills/pix-design-system/assets/design-system/app/src/styles/layout.css`
- Create: `.github/skills/pix-design-system/assets/design-system/app/src/styles/components.css`
- Create: `.github/skills/pix-design-system/assets/design-system/app/src/styles/helpers.css`
- Create: `.github/skills/pix-design-system/assets/design-system/app/docs/design-system.md`
- Test: `.github/skills/pix-design-system/scripts/install-design-system.test.mjs`

- [ ] **Step 1: Create app CSS entrypoint**

Create `.github/skills/pix-design-system/assets/design-system/app/src/styles/index.css`:

```css
@layer reset, foundations, layout, components, helpers;

@import "./reset.css" layer(reset);
@import "./foundations/colors.css" layer(foundations);
@import "./foundations/typography.css" layer(foundations);
@import "./foundations/spacing.css" layer(foundations);
@import "./foundations/radii.css" layer(foundations);
@import "./foundations/elevations.css" layer(foundations);
@import "./layout.css" layer(layout);
@import "./components.css" layer(components);
@import "./helpers.css" layer(helpers);
```

- [ ] **Step 2: Create reset**

Create `.github/skills/pix-design-system/assets/design-system/app/src/styles/reset.css`:

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  font-size: 0.625em;
  text-size-adjust: 100%;
}

body {
  min-block-size: 100vh;
  margin: 0;
  color: var(--color-text);
  background: var(--color-canvas);
  font-family: var(--font-family-sans);
  font-size: var(--font-size-0);
  line-height: var(--line-height-body);
}

img,
picture,
svg,
canvas {
  display: block;
  max-inline-size: 100%;
}

button,
input,
textarea,
select {
  font: inherit;
}

:focus-visible {
  outline: var(--focus-ring-width) solid var(--color-focus-ring);
  outline-offset: var(--focus-ring-offset);
}
```

- [ ] **Step 3: Create foundation token files**

Create the five foundation files with primitive, semantic, and alias tokens.

Minimum required content:

```css
:root {
  --color-primitive-accent-500: __ACCENT__;
  --color-canvas: #fbfaf7;
  --color-surface: #ffffff;
  --color-text: #17130f;
  --color-text-muted: #675f55;
  --color-border: #ded8cf;
  --color-focus-ring: var(--color-primitive-accent-500);
  --button-background-color: var(--color-primitive-accent-500);
  --button-text-color: #ffffff;
  --card-background-color: var(--color-surface);
  --card-border-color: var(--color-border);
}
```

```css
:root {
  --font-family-sans: __FONT__;
  --font-size--2: 1.2rem;
  --font-size--1: 1.4rem;
  --font-size-0: 1.6rem;
  --font-size-1: 2rem;
  --font-size-2: 2.6rem;
  --font-size-3: 3.6rem;
  --font-weight-regular: 400;
  --font-weight-strong: 700;
  --line-height-body: 1.6;
  --line-height-heading: 1.15;
  --measure-readable: 68ch;
}
```

```css
:root {
  --density-scale: __DENSITY__;
  --space-1: calc(0.4rem * var(--density-scale));
  --space-2: calc(0.8rem * var(--density-scale));
  --space-3: calc(1.2rem * var(--density-scale));
  --space-4: calc(1.6rem * var(--density-scale));
  --space-5: calc(2.4rem * var(--density-scale));
  --space-6: calc(3.2rem * var(--density-scale));
  --space-layout: var(--space-6);
  --stack-gap: var(--space-4);
}
```

```css
:root {
  --radius-none: 0;
  --radius-subtle: 0.4rem;
  --radius-comfortable: 0.8rem;
  --radius-round: 1.6rem;
  --radius-pill: 999rem;
  --radius-control: __RADIUS__;
  --card-border-radius: var(--radius-control);
}
```

```css
:root {
  --elevation-low: 0 0.2rem 0.8rem rgb(23 19 15 / 8%);
  --elevation-medium: 0 0.8rem 2.4rem rgb(23 19 15 / 12%);
  --elevation-high: 0 1.6rem 4rem rgb(23 19 15 / 18%);
  --focus-ring-width: 0.2rem;
  --focus-ring-offset: 0.2rem;
  --card-box-shadow: var(--elevation-low);
}
```

- [ ] **Step 4: Create layout, components, and helpers**

Create files that use element and attribute selectors first:

```css
body {
  display: grid;
  grid-template-rows: auto 1fr auto;
}

main,
[data-layout="container"] {
  inline-size: min(100% - var(--space-4), 112rem);
  margin-inline: auto;
}

[data-layout="stack"] {
  display: grid;
  gap: var(--stack-gap);
}

[data-layout="cluster"] {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  align-items: center;
}
```

```css
button,
[data-component="button"] {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-block-size: 4.4rem;
  padding: var(--space-2) var(--space-4);
  border: 0;
  border-radius: var(--radius-control);
  color: var(--button-text-color);
  background: var(--button-background-color);
  font-weight: var(--font-weight-strong);
  cursor: pointer;
}

article,
[data-component="card"] {
  padding: var(--space-5);
  border: 0.1rem solid var(--card-border-color);
  border-radius: var(--card-border-radius);
  background: var(--card-background-color);
  box-shadow: var(--card-box-shadow);
}
```

```css
[hidden] {
  display: none !important;
}

[data-helper="visually-hidden"] {
  position: absolute;
  inline-size: 1px;
  block-size: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

[data-helper="flow"] > * + * {
  margin-block-start: var(--space-4);
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    transition-duration: 1ms !important;
    animation-duration: 1ms !important;
  }
}
```

- [ ] **Step 5: Create app docs**

Create `.github/skills/pix-design-system/assets/design-system/app/docs/design-system.md` with sections:

```markdown
# __BRAND_NAME__

## Overview

This design system provides native CSS foundations, layout primitives, component aliases, and helpers.

## Install

Import `src/styles/index.css` from the application entrypoint.

## Layers

The CSS entrypoint declares `@layer reset, foundations, layout, components, helpers;`.

## Token Levels

- Primitive tokens store raw values.
- Semantic tokens describe product meaning.
- Component aliases expose stable styling hooks for UI components.

## Foundations

- Typography lives in `src/styles/foundations/typography.css`.
- Spacing lives in `src/styles/foundations/spacing.css`.
- Radii live in `src/styles/foundations/radii.css`.
- Elevations live in `src/styles/foundations/elevations.css`.
- Colors live in `src/styles/foundations/colors.css`.

## Extras

- Reset styles live in `src/styles/reset.css`.
- Layout primitives live in `src/styles/layout.css`.
- Component aliases live in `src/styles/components.css`.
- Helpers live in `src/styles/helpers.css`.
```

- [ ] **Step 6: Run installer tests**

Run:

```bash
node --test ./.github/skills/pix-design-system/scripts/install-design-system.test.mjs
```

Expected: package-mode tests still fail because package starter assets do not exist.

---

### Task 4: Package Starter Assets

**Files:**
- Create: `.github/skills/pix-design-system/assets/design-system/package/package.json`
- Create: `.github/skills/pix-design-system/assets/design-system/package/README.md`
- Create: `.github/skills/pix-design-system/assets/design-system/package/src/index.css`
- Create: `.github/skills/pix-design-system/assets/design-system/package/src/reset.css`
- Create: `.github/skills/pix-design-system/assets/design-system/package/src/foundations/typography.css`
- Create: `.github/skills/pix-design-system/assets/design-system/package/src/foundations/spacing.css`
- Create: `.github/skills/pix-design-system/assets/design-system/package/src/foundations/radii.css`
- Create: `.github/skills/pix-design-system/assets/design-system/package/src/foundations/elevations.css`
- Create: `.github/skills/pix-design-system/assets/design-system/package/src/foundations/colors.css`
- Create: `.github/skills/pix-design-system/assets/design-system/package/src/layout.css`
- Create: `.github/skills/pix-design-system/assets/design-system/package/src/components.css`
- Create: `.github/skills/pix-design-system/assets/design-system/package/src/helpers.css`
- Create: `.github/skills/pix-design-system/assets/design-system/package/docs/design-system.md`
- Create: `.github/skills/pix-design-system/assets/design-system/package/test/design-system.test.mjs`
- Test: `.github/skills/pix-design-system/scripts/install-design-system.test.mjs`

- [ ] **Step 1: Create package metadata**

Create package metadata with replacement tokens:

```json
{
  "name": "__PACKAGE_NAME__",
  "private": false,
  "version": "0.1.0",
  "description": "Reusable native CSS design system for __BRAND_NAME__.",
  "type": "module",
  "sideEffects": [
    "**/*.css"
  ],
  "exports": {
    ".": "./src/index.css",
    "./css": "./src/index.css"
  },
  "files": [
    "src",
    "docs",
    "README.md"
  ],
  "scripts": {
    "test": "node --test test/*.test.mjs"
  }
}
```

- [ ] **Step 2: Create package CSS files**

Use the same CSS content as app mode, but place files under `src/` instead of `src/styles/`.

Package entrypoint:

```css
@layer reset, foundations, layout, components, helpers;

@import "./reset.css" layer(reset);
@import "./foundations/colors.css" layer(foundations);
@import "./foundations/typography.css" layer(foundations);
@import "./foundations/spacing.css" layer(foundations);
@import "./foundations/radii.css" layer(foundations);
@import "./foundations/elevations.css" layer(foundations);
@import "./layout.css" layer(layout);
@import "./components.css" layer(components);
@import "./helpers.css" layer(helpers);
```

- [ ] **Step 3: Create package docs and package self-test**

Create `README.md` and `docs/design-system.md` with install usage:

```markdown
# __BRAND_NAME__

Import the design system CSS from `__PACKAGE_NAME__/css`.
```

Create `.github/skills/pix-design-system/assets/design-system/package/test/design-system.test.mjs`:

```js
// @ts-check

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('package CSS declares stable layers', async () => {
  const css = await readFile(new URL('../src/index.css', import.meta.url), 'utf8');
  assert.match(css, /@layer reset, foundations, layout, components, helpers;/);
});
```

- [ ] **Step 4: Run installer tests**

Run:

```bash
node --test ./.github/skills/pix-design-system/scripts/install-design-system.test.mjs
```

Expected: docs-site test still fails because docs-site assets do not exist.

---

### Task 5: Examples And Optional Docs Site

**Files:**
- Create: `.github/skills/pix-design-system/assets/examples/app-basic/index.html`
- Create: `.github/skills/pix-design-system/assets/examples/app-basic/src/styles/index.css`
- Create: `.github/skills/pix-design-system/assets/examples/package-basic/package.json`
- Create: `.github/skills/pix-design-system/assets/examples/package-basic/src/main.css`
- Create: `.github/skills/pix-design-system/assets/examples/web-component-theme/index.html`
- Create: `.github/skills/pix-design-system/assets/examples/web-component-theme/pix-theme-card.js`
- Create: `.github/skills/pix-design-system/assets/examples/web-component-theme/pix-theme-card.css`
- Create: `.github/skills/pix-design-system/assets/examples/docs-site/index.html`
- Create: `.github/skills/pix-design-system/assets/examples/docs-site/styles.css`
- Test: `.github/skills/pix-design-system/scripts/install-design-system.test.mjs`

- [ ] **Step 1: Create app-basic example**

Create a static page that imports `./src/styles/index.css` and uses `data-layout`, `data-component`, and `data-helper` attributes.

Required snippet in `index.html`:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>__BRAND_NAME__ App Example</title>
    <link rel="stylesheet" href="./src/styles/index.css">
  </head>
  <body>
    <main data-layout="stack">
      <section data-helper="flow">
        <h1>__BRAND_NAME__</h1>
        <p>App-mode design system baseline with foundations, layout, components, and helpers.</p>
        <button type="button">Primary action</button>
      </section>
      <article data-component="card">
        <h2>Token-driven card</h2>
        <p>Component aliases make theme changes safe.</p>
      </article>
    </main>
  </body>
</html>
```

- [ ] **Step 2: Create package-basic example**

Create `package.json` showing package consumption:

```json
{
  "name": "pix-design-system-package-basic",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "dependencies": {
    "__PACKAGE_NAME__": "workspace:*"
  }
}
```

Create `src/main.css`:

```css
@import "__PACKAGE_NAME__/css";

main {
  padding-block: var(--space-layout);
}
```

- [ ] **Step 3: Create web-component-theme example**

Create a custom element example that imports component-local CSS and consumes design system tokens through `:host`.

Required CSS:

```css
:host {
  display: block;
  color: var(--color-text);
  font-family: var(--font-family-sans);
}

article {
  padding: var(--space-5);
  border: 0.1rem solid var(--card-border-color);
  border-radius: var(--card-border-radius);
  background: var(--card-background-color);
  box-shadow: var(--card-box-shadow);
}
```

- [ ] **Step 4: Create docs-site example**

Create `index.html` and `styles.css` that document the generated foundations. The page must be static HTML and native CSS only.

Required HTML heading:

```html
<h1>__BRAND_NAME__ Design System</h1>
```

- [ ] **Step 5: Run installer tests**

Run:

```bash
node --test ./.github/skills/pix-design-system/scripts/install-design-system.test.mjs
```

Expected: PASS.

---

### Task 6: Skill Docs And References

**Files:**
- Create: `.github/skills/pix-design-system/SKILL.md`
- Create: `.github/skills/pix-design-system/references/FOUNDATIONS.md`
- Create: `.github/skills/pix-design-system/references/ARCHITECTURE.md`
- Create: `.github/skills/pix-design-system/references/USAGE.md`
- Create: `.github/skills/pix-design-system/references/EXAMPLES.md`

- [ ] **Step 1: Create SKILL.md**

Create frontmatter and body:

```markdown
---
name: pix-design-system
description: 'Create, install, document, and maintain pix-native design systems with reusable CSS foundations, tokens, app/package starters, docs, examples, and installer scripts. Use when users ask for design system setup, foundations, typography scale, spacing scale, radii, elevations, color tokens, CSS variables, reset, layout primitives, helpers, theme baseline, or reusable design-system package creation.'
argument-hint: 'Design system task, e.g. "create a design system baseline for this project"'
---

# pix Design System

## Outcome
Create or update a native CSS design system baseline that follows `pix-styleguides`.

## When to use
Use this skill for design system setup, token foundations, theme baselines, reusable CSS packages, docs, and examples.

## Inputs
1. Target project root.
2. Installation mode: `app` or `package`, default `app`.
3. Optional brand overrides: brand name, accent, font, radius, density.
4. Optional package overrides: package name and destination.
5. Whether to include the docs-site scaffold.

## Resources
- Installer: [./scripts/install-design-system.mjs](./scripts/install-design-system.mjs)
- Foundations reference: [./references/FOUNDATIONS.md](./references/FOUNDATIONS.md)
- Architecture reference: [./references/ARCHITECTURE.md](./references/ARCHITECTURE.md)
- Usage reference: [./references/USAGE.md](./references/USAGE.md)
- Examples reference: [./references/EXAMPLES.md](./references/EXAMPLES.md)
- App starter: [./assets/design-system/app](./assets/design-system/app)
- Package starter: [./assets/design-system/package](./assets/design-system/package)

## Procedure
1. Read the target project structure and choose `app` or `package`.
2. Run the installer with fail-safe defaults.
3. Review generated CSS against `pix-styleguides`.
4. Adapt tokens to product identity.
5. Keep docs in English and update examples when token APIs change.
6. Run installer tests when modifying this skill.

## Completion criteria
1. Generated CSS declares `@layer reset, foundations, layout, components, helpers;`.
2. Foundations cover typography, spacing, radii, elevations, and colors.
3. Extras cover reset, layout, components, and helpers.
4. Token hierarchy includes primitive, semantic, and component alias levels.
5. Docs explain install, layers, token levels, foundations, and extension points.
6. Validation commands pass or failures are reported with exact output.
```

- [ ] **Step 2: Create reference docs**

Create reference files with English docs. Required section headings:

```markdown
# Foundations Reference

## Typography
## Spacing
## Radii
## Elevations
## Colors
## Token Review Checklist
```

```markdown
# Design System Architecture

## Layers
## File Layout
## Token Levels
## Selector Strategy
## Native CSS Rules
## Maintenance Checklist
```

```markdown
# Design System Usage

## App Mode
## Package Mode
## CLI Options
## Conflict Handling
## Validation
```

```markdown
# Design System Examples

## app-basic
## package-basic
## web-component-theme
## docs-site
## Example Selection Guide
```

- [ ] **Step 3: Scan docs for forbidden placeholders and punctuation**

Run:

```bash
rg -n "T[O]DO|T[B]D|\\x{2014}|\\x{201C}|\\x{201D}|\\x{00AB}|\\x{00BB}" .github/skills/pix-design-system docs/superpowers/plans/2026-04-30-pix-design-system.md
```

Expected: no matches.

---

### Task 7: Prompt And Instructions

**Files:**
- Create: `.github/prompts/pix-design-system.prompt.md`
- Create: `.github/instructions/pix-design-system.instructions.md`

- [ ] **Step 1: Create prompt file**

Create `.github/prompts/pix-design-system.prompt.md`:

```markdown
---
name: "pix Design System Create"
description: "Create a native CSS design system baseline with foundations, reset, layout, helpers, docs, examples, and optional package mode."
argument-hint: "Design system task, e.g. 'create app mode with brand name Nova UI and accent #ff5500'"
agent: "agent"
---
Create or update a design system baseline with `pix-design-system`.

Mandatory references:
- [skill pix-design-system](../skills/pix-design-system/SKILL.md)
- [foundations reference](../skills/pix-design-system/references/FOUNDATIONS.md)
- [architecture reference](../skills/pix-design-system/references/ARCHITECTURE.md)
- [usage reference](../skills/pix-design-system/references/USAGE.md)
- [examples reference](../skills/pix-design-system/references/EXAMPLES.md)

Default command:
- `node ./.github/skills/pix-design-system/scripts/install-design-system.mjs --target "<project-root>"`

Package command:
- `node ./.github/skills/pix-design-system/scripts/install-design-system.mjs --target "<project-root>" --mode package --package-name "@pix-galaxy/pix-design-system" --dest "packages/pix-design-system"`

Hard rules:
- Native CSS only.
- Use `@layer reset, foundations, layout, components, helpers;`.
- Use primitive, semantic, and component alias tokens.
- Keep generated docs in English.
- Do not overwrite existing files unless user approved `--force`.

Mandatory final output:
1. `Installed files`
2. `Token decisions`
3. `Validation`
4. `Open items`
```

- [ ] **Step 2: Create instructions file**

Create `.github/instructions/pix-design-system.instructions.md`:

```markdown
---
description: "Use when creating or editing design system CSS, tokens, foundations, layout primitives, helpers, docs, examples, or reusable design-system packages."
name: "pix Design System"
applyTo: "**/*.{css,html,js,mjs,json,md}"
---
# pix Design System Instructions

- Build design systems with native CSS only.
- Use `@layer reset, foundations, layout, components, helpers;`.
- Use custom properties for every reusable design decision.
- Use three token levels: primitive, semantic, and component aliases.
- Keep foundation files split by typography, spacing, radii, elevations, and colors.
- Include reset, layout, component aliases, and helpers.
- Prefer element and attribute selectors. Use class selectors only when no safer selector exists.
- Keep docs and generated examples in English.
- Use fail-safe installer behavior. Do not overwrite existing files without explicit `--force`.
```

- [ ] **Step 3: Scan prompt and instructions**

Run:

```bash
rg -n "T[O]DO|T[B]D|\\x{2014}|\\x{201C}|\\x{201D}|\\x{00AB}|\\x{00BB}" .github/prompts/pix-design-system.prompt.md .github/instructions/pix-design-system.instructions.md
```

Expected: no matches.

---

### Task 8: pix Galaxy Orchestration

**Files:**
- Modify: `.github/skills/pix-galaxy/SKILL.md`
- Modify: `.github/skills/pix-galaxy/assets/registry.json`
- Modify: `.github/skills/pix-galaxy/scripts/select-skill.test.mjs`

- [ ] **Step 1: Add failing router tests**

Append tests to `.github/skills/pix-galaxy/scripts/select-skill.test.mjs`:

```js
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
```

- [ ] **Step 2: Run router tests to verify failure**

Run:

```bash
node --test ./.github/skills/pix-galaxy/scripts/select-skill.test.mjs
```

Expected: first new test FAILS because registry does not include `pix-design-system`.

- [ ] **Step 3: Update registry**

Add a skill object to `.github/skills/pix-galaxy/assets/registry.json`:

```json
{
  "name": "pix-design-system",
  "priority": 98,
  "description": "Create and install native CSS design systems with foundations, tokens, docs, examples, and reusable app/package starters.",
  "triggers": {
    "keywords": [
      "design system",
      "design-system",
      "foundations",
      "design tokens",
      "token architecture",
      "typography scale",
      "spacing scale",
      "radii",
      "elevations",
      "color tokens",
      "css variables",
      "theme baseline",
      "layout primitives",
      "helpers",
      "reusable style package"
    ],
    "regex": [
      "\\b(?:create|scaffold|install|setup|build)\\b.*\\bdesign(?:\\s|-)?system\\b",
      "\\b(?:typography|spacing|radii|elevations|colors?)\\b.*\\b(?:tokens?|foundations?)\\b",
      "\\b(?:theme|token)\\b.*\\b(?:baseline|architecture|package)\\b"
    ],
    "fileExtensions": [
      ".css",
      ".html",
      ".md",
      ".json",
      ".mjs"
    ],
    "operations": [
      "create",
      "scaffold",
      "install",
      "setup",
      "generate",
      "build"
    ],
    "intents": [
      "design system",
      "foundations",
      "tokens",
      "theme",
      "typography",
      "spacing",
      "radii",
      "elevation",
      "layout primitives"
    ]
  }
}
```

- [ ] **Step 4: Update pix-galaxy skill docs**

In `.github/skills/pix-galaxy/SKILL.md`:

```markdown
Current orchestration target:
- `pix-styleguides`
- `pix-a11y`
- `pix-template-engine`
- `pix-design-system`
```

Add resource:

```markdown
- Current routed skill: [../pix-design-system/SKILL.md](../pix-design-system/SKILL.md)
```

- [ ] **Step 5: Run router tests**

Run:

```bash
node --test ./.github/skills/pix-galaxy/scripts/select-skill.test.mjs
```

Expected: PASS.

---

### Task 9: Final Validation

**Files:**
- All files from tasks 1 through 8.

- [ ] **Step 1: Run installer tests**

Run:

```bash
node --test ./.github/skills/pix-design-system/scripts/install-design-system.test.mjs
```

Expected: PASS.

- [ ] **Step 2: Run router tests**

Run:

```bash
node --test ./.github/skills/pix-galaxy/scripts/select-skill.test.mjs
```

Expected: PASS.

- [ ] **Step 3: Run full project tests**

Run:

```bash
pnpm test
```

Expected: PASS.

- [ ] **Step 4: Run forbidden punctuation and placeholder scan**

Run:

```bash
rg -n "T[O]DO|T[B]D|\\x{2014}|\\x{201C}|\\x{201D}|\\x{00AB}|\\x{00BB}" .github/skills/pix-design-system .github/prompts/pix-design-system.prompt.md .github/instructions/pix-design-system.instructions.md docs/superpowers/plans/2026-04-30-pix-design-system.md
```

Expected: no matches.

- [ ] **Step 5: Inspect final diff**

Run:

```bash
git diff --stat
git diff -- .github/skills/pix-design-system .github/prompts/pix-design-system.prompt.md .github/instructions/pix-design-system.instructions.md .github/skills/pix-galaxy docs/superpowers/plans/2026-04-30-pix-design-system.md
```

Expected: only planned files changed.

- [ ] **Step 6: Commit implementation**

Stage only planned files:

```bash
git add .github/skills/pix-design-system .github/prompts/pix-design-system.prompt.md .github/instructions/pix-design-system.instructions.md .github/skills/pix-galaxy docs/superpowers/plans/2026-04-30-pix-design-system.md
```

Commit:

```bash
git commit -m "feat(skills): add pix design system"
```
