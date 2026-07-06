#!/usr/bin/env node

/**
 * pix-component-template initializer.
 *
 * Usage:
 *   node ./scripts/init.mjs <package-name> "<description>"
 *
 * Example:
 *   node ./scripts/init.mjs pix-my-component "My awesome Web Component"
 *
 * This replaces all {% … %} placeholders in the scaffolded template.
 * Run this after copying the template directory, before publishing.
 */

import { readdir, readFile, writeFile, rename } from 'node:fs/promises';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));

const args = process.argv.slice(2);
if (args.length < 1 || args[0] === '--help' || args[0] === '-h') {
  console.log(`
  Usage: node ./scripts/init.mjs <package-name> "<description>"

  Examples:
    node ./scripts/init.mjs pix-my-component "My awesome Web Component"
    node ./scripts/init.mjs pix-color-picker "Accessible color picker"

  The script replaces all {% … %} placeholders in:
    - all source files (src/**, scripts/**)
    - package.json, tsconfig*.json, README.md, CHANGELOG.md
    - GitHub workflows (.github/workflows/*.yml)

  And renames ComponentName/ files to match the new component name.
`);
  process.exit(0);
}

const COMPONENT_SHORT = args[0];           // e.g., "pix-my-component"
const COMPONENT_DESCRIPTION = args[1] || '';

// Extract repo owner from git remote
let REPO_OWNER = 'pixu1980';
let REPO_NAME = COMPONENT_SHORT;
try {
  const { spawnSync } = await import('node:child_process');
  const remote = spawnSync('git', ['config', '--get', 'remote.origin.url'], { encoding: 'utf8' });
  if (remote.status === 0 && remote.stdout) {
    const match = remote.stdout.trim().match(/github\.com[:\/](.+?)\/(.+?)\.git$/);
    if (match) {
      REPO_OWNER = match[1];
      REPO_NAME = match[2];
    }
  }
} catch { /* keep defaults */ }

// Derive component class name from package name
// e.g., "pix-my-component" → "PixMyComponent"
const COMPONENT_CLASS = COMPONENT_SHORT
  .replace(/^pix-?/i, '')
  .split(/[-_]/)
  .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
  .join('');
const COMPONENT_FULL = `Pix${COMPONENT_CLASS}`;

const replacements = {
  '{%PACKAGE_NAME%}': `@pix-galaxy/${COMPONENT_SHORT}`,
  '{%COMPONENT_DESCRIPTION%}': COMPONENT_DESCRIPTION,
  '{%REPO_OWNER%}': REPO_OWNER,
  '{%REPO_NAME%}': REPO_NAME,
  '{%COMPONENT_NAME%}': COMPONENT_SHORT,
  '{%COMPONENT_CLASS%}': COMPONENT_FULL,
};

const OLD_CLASS = 'ComponentName';

async function* walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === 'artifact') continue;
      yield* walk(fullPath);
    } else {
      yield fullPath;
    }
  }
}

let replaced = 0;
let renamed = 0;

for await (const filePath of walk(projectRoot)) {
  const ext = extname(filePath);

  // Replace placeholders in text files
  if (['.js', '.mjs', '.json', '.md', '.yml', '.yaml', '.css', '.html', '.d.ts', '.json5'].includes(ext) || !ext) {
    let content = await readFile(filePath, 'utf8');
    let changed = false;

    for (const [placeholder, value] of Object.entries(replacements)) {
      if (content.includes(placeholder)) {
        content = content.replaceAll(placeholder, value);
        changed = true;
      }
    }

    if (changed) {
      await writeFile(filePath, content, 'utf8');
      replaced++;
      console.log(`  ✓ ${filePath.replace(projectRoot, '.')}`);
    }
  }

  // Rename ComponentName files/dirs to the actual component name
  if (filePath.includes(OLD_CLASS)) {
    const newPath = filePath.replace(OLD_CLASS, COMPONENT_FULL);
    await rename(filePath, newPath);
    renamed++;
    console.log(`  ↪ ${filePath.replace(projectRoot, '.')} → ${newPath.replace(projectRoot, '.')}`);
  }
}

console.log(`\nDone. ${replaced} files updated, ${renamed} files/dirs renamed.`);
console.log('\nNext steps:');
console.log(`  1. cd packages/${COMPONENT_SHORT}`);
console.log(`  2. pnpm install`);
console.log(`  3. pnpm run build:lib`);
console.log(`  4. pnpm run test`);
console.log(`  5. pnpm run release  # first release`);
