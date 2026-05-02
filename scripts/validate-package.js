// @ts-check
import { existsSync, readFileSync } from "node:fs";
import { resolve, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const rootDir = resolve(__dirname, "..");

const targetPackage = process.argv[2];

if (!targetPackage) {
  console.error("usage: node scripts/validate-package.js <package-folder-name>");
  process.exit(1);
}

const packageDir = join(rootDir, "packages", targetPackage);

let errors = 0;

/**
 * Assert a file exists.
 * @param {string} relativePath
 */
function requireFile(relativePath) {
  const full = join(packageDir, relativePath);
  if (!existsSync(full)) {
    console.error(`  missing: ${relativePath}`);
    errors++;
  } else {
    console.log(`  ok: ${relativePath}`);
  }
}

/**
 * Assert a condition.
 * @param {boolean} condition
 * @param {string} message
 */
function assert(condition, message) {
  if (!condition) {
    console.error(`  fail: ${message}`);
    errors++;
  } else {
    console.log(`  ok: ${message}`);
  }
}

console.log(`\nvalidating ${targetPackage}...\n`);

if (!existsSync(packageDir)) {
  console.error(`package not found: ${targetPackage}`);
  process.exit(1);
}

requireFile("package.json");
requireFile("src/index.js");
requireFile("src/index.css");
requireFile("README.md");
requireFile("docs/index.html");
requireFile("tsconfig.types.json");

const pkgPath = join(packageDir, "package.json");
if (existsSync(pkgPath)) {
  const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));

  const runtimeDeps = Object.keys(pkg.dependencies ?? {});
  assert(runtimeDeps.length === 0, "no runtime dependencies");

  const requiredScripts = ["build", "test", "typecheck", "validate", "docs:build"];
  for (const script of requiredScripts) {
    assert(typeof pkg.scripts?.[script] === "string", `script "${script}" defined`);
  }

  assert(pkg.exports?.["."]?.import != null, 'exports["."].import defined');
  assert(pkg.exports?.["./css"] != null, 'exports["./css"] defined');
  assert(pkg.type === "module", 'type is "module"');
}

console.log("");
if (errors > 0) {
  console.error(`validation failed with ${errors} error(s)`);
  process.exit(1);
} else {
  console.log(`validation passed for ${targetPackage}`);
}
