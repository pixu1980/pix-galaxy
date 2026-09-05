# 025: Order portal cards by npm popularity, surface WIP packages

- **Date**: 2026-08-25
- **Status**: accepted
- **Tags**: portal, ordering, build, release, npm
- **Author**: pix-architect

## Context

The pix-galaxy portal (src/docs) lists all packages as cards. Previously: (1) cards were ordered statically in catalog order; (2) production builds hid packages without releaseStatus \"ready\", so WIP work was invisible on the public site; (3) there was no signal of which library/component is most used (no package is published yet, so no popularity data exists).

## Decision

Render the portal with two distinct sections - Libraries (pix-foundations, pix-color, pix-vanilla-reactive) and Components - and order cards within each section primarily by npm last-month download counts fetched at build time (api.npmjs.org/downloads) by scripts/fetch-downloads.mjs into src/docs/content/downloads.json; ties and unpublished packages fall back to a curated order per section. Show ALL packages on the production site too, marking non-ready ones with a WIP badge (top-right) and a soft blur cleared on hover/focus.

## Consequences

Positive: the public portal now signals maturity per package (WIP badge + blur) and surfaces foundation libraries first; once packages are released and downloaded, the most popular ones automatically float to the top of each section at the next build. Negative: the production site exposes components that are not yet publishable; build now performs a network call to the npm registry per package (non-fatal, 8s timeout, 404s for unpublished packages are skipped).

## Alternatives Considered

1. Keep hiding WIP packages in production (AGENTS.md earlier guidance) - rejected: user wants visibility of work-in-progress on the public site
1. Single mixed grid ordered by importance only - rejected: user wants distinct Libraries vs Components sections
1. Fetch download counts at runtime from the browser - rejected: adds per-page network dependency and registry latency; build-time snapshot is deterministic
1. Tags/component kind metadata - chosen: components.json gains kind: "library" for the three foundation libraries
