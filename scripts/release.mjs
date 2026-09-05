#!/usr/bin/env node

/**
 * release.mjs - pix-galaxy monorepo release orchestration
 *
 * Discover non-private packages in packages/, release those with changes
 * since last git tag (commit-and-tag-version bump + npm publish).
 *
 * npm now runs automatic malware scanning at publish time, introducing
 * a ~5 minute delay before the package becomes installable. Use --verify
 * to poll the registry until the package is confirmed available.
 *
 * Packages declaring dual-use content (contentPolicy in package.json)
 * must be published with a 2FA-enforced method - local `npm publish`
 * satisfies this as long as the npm session is 2FA-authenticated.
 *
 * Usage:
 *   node scripts/release.mjs
 *   node scripts/release.mjs --dry-run   # preview only
 *   node scripts/release.mjs --force     # release even without changes
 *   node scripts/release.mjs --verify    # wait & confirm package availability
 *   node scripts/release.mjs --package pix-highlighter   # release ONLY that package
 */

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import {
  standardVersionCommand,
  ensureNpmAuthentication,
  changedFilesSinceTag,
} from './release-helpers.mjs';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = join(__dirname, '..');
const PKG_DIR = join(ROOT, 'packages');

const isDryRun = process.argv.includes('--dry-run') || process.argv.includes('-n');
const isForced = process.argv.includes('--force') || process.argv.includes('-f');
const isVerify = process.argv.includes('--verify') || process.argv.includes('-V');

// ── Package filter: release only specific package(s) ──────────────────
// Accepts `--package <name>` or `--package=<name>` (repeatable, comma-
// separated). Matches the directory name ("pix-highlighter") or the
// scoped name ("@pix-galaxy/pix-highlighter").
const requestedPackages = process.argv
  .reduce((acc, arg, i, argv) => {
    if (arg === '--package' && argv[i + 1]) acc.push(argv[i + 1]);
    else if (arg.startsWith('--package=')) acc.push(arg.slice('--package='.length));
    return acc;
  }, [])
  .flatMap((v) => v.split(','))
  .map((v) => v.trim())
  .filter(Boolean)
  .map((v) => v.replace(/^@pix-galaxy\//, ''));

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
  { maxWaitMs = 600_000, pollIntervalMs = 15_000 } = {}
) {
  const start = Date.now();
  console.log(`   🔍 Verifying ${name}@${version} on npm registry…`);
  console.log(`   ⏳ npm malware scan in progress (~5 min avg). Polling…`);

  while (true) {
    const waited = Date.now() - start;
    try {
      const result = execSync(`npm view "${name}@${version}" version --json 2>/dev/null`, {
        cwd: ROOT,
        stdio: 'pipe',
        encoding: 'utf-8',
      }).trim();
      if (result) {
        const elapsed = Math.round(waited / 1000);
        console.log(`   ✅ ${name}@${version} available after ${elapsed}s`);
        return;
      }
    } catch {
      // not yet available - scan still running
    }

    if (waited >= maxWaitMs) {
      const elapsed = Math.round(waited / 1000);
      console.log(
        `   ⚠  ${name}@${version} not available after ${elapsed}s ` +
          `- may still be scanning. Check https://www.npmjs.com/package/${name}`
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

/**
 * Compute the publish-time files that must exist before `npm publish`.
 * The artifact (main/module/types + `files` entries) is gitignored, so a
 * release from a clean checkout would otherwise ship a tarball without the
 * bundled code — unlike pi-coding-agent-extensions, whose shipped files are
 * committed source. Non-glob entries must exist verbatim; glob entries only
 * have their static directory prefix verified.
 *
 * @param {string} pkg Package directory name.
 * @param {object} pkgJson Parsed package.json.
 * @returns {string[]} Missing entries (empty when publishable).
 */
function missingPublishFiles(pkg, pkgJson) {
  const pkgPath = join(PKG_DIR, pkg);
  const required = [pkgJson.main, pkgJson.module, pkgJson.types, ...(pkgJson.files || [])].filter(
    Boolean
  );

  return required.filter((entry) => {
    if (entry.includes('*')) {
      // Glob pattern — verify only the static directory prefix.
      const star = entry.indexOf('*');
      const prefix = entry.slice(0, entry.lastIndexOf('/', star));
      return Boolean(prefix) && !existsSync(join(pkgPath, prefix));
    }
    return !existsSync(join(pkgPath, entry));
  });
}

/**
 * Ensure a package is publishable: if any publish-time file is missing,
 * build it first via the package's own `build:lib` script, then re-check.
 * Fails with a clear message when the build does not produce the artifact.
 *
 * @param {string} pkg Package directory name.
 * @param {object} pkgJson Parsed package.json.
 */
function ensurePublishable(pkg, pkgJson) {
  let missing = missingPublishFiles(pkg, pkgJson);
  if (missing.length === 0) return;

  console.log(`   🏗  publish files missing (${missing.join(', ')}) - running build:lib first`);
  try {
    execIn(join(PKG_DIR, pkg), 'pnpm run build:lib', { stdio: 'inherit' });
  } catch (err) {
    console.error(`   ❌ ${pkg}: build:lib failed. Fix the build before releasing.`);
    process.exit(1);
  }

  missing = missingPublishFiles(pkg, pkgJson);
  if (missing.length > 0) {
    console.error(
      `   ❌ ${pkg}: publish files still missing after build:lib: ${missing.join(', ')}`
    );
    process.exit(1);
  }
}

console.log('═══════════════════════════════════════════');
console.log('  pix-galaxy - monorepo release');
console.log(`  dry-run:  ${isDryRun ? '✓' : '✗'}`);
console.log(`  force:    ${isForced ? '✓' : '✗'}`);
console.log(`  verify:   ${isVerify ? '✓' : '✗'}`);
console.log(
  `  packages: ${requestedPackages.length ? requestedPackages.join(', ') : '(all with changes)'}`
);
console.log('═══════════════════════════════════════════\n');

if (!isWorkingTreeClean()) {
  if (isDryRun) {
    console.log('⚠  Working tree dirty - dry-run proceeds anyway.\n');
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
  execSync(`"${join(ROOT, 'node_modules', '.bin', 'commit-and-tag-version')}" --version`, {
    stdio: 'pipe',
  });
} catch {
  console.log('commit-and-tag-version not found - run pnpm install first.\n');
  process.exit(1);
}

const packages = readdirSync(PKG_DIR, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort();

let released = 0,
  skipped = 0;

// Validate the package filter before doing anything.
if (requestedPackages.length) {
  const missing = requestedPackages.filter((r) => !packages.includes(r));
  if (missing.length) {
    console.error(`✗ Package(s) not found in packages/: ${missing.join(', ')}`);
    console.error(`  Available: ${packages.join(', ')}`);
    process.exit(1);
  }
}

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

  // Release readiness gate: only packages marked releaseStatus: "ready"
  // are released. Anything else (wip, missing) stays unpublished.
  const releaseStatus = pkgJson.releaseStatus ?? 'wip';
  if (releaseStatus !== 'ready') {
    console.log(`⏭  ${pkgJson.name || pkg}: releaseStatus "${releaseStatus}", not released`);
    skipped++;
    continue;
  }

  // Apply the --package filter (match by dir name or bare scoped name).
  if (
    requestedPackages.length &&
    !requestedPackages.includes(pkg) &&
    !requestedPackages.includes(String(pkgJson.name || '').replace(/^@pix-galaxy\//, ''))
  ) {
    console.log(`⏭  ${pkgJson.name || pkg}: not in --package filter, skipped`);
    skipped++;
    continue;
  }

  const name = pkgJson.name;
  const version = pkgJson.version;
  const tag = `${name}@${version}`;
  const pkgRel = `packages/${pkg}`;

  console.log(`\n── ${name} ────────────────────────────────`);
  console.log(`   current: ${version}`);

  // Check for dual-use content declaration (npm contentPolicy) — same
  // validation model as pi-coding-agent-extensions.
  if (pkgJson.contentPolicy === 'dual-use') {
    const disclosurePath = join(pkgPath, 'DISCLOSURE');
    if (!existsSync(disclosurePath)) {
      console.error(`✗ ${pkgJson.name}: contentPolicy=dual-use but DISCLOSURE not found.`);
      console.error(`  Create packages/${pkg}/DISCLOSURE and try again.`);
      process.exit(1);
    }
    console.log(`   🔒 dual-use: DISCLOSURE present ✓`);
    if (!isDryRun) {
      console.log(`   ⚠  Dual-use publishing requires npm authentication with 2FA.`);
      console.log(`   Make sure the npm account has 2FA enabled.`);
    }
  }

  if (tagExists(tag)) {
    console.log(`   tag: ${tag}`);

    const changedFiles = changedFilesSinceTag(tag, pkgRel, exec);
    const hasChanges = changedFiles !== null && changedFiles.length > 0;

    if (!hasChanges) {
      if (isForced) {
        console.log(`   ⚑ no release-worthy changes but --force present, proceeding anyway`);
      } else {
        console.log(`   ✓ no release-worthy changes, skipped`);
        skipped++;
        continue;
      }
    }

    console.log(`   ↻ release-worthy changes detected (${changedFiles.length}):`);
    for (const changedFile of changedFiles) {
      console.log(`       ${changedFile}`);
    }
  } else {
    console.log(`   ⚑ no tag found - first release`);
  }

  // ── Release ──
  const prefix = `${name}@`;
  const firstRelease = !tagExists(tag);
  if (isDryRun) {
    console.log(`   [dry-run] commit-and-tag-version --tag-prefix "${prefix}"`);
    execIn(pkgPath, standardVersionCommand(ROOT, name, true, firstRelease), {
      stdio: 'inherit',
    });
    const missing = missingPublishFiles(pkg, pkgJson);
    console.log(
      `   [dry-run] publish files: ${missing.length === 0 ? '✓ all present' : `✗ missing (${missing.join(', ')}) - would run build:lib`}`
    );
    console.log(`   [dry-run] npm publish --access public (skipped)`);
  } else {
    try {
      execIn(pkgPath, standardVersionCommand(ROOT, name, false, firstRelease), {
        stdio: 'inherit',
      });
      // Push release commit + tag to the trunk (ADR-022: develop). The tag
      // triggers the release quality gate (release.yml).
      execIn(pkgPath, `git push --follow-tags origin develop`, { stdio: 'inherit' });
      // Build the artifact if needed, then publish locally using the user's
      // npm credentials (same local model as pi-coding-agent-extensions: no
      // CI publish, no provenance).
      ensurePublishable(pkg, pkgJson);
      execIn(pkgPath, `npm publish --access public`, { stdio: 'inherit' });
      released++;

      // npm now runs malware scanning at publish time (~5 min delay)
      console.log(`   ✅ ${name} published!`);
      console.log(`   ℹ  npm malware scan - available in ~5 min (check Staged Packages on npm)`);

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
  console.log(`\n  ℹ  npm scans published packages for malware (~5 min).`);
  console.log(`     Use --verify to wait for availability confirmation.`);
}
console.log('═══════════════════════════════════════════\n');
