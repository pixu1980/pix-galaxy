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

| Package                   | npm name                                | Status             | Path                                  |
| ------------------------- | --------------------------------------- | ------------------ | ------------------------------------- |
| pix-highlighter           | `@pix-galaxy/pix-highlighter`           | Publishable        | `packages/pix-highlighter/`           |
| pix-accent-color-selector | `@pix-galaxy/pix-accent-color-selector` | Publishable        | `packages/pix-accent-color-selector/` |
| pix-color-scheme-selector | `@pix-galaxy/pix-color-scheme-selector` | Publishable        | `packages/pix-color-scheme-selector/` |
| pix-a11y-panel            | `@pix-galaxy/pix-a11y-panel`            | Publishable        | `packages/pix-a11y-panel/`            |
| pix-component-template    | -                                       | Private (template) | `packages/pix-component-template/`    |

---

## Dependency Graph

```
pix-a11y-panel
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
feat(pix-a11y-panel): ...                 → minor
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
pnpm release          # bump + CHANGELOG + tag + publish
pnpm release:dry      # preview only (no changes)
pnpm release --force  # release even without changes
```

The orchestrator (`scripts/release.mjs`):

1. Verifies the working tree is clean (skipped in dry-run)
2. Discovers non-private packages in `packages/`
3. For each package with changes since its last tag (or no tag yet - first release):
   - Runs `commit-and-tag-version --tag-prefix "@pix-galaxy/<pkg>@"` (with `--first-release` when no tag exists)
   - Updates `package.json` version + `CHANGELOG.md`
   - Creates a release commit and tag `@pix-galaxy/<pkg>@<version>`
   - Pushes tags to `main`
   - Publishes to npm with `pnpm publish --access public` (local npm auth)
4. Prints a summary

**ADR-018:** releases are LOCAL. No CI publish, no `NPM_TOKEN` secret.

**Options:**

| Flag        | Description                           |
| ----------- | ------------------------------------- |
| `--dry-run` | Preview only, no changes made         |
| `--force`   | Release packages even without changes |

### 4. Push

The script pushes tags automatically (`git push --follow-tags origin main`). The `main` branch is the release branch (ADR-022); development happens on `develop`.

### 5. Release quality gate

`.github/workflows/release.yml` is triggered by release tags but no longer publishes. It runs a quality gate on the tagged package (typecheck + test + build:lib) to catch broken releases before consumers install them.

---

## Release Orchestrator (root)

**Script location:** `scripts/release.mjs` (+ `scripts/release-helpers.mjs`)

The orchestrator discovers changed packages and delegates the version bump to `commit-and-tag-version` (the maintained fork of `standard-version`, ADR-018).

**How it detects changes:**

```
git diff --quiet "@pix-galaxy/pix-highlighter@0.1.0" -- packages/pix-highlighter/
```

A missing tag means the package was never released - treated as a first release (`--first-release`, no version bump, CHANGELOG generated from all commits).

## Per-Package Release

Packages do not carry their own release scripts anymore (they were removed when build scripts were centralised in `pix-core`). All releases run from the root orchestrator:

```sh
pnpm release        # all changed packages
pnpm release:dry    # preview
```

---

## Versioning Strategy

**Independent semver per package.** Each package's version is managed independently based on commits that touch that package only.

| Commit type                    | Bump  | Example                                             |
| ------------------------------ | ----- | --------------------------------------------------- |
| `feat:`                        | minor | `feat(pix-highlighter): add ruby lexer`             |
| `fix:`                         | patch | `fix(pix-color-scheme-selector): persist on toggle` |
| `*!:`                          | major | `feat(pix-highlighter)!: redesign API`              |
| `docs:`, `chore:`, `ci:`, etc. | patch | `docs(pix-highlighter): fix readme example`         |
| BREAKING CHANGE in body        | major | Any commit with `BREAKING CHANGE:` in the body      |

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
@pix-galaxy/pix-a11y-panel@1.0.0
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

Triggered on tags matching `@pix-galaxy/*@*`. It is a **quality gate** - it does NOT publish (ADR-018):

1. Checkout + Install
2. Extract package name from tag: `@pix-galaxy/pix-highlighter@0.2.0` → `pix-highlighter`
3. Run typecheck, tests, and `build:lib` for the matched package
4. If the gate passes, the release is ready for consumers (publish happened locally)

### Pages Workflow (`.github/workflows/pages.yml`)

Triggered manually (`workflow_dispatch`):

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
- Published from **local** npm auth (ADR-018) - no CI token

## Prerequisites & Setup

### For local development

- Node.js >= 20.11
- pnpm >= 10

```sh
pnpm install
```

### For publishing

1. **npm auth**: Log in to npm locally so the publish account has access to the `@pix-galaxy` scope:
   ```sh
   npm login
   ```
2. Ensure the scope is public (`.npmrc` has `access=public`).
3. Optional: enable npm provenance on your npm account for sigstore-signed releases.

### Verification

```sh
pnpm release:dry     # preview CHANGELOGs and bumps
pnpm -r --if-present run test
pnpm -r --if-present run typecheck
pnpm -r --if-present run build:lib
pnpm quality
```

---

## Troubleshooting

| Problem                              | Solution                                                                                                                         |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| `Working tree not clean`             | Commit or stash changes before releasing.                                                                                        |
| `Tag already exists`                 | The tag was already created. If the release failed after the tag, delete it (`git tag -d <tagname>`) and retry.                  |
| `npm publish` fails                  | Verify local npm auth has publish access to `@pix-galaxy/*` (`npm whoami`, `npm login`).                                         |
| Package not detected as changed      | Ensure commits touch the package directory (`packages/<name>/`). Commits that only modify root files won't trigger that package. |
| Changelog includes unrelated commits | The tag-based path filter ensures only relevant commits appear (`git diff <tag> -- packages/<name>/`).                           |
| Release gate doesn't trigger on tag  | Tags must match `@pix-galaxy/*@*`. Verify the tag format: `git tag -l '@pix-galaxy/*'`                                           |

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
