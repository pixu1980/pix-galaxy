// @ts-check
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { cp, mkdir, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join, resolve } from 'node:path';
import { log, logTitle } from './_cli.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const rootDir = resolve(__dirname, '..');
const siteDir = join(rootDir, 'site');
const packagesDir = join(rootDir, 'packages');

/**
 * @param {string[]} allPackages
 * @param {string | null} targetPackage
 * @returns {string[]}
 */
export function resolvePackages(allPackages, targetPackage) {
  if (targetPackage === null) {
    return allPackages;
  }

  if (!allPackages.includes(targetPackage)) {
    throw new Error(`package not found: ${targetPackage}`);
  }

  return [targetPackage];
}

/**
 * @param {Array<{ folder: string; packageName: string }>} packageEntries
 * @returns {string}
 */
export function renderRootIndex(packageEntries) {
  const packageLinks = packageEntries
    .map((entry) => `    <li><a href="./${entry.folder}/">${entry.packageName}</a></li>`)
    .join('\n');

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>pix-galaxy — Web Components</title>
    <style>
      body { font-family: system-ui, sans-serif; max-width: 800px; margin: 2rem auto; padding: 0 1rem; }
      h1 { font-size: 2rem; }
      ul { list-style: none; padding: 0; }
      li { margin: 0.5rem 0; }
      a { color: inherit; text-decoration: underline; font-size: 1.1rem; }
    </style>
  </head>
  <body>
    <main>
      <h1>pix-galaxy</h1>
      <p>Zero-runtime-dependency vanilla JS Web Components</p>
      <nav aria-label="Package list">
        <ul>
${packageLinks}
        </ul>
      </nav>
    </main>
  </body>
</html>
`;
}

/**
 * @param {string | null} targetPackage
 * @returns {Promise<void>}
 */
export async function buildDocsSite(targetPackage = null) {
  if (!existsSync(packagesDir)) {
    throw new Error('no packages directory found');
  }

  const allPackages = readdirSync(packagesDir);
  const packages = resolvePackages(allPackages, targetPackage);

  if (targetPackage === null) {
    if (existsSync(siteDir)) {
      await rm(siteDir, { recursive: true, force: true });
    }

    await mkdir(siteDir, { recursive: true });
  }

  logTitle('Building documentation site');

  for (const pkg of packages) {
    const packageDir = join(packagesDir, pkg);
    const docsDir = join(packageDir, 'docs');
    const distDir = join(packageDir, 'dist');
    const sitePackageDir = join(siteDir, pkg);

    if (!existsSync(docsDir)) {
      log('warn', `Skipping ${pkg}: docs/ not found`);
      continue;
    }

    await mkdir(sitePackageDir, { recursive: true });
    await cp(docsDir, sitePackageDir, { recursive: true });

    if (existsSync(distDir)) {
      await cp(distDir, join(sitePackageDir, 'dist'), { recursive: true });
    } else {
      log('warn', `${pkg}: dist/ not found, run build first`);
    }

    log('success', `Built docs for ${pkg}`);
  }

  if (targetPackage === null) {
    const packageEntries = allPackages
      .filter((pkg) => existsSync(join(packagesDir, pkg, 'docs')))
      .map((pkg) => {
        const pkgJsonPath = join(packagesDir, pkg, 'package.json');
        const packageName = existsSync(pkgJsonPath)
          ? JSON.parse(readFileSync(pkgJsonPath, 'utf8')).name
          : pkg;

        return { folder: pkg, packageName };
      });

    writeFileSync(join(siteDir, 'index.html'), renderRootIndex(packageEntries), 'utf8');
    log('success', 'Built site/index.html');
  }

  log('success', 'Documentation build complete');
}

const currentFile = fileURLToPath(import.meta.url);
const invokedFile = process.argv[1] ? resolve(process.argv[1]) : '';

if (invokedFile === currentFile) {
  buildDocsSite(process.argv[2] ?? null).catch((error) => {
    log('error', error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
