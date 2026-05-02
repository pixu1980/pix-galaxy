// @ts-check
import { readdirSync, existsSync, readFileSync } from "node:fs";
import { resolve, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const rootDir = resolve(__dirname, "..");
const packagesDir = join(rootDir, "packages");

if (!existsSync(packagesDir)) {
  console.log("no packages found");
  process.exit(0);
}

const folders = readdirSync(packagesDir);

console.log(`\npix-galaxy packages (${folders.length}):\n`);

for (const folder of folders) {
  const pkgPath = join(packagesDir, folder, "package.json");
  if (existsSync(pkgPath)) {
    const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
    console.log(`  ${folder.padEnd(20)} ${pkg.name}`);
  }
}

console.log("");
