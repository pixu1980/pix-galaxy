# Governance

pix-galaxy is maintained as a public component suite under a **benevolent-dictator (BDFL)** governance model (ADR-026): the Owner acts as benevolent dictator with final authority on release, security, and governance decisions, while contributors are free to propose and implement changes.

## Project Goals

- Ship dependable, framework-agnostic Web Components and supporting packages.
- Keep the public API small, stable, and well documented.
- Prefer maintainable browser-native behavior over framework coupling.
- Maintain a release process suitable for public npm distribution.

## Roles

### Owner (Benevolent Dictator)

The repository owner is the **final decision authority** for release, security, and governance (BDFL model, ADR-026). The Owner:

- Sets the long-term direction and public roadmap.
- Decides when a package is promoted to `releaseStatus: "ready"` or published to npm.
- Is the escalation point when lazy consensus fails or the decision is time-sensitive.

Ownership is intended to be transferred or widened (core team) if the project outgrows single-maintainer operation.

### Maintainers

Maintainers can triage issues, review and merge pull requests, cut releases, and enforce project policies.

### Contributors

Contributors can propose and implement changes through issues and pull requests.

## Decision Making

- Small technical changes are handled through pull request review.
- Larger changes use lazy consensus in the linked issue or pull request discussion.
- If consensus is unclear or time-sensitive, the repository owner makes the final decision.

## Quality Gate (pre-public status)

Before any package is promoted to `releaseStatus: "ready"` or published (ADR-026):

- `node:test` unit tests pass.
- Playwright e2e passes.
- `@axe-core/playwright` audit passes on the package docs site.
- Visual regression baseline is green.
- Test coverage is **>= 95%**.

## Release Policy

- Releases follow semantic versioning.
- Tags in the form `v*.*.*` trigger npm publication.
- Release helpers generate `CHANGELOG.md` from Conventional Commits and rebuild tracked `dist/` artifacts locally before tagging.
- The latest published minor in the active major line is the supported line unless documented otherwise in SECURITY.md.

## Governance Changes

Changes to governance, contribution process, security policy, or code of conduct require maintainer approval and should be documented in a pull request.

## Deprecation & EOL

A package may be deprecated by the Owner when it is superseded, unmaintained, or replaced. Deprecation steps:

1. `npm deprecate` a message on the latest published version.
2. Mark the package status as `deprecated` in `package.json` and the portal catalog, and add a deprecation note to its README and docs site.
3. The deprecating line keeps security fixes for **90 days** from the announcement (see SECURITY.md).

Breaking API changes follow semver majors per package (ADR-018): a new major is the migration surface; the previous major is supported per the Release Policy above.
