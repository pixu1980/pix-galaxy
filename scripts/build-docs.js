// @ts-check
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { rm, mkdir, cp } from "node:fs/promises";
import { resolve, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const rootDir = resolve(__dirname, "..");

const targetPackage = process.argv[2];
const siteDir = join(rootDir, "site");

const packagesDir = join(rootDir, "packages");

if (!existsSync(packagesDir)) {
  console.error("no packages directory found");
  process.exit(1);
}

// Determine which packages to process
const allPackages = readdirSync(packagesDir);
const packages = targetPackage ? [targetPackage] : allPackages;

if (targetPackage && !allPackages.includes(targetPackage)) {
  console.error(`package not found: ${targetPackage}`);
  process.exit(1);
}

// For full docs build, recreate site dir
if (!targetPackage) {
  if (existsSync(siteDir)) {
    await rm(siteDir, { recursive: true, force: true });
  }
  await mkdir(siteDir, { recursive: true });
}

console.log(`\nbuilding docs...\n`);

for (const pkg of packages) {
  const packageDir = join(packagesDir, pkg);
  const docsDir = join(packageDir, "docs");
  const distDir = join(packageDir, "dist");
  const sitePackageDir = join(siteDir, pkg);

  if (!existsSync(docsDir)) {
    console.warn(`  skipping ${pkg}: no docs folder`);
    continue;
  }

  await mkdir(sitePackageDir, { recursive: true });

  // Copy docs files
  await cp(docsDir, sitePackageDir, { recursive: true });

  // Copy dist if it exists
  if (existsSync(distDir)) {
    await cp(distDir, join(sitePackageDir, "dist"), { recursive: true });
  } else {
    console.warn(`  warning: ${pkg} dist not found, run build first`);
  }

  console.log(`  built docs for ${pkg}`);
}

// Generate root index only for full build
if (!targetPackage) {
  const packageLinks = allPackages
    .filter((pkg) => existsSync(join(packagesDir, pkg, "docs")))
    .map((pkg) => {
      const pkgJsonPath = join(packagesDir, pkg, "package.json");
      const pkgName = existsSync(pkgJsonPath)
        ? JSON.parse(readFileSync(pkgJsonPath, "utf-8")).name
        : pkg;
      return `    <li><a href="./${pkg}/">${pkgName}</a></li>`;
    })
    .join("\n");

  const rootIndex = `<!doctype html>
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

  writeFileSync(join(siteDir, "index.html"), rootIndex, "utf-8");
  console.log("\n  built site/index.html");
}

console.log("\ndocs build complete");
