#!/usr/bin/env node

/**
 * release.mjs — pix-galaxy monorepo release orchestration
 *
 * Discover non-private packages in packages/, release those with changes
 * since last git tag (standard-version bump + pnpm publish).
 *
 * Usage:
 *   node scripts/release.mjs
 *   node scripts/release.mjs --dry-run   # preview only
 *   node scripts/release.mjs --force     # release even without changes
 */

import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = join(__dirname, '..');
const PKG_DIR = join(ROOT, 'packages');

const isDryRun = process.argv.includes('--dry-run') || process.argv.includes('-n');
const isForced = process.argv.includes('--force') || process.argv.includes('-f');

function exec(cmd, opts = {}) {
  return execSync(cmd, { cwd: ROOT, stdio: 'pipe', encoding: 'utf-8', ...opts });
}

function execIn(dir, cmd, opts = {}) {
  return execSync(cmd, { cwd: dir, stdio: 'inherit', encoding: 'utf-8', ...opts });
}

function tagExists(tag) {
  try { exec(`git rev-parse "${tag}"`, { stdio: 'pipe' }); return true; }
  catch { return false; }
}

function hasChangesSinceTag(tag, pkgRel) {
  try { exec(`git diff --quiet "${tag}" -- "${pkgRel}"`, { stdio: 'pipe' }); return false; }
  catch { return true; }
}

function isWorkingTreeClean() {
  try { return exec('git status --porcelain', { stdio: 'pipe' }).trim().length === 0; }
  catch { return false; }
}

console.log('═══════════════════════════════════════════');
console.log('  pix-galaxy — monorepo release');
console.log(`  dry-run: ${isDryRun ? '✓' : '✗'}`);
console.log(`  force:   ${isForced ? '✓' : '✗'}`);
console.log('═══════════════════════════════════════════\n');

if (!isWorkingTreeClean()) {
  if (isDryRun) {
    console.log('⚠  Working tree dirty — dry-run proceeds anyway.\n');
  } else {
    console.error('✗ Working tree not clean. Commit or stash first.');
    process.exit(1);
  }
}

try { execSync("standard-version --version", { stdio: "pipe" }); } catch {
  console.log('standard-version not found globally — installing via npx.\n');
}

const packages = readdirSync(PKG_DIR, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name)
  .sort();

let released = 0, skipped = 0;

for (const pkg of packages) {
  const pkgPath = join(PKG_DIR, pkg);
  const pkgJsonPath = join(pkgPath, 'package.json');

  let pkgJson;
  try { pkgJson = JSON.parse(readFileSync(pkgJsonPath, 'utf-8')); }
  catch { console.log(`⚠  ${pkg}: invalid package.json, skipped`); skipped++; continue; }

  if (pkgJson.private) {
    console.log(`⏭  ${pkgJson.name || pkg}: private, skipped`);
    skipped++;
    continue;
  }

  const name = pkgJson.name;
  const version = pkgJson.version;
  const tag = `${name}@${version}`;
  const pkgRel = `packages/${pkg}`;

  console.log(`\n── ${name} ────────────────────────────────`);
  console.log(`   current: ${version}`);

  if (tagExists(tag)) {
    console.log(`   tag: ${tag}`);
    if (!hasChangesSinceTag(tag, pkgRel)) {
      if (isForced) {
        console.log(`   ⚑ no changes but --force, releasing anyway`);
      } else {
        console.log(`   ✓ no changes, skipped`);
        skipped++;
        continue;
      }
    }
  } else {
    console.log(`   ⚑ no tag found — first release`);
  }

  // ── Release ──
  const prefix = `${name}@`;
  if (isDryRun) {
    console.log(`   [dry-run] standard-version --tag-prefix "${prefix}"`);
    execIn(pkgPath, `npx standard-version --dry-run --tag-prefix "${prefix}"`, { stdio: 'inherit' });
    console.log(`   [dry-run] pnpm publish (skipped)`);
  } else {
    try {
      execIn(pkgPath, `npx standard-version --no-verify --tag-prefix "${prefix}"`, { stdio: 'inherit' });
      execIn(pkgPath, `git push --follow-tags origin main 2>/dev/null || true`, { stdio: 'inherit' });
      execIn(pkgPath, `pnpm publish --access public`, { stdio: 'inherit' });
      released++;
      console.log(`   ✅ ${name} published!`);
    } catch (err) {
      console.error(`   ❌ Failed: ${name}`, err.message);
      if (!isForced) process.exit(1);
    }
  }
}

console.log('\n═══════════════════════════════════════════');
console.log(`  Summary:`);
console.log(`  • released: ${released}`);
console.log(`  • skipped:  ${skipped}`);
console.log('═══════════════════════════════════════════\n');
