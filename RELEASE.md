# Release Process - pix-galaxy

> **Zero-runtime-dependency vanilla JavaScript Web Components, packaged as a pnpm workspace monorepo.**

This document describes the complete release workflow for all packages in the pix-galaxy ecosystem.

---

## Table of Contents

- [Release Philosophy](#release-philosophy)
- [Package Overview](#package-overview)
- [Dependency Graph](#dependency-graph)
- [Workflow](#workflow)
  - [1. Development](#1-development)
  - [2. Preview Changes](#2-preview-changes)
  - [3. Release](#3-release)
  - [4. Push](#4-push)
  - [5. CI publishes](#5-ci-publishes)
- [Release Orchestrator (root)](#release-orchestrator-root)
- [Per-Package Release](#per-package-release)
- [Versioning Strategy](#versioning-strategy)
- [Tag Format](#tag-format)
- [Changelog Generation](#changelog-generation)
- [CI/CD Pipeline](#cicd-pipeline)
- [Registry Targets](#registry-targets)
- [Prerequisites & Setup](#prerequisites--setup)
- [Troubleshooting](#troubleshooting)
- [Creating a New Package](#creating-a-new-package)

---

## Release Philosophy

- **Independent versioning** - each package has its own semver, its own changelog, and its own release tag.
- **Conventional Commits** - `feat:` bumps minor, `fix:` bumps patch, `!` or `BREAKING CHANGE:` bumps major.
- **Topological order** - dependencies are always released before their dependents.
- **Only changed packages** - if a package has no new commits since its last tag, it is skipped.
- **Commit-based detection** - releases are based on merged commits, not file timestamps or manual selection.

---

## Package Overview

| Package | npm name | Status | Path |
|---------|----------|--------|------|
| pix-highlighter | `@pix-galaxy/pix-highlighter` | Publishable | `packages/pix-highlighter/` |
| pix-accent-color-selector | `@pix-galaxy/pix-accent-color-selector` | Publishable | `packages/pix-accent-color-selector/` |
| pix-color-scheme-selector | `@pix-galaxy/pix-color-scheme-selector` | Publishable | `packages/pix-color-scheme-selector/` |
| pix-display-preferences | `@pix-galaxy/pix-display-preferences` | Publishable | `packages/pix-display-preferences/` |
| pix-component-template | - | Private (template) | `packages/pix-component-template/` |

---

## Dependency Graph

```
pix-display-preferences
  ├── pix-accent-color-selector
  │     └── pix-highlighter
  ├── pix-color-scheme-selector
  │     └── pix-highlighter
  └── pix-highlighter
```

This determines the **release order**: dependencies first, dependents last.

---

## Workflow

### 1. Development

Use **Conventional Commits** - the commit message determines the semver bump:

```
feat(pix-highlighter): add dracula theme           → minor
fix(pix-accent-color-selector): close on esc       → patch
feat(pix-display-preferences): ...                 → minor
fix(pix-color-scheme-selector)!: rename API        → major (BREAKING)
```

Always scope your commit to the package it affects:

```
feat(pix-highlighter): ...         # affects packages/pix-highlighter/
fix(pix-accent-color-selector): ... # affects packages/pix-accent-color-selector/
```

### 2. Preview Changes

From the repository root, see which packages have unreleased changes:

```sh
node scripts/release.mjs --dry-run
```

Output:

```
┌─────────────────────────────────────────────────────┐
│  pix-galaxy - Monorepo Release Orchestrator        │
└─────────────────────────────────────────────────────┘

Packages to release (topological order):

  pix-highlighter                     2 commit(s)    last: @pix-galaxy/pix-highlighter@0.1.0
  pix-accent-color-selector           1 commit(s)    last: @pix-galaxy/pix-accent-color-selector@0.1.0

⚠️  Dry-run mode - no changes made.
   Run without --dry-run to execute.
```

### 3. Release

```sh
node scripts/release.mjs
```

This will:

1. Verify the working tree is clean
2. Detect packages with unreleased changes (path-filtered per package)
3. Show a summary and ask for confirmation
4. Process packages in topological order - for each changed package:
   - Parse conventional commits since its last tag
   - Determine the semver bump type (major/minor/patch)
   - Update `package.json` version
   - Update `CHANGELOG.md` with only relevant entries
   - Create a release commit: `release(pix-highlighter): @pix-galaxy/pix-highlighter@0.2.0`
   - Create a release tag: `@pix-galaxy/pix-highlighter@0.2.0`
5. Print a final summary

**Options:**

| Flag | Description |
|------|-------------|
| `--dry-run` | Preview only, no changes made |
| `--yes` | Skip confirmation prompts (for CI) |
| `--force <pkg>` | Release a specific package regardless of changes |

### 4. Push

```sh
git push origin main --follow-tags
```

### 5. CI publishes

The GitHub Actions release workflow (`.github/workflows/release.yml`) is triggered by tags matching `@pix-galaxy/*@*`. It:

1. Extracts the package name and version from the tag
2. Runs `test`, `typecheck`, and `build:lib` for the matched package
3. Publishes to **npm** (with provenance)
4. Publishes to **GitHub Packages**
5. Creates a **GitHub Release** with auto-generated release notes

---

## Release Orchestrator (root)

**Script location:** `scripts/release.mjs`

This is the entry point for releasing. It does NOT duplicate the release logic - it discovers changed packages and delegates to each package's own `scripts/release.mjs`.

**How it detects changes:**

```
git log @pix-galaxy/pix-highlighter@0.1.0..HEAD \
  --oneline \
  -- :(top)packages/pix-highlighter/
```

The `:(top)` prefix ensures paths are resolved relative to the repository root, regardless of the current working directory.

**Release order (topological sort):**

```
1. pix-highlighter           (no deps)
2. pix-accent-color-selector (depends on highlighter)
3. pix-color-scheme-selector (depends on highlighter)
4. pix-display-preferences   (depends on all of the above)
```

---

## Per-Package Release

**Script location:** `packages/<name>/scripts/release.mjs`

Each package has its own self-contained release script that can also be called directly:

```sh
cd packages/pix-highlighter
pnpm release
```

This is useful for:
- Releasing a single package without the orchestrator
- Testing the release logic in isolation
- Working in the standalone repo (if the package is extracted)

The per-package script:
- Reads commits filtered to its own path: `-- :(top)packages/<name>/`
- Parses conventional commits to determine the bump
- Updates `package.json` version
- Updates `CHANGELOG.md`
- Creates a commit and a namespaced tag
- Never publishes - that's the CI's job

---

## Versioning Strategy

**Independent semver per package.** Each package's version is managed independently based on commits that touch that package only.

| Commit type | Bump | Example |
|-------------|------|---------|
| `feat:` | minor | `feat(pix-highlighter): add ruby lexer` |
| `fix:` | patch | `fix(pix-color-scheme-selector): persist on toggle` |
| `*!:` | major | `feat(pix-highlighter)!: redesign API` |
| `docs:`, `chore:`, `ci:`, etc. | patch | `docs(pix-highlighter): fix readme example` |
| BREAKING CHANGE in body | major | Any commit with `BREAKING CHANGE:` in the body |

---

## Tag Format

All tags follow the namespaced format:

```
@pix-galaxy/<package-short>@<semver>
```

Examples:

```
@pix-galaxy/pix-highlighter@0.1.0
@pix-galaxy/pix-highlighter@0.2.0
@pix-galaxy/pix-accent-color-selector@0.1.0
@pix-galaxy/pix-display-preferences@1.0.0
```

This avoids tag collisions in the monorepo and allows CI workflows to identify exactly which package to publish.

---

## Changelog Generation

Each package maintains its own `CHANGELOG.md`. The release script generates entries grouped by conventional commit type:

```
### ⚠️ Breaking changes
### Features
### Bug fixes
### Performance
### Refactoring
### Style
### Tests
### Documentation
### Chores
### CI
### Build
### Other
```

Only commits that touch the specific package's directory are included - cross-package commits do not leak into neighbouring changelogs.

---

## CI/CD Pipeline

### CI Workflow (`.github/workflows/ci.yml`)

Triggered on `push` to `main` and on `pull_request`:

- `pnpm install --frozen-lockfile`
- `pnpm -r --if-present run test`
- `pnpm -r --if-present run typecheck`
- `pnpm -r --if-present run build:lib`
- `pnpm -r --if-present run lint`

### Release Workflow (`.github/workflows/release.yml`)

Triggered on tags matching `@pix-galaxy/*@*` or via `workflow_dispatch`:

1. Checkout + Install
2. Extract package name from tag: `@pix-galaxy/pix-highlighter@0.2.0` → `pix-highlighter`
3. Validate the package directory exists
4. Run tests, typecheck, and build for the matched package
5. Publish to **npm** (with `--provenance`)
6. Publish to **GitHub Packages**
7. Create a **GitHub Release** with release notes

### Pages Workflow (`.github/workflows/pages.yml`)

Triggered manually (`workflow_dispatch`) or can be configured for branch pushes:

- Builds all package libraries and docs sites
- Aggregates them into a `site/` directory
- Deploys to GitHub Pages with an index page linking to each package's docs

---

## Registry Targets

### Primary: npm

```
https://registry.npmjs.org
```

- All packages are scoped under `@pix-galaxy`
- Published with `--access public`
- Published with `--provenance` (sigstore)
- Requires `NPM_TOKEN` secret in GitHub repository

### Secondary: GitHub Packages

```
https://npm.pkg.github.com
```

- Published automatically with the same release workflow
- Uses the auto-generated `GITHUB_TOKEN` - no additional configuration needed
- Available to anyone with access to the `pixu1980` organisation

### Other registries (not configured, but possible)

| Registry | URL | Notes |
|----------|-----|-------|
| **JSR** | `https://jsr.io` | Modern JS registry, ESM-first. Would need an additional publish step. |
| **pkg.pr.new** | `https://pkg.pr.new` | Instant preview from every PR. Useful for testing before release. |

---

## Prerequisites & Setup

### For local development

- Node.js >= 20.11
- pnpm >= 10

```sh
pnpm install
```

### For publishing

1. **npm token**: Create an automation token on [npmjs.com](https://www.npmjs.com/settings/pixu1980/tokens) with `publish` access to the `@pix-galaxy` organisation.
2. **GitHub secret**: Add it as `NPM_TOKEN` in the repository settings → Secrets and variables → Actions.
3. **Provenance**: Ensure "Allow GitHub Actions to create and approve pull requests" is enabled in the repository settings (optional but recommended for npm provenance).

### Verification

```sh
node scripts/release.mjs --dry-run
pnpm -r --if-present run test
pnpm -r --if-present run typecheck
pnpm -r --if-present run build:lib
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `Working tree not clean` | Commit or stash changes before releasing. |
| `Tag already exists` | The tag was already created. If the release failed after the tag, delete it (`git tag -d <tagname>`) and retry. |
| `npm publish` fails | Verify `NPM_TOKEN` is set and has publish access to `@pix-galaxy/*`. Check the GitHub Actions log for details. |
| Package not detected as changed | Ensure commits touch the package directory (`packages/<name>/`). Commits that only modify root files won't trigger that package. |
| Changelog includes unrelated commits | The `:(top)packages/<name>/` path filter ensures only relevant commits appear. If unrelated commits are shown, check the filter pattern. |
| CI doesn't trigger on tag push | Tags must match `@pix-galaxy/*@*`. Verify the tag format: `git tag -l '@pix-galaxy/*'` |

---

## Creating a New Package

Use the template package and the included initialiser:

```sh
cp -r packages/pix-component-template packages/pix-my-component
cd packages/pix-my-component
node ./scripts/init.mjs pix-my-component "Description of my component"
```

The script will:
- Replace all `{%…%}` placeholders with your package name and details
- Rename `ComponentName` files and directories to your component class
- Update `package.json`, `README.md`, workflows, and all source files

After initialisation:

```sh
pnpm install          # install dependencies
pnpm run build:lib    # verify the build works
pnpm run test         # run tests
```

The new package is automatically discovered by the monorepo release orchestrator.
