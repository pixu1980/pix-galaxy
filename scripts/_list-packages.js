// @ts-check
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { log, logTitle } from './_cli.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const rootDir = resolve(__dirname, '..');
const packagesDir = join(rootDir, 'packages');

/**
 * @param {Array<{ folder: string; packageName: string }>} entries
 * @returns {string[]}
 */
export function formatPackageRows(entries) {
  return entries.map((entry) => `${entry.folder.padEnd(20)} ${entry.packageName}`);
}

/**
 * @returns {void}
 */
export function listPackages() {
  if (!existsSync(packagesDir)) {
    log('warn', 'No packages found');
    return;
  }

  const entries = readdirSync(packagesDir)
    .map((folder) => {
      const pkgPath = join(packagesDir, folder, 'package.json');
      if (!existsSync(pkgPath)) {
        return null;
      }

      const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
      return { folder, packageName: pkg.name };
    })
    .filter(Boolean);

  logTitle(`pix-galaxy packages (${entries.length})`);
  for (const row of formatPackageRows(/** @type {Array<{ folder: string; packageName: string }>} */ (entries))) {
    console.log(`  ${row}`);
  }
}

const currentFile = fileURLToPath(import.meta.url);
const invokedFile = process.argv[1] ? resolve(process.argv[1]) : '';

if (invokedFile === currentFile) {
  listPackages();
}
