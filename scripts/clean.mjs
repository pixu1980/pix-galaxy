// @ts-check
import { rm } from "node:fs/promises";
import { resolve, join } from "node:path";
import { existsSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const rootDir = resolve(__dirname, "..");

const targetPackage = process.argv[2];

/**
 * Remove a directory if it exists.
 * @param {string} dir
 */
async function removeDir(dir) {
  if (existsSync(dir)) {
    await rm(dir, { recursive: true, force: true });
    console.log(`removed ${dir.replace(rootDir + "/", "")}`);
  }
}

if (targetPackage) {
  const packageDir = join(rootDir, "packages", targetPackage);
  if (!existsSync(packageDir)) {
    console.error(`package not found: ${targetPackage}`);
    process.exit(1);
  }
  await removeDir(join(packageDir, "dist"));
} else {
  await removeDir(join(rootDir, "site"));
  const packagesDir = join(rootDir, "packages");
  if (existsSync(packagesDir)) {
    const packages = readdirSync(packagesDir);
    for (const pkg of packages) {
      await removeDir(join(packagesDir, pkg, "dist"));
    }
  }
}

console.log("clean done");
