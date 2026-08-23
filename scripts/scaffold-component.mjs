#!/usr/bin/env node

/**
 * Scaffold a new pix-galaxy component package from pix-component-template.
 *
 * Usage:
 *   node scripts/scaffold-component.mjs PixCommand [description]
 *
 * Examples:
 *   node scripts/scaffold-component.mjs PixSlider "Accessible range slider"
 *   node scripts/scaffold-component.mjs "PixColorPicker" "Color picker component"
 *
 * This will:
 *   1. Copy packages/pix-component-template → packages/pix-<name>
 *   2. Replace all {%...%} placeholders with actual values
 *   3. Rename ComponentName/ files to the new PascalCase class name
 *   4. Install dependencies
 *   5. Build docs
 */

import { execSync } from 'node:child_process';
import { copyFile, mkdir, readdir, readFile, rename, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');
const templateDir = resolve(projectRoot, 'packages/pix-component-template');

const args = process.argv.slice(2);

if (args.length < 1 || args[0] === '--help' || args[0] === '-h') {
  console.log(`
  Usage: node scripts/scaffold-component.mjs <PascalName> [description]

  Examples:
    node scripts/scaffold-component.mjs PixCommand "Command palette"
    node scripts/scaffold-component.mjs PixSlider "Range slider"

  The PascalName is converted automatically:
    PixCommand  →  pix-command  (element, dir)
                 →  PixCommand   (class)
                 →  pix-command  (variable prefix)
  `);
  process.exit(0);
}

/* ── Parse args ─────────────────────────────────────────────────── */

const pascalInput = args[0];
const description = args.slice(1).join(' ') || '';

// Convert PascalCase → kebab-case: "PixCommand" → "pix-command"
const kebabName = pascalInput
  .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
  .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
  .toLowerCase();

// Full element name with pix- prefix
const elementName = kebabName.startsWith('pix-') ? kebabName : `pix-${kebabName}`;

// Class name: PixCommand
const className = pascalInput.startsWith('Pix') ? pascalInput : `Pix${pascalInput}`;

// Short kebab name without pix- prefix (for internal use)
const shortName = elementName.replace(/^pix-/, '');

// Package name
const packageName = `@pix-galaxy/${elementName}`;

// Target directory
const targetDir = resolve(projectRoot, `packages/${elementName}`);

console.log(`\n  ✨  Scaffolding ${className} (${elementName})`);
console.log(`  📦  Package: ${packageName}`);
console.log(`  📝  ${description || '(no description)'}\n`);

/* ── Validate ───────────────────────────────────────────────────── */

if (!existsSync(templateDir)) {
  console.error(`  ❌  Template not found at ${templateDir}`);
  process.exit(1);
}

if (existsSync(targetDir)) {
  console.error(`  ❌  Target directory already exists: packages/${elementName}`);
  process.exit(1);
}

/* ── Copy template ──────────────────────────────────────────────── */

console.log(`  Copying template → packages/${elementName} ...`);

await mkdir(targetDir, { recursive: true });
await copyRecursive(templateDir, targetDir, ['node_modules', 'artifact', '.DS_Store']);

/* ── Replace placeholders ───────────────────────────────────────── */

const replacements = {
  '{%PACKAGE_NAME%}': packageName,
  '{%COMPONENT_DESCRIPTION%}': description,
  '{%REPO_OWNER%}': 'pixu1980',
  '{%REPO_NAME%}': elementName,
  '{%COMPONENT_NAME%}': elementName,
  '{%COMPONENT_CLASS%}': className,
  '{%ELEMENT_NAME%}': elementName,
  '{%STORAGE_KEY%}': `pix-${shortName}`,
  '{%DOCS_TITLE%}': className,
};

const OLD_CLASS = 'ComponentName';
let replaced = 0;
let renamed = 0;

async function* walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === 'artifact' || entry.name === '.git')
        continue;
      yield* walk(fullPath);
    } else {
      yield fullPath;
    }
  }
}

for await (const filePath of walk(targetDir)) {
  const ext = extname(filePath);

  if (
    ['.js', '.mjs', '.json', '.md', '.yml', '.yaml', '.css', '.html', '.d.ts', '.json5'].includes(
      ext
    ) ||
    !ext
  ) {
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
      console.log(
        `  ✓ ${filePath.replace(projectRoot, '.').replace(targetDir, `packages/${elementName}`)}`
      );
    }
  }

  // Rename ComponentName → actual class name
  if (filePath.includes(OLD_CLASS)) {
    const newPath = filePath.replace(OLD_CLASS, className);
    await rename(filePath, newPath);
    renamed++;
  }
}

/* ── Rename ComponentName directory ──────────────────────────────── */

const oldDir = join(targetDir, 'src/components/ComponentName');
const newDir = join(targetDir, `src/components/${className}`);
try {
  if (existsSync(oldDir)) {
    await rename(oldDir, newDir);
    renamed++;
  }
} catch {
  /* may have been renamed already */
}

console.log(`\n  📝  ${replaced} files updated, ${renamed} files/dirs renamed`);

/* ── Install & build ────────────────────────────────────────────── */

console.log(`\n  📦  Installing dependencies...`);
try {
  execSync('pnpm install', { cwd: projectRoot, stdio: 'pipe' });
  console.log(`  ✅  Dependencies installed`);
} catch (e) {
  console.error(`  ⚠️  pnpm install failed: ${e.message}`);
}

console.log(`\n  📚  Building docs...`);
try {
  execSync('node ./scripts/docs.mjs', { cwd: targetDir, stdio: 'pipe' });
  console.log(`  ✅  Docs built`);
} catch (e) {
  console.log(`  ⚠️  Docs build skipped (template may need init): ${e.message}`);
}

console.log(`\n  ────────────────────────────────────────────────`);
console.log(`  ✅  ${className} scaffolded successfully!`);
console.log(``);
console.log(`  Next steps:`);
console.log(`    1. Mark release readiness:`);
console.log(`       - packages/${elementName}/package.json -> set "releaseStatus": "ready"`);
console.log(`         once the component is ready (default: "wip")`);
console.log(`    2. Add to portal:`);
console.log(`       - src/docs/content/components.json (add card entry)`);
console.log(`       - scripts/dev-all.mjs (add to knownColors)`);
console.log(`       - src/docs/index.js (add icon to ICONS)`);
console.log(`       - src/docs/index.css (add accent color palette)`);
console.log(`    3. cd packages/${elementName}`);
console.log(`    4. pnpm run dev  # start dev server`);
console.log(`    5. Open http://localhost:${3000 + /* guess */ 0}`);
console.log(`  ────────────────────────────────────────────────\n`);

/* ── Helper: recursive copy ─────────────────────────────────────── */

async function copyRecursive(src, dest, exclude = []) {
  const entries = await readdir(src, { withFileTypes: true });
  await mkdir(dest, { recursive: true });

  for (const entry of entries) {
    if (exclude.includes(entry.name)) continue;

    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyRecursive(srcPath, destPath, exclude);
    } else {
      await copyFile(srcPath, destPath);
    }
  }
}
