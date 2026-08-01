import { readFile, readdir } from 'node:fs/promises';
import { watch } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { Marked, Renderer } from 'marked';

const projectRoot = process.cwd();
const docsDir = resolve(projectRoot, 'src/docs/content');
const packageJsonPath = resolve(projectRoot, 'package.json');

/**
 * Escape text for safe HTML interpolation.
 *
 * @param {unknown} value Value to stringify and escape.
 * @returns {string} HTML-safe string.
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
 * Convert markdown file name to docs slug.
 *
 * @param {string} fileName Markdown file name.
 * @returns {string} Slug without `.md` suffix.
 */
function slugFromFileName(fileName) {
  return fileName.replace(/\.md$/u, '');
}

/**
 * Extract first markdown heading as page title.
 *
 * @param {string} markdown Markdown source.
 * @param {string} fallback Title used when no h1 exists.
 * @returns {string} Resolved title.
 */
function titleFromMarkdown(markdown, fallback) {
  const match = markdown.match(/^#\s+(.+)$/mu);
  return match?.[1]?.trim() || fallback;
}

/**
 * Create a configured Marked renderer for docs pages.
 *
 * @returns {Marked} Marked parser instance.
 */
function createMarked() {
  const renderer = new Renderer();

  renderer.code = ({ text, lang = '' }) => {
    const language =
      String(lang || 'text')
        .trim()
        .toLowerCase() || 'text';
    return `<pre is="pix-highlighter" data-lang="${escapeHtml(language)}"><code>${escapeHtml(text)}</code></pre>`;
  };

  return new Marked({ renderer, gfm: true });
}

/**
 * Build docs metadata from package markdown files.
 *
 * @returns {Promise<{ docs: Array<{ slug: string, title: string, html: string, sourcePath: string }>, meta: { generatedAt: string, releaseTag: string, version: string } }>} Docs manifest.
 */
export async function buildDocsManifest() {
  const marked = createMarked();
  const [packageJsonText, docFileNames] = await Promise.all([
    readFile(packageJsonPath, 'utf8'),
    readdir(docsDir),
  ]);

  const packageJson = JSON.parse(packageJsonText);
  const docs = [];

  for (const fileName of docFileNames.filter((entry) => entry.endsWith('.md')).sort()) {
    const sourcePath = join('src/docs/content', fileName);
    const markdown = await readFile(resolve(docsDir, fileName), 'utf8');
    docs.push({
      slug: slugFromFileName(fileName),
      title: titleFromMarkdown(markdown, slugFromFileName(fileName)),
      html: marked.parse(markdown),
      sourcePath,
    });
  }

  return {
    docs,
    meta: {
      generatedAt: new Date().toISOString(),
      releaseTag: `v${packageJson.version}`,
      version: packageJson.version,
    },
  };
}

async function run() {
  const result = await buildDocsManifest();
  console.log(`Docs built: ${result.docs.length} pages for ${result.meta.releaseTag}`);
}

async function runWatch() {
  let timer = 0;

  const rebuild = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      run().catch((error) => {
        console.error(error);
      });
    }, 80);
  };

  await run();
  watch(docsDir, rebuild);
  watch(packageJsonPath, rebuild);
  console.log('Watching src/docs/content and package.json for docs validation');
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
  if (process.argv.includes('--watch')) {
    await runWatch();
  } else {
    await run();
  }
}
