// @ts-check
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateChangelog } from './_generate-changelog.js';
import { log, logKeyValue, logTitle } from './_cli.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const rootDir = resolve(__dirname, '..');
const packagesDir = join(rootDir, 'packages');
const changelogPath = join(rootDir, 'CHANGELOG.md');
const rootManifestPath = join(rootDir, 'package.json');

export const VALID_RELEASE_TYPES = Object.freeze(['patch', 'minor', 'major']);

/**
 * @param {string} filePath
 * @returns {any}
 */
function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, 'utf8'));
}

/**
 * @param {string} filePath
 * @param {any} data
 * @returns {void}
 */
function writeJson(filePath, data) {
  writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

/**
 * @param {string} command
 * @param {string[]} args
 * @param {{ cwd?: string; stdio?: 'inherit' | 'pipe' }} [options]
 * @returns {string}
 */
function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd ?? rootDir,
    encoding: 'utf8',
    stdio: options.stdio ?? 'pipe',
  });

  if (result.status !== 0) {
    throw new Error(result.stderr?.trim() || result.stdout?.trim() || `${command} ${args.join(' ')} failed`);
  }

  return result.stdout?.trim() ?? '';
}

/**
 * @param {string} version
 * @param {'patch' | 'minor' | 'major'} releaseType
 * @returns {string}
 */
export function bumpVersion(version, releaseType) {
  const [major, minor, patch] = version.split('.').map(Number);

  if ([major, minor, patch].some((value) => Number.isNaN(value))) {
    throw new Error(`unsupported version format: ${version}`);
  }

  if (releaseType === 'patch') {
    return `${major}.${minor}.${patch + 1}`;
  }

  if (releaseType === 'minor') {
    return `${major}.${minor + 1}.0`;
  }

  return `${major + 1}.0.0`;
}

/**
 * @param {string} cwd
 * @returns {void}
 */
function ensureCleanWorktree(cwd = rootDir) {
  const status = run('git', ['status', '--porcelain'], { cwd });
  if (status.length > 0) {
    throw new Error('working tree not clean. Commit or stash changes first.');
  }
}

/**
 * @param {string} cwd
 * @returns {Array<{ folder: string; packageDir: string; manifestPath: string; distDir: string; manifest: any }>}
 */
export function collectPublishablePackages(cwd = rootDir) {
  return readdirSync(join(cwd, 'packages'))
    .map((folder) => {
      const packageDir = join(cwd, 'packages', folder);
      const manifestPath = join(packageDir, 'package.json');

      if (!existsSync(manifestPath)) {
        return null;
      }

      const manifest = readJson(manifestPath);
      if (manifest.private === true) {
        return null;
      }

      return {
        folder,
        packageDir,
        manifestPath,
        distDir: join(packageDir, 'dist'),
        manifest,
      };
    })
    .filter(Boolean)
    .sort((left, right) => left.folder.localeCompare(right.folder));
}

/**
 * @param {string} filePath
 * @returns {string}
 */
function toRepoPath(filePath) {
  return relative(rootDir, filePath).split('\\').join('/');
}

/**
 * @param {string} changelog
 * @param {string} nextVersion
 * @param {string} [today]
 * @returns {string}
 */
export function finalizeChangelogForRelease(changelog, nextVersion, today = new Date().toISOString().slice(0, 10)) {
  const unreleasedMatch = /^## Unreleased\n([\s\S]*?)(?=^##\s|$)/mu.exec(changelog);
  const unreleasedBody = unreleasedMatch?.[1]?.trim() || '- Release notes pending.';
  const releaseSection = `## Unreleased\n\n- Release notes pending.\n\n## ${nextVersion} - ${today}\n\n${unreleasedBody}`;

  if (unreleasedMatch) {
    const prefix = changelog.slice(0, unreleasedMatch.index).trimEnd();
    const suffix = changelog.slice(unreleasedMatch.index + unreleasedMatch[0].length).trimStart();
    return `${prefix}\n\n${releaseSection}${suffix ? `\n\n${suffix}` : ''}`.trimEnd() + '\n';
  }

  return `${changelog.trimEnd()}\n\n${releaseSection}\n`;
}

/**
 * @param {string | null | undefined} tagName
 * @returns {string | null}
 */
function normalizeVersionTag(tagName) {
  if (tagName == null || tagName === '') {
    return null;
  }

  return tagName.startsWith('v') ? tagName.slice(1) : tagName;
}

/**
 * @param {{ expectedVersion?: string | null; cwd?: string }} [options]
 * @returns {{ ok: boolean; issues: string[]; packageCount: number }}
 */
export function verifyReleaseArtifacts(options = {}) {
  const cwd = options.cwd ?? rootDir;
  const expectedVersion = normalizeVersionTag(options.expectedVersion);
  const rootManifest = readJson(join(cwd, 'package.json'));
  const packages = collectPublishablePackages(cwd);
  /** @type {string[]} */
  const issues = [];

  if (expectedVersion !== null && rootManifest.version !== expectedVersion) {
    issues.push(`root package.json version ${rootManifest.version} does not match ${expectedVersion}`);
  }

  for (const entry of packages) {
    if (expectedVersion !== null && entry.manifest.version !== expectedVersion) {
      issues.push(`${entry.manifest.name} version ${entry.manifest.version} does not match ${expectedVersion}`);
    }

    if (!existsSync(entry.distDir)) {
      issues.push(`${entry.folder}: dist/ not found`);
      continue;
    }

    const requiredPaths = new Set([
      entry.manifest.main,
      entry.manifest.module,
      entry.manifest.types,
      entry.manifest.exports?.['.']?.import,
      entry.manifest.exports?.['.']?.types,
    ]);

    for (const relativePath of requiredPaths) {
      if (typeof relativePath !== 'string') {
        continue;
      }

      const absolutePath = join(entry.packageDir, relativePath);
      if (!existsSync(absolutePath)) {
        issues.push(`${entry.folder}: missing ${relativePath}`);
      }
    }
  }

  return {
    ok: issues.length === 0,
    issues,
    packageCount: packages.length,
  };
}

/**
 * @param {'patch' | 'minor' | 'major'} releaseType
 * @returns {void}
 */
export function release(releaseType) {
  if (!VALID_RELEASE_TYPES.includes(releaseType)) {
    throw new Error('usage: node scripts/_release.js <patch|minor|major|verify> [tag]');
  }

  ensureCleanWorktree(rootDir);

  const rootManifest = readJson(rootManifestPath);
  const packages = collectPublishablePackages(rootDir);
  const nextVersion = bumpVersion(rootManifest.version, releaseType);
  const nextTag = `v${nextVersion}`;

  if (run('git', ['tag', '--list', nextTag], { cwd: rootDir }) === nextTag) {
    throw new Error(`tag already exists: ${nextTag}`);
  }

  logTitle(`Preparing ${nextTag}`);

  log('step', 'Running tests');
  run('pnpm', ['test'], { cwd: rootDir, stdio: 'inherit' });

  log('step', 'Running typecheck');
  run('pnpm', ['typecheck'], { cwd: rootDir, stdio: 'inherit' });

  log('step', 'Generating changelog');
  generateChangelog({ cwd: rootDir, outputPath: changelogPath });

  rootManifest.version = nextVersion;
  writeJson(rootManifestPath, rootManifest);

  for (const entry of packages) {
    entry.manifest.version = nextVersion;
    writeJson(entry.manifestPath, entry.manifest);
  }

  const changelog = readFileSync(changelogPath, 'utf8');
  writeFileSync(changelogPath, finalizeChangelogForRelease(changelog, nextVersion), 'utf8');

  log('step', 'Building packages');
  run('pnpm', ['build'], { cwd: rootDir, stdio: 'inherit' });

  const verification = verifyReleaseArtifacts({ expectedVersion: nextVersion, cwd: rootDir });
  if (!verification.ok) {
    throw new Error(verification.issues.join('\n'));
  }

  const pathsToAdd = [
    toRepoPath(rootManifestPath),
    toRepoPath(changelogPath),
    ...packages.flatMap((entry) => [toRepoPath(entry.manifestPath), toRepoPath(entry.distDir)]),
  ];

  run('git', ['add', ...pathsToAdd], { cwd: rootDir });
  run('git', ['commit', '-m', `chore(release): ${nextTag}`], { cwd: rootDir, stdio: 'inherit' });
  run('git', ['tag', nextTag], { cwd: rootDir });

  logKeyValue('Version', nextVersion);
  logKeyValue('Packages', String(packages.length));
  log('success', `Created release commit and tag ${nextTag}`);
}

/**
 * @param {string | null | undefined} expectedVersion
 * @returns {void}
 */
export function verify(expectedVersion = null) {
  const result = verifyReleaseArtifacts({ expectedVersion, cwd: rootDir });

  if (!result.ok) {
    throw new Error(result.issues.join('\n'));
  }

  logTitle('Verified release artifacts');
  logKeyValue('Packages', String(result.packageCount));
  if (expectedVersion) {
    logKeyValue('Version', normalizeVersionTag(expectedVersion) ?? 'unknown');
  }
  log('success', 'Committed dist artifacts are ready to publish');
}

const currentFile = fileURLToPath(import.meta.url);
const invokedFile = process.argv[1] ? resolve(process.argv[1]) : '';

if (invokedFile === currentFile) {
  try {
    const [command, expectedVersion] = process.argv.slice(2);

    if (command === 'verify') {
      verify(expectedVersion ?? process.env.GITHUB_REF_NAME ?? null);
    } else if (VALID_RELEASE_TYPES.includes(command)) {
      release(/** @type {'patch' | 'minor' | 'major'} */ (command));
    } else {
      throw new Error('usage: node scripts/_release.js <patch|minor|major|verify> [tag]');
    }
  } catch (error) {
    log('error', error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
