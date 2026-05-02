// @ts-check

import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DEFAULTS = {
  mode: 'app',
  brandName: 'Pix Design System',
  accent: '#3f6df6',
  font: 'Aptos, "Avenir Next", "Helvetica Neue", sans-serif',
  radius: 'comfortable',
  density: 'comfortable',
  packageName: '@pix-galaxy/pix-design-system',
  packageDest: 'packages/pix-design-system',
  docsSiteDest: 'docs/design-system-site',
};

const RADIUS_VALUES = {
  subtle: '0.4rem',
  comfortable: '0.8rem',
  round: '1.6rem',
};

const DENSITY_VALUES = {
  compact: '0.875',
  comfortable: '1',
  spacious: '1.125',
};

const MAX_TEMPLATE_REDIRECTS = 8;

/**
 * @param {string[]} argv
 * @param {string} flag
 * @param {string} fallback
 * @returns {string}
 */
const getArg = (argv, flag, fallback = '') => {
  const index = argv.findIndex((entry) => entry === flag);
  return index !== -1 ? argv[index + 1] ?? fallback : fallback;
};

/**
 * @typedef {{
 *   target: string;
 *   mode: "app" | "package";
 *   brandName: string;
 *   accent: string;
 *   font: string;
 *   radius: keyof typeof RADIUS_VALUES;
 *   density: keyof typeof DENSITY_VALUES;
 *   packageName: string;
 *   dest: string;
 *   docsSite: boolean;
 *   force: boolean;
 * }} InstallerOptions
 */

/**
 * @param {string[]} argv
 * @returns {InstallerOptions}
 */
export const parseArgs = (argv) => {
  const mode = getArg(argv, '--mode', DEFAULTS.mode);

  if (mode !== 'app' && mode !== 'package') {
    throw new Error('Invalid --mode. Use "app" or "package".');
  }

  const radius = getArg(argv, '--radius', DEFAULTS.radius);
  const density = getArg(argv, '--density', DEFAULTS.density);

  if (!Object.hasOwn(RADIUS_VALUES, radius)) {
    throw new Error('Invalid --radius. Use "subtle", "comfortable", or "round".');
  }

  if (!Object.hasOwn(DENSITY_VALUES, density)) {
    throw new Error('Invalid --density. Use "compact", "comfortable", or "spacious".');
  }

  return {
    target: path.resolve(getArg(argv, '--target', process.cwd())),
    mode,
    brandName: getArg(argv, '--brand-name', DEFAULTS.brandName),
    accent: getArg(argv, '--accent', DEFAULTS.accent),
    font: getArg(argv, '--font', DEFAULTS.font),
    radius,
    density,
    packageName: getArg(argv, '--package-name', DEFAULTS.packageName),
    dest: getArg(argv, '--dest', DEFAULTS.packageDest),
    docsSite: argv.includes('--docs-site'),
    force: argv.includes('--force'),
  };
};

/**
 * @param {string} filePath
 * @returns {Promise<boolean>}
 */
const fileExists = async (filePath) => {
  try {
    await readFile(filePath, 'utf8');
    return true;
  } catch {
    return false;
  }
};

/**
 * @param {string} sourceRoot
 * @param {string} targetRoot
 * @returns {Promise<Array<{ sourcePath: string; targetPath: string }>>}
 */
const collectTemplateFiles = async (sourceRoot, targetRoot) => {
  const entries = await readdir(sourceRoot, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const sourcePath = path.join(sourceRoot, entry.name);
    const targetPath = path.join(targetRoot, entry.name);

    if (entry.isDirectory()) {
      files.push(...await collectTemplateFiles(sourcePath, targetPath));
      continue;
    }

    if (entry.isFile()) {
      files.push({ sourcePath, targetPath });
    }
  }

  return files;
};

/**
 * @param {string} content
 * @param {InstallerOptions} options
 * @returns {string}
 */
const applyReplacements = (content, options) => {
  const replacements = {
    __BRAND_NAME__: options.brandName,
    __ACCENT__: options.accent,
    __FONT__: options.font,
    __RADIUS__: RADIUS_VALUES[options.radius],
    __DENSITY__: DENSITY_VALUES[options.density],
    __PACKAGE_NAME__: options.packageName,
    __STYLE_ROOT__: options.mode === 'package' ? 'src' : 'src/styles',
    __INSTALL_LINE__: options.mode === 'package'
      ? `Import the design system CSS from \`${options.packageName}/css\`.`
      : 'Import `src/styles/index.css` from the application entrypoint.',
  };

  return Object.entries(replacements).reduce((nextContent, [token, value]) => {
    return nextContent.replaceAll(token, value);
  }, content);
};

/**
 * @param {string} sourcePath
 * @param {Set<string>} [visited]
 * @returns {Promise<string>}
 */
const readTemplateContent = async (sourcePath, visited = new Set()) => {
  const normalizedPath = path.resolve(sourcePath);

  if (visited.has(normalizedPath) || visited.size > MAX_TEMPLATE_REDIRECTS) {
    throw new Error(`Template indirection loop detected at ${normalizedPath}`);
  }

  visited.add(normalizedPath);
  const content = await readFile(normalizedPath, 'utf8');
  const cssImportMatch = content.match(/^\s*@import\s+["']([^"']+)["'];\s*$/);
  const markdownIncludeMatch = content.match(/^\s*<!--\s*@include\s+"([^"]+)"\s*-->\s*$/);

  if (cssImportMatch) {
    const nextPath = path.resolve(path.dirname(normalizedPath), cssImportMatch[1]);
    return readTemplateContent(nextPath, visited);
  }

  if (markdownIncludeMatch) {
    const nextPath = path.resolve(path.dirname(normalizedPath), markdownIncludeMatch[1]);
    return readTemplateContent(nextPath, visited);
  }

  return content;
};

/**
 * @param {Array<{ targetPath: string }>} files
 * @param {boolean} force
 * @returns {Promise<void>}
 */
const assertNoConflicts = async (files, force) => {
  if (force) {
    return;
  }

  const conflicts = [];

  for (const file of files) {
    if (await fileExists(file.targetPath)) {
      conflicts.push(file.targetPath);
    }
  }

  if (conflicts.length > 0) {
    throw new Error(`Refusing to overwrite existing files without --force:\n${conflicts.join('\n')}`);
  }
};

/**
 * @param {Array<{ sourcePath: string; targetPath: string }>} files
 * @param {InstallerOptions} options
 * @returns {Promise<string[]>}
 */
const writeTemplateFiles = async (files, options) => {
  const written = [];

  for (const file of files) {
    const content = await readTemplateContent(file.sourcePath);
    const rendered = applyReplacements(content, options);
    await mkdir(path.dirname(file.targetPath), { recursive: true });
    await writeFile(file.targetPath, rendered, 'utf8');
    written.push(file.targetPath);
  }

  return written;
};

/**
 * @param {InstallerOptions} options
 * @returns {Promise<{
 *   mode: string;
 *   target: string;
 *   destination: string;
 *   writtenFiles: string[];
 *   docsSite: string | null;
 *   nextSteps: string[];
 * }>}
 */
export const installDesignSystem = async (options) => {
  const currentFile = fileURLToPath(import.meta.url);
  const skillRoot = path.resolve(path.dirname(currentFile), '..');
  const starterRoot = path.join(skillRoot, 'assets', 'design-system', options.mode);
  const targetRoot = options.mode === 'package'
    ? path.join(options.target, options.dest)
    : options.target;

  const files = await collectTemplateFiles(starterRoot, targetRoot);
  const docsSiteFiles = options.docsSite
    ? await collectTemplateFiles(
      path.join(skillRoot, 'assets', 'examples', 'docs-site'),
      path.join(options.target, DEFAULTS.docsSiteDest)
    )
    : [];

  const allFiles = [...files, ...docsSiteFiles];
  await assertNoConflicts(allFiles, options.force);
  const writtenFiles = await writeTemplateFiles(allFiles, options);

  return {
    mode: options.mode,
    target: options.target,
    destination: targetRoot,
    writtenFiles,
    docsSite: options.docsSite ? path.join(options.target, DEFAULTS.docsSiteDest) : null,
    nextSteps: options.mode === 'package'
      ? [
        `Import ${options.packageName}/css from consuming apps.`,
        `Review ${path.join(options.dest, 'docs/design-system.md')}.`,
      ]
      : [
        'Import src/styles/index.css from the app entrypoint.',
        'Review docs/design-system.md.',
      ],
  };
};

/**
 * @returns {Promise<void>}
 */
const main = async () => {
  const options = parseArgs(process.argv.slice(2));
  const summary = await installDesignSystem(options);
  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
};

const currentFile = fileURLToPath(import.meta.url);
const invokedFile = process.argv[1] ? path.resolve(process.argv[1]) : '';

if (invokedFile === currentFile) {
  main().catch((error) => {
    process.stderr.write(`install-design-system error: ${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  });
}
