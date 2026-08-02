import { join } from 'node:path';

/**
 * Build the commit-and-tag-version command for a package.
 *
 * @param {string} root Project root.
 * @param {string} packageName npm package name (used as tag prefix).
 * @param {boolean} dryRun Preview mode (no commit/tag).
 * @param {boolean} [firstRelease] Use --first-release for initial publish.
 * @returns {string} Executable command string.
 */
export function standardVersionCommand(root, packageName, dryRun, firstRelease = false) {
  const executable = join(root, 'node_modules', '.bin', 'commit-and-tag-version');
  const mode = dryRun ? '--dry-run' : '--no-verify';
  const firstReleaseFlag = firstRelease ? '--first-release ' : '';

  return `"${executable}" ${firstReleaseFlag}${mode} --tag-prefix "${packageName}@"`;
}
