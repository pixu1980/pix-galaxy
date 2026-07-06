#!/usr/bin/env node

/**
 * Monorepo release orchestration — pix-galaxy.
 *
 * Discovers which packages have unreleased changes (via path-filtered
 * conventional commits), then releases them in topological order so
 * dependencies are always published before their dependents.
 *
 * Each package's own scripts/release.mjs does the actual version bump,
 * changelog update, commit and tag — this script just orchestrates.
 *
 * Usage:
 *   node scripts/release.mjs           # interactive (asks confirmation)
 *   node scripts/release.mjs --yes     # non-interactive (CI mode)
 *   node scripts/release.mjs --dry-run # preview only, no changes
 *   node scripts/release.mjs --force <pkg>  # release one package regardless
 */

import { readFileSync, statSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { createInterface } from 'node:readline';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));
const ARGS = process.argv.slice(2);
const DRY_RUN = ARGS.includes('--dry-run');
const YES = ARGS.includes('--yes') || process.env.CI === 'true';

// ── Release order (topological: dependencies first) ─────────────
const RELEASE_ORDER = [
  { short: 'pix-highlighter',           deps: [] },
  { short: 'pix-accent-color-selector', deps: ['pix-highlighter'] },
  { short: 'pix-color-scheme-selector', deps: ['pix-highlighter'] },
  { short: 'pix-display-preferences',   deps: ['pix-accent-color-selector', 'pix-color-scheme-selector', 'pix-highlighter'] },
];

function runGit(args) {
  const result = spawnSync('git', args, {
    cwd: ROOT,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  if (result.status !== 0) return null;
  return result.stdout.trim();
}

function getLastTag(pkgShort) {
  try {
    return runGit(['describe', '--tags', '--abbrev=0', '--match', `@pix-galaxy/${pkgShort}@*`]);
  } catch {
    return null;
  }
}

function getPackageName(pkgShort) {
  return `@pix-galaxy/${pkgShort}`;
}

function getPackageDir(pkgShort) {
  return resolve(ROOT, '..', 'packages', pkgShort);
}

function countCommitsSince(pkgShort, since) {
  const pkgPath = `packages/${pkgShort}/`;
  const range = since ? `${since}..HEAD` : 'HEAD';
  const log = runGit(['log', range, '--oneline', '--', `:(top)${pkgPath}`]);
  if (!log || !log.trim()) return 0;
  return log.trim().split('\n').length;
}

function ensureCleanWorktree() {
  const status = runGit(['status', '--porcelain']);
  if (status) {
    console.error('❌ Working tree not clean. Commit or stash changes first.');
    process.exit(1);
  }
}

function askConfirmation(message) {
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    rl.question(`${message} (y/N) `, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
    });
  });
}

async function main() {
  if (!DRY_RUN) {
    ensureCleanWorktree();
  }

  // ── Detect changed packages ────────────────────────────────────
  /** @type {{ short: string; lastTag: string | null; commits: number }[]} */
  const changed = [];

  for (const pkg of RELEASE_ORDER) {
    const lastTag = getLastTag(pkg.short);
    const count = countCommitsSince(pkg.short, lastTag);
    if (count > 0) {
      changed.push({ ...pkg, lastTag, commits: count });
    }
  }

  // Handle --force <pkg> override
  const forceIdx = ARGS.indexOf('--force');
  if (forceIdx !== -1 && forceIdx + 1 < ARGS.length) {
    const forcePkg = ARGS[forceIdx + 1];
    const match = RELEASE_ORDER.find((p) => p.short === forcePkg);
    if (!match) {
      console.error(`❌ Unknown package "${forcePkg}". Valid: ${RELEASE_ORDER.map(p => p.short).join(', ')}`);
      process.exit(1);
    }
    const lastTag = getLastTag(match.short);
    changed.length = 0;
    changed.push({ ...match, lastTag, commits: -1 });
    console.log(`⚠️  Force-releasing ${getPackageName(match.short)}\n`);
  }

  if (changed.length === 0) {
    console.log('✅ No packages have unreleased changes. Nothing to do.');
    process.exit(0);
  }

  // ── Summary ─────────────────────────────────────────────────────
  console.log('');
  console.log('┌─────────────────────────────────────────────────────┐');
  console.log('│  pix-galaxy — Monorepo Release Orchestrator        │');
  console.log('└─────────────────────────────────────────────────────┘');
  console.log('');
  console.log('Packages to release (topological order):');
  console.log('');

  for (const pkg of changed) {
    const tag = pkg.lastTag ?? '(none)';
    const count = pkg.commits === -1 ? 'forced' : `${pkg.commits} commit(s)`;
    const deps = pkg.deps.length > 0 ? ` ← ${pkg.deps.join(', ')}` : '';
    console.log(`  ${pkg.short.padEnd(35)} ${count.padEnd(14)} last: ${tag}${deps}`);
  }

  console.log('');

  if (DRY_RUN) {
    console.log('⚠️  Dry-run mode — no changes made.');
    console.log('   Run without --dry-run to execute.\n');
    process.exit(0);
  }

  if (!YES) {
    const ok = await askConfirmation('Proceed with release?');
    if (!ok) {
      console.log('Aborted.');
      process.exit(0);
    }
  }

  // ── Execute releases in order ───────────────────────────────────
  let released = 0;
  let failed = 0;

  for (const pkg of changed) {
    const pkgDir = getPackageDir(pkg.short);
    const pkgName = getPackageName(pkg.short);
    const scriptPath = resolve(pkgDir, 'scripts/release.mjs');

    console.log(`\n── ${pkgName} ────────────────────────────────────────`);

    if (!fileExists(scriptPath)) {
      console.log(`  ⏭️  No scripts/release.mjs found — skipping.`);
      continue;
    }

    const result = spawnSync('node', [scriptPath], {
      cwd: pkgDir,
      stdio: 'inherit',
      env: { ...process.env },
    });

    if (result.status === 0) {
      console.log(`  ✅ ${pkgName} released.`);
      released++;
    } else {
      console.error(`  ❌ ${pkgName} failed (exit code ${result.status}).`);
      failed++;
      if (!YES) {
        const cont = await askConfirmation('Continue with next package?');
        if (!cont) {
          console.log('Aborted after failure.');
          process.exit(1);
        }
      }
    }
  }

  // ── Final summary ──────────────────────────────────────────────
  console.log('');
  console.log('┌─────────────────────────────────────────────────────┐');
  console.log(`│  Released: ${released}   Failed: ${failed}                   │`);
  console.log('└─────────────────────────────────────────────────────┘');
  console.log('');
  console.log('Don\'t forget to push:');
  console.log('  git push origin main --follow-tags');
  console.log('');
}

function fileExists(path) {
  try {
    return statSync(path).isFile();
  } catch {
    return false;
  }
}

await main();
