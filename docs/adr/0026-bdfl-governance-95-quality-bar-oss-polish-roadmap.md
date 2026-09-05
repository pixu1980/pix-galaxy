# 026: BDFL governance, 95% quality bar, OSS polish roadmap

- **Date**: 2026-08-25
- **Status**: accepted
- **Tags**: open-source, governance, quality, release, roadmap
- **Author**: pix-galaxy-mcp

## Context

Maintainer interview (2026-08-25) set the open-source direction: full UI audit (hero/header, cards/grid, dark mode, responsive, a11y audit); consumer-facing docs plus API reference, migration notes, showcase; component behavior gaps (form/ElementInternals, i18n/l10n/RTL, SSR/hydration safety, keyboard & focus-trap); quality bar = node:test + Playwright e2e + axe-core on every docs site + visual regression + coverage >=95%; governance model = benevolent dictator; community channels (GitHub Discussions, public roadmap, marketing badges, funding tiers); first release verified via pnpm release:dry only (4 ready packages pass the dry-run; private/wip correctly skipped).

## Decision

Formalize pix-galaxy as a benevolent-dictator (BDFL) open-source project: the Owner role in GOVERNANCE.md is the final decision authority on release, security, and governance. Enforce a quality gate before any package is promoted to "ready" or published: node:test unit tests + Playwright e2e + @axe-core/playwright on every docs site + visual regression + >=95% coverage. Publish and maintain a public ROADMAP.md, enable GitHub Discussions, and add funding tiers; the first npm release is prepared only after the audit passes and was verified via dry-run.

## Consequences

Positive: clear contribution and release path, consumer trust, measurable quality gate (unit + e2e + axe + visual regression + >=95% coverage) before any package is promoted or published; BDFL keeps single-owner velocity. Negative: enforcing 95% coverage and axe on every docs site raises CI/maintenance effort and may require test refactors across packages; full UI audit and docs deliverables are a multi-session effort tracked in the public roadmap.

## Alternatives Considered

1. Core-team / TSC model - rejected: single owner today, BDFL is the honest match
1. Promote WIP packages to ready now - rejected: audit-first, quality bar must pass before release
1. Lower coverage target (<95%) - rejected: maintainer explicitly wants 95% threshold
1. Publish npm immediately - rejected: first release verified via dry-run only
