# ADR-023: JSDoc types with strict typecheck, no TypeScript migration

## Status

Accepted

## Context

For a public open-source library, types matter. Source is currently vanilla JS with JSDoc typedefs compiled via `tsconfig.types.json` + `finalize-types.mjs`.

## Decision

Keep **vanilla JS + JSDoc types** and enforce **strict typecheck** in CI (`tsc --noEmit` with strict settings). Do **not** migrate sources to `.ts`.

## Rationale

- Preserves the "vanilla JS, no build step" identity
- JSDoc + `// @ts-check` gives type safety without a compile step
- TypeScript would add toolchain weight and break the zero-framework positioning

## Consequences

Positive:

- No build-step migration cost
- Types still shipped via generated `.d.ts`

Negative:

- Some type-safety gaps inherent to JSDoc
- Requires discipline to keep typedefs in sync

## Follow-up

Add strict typecheck to CI (Phase 3).

## Tags

typescript, typing, strategy
