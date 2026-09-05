# Releasing

## Local release commands

Use pnpm release helpers:

```bash
pnpm rel:patch
pnpm rel:minor
pnpm rel:major
```

Each command does four things locally:

1. bumps `package.json`
2. rolls `CHANGELOG.md`
3. creates a git commit
4. creates a local git tag

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

Create repository secret `NPM_TOKEN` with publish access to `@pix-galaxy/pix-a11y`.

### Pages

Set repository Pages source to `GitHub Actions`.

### Workflow permissions

Keep `id-token: write` enabled for provenance and `pages: write` for deploy job.
