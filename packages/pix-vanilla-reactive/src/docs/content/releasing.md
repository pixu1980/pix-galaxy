# Releasing

Releases are tagged per-package with `commit-and-tag-version` and published
locally — no CI publishing.

```bash
pnpm release        # in this package directory
```

Conventional commits (`feat:`, `fix:`, `refactor:`, `docs:`, `chore:`) drive
the semver bump and CHANGELOG generation. See the root `AGENTS.md` and
`docs/adr/0018-release-commit-and-tag-version.md` for the full convention.
