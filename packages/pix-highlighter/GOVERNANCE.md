# Governance

@pix-galaxy/pix-highlighter is maintained as part of the pix-galaxy component suite.

## Project Goals

- Ship a dependable, framework-agnostic syntax-highlighting component for the web platform.
- Keep the public API small and stable.
- Prefer maintainable browser-native behavior over framework coupling.
- Maintain a release process suitable for public npm distribution.

## Roles

### Owner

The repository owner is the final escalation point for release, security and governance decisions.

### Maintainers

Maintainers can triage issues, review and merge pull requests, cut releases and enforce project policies.

### Contributors

Contributors can propose and implement changes through issues and pull requests.

## Decision Making

- Small technical changes are handled through pull request review.
- For larger changes, maintainers use lazy consensus in the linked issue or PR discussion.
- If consensus is unclear or time-sensitive, the repository owner makes the final decision.

## Release Policy

- Releases follow semantic versioning.
- Tags in the form v*.*.\* are the release trigger for npm publication.
- The latest published minor in the active major line is the supported line unless documented otherwise in SECURITY.md.

## Governance Changes

Changes to governance, contribution process, security policy or code of conduct require maintainer approval and should be documented in a pull request.
