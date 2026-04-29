// @ts-check
import { existsSync } from "node:fs";
import { rm, mkdir } from "node:fs/promises";
import { resolve, join } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";
import * as esbuild from "esbuild";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const rootDir = resolve(__dirname, "..");

const packageName = process.argv[2];

if (!packageName) {
  console.error("usage: node scripts/build-package.mjs <package-folder-name>");
  process.exit(1);
}

const packageDir = join(rootDir, "packages", packageName);

if (!existsSync(packageDir)) {
  console.error(`package not found: ${packageName}`);
  process.exit(1);
}

const srcDir = join(packageDir, "src");
const distDir = join(packageDir, "dist");

console.log(`\nbuilding ${packageName}...\n`);

// Remove and recreate dist
if (existsSync(distDir)) {
  await rm(distDir, { recursive: true, force: true });
}
await mkdir(distDir, { recursive: true });

/** @type {import("esbuild").BuildOptions} */
const sharedOptions = {
  bundle: true,
  platform: "browser",
  target: "es2022",
  format: "esm",
  legalComments: "none",
  sourcemap: true,
};

// JS bundle
await esbuild.build({
  ...sharedOptions,
  entryPoints: [join(srcDir, "index.js")],
  outfile: join(distDir, "index.js"),
  minify: false,
});

// Minified JS bundle
await esbuild.build({
  ...sharedOptions,
  entryPoints: [join(srcDir, "index.js")],
  outfile: join(distDir, "index.min.js"),
  minify: true,
});

// CSS bundle
await esbuild.build({
  ...sharedOptions,
  entryPoints: [join(srcDir, "index.css")],
  outfile: join(distDir, "index.css"),
  minify: false,
});

// Minified CSS bundle
await esbuild.build({
  ...sharedOptions,
  entryPoints: [join(srcDir, "index.css")],
  outfile: join(distDir, "index.min.css"),
  minify: true,
});

// Generate TypeScript declarations from JSDoc
console.log("generating type declarations...");
execSync(
  `pnpm exec tsc -p packages/${packageName}/tsconfig.types.json`,
  { cwd: rootDir, stdio: "inherit" }
);

console.log(`\nbuild complete: packages/${packageName}/dist`);
