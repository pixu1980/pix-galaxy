# PixHighlighter Port And Shared Docs Template Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Port standalone pix-highlighter into pix-galaxy and replace scaffolded component docs with one shared interactive docs template used by every component package.

**Architecture:** Build docs pages from package-local markdown at build time, then materialize one shared HTML/CSS/JS docs shell per package. Port pix-highlighter runtime and tests from standalone source with minimal API drift, preserving the customized built-in element and exported lexers/theme API for first release parity.

**Tech Stack:** pnpm workspaces, node:test, esbuild, jsdom, Marked, vanilla Custom Elements v1, shared TemplateEngine runtime.

---

### Task 1: Shared Docs Builder

**Files:**
- Modify: `scripts/_build-docs.js`
- Test: `scripts/tests/_build-docs.test.js`

- [ ] **Step 1: Write failing tests for docs manifest and package docs shell generation**

Add tests that assert `scripts/_build-docs.js` can:
- render code fences as `pre[is="pix-highlighter"]`
- build docs page records from markdown
- render a package docs shell with package metadata and docs navigation

- [ ] **Step 2: Run test to verify failure**

Run: `node --test scripts/tests/_build-docs.test.js`
Expected: FAIL because new docs helpers do not exist yet.

- [ ] **Step 3: Implement minimal docs parsing and shell rendering**

Create exported helpers in `scripts/_build-docs.js` for markdown manifest generation and package docs shell rendering, then update `buildDocsSite()` to emit shared docs assets per package instead of copying only static stub files.

- [ ] **Step 4: Run test to verify pass**

Run: `node --test scripts/tests/_build-docs.test.js`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add scripts/_build-docs.js scripts/tests/_build-docs.test.js
git commit -m "feat: build shared component docs"
```

### Task 2: Shared Docs Scaffold And Existing Package Docs

**Files:**
- Modify: `scripts/_create-package.js`
- Modify: `scripts/tests/_create-package.test.js`
- Modify: `packages/pix-button/docs/content/getting-started.md`
- Modify: `packages/pix-button/docs/content/examples.md`
- Modify: `packages/pix-button/docs/content/api.md`
- Modify: `packages/pix-button/docs/content/releasing.md`
- Modify: `packages/pix-card/docs/content/getting-started.md`
- Modify: `packages/pix-card/docs/content/examples.md`
- Modify: `packages/pix-card/docs/content/api.md`
- Modify: `packages/pix-card/docs/content/releasing.md`
- Modify: `packages/pix-baseline/docs/content/getting-started.md`
- Modify: `packages/pix-baseline/docs/content/examples.md`
- Modify: `packages/pix-baseline/docs/content/api.md`
- Modify: `packages/pix-baseline/docs/content/releasing.md`
- Modify: `packages/pix-highlighter/docs/content/getting-started.md`
- Modify: `packages/pix-highlighter/docs/content/examples.md`
- Modify: `packages/pix-highlighter/docs/content/api.md`
- Modify: `packages/pix-highlighter/docs/content/releasing.md`

- [ ] **Step 1: Write failing scaffold tests for new docs files**

Add assertions that generated package docs include shared-template metadata files or data hooks required by the new builder, not the old stub-only landing page.

- [ ] **Step 2: Run test to verify failure**

Run: `node --test scripts/tests/_create-package.test.js`
Expected: FAIL because scaffold output still matches old static docs contract.

- [ ] **Step 3: Update scaffold and retrofit docs content**

Change `scripts/_create-package.js` so new packages scaffold markdown-first docs for the shared builder. Rewrite existing component package markdown files so each package has accurate install, example, API, and release copy.

- [ ] **Step 4: Run test to verify pass**

Run: `node --test scripts/tests/_create-package.test.js`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add scripts/_create-package.js scripts/tests/_create-package.test.js packages/pix-button/docs packages/pix-card/docs packages/pix-baseline/docs packages/pix-highlighter/docs
git commit -m "feat: align package docs scaffold"
```

### Task 3: PixHighlighter Runtime Port

**Files:**
- Modify: `packages/pix-highlighter/src/index.js`
- Modify: `packages/pix-highlighter/package.json`
- Modify: `packages/pix-highlighter/README.md`
- Replace: `packages/pix-highlighter/src/components/PixHighlighter/*`
- Create: `packages/pix-highlighter/src/components/PixHighlighter/icons/*`
- Create: `packages/pix-highlighter/src/components/PixHighlighter/lexers/*`
- Create: `packages/pix-highlighter/src/components/PixHighlighter/styles/themes/*`

- [ ] **Step 1: Write failing package tests for exported API and runtime behavior**

Port source behavioral tests first for theme control, tokenizer exports, docs integration, and copy action.

- [ ] **Step 2: Run test to verify failure**

Run: `pnpm --filter @pix-galaxy/pix-highlighter test`
Expected: FAIL because scaffold runtime does not expose source-parity behavior.

- [ ] **Step 3: Port minimal runtime to satisfy tests**

Copy source component, constants, utils, lexers, icons, and theme CSS into `packages/pix-highlighter/src/components/PixHighlighter`, then adapt import paths, package exports, and monorepo build expectations.

- [ ] **Step 4: Run test to verify pass**

Run: `pnpm --filter @pix-galaxy/pix-highlighter test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/pix-highlighter/src packages/pix-highlighter/package.json packages/pix-highlighter/README.md
git commit -m "feat: port pix-highlighter runtime"
```

### Task 4: Test Infrastructure, Typecheck, And Site Verification

**Files:**
- Modify: `packages/pix-highlighter/tests/index.js`
- Create: `packages/pix-highlighter/tests/_mocks.js`
- Create: `packages/pix-highlighter/tests/_components.test.js`
- Create: `packages/pix-highlighter/tests/_docs-build.test.js`
- Create: `packages/pix-highlighter/tests/_site-app.test.js`
- Create or modify: package-local test loader files if required for CSS/SVG raw imports

- [ ] **Step 1: Write failing tests for docs app and loader assumptions**

Port source docs-app tests and raw-asset loading expectations before implementing the loader glue.

- [ ] **Step 2: Run test to verify failure**

Run: `pnpm --filter @pix-galaxy/pix-highlighter test`
Expected: FAIL because Node test runtime cannot yet import CSS or SVG assets and docs builder/runtime are incomplete.

- [ ] **Step 3: Implement loader glue and finalize docs/runtime integration**

Add the minimal raw-text loader support needed by Node tests, keep `node:test` as runner, and verify package docs build uses real runtime exports rather than self-importing docs code.

- [ ] **Step 4: Run verification suite**

Run:
- `pnpm --filter @pix-galaxy/pix-highlighter build`
- `pnpm --filter @pix-galaxy/pix-highlighter typecheck`
- `pnpm --filter @pix-galaxy/pix-highlighter test`
- `pnpm docs:build`
- `node --test scripts/tests/index.js`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/pix-highlighter/tests packages/pix-highlighter/docs package.json pnpm-lock.yaml
git commit -m "test: verify pix-highlighter port"
```
