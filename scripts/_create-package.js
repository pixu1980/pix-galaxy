// @ts-check
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { log, logTitle } from './_cli.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const rootDir = resolve(__dirname, '..');
const scope = '@pix-galaxy';
const sharedPackageName = '@pix-galaxy/shared';
const customElementSkillRoot = join(rootDir, '.github', 'skills', 'pix-custom-element', 'scripts');
const templateEngineRuntimeFile = join(rootDir, '.github', 'skills', 'pix-template-engine', 'assets', 'tagged-runtime', 'index.js');

/**
 * @param {string} packageName
 * @returns {boolean}
 */
export function isValidPackageName(packageName) {
  return /^[a-z][a-z0-9-]*$/u.test(packageName);
}

/**
 * @param {string} packageName
 * @returns {string}
 */
export function toPascalCase(packageName) {
  return packageName
    .split('-')
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join('');
}

/**
 * @param {string} sourceRoot
 * @param {string} targetRoot
 * @param {string[]} [skipEntries=[]]
 * @returns {Record<string, string>}
 */
function collectFileMap(sourceRoot, targetRoot, skipEntries = []) {
  /** @type {Record<string, string>} */
  const files = {};

  /**
   * @param {string} currentSource
   */
  const walk = (currentSource) => {
    for (const entry of readdirSync(currentSource, { withFileTypes: true })) {
      if (skipEntries.includes(entry.name)) {
        continue;
      }

      const sourcePath = join(currentSource, entry.name);
      const relativePath = sourcePath.slice(sourceRoot.length + 1).split('\\').join('/');
      const targetPath = join(targetRoot, relativePath).split('\\').join('/');

      if (entry.isDirectory()) {
        walk(sourcePath);
        continue;
      }

      if (entry.isFile()) {
        files[targetPath] = readFileSync(sourcePath, 'utf8');
      }
    }
  };

  walk(sourceRoot);
  return files;
}

/**
 * @param {string} packageName
 * @returns {string}
 */
function buildPackageDescription(packageName) {
  return `${toPascalCase(packageName)} Web Component`;
}

/**
 * @param {string} packageName
 * @returns {Record<string, string>}
 */
export function buildPackageFiles(packageName) {
  const componentName = toPascalCase(packageName);
  const componentDir = `src/components/${componentName}`;
  const sharedFiles = {
    ...collectFileMap(join(customElementSkillRoot, 'decorator'), '../shared/decorator'),
    ...collectFileMap(join(customElementSkillRoot, 'events'), '../shared/events'),
    '../shared/package.json': `${JSON.stringify({
      name: sharedPackageName,
      private: true,
      type: 'module',
      exports: {
        './decorator/index.js': './decorator/index.js',
        './events/index.js': './events/index.js',
        './template-engine/index.js': './template-engine/index.js',
      },
    }, null, 2)}\n`,
    '../shared/README.md': '# @pix-galaxy/shared\n\nShared runtime helpers for pix-galaxy component packages.\n',
    'src/_css.d.ts': "declare module '*.css' {\n  const content: string;\n  export default content;\n}\n",
    '../shared/template-engine/index.js': readFileSync(templateEngineRuntimeFile, 'utf8'),
  };

  const files = {
    ...sharedFiles,
    'src/index.js': `// @ts-check\nexport { ${componentName}, normalizeVariant } from './components/${componentName}/${packageName}.js';\n`,
    [`${componentDir}/${packageName}.consts.js`]: `// @ts-check\n\n/**\n * @typedef {'default' | 'outlined'} ${componentName}Variant\n */\n\nexport const DEFAULT_VARIANT = 'default';\nexport const SUPPORTED_VARIANTS = ['default', 'outlined'];\nexport const ROOT_PART = 'root';\nexport const CONTENT_PART = 'content';\n`,
    [`${componentDir}/${packageName}.utils.js`]: `// @ts-check\n\nimport { DEFAULT_VARIANT, SUPPORTED_VARIANTS } from './${packageName}.consts.js';\n\n/**\n * Normalize a variant value for ${packageName}.\n *\n * @param {string | null | undefined} value\n * @returns {import('./${packageName}.consts.js').${componentName}Variant}\n */\nexport function normalizeVariant(value) {\n  return SUPPORTED_VARIANTS.includes(String(value)) ? /** @type {import('./${packageName}.consts.js').${componentName}Variant} */ (value) : DEFAULT_VARIANT;\n}\n\n/**\n * @param {ChildNode[]} nodes\n * @returns {ChildNode[]}\n */\nexport function filterRenderableNodes(nodes) {\n  return nodes.filter((node) => !(node.nodeType === Node.ELEMENT_NODE && node instanceof HTMLElement && node.getAttribute('data-part') === 'root'));\n}\n`,
    [`${componentDir}/${packageName}.template.js`]: `// @ts-check\n\nimport TemplateEngine from '${sharedPackageName}/template-engine/index.js';\nimport { CONTENT_PART, ROOT_PART } from './${packageName}.consts.js';\n\nconst engine = new TemplateEngine();\n\n/**\n * Render the structural light DOM shell for ${packageName}.\n */\nexport const renderRoot = engine.html\`\n  <div data-part="\${ROOT_PART}">\n    <div data-part="\${CONTENT_PART}"></div>\n  </div>\n\`;\n`,
    [`${componentDir}/${packageName}.attributes.js`]: `// @ts-check\n\nimport { normalizeVariant } from './${packageName}.utils.js';\n\n/**\n * Attribute handlers for ${componentName}.\n */\nexport default {\n  /**\n   * @this {HTMLElement}\n   * @param {string | null} _oldValue\n   * @param {string | null} newValue\n   */\n  variant(_oldValue, newValue) {\n    const variant = normalizeVariant(newValue);\n    this.setAttribute('data-variant', variant);\n  },\n};\n`,
    [`${componentDir}/${packageName}.events.js`]: `// @ts-check\n\n/**\n * DOM event handlers for ${componentName}.\n */\nexport default {};\n`,
    [`${componentDir}/${packageName}.js`]: `// @ts-check\n\nimport styles from './styles/${packageName}.css';\n\nimport { componentDecorator } from '${sharedPackageName}/decorator/index.js';\n\nimport attributes from './${packageName}.attributes.js';\nimport events from './${packageName}.events.js';\nimport { CONTENT_PART } from './${packageName}.consts.js';\nimport { renderRoot } from './${packageName}.template.js';\nimport { filterRenderableNodes, normalizeVariant } from './${packageName}.utils.js';\n\n/**\n * ${componentName} Web Component.\n *\n * @element ${packageName}\n * @attr {'default' | 'outlined'} [variant='default'] - Visual variant.\n */\nexport class ${componentName} extends HTMLElement {\n  static attributes = attributes;\n  static events = events;\n  static styles = styles;\n\n  static {\n    componentDecorator(this);\n  }\n\n  /**\n   * @returns {import('./${packageName}.consts.js').${componentName}Variant}\n   */\n  get variant() {\n    return normalizeVariant(this.getAttribute('variant'));\n  }\n\n  /**\n   * @param {string | null | undefined} value\n   */\n  set variant(value) {\n    this.setAttribute('variant', normalizeVariant(value));\n  }\n\n  onRender() {\n    const existingRoot = this.querySelector(':scope > [data-part="root"]');\n\n    if (!existingRoot) {\n      const nodes = filterRenderableNodes(Array.from(this.childNodes));\n      this.innerHTML = renderRoot({});\n      this.querySelector(':scope > [data-part="content"]')?.append(...nodes);\n    }\n\n    this.#syncState();\n  }\n\n  /**\n   * @param {string} name\n   * @param {string | null} _oldValue\n   * @param {string | null} newValue\n   */\n  onAttributeChanged(name, _oldValue, newValue) {\n    if (name === 'variant') {\n      this.setAttribute('data-variant', normalizeVariant(newValue));\n    }\n  }\n\n  #syncState() {\n    const variant = this.variant;\n    this.setAttribute('variant', variant);\n    this.setAttribute('data-variant', variant);\n\n    const content = this.querySelector(':scope > [data-part="' + CONTENT_PART + '"]');\n    if (content) {\n      content.setAttribute('data-variant', variant);\n    }\n  }\n}\n\nexport { normalizeVariant } from './${packageName}.utils.js';\nexport default ${componentName};\n`,
    [`${componentDir}/styles/${packageName}.css`]: `@import './_core.css' layer(components.${packageName});\n@import './states/_states.css' layer(components.${packageName});\n`,
    [`${componentDir}/styles/_core.css`]: `:root {\n  --${packageName}--padding: var(--space-4);\n  --${packageName}--color: var(--color-text);\n  --${packageName}--background-color: var(--color-surface);\n  --${packageName}--border-color: var(--color-border);\n  --${packageName}--border-radius: var(--radius-control);\n}\n\n${packageName} {\n  display: block;\n}\n\n${packageName} > [data-part='root'] {\n  display: grid;\n  gap: var(--space-3);\n  padding: var(--${packageName}--padding);\n  color: var(--${packageName}--color);\n  background-color: var(--${packageName}--background-color);\n  border: 0.1rem solid var(--${packageName}--border-color);\n  border-radius: var(--${packageName}--border-radius);\n}\n`,
    [`${componentDir}/styles/states/_states.css`]: `${packageName}[variant='outlined'] > [data-part='root'] {\n  background-color: transparent;\n}\n`,
    'tests/index.js': `// @ts-check\nimport './_normalize-variant.test.js';\nimport './_component.test.js';\n`,
    'tests/_normalize-variant.test.js': `// @ts-check\nimport test from 'node:test';\nimport assert from 'node:assert/strict';\nimport { normalizeVariant } from '../src/components/${componentName}/${packageName}.utils.js';\n\ntest('normalizeVariant returns default for null', () => {\n  assert.equal(normalizeVariant(null), 'default');\n});\n\ntest('normalizeVariant preserves outlined', () => {\n  assert.equal(normalizeVariant('outlined'), 'outlined');\n});\n`,
    'tests/_component.test.js': `// @ts-check\nimport test from 'node:test';\nimport assert from 'node:assert/strict';\nimport { DEFAULT_VARIANT } from '../src/components/${componentName}/${packageName}.consts.js';\n\ntest('default variant constant is stable', () => {\n  assert.equal(DEFAULT_VARIANT, 'default');\n});\n`,
    'docs/content/getting-started.md': `# Getting Started\n\n${scope}/${packageName} is scaffolded as a browser-native Web Component with zero runtime dependencies. Documentation is rendered through the shared docs template during site builds.\n\n## Install\n\n\`\`\`bash\npnpm add ${scope}/${packageName}\n\`\`\`\n\n## Basic Usage\n\n\`\`\`html\n<script type="module">\n  import '${scope}/${packageName}';\n</script>\n\n<${packageName}>Hello pix-galaxy</${packageName}>\n\`\`\`\n\n## Local Development\n\n\`\`\`bash\npnpm --filter ${scope}/${packageName} build\npnpm --filter ${scope}/${packageName} test\npnpm --filter ${scope}/${packageName} docs:build\n\`\`\`\n`,
    'docs/content/examples.md': `# Examples\n\n## Default Variant\n\nShared docs builds surface fenced examples as interactive gallery cards.\n\n\`\`\`html\n<${packageName}>Default content</${packageName}>\n\`\`\`\n\n## Alternate Variant\n\nUse the outlined state when you want lower visual emphasis.\n\n\`\`\`html\n<${packageName} variant="outlined">Outlined content</${packageName}>\n\`\`\`\n`,
    'docs/content/api.md': `# API\n\n## Main exports\n\n- \`${componentName}\`\n- \`normalizeVariant(value?)\`\n\n## Attributes\n\n- \`variant\`\n\n## Parts\n\n- \`root\`\n- \`content\`\n`,
    'docs/content/releasing.md': `# Releasing\n\n## Local release commands\n\nRun release prep from repository root:\n\n\`\`\`bash\npnpm rel:patch\npnpm rel:minor\npnpm rel:major\n\`\`\`\n\nEach command updates package versions, regenerates \`CHANGELOG.md\`, rebuilds tracked \`dist/\` artifacts locally, creates a release commit, and creates a local tag.\n\nPush remains manual:\n\n\`\`\`bash\ngit push origin main --follow-tags\n\`\`\`\n`,
    'README.md': `# ${scope}/${packageName}\n\n${buildPackageDescription(packageName)} scaffold.\n`,
  };

  return files;
}

/**
 * @param {string} packageName
 * @returns {Record<string, unknown>}
 */
export function buildPackageManifest(packageName) {
  return {
    name: `${scope}/${packageName}`,
    version: '0.0.1',
    description: buildPackageDescription(packageName),
    type: 'module',
    files: ['dist', 'README.md', 'LICENSE'],
    main: './dist/index.js',
    module: './dist/index.js',
    types: './dist/index.d.ts',
    exports: {
      '.': {
        types: './dist/index.d.ts',
        import: './dist/index.js',
      },
      './package.json': './package.json',
    },
    scripts: {
      clean: `node ../../scripts/_clean.js ${packageName}`,
      build: `node ../../scripts/_build-package.js ${packageName}`,
      test: 'node --test tests/index.js',
      typecheck: 'pnpm exec tsc -p tsconfig.types.json --noEmit',
      validate: `node ../../scripts/_validate-package.js ${packageName}`,
      'docs:build': `node ../../scripts/_build-docs.js ${packageName}`,
      'docs:serve': `node ../../scripts/_serve-docs.js ${packageName}`,
    },
    devDependencies: {
      [sharedPackageName]: 'workspace:*',
    },
    dependencies: {},
  };
}

/**
 * @param {string} packageName
 * @returns {Promise<void>}
 */
export async function scaffoldPackage(packageName) {
  if (!packageName) {
    throw new Error('usage: node scripts/_create-package.js <package-name>');
  }

  if (!isValidPackageName(packageName)) {
    throw new Error('package name must be lowercase letters, numbers, and hyphens only');
  }

  const packageDir = join(rootDir, 'packages', packageName);
  if (existsSync(packageDir)) {
    throw new Error(`package already exists: packages/${packageName}`);
  }

  const componentName = toPascalCase(packageName);

  logTitle(`Creating ${scope}/${packageName}`);

  for (const dir of [
    packageDir,
    join(packageDir, 'src'),
    join(packageDir, 'tests'),
    join(packageDir, 'docs'),
  ]) {
    await mkdir(dir, { recursive: true });
  }

  writeFileSync(join(packageDir, 'package.json'), `${JSON.stringify(buildPackageManifest(packageName), null, 2)}\n`, 'utf8');
  writeFileSync(join(packageDir, 'tsconfig.types.json'), `${JSON.stringify({
    extends: '../../tsconfig.types.json',
    compilerOptions: {
      rootDir: './src',
      outDir: './dist',
    },
    include: ['src/**/*.js', 'src/**/*.d.ts'],
  }, null, 2)}\n`, 'utf8');

  for (const [relativePath, content] of Object.entries(buildPackageFiles(packageName))) {
    const targetPath = join(packageDir, relativePath);
    await mkdir(join(targetPath, '..'), { recursive: true });
    writeFileSync(targetPath, content, 'utf8');
  }

  log('success', `Package created: packages/${packageName}`);
  log('info', `Next: pnpm --filter ${scope}/${packageName} build`);
}

const currentFile = fileURLToPath(import.meta.url);
const invokedFile = process.argv[1] ? resolve(process.argv[1]) : '';

if (invokedFile === currentFile) {
  scaffoldPackage(process.argv[2] ?? '').catch((error) => {
    log('error', error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
