# Releasing

## Local release commands

Run release prep from repository root:

```bash
pnpm rel:patch
pnpm rel:minor
pnpm rel:major
```

Each command updates package versions, regenerates `CHANGELOG.md` from Conventional Commits, rebuilds tracked `dist/` artifacts locally, creates a release commit, and creates a local tag.

Push remains manual:

```bash
git push origin main --follow-tags
```

## GitHub Actions release automation

Release automation runs on pushed tags `v*.*.*`.

Flow:

1. installs dependencies with pnpm
2. runs tests and typecheck
3. verifies the committed `dist/` artifacts for every publishable package
4. builds docs
5. publishes packages to npm without rebuilding package artifacts in CI

## Required repository setup

### npm token

Create repository secret `NPM_TOKEN` with publish access to the `@pix-galaxy/*` packages you intend to release.

### Pages

Set repository Pages source to `GitHub Actions`.

### Workflow permissions

Keep `id-token: write` enabled for publish provenance and `pages: write` for the docs deploy workflow.
