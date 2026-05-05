// @ts-check
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { cp, mkdir, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join, resolve } from 'node:path';
import { Marked, Renderer } from 'marked';
import { log, logTitle } from './_cli.js';
import {
  renderPackageDocsScript,
  renderPackageDocsStyles,
  renderPackageDocsTokens,
} from './_docs/index.js';

export {
  renderPackageDocsScript,
  renderPackageDocsStyles,
};

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const rootDir = resolve(__dirname, '..');
const siteDir = join(rootDir, 'site');
const packagesDir = join(rootDir, 'packages');
const docsDisplayOrder = ['getting-started', 'examples', 'api', 'releasing'];

/**
 * @param {string} value
 * @returns {string}
 */
function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

/**
 * @param {string} markdown
 * @param {string} fallback
 * @returns {string}
 */
function titleFromMarkdown(markdown, fallback) {
  const match = markdown.match(/^#\s+(.+)$/mu);
  return match?.[1]?.trim() || fallback;
}

/**
 * @param {string} sourcePath
 * @returns {string}
 */
function slugFromPath(sourcePath) {
  return sourcePath.split('/').pop()?.replace(/\.md$/u, '') ?? 'overview';
}

/**
 * @returns {Marked}
 */
function createMarked() {
  const renderer = new Renderer();

  renderer.code = ({ text, lang = '' }) => {
    const language = String(lang || 'text').trim().toLowerCase() || 'text';
    return `<pre is="pix-highlighter" data-lang="${escapeHtml(language)}"><code>${escapeHtml(text)}</code></pre>`;
  };

  return new Marked({ renderer, gfm: true });
}

/**
 * @param {Array<{ markdown: string; sourcePath: string }>} entries
 * @returns {Array<{ slug: string; title: string; html: string; sourcePath: string }>}
 */
export function buildDocsPages(entries) {
  const marked = createMarked();

  return entries.map(({ markdown, sourcePath }) => ({
    slug: slugFromPath(sourcePath),
    title: titleFromMarkdown(markdown, slugFromPath(sourcePath)),
    html: String(marked.parse(markdown)),
    sourcePath,
  }));
}

/**
 * @param {string} markdown
 * @returns {Array<{ title: string; description: string; lang: string; code: string }>}
 */
export function buildExamplesGallery(markdown) {
  return String(markdown)
    .split(/^##\s+/mu)
    .slice(1)
    .map((section) => {
      const [headingLine = '', ...restLines] = section.split('\n');
      const title = headingLine.trim();
      const body = restLines.join('\n').trim();
      const codeMatch = body.match(/```([\w-]+)?\n([\s\S]*?)```/u);

      if (!title || !codeMatch) {
        return null;
      }

      const description = body.slice(0, codeMatch.index ?? 0).replace(/\s+/gu, ' ').trim();

      return {
        title,
        description: description || 'Example block from docs/content/examples.md.',
        lang: codeMatch[1] || 'text',
        code: codeMatch[2].trimEnd(),
      };
    })
    .filter(Boolean);
}

/**
 * @param {unknown} payload
 * @returns {string}
 */
function serializeForHtml(payload) {
  return JSON.stringify(payload).replaceAll('<', '\\u003c');
}

/**
 * @param {{
 *   packageName: string;
 *   tagName: string;
 *   description: string;
 *   docs: Array<{ slug: string; title: string; html: string; sourcePath: string }>;
 *   examples: Array<{ title: string; description: string; lang: string; code: string }>;
 *   meta: { version: string; releaseTag: string };
 *   highlighterModulePath: string;
 *   colorSchemeSwitcherModulePath: string;
 * }} data
 * @returns {string}
 */
export function renderPackageDocsHtml(data) {
  const payload = {
    packageName: data.packageName,
    tagName: data.tagName,
    summary: data.description,
    docs: data.docs,
    examples: data.examples,
    meta: data.meta,
    highlighterModulePath: data.highlighterModulePath,
    colorSchemeSwitcherModulePath: data.colorSchemeSwitcherModulePath,
  };

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="${escapeHtml(data.description)}" />
    <title>${escapeHtml(data.packageName)} docs</title>
    <link
      rel="icon"
      href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%23081523'/%3E%3Cpath d='M18 20h28v6H18zm0 10h18v6H18zm0 10h28v6H18z' fill='%237dd3fc'/%3E%3C/svg%3E"
    />
    <link rel="stylesheet" href="./index.css" />
    <script type="application/json" id="pix-docs-data">${serializeForHtml(payload)}</script>
    <script type="module" src="./index.js"></script>
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>
`;
}

/**
 * @param {string} fileName
 * @returns {number}
 */
function getDocsFileRank(fileName) {
  const slug = fileName.replace(/\.md$/u, '');
  const rank = docsDisplayOrder.indexOf(slug);
  return rank === -1 ? Number.MAX_SAFE_INTEGER : rank;
}

/**
 * @param {string} left
 * @param {string} right
 * @returns {number}
 */
function compareDocsFiles(left, right) {
  const rankDelta = getDocsFileRank(left) - getDocsFileRank(right);
  return rankDelta !== 0 ? rankDelta : left.localeCompare(right);
}

/**
 * @param {string} packageFolder
 * @param {string} dependencyPackage
 * @returns {string}
 */
function resolveSharedModulePath(packageFolder, dependencyPackage) {
  return packageFolder === dependencyPackage
    ? './dist/index.js'
    : `../${dependencyPackage}/dist/index.js`;
}

/**
 * @param {string} packageFolder
 * @returns {string}
 */
function resolveHighlighterModulePath(packageFolder) {
  return resolveSharedModulePath(packageFolder, 'pix-highlighter');
}

/**
 * @param {string} packageFolder
 * @returns {string}
 */
function resolveColorSchemeSwitcherModulePath(packageFolder) {
  return resolveSharedModulePath(packageFolder, 'pix-color-scheme-switcher');
}

/**
 * @param {string} packageFolder
 * @param {string} packageDir
 * @returns {{
 *   packageName: string;
 *   tagName: string;
 *   description: string;
 *   docs: Array<{ slug: string; title: string; html: string; sourcePath: string }>;
 *   examples: Array<{ title: string; description: string; lang: string; code: string }>;
 *   meta: { version: string; releaseTag: string };
 *   highlighterModulePath: string;
 *   colorSchemeSwitcherModulePath: string;
 * } | null}
 */
function buildPackageDocsModel(packageFolder, packageDir) {
  const contentDir = join(packageDir, 'docs', 'content');
  if (!existsSync(contentDir)) {
    return null;
  }

  const packageJsonPath = join(packageDir, 'package.json');
  const packageJson = existsSync(packageJsonPath)
    ? JSON.parse(readFileSync(packageJsonPath, 'utf8'))
    : { name: packageFolder, version: '0.0.0', description: `${packageFolder} docs` };
  const docEntries = readdirSync(contentDir)
    .filter((entry) => entry.endsWith('.md'))
    .sort(compareDocsFiles)
    .map((entry) => ({
      markdown: readFileSync(join(contentDir, entry), 'utf8'),
      sourcePath: `packages/${packageFolder}/docs/content/${entry}`,
    }));
  const docs = buildDocsPages(docEntries);
  const examplesMarkdown = docEntries.find((entry) => entry.sourcePath.endsWith('/examples.md'))?.markdown ?? '';

  return {
    packageName: packageJson.name ?? packageFolder,
    tagName: packageFolder,
    description: packageJson.description ?? `${packageFolder} docs`,
    docs,
    examples: buildExamplesGallery(examplesMarkdown),
    meta: {
      version: packageJson.version ?? '0.0.0',
      releaseTag: `v${packageJson.version ?? '0.0.0'}`,
    },
    highlighterModulePath: resolveHighlighterModulePath(packageFolder),
    colorSchemeSwitcherModulePath: resolveColorSchemeSwitcherModulePath(packageFolder),
  };
}

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
 * @param {string} packageFolder
 * @returns {{ folder: string; packageName: string }}
 */
function getPackageEntry(packageFolder) {
  const pkgJsonPath = join(packagesDir, packageFolder, 'package.json');
  const packageName = existsSync(pkgJsonPath)
    ? JSON.parse(readFileSync(pkgJsonPath, 'utf8')).name
    : packageFolder;

  return { folder: packageFolder, packageName };
}

/**
 * @param {string} packageFolder
 * @param {string} packageDir
 * @param {string} sitePackageDir
 * @returns {Promise<void>}
 */
async function copyPackageDist(packageFolder, packageDir, sitePackageDir) {
  const distDir = join(packageDir, 'dist');

  if (!existsSync(distDir)) {
    log('warn', `${packageFolder}: dist/ not found, run build first`);
    return;
  }

  await cp(distDir, join(sitePackageDir, 'dist'), { recursive: true });
}

/**
 * @param {string} sitePackageDir
 * @param {{
 *   packageName: string;
 *   tagName: string;
 *   description: string;
 *   docs: Array<{ slug: string; title: string; html: string; sourcePath: string }>;
 *   examples: Array<{ title: string; description: string; lang: string; code: string }>;
 *   meta: { version: string; releaseTag: string };
 *   highlighterModulePath: string;
 *   colorSchemeSwitcherModulePath: string;
 * }} docsModel
 * @returns {void}
 */
function writePackageDocsAssets(sitePackageDir, docsModel) {
  writeFileSync(join(sitePackageDir, 'index.html'), renderPackageDocsHtml(docsModel), 'utf8');
  writeFileSync(join(sitePackageDir, 'index.css'), renderPackageDocsStyles(), 'utf8');
  writeFileSync(join(sitePackageDir, 'index.js'), renderPackageDocsScript(), 'utf8');
  writeFileSync(join(sitePackageDir, '_ds-tokens.css'), renderPackageDocsTokens(), 'utf8');
}

/**
 * @param {string | null} targetPackage
 * @param {string} dependencyPackage
 * @param {string} warningMessage
 * @returns {Promise<void>}
 */
async function copySharedDocsDependencyDist(targetPackage, dependencyPackage, warningMessage) {
  if (targetPackage === null || targetPackage === dependencyPackage) {
    return;
  }

  const packageDir = join(packagesDir, dependencyPackage);
  const distDir = join(packageDir, 'dist');
  if (!existsSync(distDir)) {
    log('warn', warningMessage);
    return;
  }

  const sitePackageDir = join(siteDir, dependencyPackage);
  await mkdir(sitePackageDir, { recursive: true });
  await cp(distDir, join(sitePackageDir, 'dist'), { recursive: true });
}

/**
 * @param {string | null} targetPackage
 * @returns {Promise<void>}
 */
async function copySharedHighlighterDist(targetPackage) {
  await copySharedDocsDependencyDist(
    targetPackage,
    'pix-highlighter',
    'pix-highlighter: dist/ not found, docs code blocks will stay unenhanced'
  );
}

/**
 * @param {string | null} targetPackage
 * @returns {Promise<void>}
 */
async function copySharedColorSchemeSwitcherDist(targetPackage) {
  await copySharedDocsDependencyDist(
    targetPackage,
    'pix-color-scheme-switcher',
    'pix-color-scheme-switcher: dist/ not found, docs color scheme switcher will stay unavailable'
  );
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
  } else {
    await rm(join(siteDir, targetPackage), { recursive: true, force: true });
    await mkdir(siteDir, { recursive: true });
  }

  logTitle('Building documentation site');

  for (const pkg of packages) {
    const packageDir = join(packagesDir, pkg);
    const docsDir = join(packageDir, 'docs');
    const sitePackageDir = join(siteDir, pkg);

    if (!existsSync(docsDir)) {
      log('warn', `Skipping ${pkg}: docs/ not found`);
      continue;
    }

    await rm(sitePackageDir, { recursive: true, force: true });
    await mkdir(sitePackageDir, { recursive: true });
    await cp(docsDir, sitePackageDir, { recursive: true });

    const docsModel = buildPackageDocsModel(pkg, packageDir);
    if (docsModel) {
      writePackageDocsAssets(sitePackageDir, docsModel);
    }

    await copyPackageDist(pkg, packageDir, sitePackageDir);
    log('success', `Built docs for ${pkg}`);
  }

  await copySharedHighlighterDist(targetPackage);
  await copySharedColorSchemeSwitcherDist(targetPackage);

  if (targetPackage === null) {
    const packageEntries = allPackages
      .filter((pkg) => existsSync(join(packagesDir, pkg, 'docs')))
      .map(getPackageEntry);

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
