#!/usr/bin/env node

/**
 * release.mjs — pix-galaxy monorepo release orchestration
 *
 * Discover non-private packages in packages/, release those with changes
 * since last git tag (commit-and-tag-version bump + npm publish).
 *
 * npm now runs automatic malware scanning at publish time, introducing
 * a ~5 minute delay before the package becomes installable. Use --verify
 * to poll the registry until the package is confirmed available.
 *
 * Packages declaring dual-use content (contentPolicy in package.json)
 * must be published with a 2FA-enforced method — local `npm publish`
 * satisfies this as long as the npm session is 2FA-authenticated.
 *
 * Usage:
 *   node scripts/release.mjs
 *   node scripts/release.mjs --dry-run   # preview only
 *   node scripts/release.mjs --force     # release even without changes
 *   node scripts/release.mjs --verify    # wait & confirm package availability
 */

import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { standardVersionCommand, ensureNpmAuthentication } from './release-helpers.mjs';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = join(__dirname, '..');
const PKG_DIR = join(ROOT, 'packages');

const isDryRun = process.argv.includes('--dry-run') || process.argv.includes('-n');
const isForced = process.argv.includes('--force') || process.argv.includes('-f');
const isVerify = process.argv.includes('--verify') || process.argv.includes('-V');

function exec(cmd, opts = {}) {
  return execSync(cmd, { cwd: ROOT, stdio: 'pipe', encoding: 'utf-8', ...opts });
}

function execIn(dir, cmd, opts = {}) {
  return execSync(cmd, { cwd: dir, stdio: 'inherit', encoding: 'utf-8', ...opts });
}

function tagExists(tag) {
  try {
    exec(`git rev-parse "${tag}"`, { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

function hasChangesSinceTag(tag, pkgRel) {
  try {
    exec(`git diff --quiet "${tag}" -- "${pkgRel}"`, { stdio: 'pipe' });
    return false;
  } catch {
    return true;
  }
}

function isWorkingTreeClean() {
  try {
    return exec('git status --porcelain', { stdio: 'pipe' }).trim().length === 0;
  } catch {
    return false;
  }
}

/**
 * Poll the npm registry until the published package is available.
 * npm now runs malware scanning at publish time, introducing a ~5 minute
 * delay before the package becomes installable.
 *
 * @param {string} name Package name (e.g. "@pix-galaxy/pix-toast")
 * @param {string} version Expected version
 * @param {{ maxWaitMs?: number, pollIntervalMs?: number }} [opts]
 */
function verifyNpmAvailability(
  name,
  version,
  { maxWaitMs = 600_000, pollIntervalMs = 15_000 } = {},
) {
  const start = Date.now();
  console.log(`   🔍 Verifying ${name}@${version} on npm registry…`);
  console.log(`   ⏳ npm malware scan in progress (~5 min avg). Polling…`);

  while (true) {
    const waited = Date.now() - start;
    try {
      const result = execSync(
        `npm view "${name}@${version}" version --json 2>/dev/null`,
        { cwd: ROOT, stdio: 'pipe', encoding: 'utf-8' },
      ).trim();
      if (result) {
        const elapsed = Math.round(waited / 1000);
        console.log(`   ✅ ${name}@${version} available after ${elapsed}s`);
        return;
      }
    } catch {
      // not yet available — scan still running
    }

    if (waited >= maxWaitMs) {
      const elapsed = Math.round(waited / 1000);
      console.log(
        `   ⚠  ${name}@${version} not available after ${elapsed}s ` +
          `— may still be scanning. Check https://www.npmjs.com/package/${name}`,
      );
      return;
    }

    // Progress every minute
    if (Math.floor(waited / 60_000) > Math.floor((waited - pollIntervalMs) / 60_000)) {
      console.log(`   … ${Math.round(waited / 1000)}s elapsed …`);
    }

    execSync(`sleep ${pollIntervalMs / 1000}`, { stdio: 'pipe' });
  }
}

console.log('═══════════════════════════════════════════');
console.log('  pix-galaxy — monorepo release');
console.log(`  dry-run: ${isDryRun ? '✓' : '✗'}`);
console.log(`  force:   ${isForced ? '✓' : '✗'}`);
console.log(`  verify:  ${isVerify ? '✓' : '✗'}`);
console.log('═══════════════════════════════════════════\n');

if (!isWorkingTreeClean()) {
  if (isDryRun) {
    console.log('⚠  Working tree dirty — dry-run proceeds anyway.\n');
  } else {
    console.error('✗ Working tree not clean. Commit or stash first.');
    process.exit(1);
  }
}

if (!isDryRun) {
  try {
    ensureNpmAuthentication({
      whoami: () => exec('npm whoami'),
      login: () =>
        execIn(ROOT, 'npm login', {
          stdio: 'inherit',
        }),
      log: console.log,
    });
  } catch (err) {
    console.error(`✗ ${err.message}`);
    process.exit(1);
  }
}

try {
  execSync('commit-and-tag-version --version', { stdio: 'pipe' });
} catch {
  console.log('commit-and-tag-version not found — run pnpm install first.\n');
  process.exit(1);
}

const packages = readdirSync(PKG_DIR, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort();

let released = 0,
  skipped = 0;

for (const pkg of packages) {
  const pkgPath = join(PKG_DIR, pkg);
  const pkgJsonPath = join(pkgPath, 'package.json');

  let pkgJson;
  try {
    pkgJson = JSON.parse(readFileSync(pkgJsonPath, 'utf-8'));
  } catch {
    console.log(`⚠  ${pkg}: invalid package.json, skipped`);
    skipped++;
    continue;
  }

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

  // Check for dual-use content declaration (npm contentPolicy)
  if (pkgJson.contentPolicy != null) {
    console.log(`   ⚐  contentPolicy declared — 2FA-enforced publish required`);
    console.log(`   ⚐  ensure npm session is 2FA-authenticated and DISCLOSURE file present`);
  }

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
  const firstRelease = !tagExists(tag);
  if (isDryRun) {
    console.log(`   [dry-run] commit-and-tag-version --tag-prefix "${prefix}"`);
    execIn(pkgPath, standardVersionCommand(ROOT, name, true, firstRelease), {
      stdio: 'inherit',
    });
    console.log(`   [dry-run] npm publish --access public (skipped)`);
  } else {
    try {
      execIn(pkgPath, standardVersionCommand(ROOT, name, false, firstRelease), {
        stdio: 'inherit',
      });
      execIn(pkgPath, `git push --follow-tags origin main 2>/dev/null || true`, {
        stdio: 'inherit',
      });
      execIn(pkgPath, `npm publish --access public`, { stdio: 'inherit' });
      released++;

      // npm now runs malware scanning at publish time (~5 min delay)
      console.log(`   ✅ ${name} published!`);
      console.log(
        `   ℹ  npm malware scan — available in ~5 min (check Staged Packages on npm)`,
      );

      if (isVerify) {
        // Read bumped version from package.json (commit-and-tag-version already wrote it)
        const bumped = JSON.parse(readFileSync(pkgJsonPath, 'utf-8'));
        verifyNpmAvailability(name, bumped.version);
      }
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
if (released > 0 && !isDryRun && !isVerify) {
  console.log(
    `\n  ℹ  npm scans published packages for malware (~5 min).`,
  );
  console.log(
    `     Use --verify to wait for availability confirmation.`,
  );
}
console.log('═══════════════════════════════════════════\n');
