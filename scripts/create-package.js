// @ts-check
import { existsSync, writeFileSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import { resolve, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const rootDir = resolve(__dirname, "..");

const packageName = process.argv[2];

if (!packageName) {
  console.error("usage: node scripts/create-package.js <package-name>");
  console.error("example: node scripts/create-package.js pix-badge");
  process.exit(1);
}

if (!/^[a-z][a-z0-9-]*$/.test(packageName)) {
  console.error("package name must be lowercase letters, numbers, and hyphens only");
  process.exit(1);
}

const packageDir = join(rootDir, "packages", packageName);

if (existsSync(packageDir)) {
  console.error(`package already exists: packages/${packageName}`);
  process.exit(1);
}

const componentName = packageName
  .split("-")
  .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
  .join("");

const elementTag = packageName;
const scope = "@pix-galaxy";

console.log(`\ncreating package ${scope}/${packageName}...\n`);

// Create directory structure
const dirs = [
  packageDir,
  join(packageDir, "src"),
  join(packageDir, "test"),
  join(packageDir, "docs"),
];
for (const dir of dirs) {
  await mkdir(dir, { recursive: true });
}

// package.json
writeFileSync(
  join(packageDir, "package.json"),
  JSON.stringify(
    {
      name: `${scope}/${packageName}`,
      version: "0.1.0",
      description: `${componentName} Web Component`,
      type: "module",
      sideEffects: ["./dist/index.css"],
      files: ["dist", "README.md", "LICENSE"],
      main: "./dist/index.js",
      module: "./dist/index.js",
      types: "./dist/index.d.ts",
      exports: {
        ".": {
          types: "./dist/index.d.ts",
          import: "./dist/index.js",
        },
        "./css": "./dist/index.css",
        "./package.json": "./package.json",
      },
      scripts: {
        clean: `node ../../scripts/clean.js ${packageName}`,
        build: `node ../../scripts/build-package.js ${packageName}`,
        test: "node --test test/*.test.js",
        typecheck: "pnpm exec tsc -p tsconfig.types.json --noEmit",
        validate: `node ../../scripts/validate-package.js ${packageName}`,
        "docs:build": `node ../../scripts/build-docs.js ${packageName}`,
      },
      dependencies: {},
    },
    null,
    2
  ) + "\n"
);

// tsconfig.types.json
writeFileSync(
  join(packageDir, "tsconfig.types.json"),
  JSON.stringify(
    {
      extends: "../../tsconfig.types.json",
      compilerOptions: {
        rootDir: "./src",
        outDir: "./dist",
      },
      include: ["src/**/*.js"],
    },
    null,
    2
  ) + "\n"
);

// src/normalize-variant.js
writeFileSync(
  join(packageDir, "src", "normalize-variant.js"),
  `// @ts-check

/**
 * @typedef {"default" | "outlined"} ${componentName}Variant
 */

/**
 * Normalize a variant value for ${elementTag}.
 *
 * @param {string | null | undefined} value
 * @returns {${componentName}Variant}
 */
export function normalizeVariant(value) {
  if (value === "outlined") {
    return value;
  }

  return "default";
}
`
);

// src/<package-name>.css
writeFileSync(
  join(packageDir, "src", `${packageName}.css`),
  `@layer component {
  :host {
    --${packageName}-background: Canvas;
    --${packageName}-color: CanvasText;
    --${packageName}-border-color: CanvasText;
    --${packageName}-radius: 0.5rem;
    --${packageName}-padding: 1rem;

    display: block;
  }

  .${packageName} {
    background: var(--${packageName}-background);
    color: var(--${packageName}-color);
    border: 1px solid var(--${packageName}-border-color);
    border-radius: var(--${packageName}-radius);
    padding: var(--${packageName}-padding);
  }

  :host([variant="outlined"]) .${packageName} {
    background: transparent;
  }
}
`
);

// src/index.css
writeFileSync(
  join(packageDir, "src", "index.css"),
  `@import "./${packageName}.css";
`
);

// src/<package-name>.js
writeFileSync(
  join(packageDir, "src", `${packageName}.js`),
  `// @ts-check
import { normalizeVariant } from "./normalize-variant.js";

const template = document.createElement("template");
template.innerHTML = \`
  <div class="${packageName}" part="${packageName}">
    <slot></slot>
  </div>
\`;

/**
 * ${componentName} Web Component.
 *
 * @element ${elementTag}
 *
 * @attr {string} [variant="default"] - Component variant. One of: default, outlined.
 *
 * @cssprop --${packageName}-background - Background color.
 * @cssprop --${packageName}-color - Text color.
 * @cssprop --${packageName}-border-color - Border color.
 * @cssprop --${packageName}-radius - Border radius.
 * @cssprop --${packageName}-padding - Padding.
 *
 * @csspart ${packageName} - The inner container element.
 */
export class ${componentName} extends HTMLElement {
  static get observedAttributes() {
    return ["variant"];
  }

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    shadow.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    this.#update();
  }

  /**
   * @param {string} name
   * @param {string | null} _oldValue
   * @param {string | null} _newValue
   */
  attributeChangedCallback(name, _oldValue, _newValue) {
    if (name === "variant") {
      this.#update();
    }
  }

  /**
   * The component variant.
   * @type {string}
   */
  get variant() {
    return normalizeVariant(this.getAttribute("variant"));
  }

  set variant(value) {
    this.setAttribute("variant", normalizeVariant(value));
  }

  #update() {
    const variant = this.variant;
    this.setAttribute("variant", variant);
  }
}

if (!customElements.get("${elementTag}")) {
  customElements.define("${elementTag}", ${componentName});
}
`
);

// src/index.js
writeFileSync(
  join(packageDir, "src", "index.js"),
  `// @ts-check
export { ${componentName} } from "./${packageName}.js";
export { normalizeVariant } from "./normalize-variant.js";
`
);

// test/normalize-variant.test.js
writeFileSync(
  join(packageDir, "test", "normalize-variant.test.js"),
  `// @ts-check
import test from "node:test";
import assert from "node:assert/strict";
import { normalizeVariant } from "../src/normalize-variant.js";

test("normalizeVariant returns 'default' for null", () => {
  assert.equal(normalizeVariant(null), "default");
});

test("normalizeVariant returns 'default' for undefined", () => {
  assert.equal(normalizeVariant(undefined), "default");
});

test("normalizeVariant returns 'default' for unknown value", () => {
  assert.equal(normalizeVariant("unknown"), "default");
});

test("normalizeVariant returns 'outlined' for 'outlined'", () => {
  assert.equal(normalizeVariant("outlined"), "outlined");
});

test("normalizeVariant returns 'default' for empty string", () => {
  assert.equal(normalizeVariant(""), "default");
});
`
);

// test/template.test.js
writeFileSync(
  join(packageDir, "test", "template.test.js"),
  `// @ts-check
import test from "node:test";
import assert from "node:assert/strict";
import { normalizeVariant } from "../src/normalize-variant.js";

test("default variant is 'default'", () => {
  assert.equal(normalizeVariant(null), "default");
});
`
);

// docs/styles.css
writeFileSync(
  join(packageDir, "docs", "styles.css"),
  `* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: system-ui, sans-serif;
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1rem;
  background: Canvas;
  color: CanvasText;
}

h1 { font-size: 2rem; margin-block-end: 0.5rem; }
h2 { font-size: 1.4rem; margin-block: 1.5rem 0.75rem; }
h3 { font-size: 1.1rem; margin-block: 1rem 0.5rem; }

p { line-height: 1.6; margin-block-end: 0.75rem; }

code, pre {
  font-family: ui-monospace, monospace;
  font-size: 0.9rem;
}

pre {
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin-block-end: 1rem;
}

.demo { display: flex; gap: 1rem; flex-wrap: wrap; align-items: center; margin-block: 1rem; }

table { border-collapse: collapse; width: 100%; margin-block-end: 1rem; }
th, td { text-align: left; padding: 0.5rem; border-bottom: 1px solid #ddd; }
th { font-weight: 600; }
`
);

// docs/index.html
writeFileSync(
  join(packageDir, "docs", "index.html"),
  `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${scope}/${packageName} docs</title>
    <link rel="stylesheet" href="./styles.css" />
    <script type="module" src="./dist/index.js"></script>
  </head>
  <body>
    <main>
      <h1>&lt;${elementTag}&gt;</h1>
      <p>${componentName} Web Component. Zero runtime dependencies.</p>

      <h2>Installation</h2>
      <pre><code>pnpm add ${scope}/${packageName}</code></pre>

      <h2>Usage</h2>
      <pre><code>import "${scope}/${packageName}";
import "${scope}/${packageName}/css";</code></pre>

      <pre><code>&lt;${elementTag}&gt;Content&lt;/${elementTag}&gt;</code></pre>

      <h2>Examples</h2>
      <div class="demo">
        <${elementTag}>Default</${elementTag}>
        <${elementTag} variant="outlined">Outlined</${elementTag}>
      </div>

      <h2>Attributes</h2>
      <table>
        <thead><tr><th>Attribute</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
        <tbody>
          <tr><td>variant</td><td>string</td><td>default</td><td>Component variant: default, outlined</td></tr>
        </tbody>
      </table>

      <h2>CSS Custom Properties</h2>
      <table>
        <thead><tr><th>Property</th><th>Description</th></tr></thead>
        <tbody>
          <tr><td>--${packageName}-background</td><td>Background color</td></tr>
          <tr><td>--${packageName}-color</td><td>Text color</td></tr>
          <tr><td>--${packageName}-border-color</td><td>Border color</td></tr>
          <tr><td>--${packageName}-radius</td><td>Border radius</td></tr>
          <tr><td>--${packageName}-padding</td><td>Padding</td></tr>
        </tbody>
      </table>

      <h2>Parts</h2>
      <table>
        <thead><tr><th>Part</th><th>Description</th></tr></thead>
        <tbody>
          <tr><td>${packageName}</td><td>The inner container element</td></tr>
        </tbody>
      </table>
    </main>
  </body>
</html>
`
);

// README.md
writeFileSync(
  join(packageDir, "README.md"),
  `# ${scope}/${packageName}

${componentName} Web Component. Zero runtime dependencies.

## Installation

\`\`\`sh
pnpm add ${scope}/${packageName}
\`\`\`

## Usage

\`\`\`js
import "${scope}/${packageName}";
import "${scope}/${packageName}/css";
\`\`\`

\`\`\`html
<${elementTag}>Content</${elementTag}>
\`\`\`

## Attributes

| Attribute | Type   | Default   | Description                      |
|-----------|--------|-----------|----------------------------------|
| variant   | string | "default" | Component variant: default, outlined |

## CSS Custom Properties

| Property                      | Description      |
|-------------------------------|------------------|
| --${packageName}-background   | Background color |
| --${packageName}-color        | Text color       |
| --${packageName}-border-color | Border color     |
| --${packageName}-radius       | Border radius    |
| --${packageName}-padding      | Padding          |

## Parts

| Part          | Description               |
|---------------|---------------------------|
| ${packageName} | The inner container element |

## Commands

\`\`\`sh
pnpm --filter ${scope}/${packageName} build
pnpm --filter ${scope}/${packageName} test
\`\`\`
`
);

console.log(`package created: packages/${packageName}`);
console.log("\nnext steps:");
console.log(`  cd packages/${packageName}`);
console.log(`  pnpm run build`);
console.log(`  pnpm run test`);
