# Governance

pix-galaxy is maintained as a public component suite.

## Project Goals

- Ship dependable, framework-agnostic Web Components and supporting packages.
- Keep the public API small, stable, and well documented.
- Prefer maintainable browser-native behavior over framework coupling.
- Maintain a release process suitable for public npm distribution.

## Roles

### Owner

The repository owner is the final escalation point for release, security, and governance decisions.

### Maintainers

Maintainers can triage issues, review and merge pull requests, cut releases, and enforce project policies.

### Contributors

Contributors can propose and implement changes through issues and pull requests.

## Decision Making

- Small technical changes are handled through pull request review.
- Larger changes use lazy consensus in the linked issue or pull request discussion.
- If consensus is unclear or time-sensitive, the repository owner makes the final decision.

## Release Policy

- Releases follow semantic versioning.
- Tags in the form `v*.*.*` trigger npm publication.
- Release helpers generate `CHANGELOG.md` from Conventional Commits and rebuild tracked `dist/` artifacts locally before tagging.
- The latest published minor in the active major line is the supported line unless documented otherwise in SECURITY.md.

## Governance Changes

Changes to governance, contribution process, security policy, or code of conduct require maintainer approval and should be documented in a pull request.
