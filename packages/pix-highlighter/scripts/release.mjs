import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const packageJsonPath = resolve(projectRoot, 'package.json');
const changelogPath = resolve(projectRoot, 'CHANGELOG.md');

const CHANGELOG_HEADER = '# Changelog\n\nAll notable changes to this project will be documented in this file.\n\n';

function runGit(args) {
  const result = spawnSync('git', args, {
    cwd: projectRoot,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  if (result.status !== 0) {
    throw new Error(result.stderr.trim() || `git ${args.join(' ')} failed`);
  }

  return result.stdout.trim();
}

const PACKAGE_NAME = JSON.parse(await readFile(packageJsonPath, 'utf8')).name;
const PACKAGE_SHORT = PACKAGE_NAME.replace(/^@[^/]+\//u, '');
const TAG_PREFIX = `${PACKAGE_NAME}@`;

function getLastTag() {
  try {
    return runGit(['describe', '--tags', '--abbrev=0', '--match', `${TAG_PREFIX}*`]);
  } catch {
    return null;
  }
}

function getCommitsSince(since) {
  const range = since ? `${since}..HEAD` : 'HEAD';
  // Use :(top) to make paths relative to repo root regardless of git CWD
  const log = runGit(['log', range, '--format=%s%n%b---end---', '--reverse', '--', `:(top)packages/${PACKAGE_SHORT}/`]);
  if (!log) return [];

  return log.split('---end---\n').filter(Boolean).map((entry) => {
    const lines = entry.trim().split('\n');
    const subject = lines[0] || '';
    const body = lines.slice(1).filter((l) => l.trim()).join('\n');
    return { subject, body };
  });
}

const COMMIT_TYPE_ORDER = [
  'breaking',
  'feat',
  'fix',
  'perf',
  'refactor',
  'style',
  'test',
  'docs',
  'chore',
  'ci',
  'build',
  'other',
];

const COMMIT_TYPE_LABELS = {
  breaking: '⚠️ Breaking changes',
  feat: 'Features',
  fix: 'Bug fixes',
  perf: 'Performance',
  refactor: 'Refactoring',
  style: 'Style',
  test: 'Tests',
  docs: 'Documentation',
  chore: 'Chores',
  ci: 'CI',
  build: 'Build',
  other: 'Other',
};

// eslint-disable-next-line camelcase -- matches standard terminology
const COMMIT_TYPE_SORT = Object.fromEntries(COMMIT_TYPE_ORDER.map((t, i) => [t, i]));

// Conventional commit regex:
//   type(scope)!: description
//   type(scope): description
//   type!: description
const CONVENTIONAL_RE = /^(\w+)(\([^)]+\))?(!)?\s*:\s*(.+)$/u;

function parseConventionalCommit(subject) {
  const match = subject.match(CONVENTIONAL_RE);
  if (!match) return null;

  const type = match[1].toLowerCase();
  const hasBang = match[3] === '!';
  return { type, hasBang, description: match[4] };
}

function getBumpType(commits) {
  let hasBreaking = false;
  let hasFeat = false;
  let hasFix = false;

  for (const { subject, body } of commits) {
    // Check body for BREAKING CHANGE
    if (/BREAKING\s+CHANGE:/iu.test(body)) {
      hasBreaking = true;
    }

    const parsed = parseConventionalCommit(subject);
    if (parsed) {
      if (parsed.hasBang) hasBreaking = true;
      if (parsed.type === 'feat') hasFeat = true;
      if (parsed.type === 'fix') hasFix = true;
    }
  }

  if (hasBreaking) return 'major';
  if (hasFeat) return 'minor';
  // Default to patch (even for chores/docs/etc.) so nothing is left behind
  return 'patch';
}

function groupCommits(commits) {
  /** @type {Map<string, { description: string; original: string }[]>} */
  const groups = new Map();

  for (const { subject, body } of commits) {
    const parsed = parseConventionalCommit(subject);
    let type = 'other';
    let description = subject;
    let isBreaking = false;

    if (parsed) {
      type = parsed.type;
      description = parsed.description;
      isBreaking = parsed.hasBang;
    }

    // Upgrade to breaking group if flagged
    if (isBreaking || /BREAKING\s+CHANGE:/iu.test(body)) {
      type = 'breaking';
      // Use the original subject as description for breaking changes
      description = subject;
    }

    if (!groups.has(type)) groups.set(type, []);
    groups.get(type).push({ description, original: subject });
  }

  return groups;
}

function formatChangelogEntries(commits) {
  const groups = groupCommits(commits);
  const lines = [];

  for (const type of COMMIT_TYPE_ORDER) {
    const entries = groups.get(type);
    if (!entries?.length) continue;

    lines.push(`### ${COMMIT_TYPE_LABELS[type]}`);
    for (const { description } of entries) {
      lines.push(`- ${description}`);
    }
    lines.push('');
  }

  return lines.join('\n').trimEnd();
}

function bumpVersion(version, type) {
  const [major, minor, patch] = version.split('.').map(Number);

  if ([major, minor, patch].some((value) => Number.isNaN(value))) {
    throw new Error(`Unsupported version format: ${version}`);
  }

  if (type === 'patch') return `${major}.${minor}.${patch + 1}`;
  if (type === 'minor') return `${major}.${minor + 1}.0`;
  if (type === 'major') return `${major + 1}.0.0`;

  throw new Error(`Unknown release type: ${type}`);
}

function updateChangelog(changelog, nextVersion, newEntries) {
  if (!changelog.startsWith(CHANGELOG_HEADER)) {
    throw new Error('CHANGELOG.md header not recognized');
  }

  const body = changelog.slice(CHANGELOG_HEADER.length);
  const unreleasedMatch = body.match(/^## Unreleased\n([\s\S]*?)(?=^##\s+|$)/mu);
  const existingUnreleased = unreleasedMatch?.[1]?.trim();

  const today = new Date().toISOString().slice(0, 10);
  const unreleasedSection = existingUnreleased || '- Release notes pending.';
  const remainingBody = unreleasedMatch
    ? body.slice(unreleasedMatch[0].length).replace(/^\n+/u, '')
    : body;

  const newSection = `## ${nextVersion} - ${today}\n\n${newEntries || unreleasedSection}\n`;

  return `${CHANGELOG_HEADER}## Unreleased\n\n${unreleasedSection}\n\n${newSection}\n${remainingBody}`.trimEnd() + '\n';
}

function ensureCleanWorktree() {
  const status = runGit(['status', '--porcelain']);
  if (status) {
    throw new Error('Working tree not clean. Commit or stash changes first.');
  }
}

async function main() {
  ensureCleanWorktree();

  const lastTag = getLastTag();
  const commits = getCommitsSince(lastTag);

  if (commits.length === 0) {
    console.log('No new commits since last release. Nothing to do.');
    return;
  }

  const bumpType = getBumpType(commits);
  const changelogEntries = formatChangelogEntries(commits);

  console.log(`Commits since ${lastTag || 'beginning'}: ${commits.length}`);
  console.log(`Detected bump: ${bumpType}`);
  console.log('');
  console.log(changelogEntries);

  const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8'));
  const changelog = await readFile(changelogPath, 'utf8');
  const nextVersion = bumpVersion(packageJson.version, bumpType);
  const nextTag = `${TAG_PREFIX}${nextVersion}`;

  if (runGit(['tag', '--list', nextTag]) === nextTag) {
    throw new Error(`Tag ${nextTag} already exists`);
  }

  packageJson.version = nextVersion;

  await writeFile(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`, 'utf8');
  await writeFile(changelogPath, updateChangelog(changelog, nextVersion, changelogEntries), 'utf8');

  runGit(['add', 'package.json', 'CHANGELOG.md']);
  runGit(['commit', '-m', `release(${PACKAGE_SHORT}): ${nextTag}`]);
  runGit(['tag', nextTag]);

  console.log(`\nCreated release commit and tag ${nextTag}`);
}

await main();
