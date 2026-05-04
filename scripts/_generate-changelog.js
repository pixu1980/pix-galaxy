// @ts-check
import { execSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { log, logKeyValue, logTitle } from './_cli.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const rootDir = resolve(__dirname, '..');
const defaultOutputPath = join(rootDir, 'CHANGELOG.md');

export const SECTION_ORDER = Object.freeze([
  'Breaking',
  'Added',
  'Fixed',
  'Changed',
  'Documentation',
  'Testing',
  'Maintenance',
]);

const CATEGORY_BY_TYPE = Object.freeze({
  feat: 'Added',
  fix: 'Fixed',
  perf: 'Changed',
  refactor: 'Changed',
  docs: 'Documentation',
  test: 'Testing',
  build: 'Maintenance',
  ci: 'Maintenance',
  chore: 'Maintenance',
  revert: 'Maintenance',
  style: 'Maintenance',
});

const CHANGELOG_HEADER = [
  '# Changelog',
  '',
  'All notable changes to this project will be documented in this file.',
  '',
  'Generated from Conventional Commits via `pnpm changelog:generate`.',
  '',
].join('\n');

/**
 * @param {string} subject
 * @returns {{ type: string; scope: string | null; breaking: boolean; description: string } | null}
 */
export function parseConventionalCommit(subject) {
  const match = /^(?<type>build|chore|ci|docs|feat|fix|perf|refactor|revert|style|test)(?:\((?<scope>[^)]+)\))?(?<breaking>!)?: (?<description>.+)$/u.exec(subject.trim());

  if (!match?.groups) {
    return null;
  }

  return {
    type: match.groups.type,
    scope: match.groups.scope ?? null,
    breaking: match.groups.breaking === '!',
    description: match.groups.description,
  };
}

/**
 * @param {string[]} subjects
 * @returns {Record<(typeof SECTION_ORDER)[number], string[]>}
 */
export function groupConventionalCommits(subjects) {
  /** @type {Record<(typeof SECTION_ORDER)[number], string[]>} */
  const groups = {
    Breaking: [],
    Added: [],
    Fixed: [],
    Changed: [],
    Documentation: [],
    Testing: [],
    Maintenance: [],
  };

  for (const subject of subjects) {
    const parsed = parseConventionalCommit(subject);

    if (!parsed) {
      continue;
    }

    const label = parsed.scope
      ? `${parsed.scope}: ${parsed.description}`
      : parsed.description;

    if (parsed.breaking) {
      groups.Breaking.push(label);
      continue;
    }

    const category = CATEGORY_BY_TYPE[parsed.type] ?? 'Maintenance';
    groups[category].push(label);
  }

  return groups;
}

/**
 * @param {string[]} subjects
 * @returns {string}
 */
export function renderUnreleasedSection(subjects) {
  const groups = groupConventionalCommits(subjects);
  const lines = ['## Unreleased', ''];

  const hasEntries = SECTION_ORDER.some((section) => groups[section].length > 0);
  if (!hasEntries) {
    lines.push('- No conventional-commit changes detected since the last release tag.', '');
    return lines.join('\n');
  }

  for (const section of SECTION_ORDER) {
    if (groups[section].length === 0) {
      continue;
    }

    lines.push(`### ${section}`, '');
    for (const entry of groups[section]) {
      lines.push(`- ${entry}`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * @param {string} existingContent
 * @param {string[]} subjects
 * @returns {string}
 */
export function renderChangelog(existingContent, subjects) {
  const unreleasedSection = renderUnreleasedSection(subjects).trimEnd();
  const normalizedExisting = existingContent.trim();

  if (normalizedExisting.length === 0) {
    return `${CHANGELOG_HEADER}${unreleasedSection}\n`;
  }

  if (/^## Unreleased$/m.test(existingContent)) {
    return `${existingContent.replace(/## Unreleased[\s\S]*?(?=\n## |$)/u, `${unreleasedSection}\n`).trimEnd()}\n`;
  }

  const firstVersionHeading = existingContent.search(/\n## /u);
  if (firstVersionHeading !== -1) {
    const head = existingContent.slice(0, firstVersionHeading).trimEnd();
    const tail = existingContent.slice(firstVersionHeading).trimStart();
    return `${head}\n\n${unreleasedSection}\n\n${tail}`.trimEnd() + '\n';
  }

  return `${existingContent.trimEnd()}\n\n${unreleasedSection}\n`;
}

/**
 * @param {string} cwd
 * @returns {string | null}
 */
export function findLatestReleaseTag(cwd = rootDir) {
  try {
    return execSync('git describe --tags --abbrev=0 --match "v*"', {
      cwd,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim() || null;
  } catch {
    return null;
  }
}

/**
 * @param {string | null} fromRef
 * @param {string} cwd
 * @returns {string[]}
 */
export function readCommitSubjectsSince(fromRef, cwd = rootDir) {
  const range = fromRef ? `${fromRef}..HEAD` : 'HEAD';
  const output = execSync(`git log --no-merges --pretty=format:%s ${range}`, {
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
  }).trim();

  return output.length === 0 ? [] : output.split('\n');
}

/**
 * @param {string[]} argv
 * @returns {{ fromRef: string | null; outputPath: string }}
 */
export function parseArgs(argv) {
  /** @type {{ fromRef: string | null; outputPath: string }} */
  const options = {
    fromRef: null,
    outputPath: defaultOutputPath,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const entry = argv[index];

    if (entry === '--from') {
      options.fromRef = argv[index + 1] ?? null;
      index += 1;
      continue;
    }

    if (entry === '--output') {
      options.outputPath = resolve(rootDir, argv[index + 1] ?? 'CHANGELOG.md');
      index += 1;
      continue;
    }

    throw new Error(`unknown option: ${entry}`);
  }

  return options;
}

/**
 * @param {{ fromRef?: string | null; outputPath?: string; cwd?: string }} [options]
 * @returns {{ fromRef: string | null; outputPath: string; commitCount: number }}
 */
export function generateChangelog(options = {}) {
  const cwd = options.cwd ?? rootDir;
  const fromRef = options.fromRef ?? findLatestReleaseTag(cwd);
  const outputPath = options.outputPath ?? defaultOutputPath;
  const subjects = readCommitSubjectsSince(fromRef, cwd);
  const existing = existsSync(outputPath) ? readFileSync(outputPath, 'utf8') : '';
  const next = renderChangelog(existing, subjects);

  writeFileSync(outputPath, next, 'utf8');

  return {
    fromRef,
    outputPath,
    commitCount: subjects.length,
  };
}

const currentFile = fileURLToPath(import.meta.url);
const invokedFile = process.argv[1] ? resolve(process.argv[1]) : '';

if (invokedFile === currentFile) {
  try {
    const options = parseArgs(process.argv.slice(2));
    const result = generateChangelog(options);

    logTitle('Generated changelog');
    logKeyValue('Output', result.outputPath);
    logKeyValue('From', result.fromRef ?? 'initial history');
    logKeyValue('Commits', String(result.commitCount));
    log('success', 'CHANGELOG.md updated');
  } catch (error) {
    log('error', error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
