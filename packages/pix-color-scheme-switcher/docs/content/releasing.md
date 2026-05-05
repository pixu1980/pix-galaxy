# Releasing

## Package Validation

Before preparing a release, run the package checks from the repository root:

```bash
pnpm --filter @pix-galaxy/pix-color-scheme-switcher test
pnpm --filter @pix-galaxy/pix-color-scheme-switcher build
pnpm --filter @pix-galaxy/pix-color-scheme-switcher typecheck
pnpm --filter @pix-galaxy/pix-color-scheme-switcher docs:build
```

## Local release commands

Run release prep from repository root:

```bash
pnpm rel:patch
pnpm rel:minor
pnpm rel:major
```

Each command updates package versions, regenerates `CHANGELOG.md`, rebuilds tracked `dist/` artifacts locally, creates a release commit, and creates a local tag.

The new package is versioned and published through the same root release workflow as the other pix-galaxy packages.

Push remains manual:

```bash
git push origin main --follow-tags
```
