# Releasing

## Local release commands

Use pnpm release helpers:

```bash
pnpm release
```

The command does five things locally:

1. reads commits since the last tag and auto-detects the bump type
2. bumps `package.json`
3. rolls `CHANGELOG.md`
4. creates a git commit
5. creates a local git tag

Push remains manual:

```bash
git push origin main --follow-tags
```

## GitHub Actions release automation

Release automation runs on pushed tags `v*.*.*`.

Flow:

1. validate with pnpm install, test, build and pack checks
2. publish to npm with `npm publish --provenance`
3. build docs site
4. deploy docs site to GitHub Pages

## Required repository setup

### npm token

Create repository secret `NPM_TOKEN` with publish access to `{%PACKAGE_NAME%}`.

### Pages

Set repository Pages source to **GitHub Actions**.

### Workflow permissions

Keep `id-token: write` enabled for provenance and `pages: write` for deploy job.
