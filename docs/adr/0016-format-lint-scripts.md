# ADR-016: Root formatting and linting are reproducible scripts

## Status

Accepted

## Context

Formatting and linting across JS, CSS, HTML needed to be reproducible npm scripts.

## Decision

Root `package.json` exposes:

```json
{
  "format": "prettier --write '**/*.{js,mjs,cjs,css,html,md,json,yml,yaml}'",
  "format:check": "prettier --check '**/*.{js,mjs,cjs,css,html,md,json,yml,yaml}'",
  "lint:format": "prettier --check '**/*.{js,mjs,cjs,css,html,md,json,yml,yaml}'",
  "quality": "pnpm format:check && pnpm lint"
}
```

## Consequences

Positive:

- Formatting is reproducible
- CI can call `pnpm quality`

Negative:

- Uninitialized scaffold placeholders need `.prettierignore` exclusions because they are not valid JS

## Follow-up

Consider adding `lint:css` with a CSS parser (see ADR-017).

## Tags

tooling, quality
