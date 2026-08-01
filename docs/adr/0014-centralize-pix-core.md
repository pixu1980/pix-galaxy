# ADR-014: Centralize shared runtime and scripts in `pix-core`

## Status

Accepted

## Context

Every component package duplicated scripts (build, docs, finalize-types, raw-text-loader, raw-text-plugin, register-test-loader). Package `packages/shared` already held docs and SSR helpers, but the name was generic.

## Decision

Rename `packages/shared` to `packages/pix-core` and move shared build/test/docs scripts there. Update all package scripts to call `../pix-core/scripts/*`.

## Consequences

Positive:

- Duplicated scripts removed
- Shared raw text plugin fixed once for all packages
- Package docs builder centralized

Negative:

- Workspace dependency rename affects many package manifests
- `pix-core` now has build-time dependency on `esbuild`

## Follow-up

Keep package-specific scripts only when genuinely package-specific. Otherwise add behavior to `pix-core/scripts/*`.

## Tags

architecture, monorepo, build
