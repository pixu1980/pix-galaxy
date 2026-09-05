# Architecture Decision Records

This log records the significant architectural decisions for pix-galaxy. Each ADR is a short Nygard-format document (Context / Decision / Consequences) that captures _what_ was decided and _why_.

**Status legend:** Accepted · Superseded · Deprecated

## Index

| ADR                                                              | Status                                                             | Decision                                                  |
| ---------------------------------------------------------------- | ------------------------------------------------------------------ | --------------------------------------------------------- |
| [001](0001-light-dom-over-shadow-dom.md)                         | ✅ Accepted                                                        | Light DOM over Shadow DOM                                 |
| [002](0002-adopted-stylesheets.md)                               | ✅ Accepted                                                        | `adoptedStyleSheets` over `<link>`/`<style>`              |
| [003](0003-light-dark.md)                                        | ✅ Accepted                                                        | `light-dark()` over media-query toggle                    |
| [004](0004-light-dark-fallback.md)                               | ✅ Accepted                                                        | CSS fallback before `light-dark()`                        |
| [005](0005-private-class-fields.md)                              | ✅ Accepted                                                        | Private class fields for internal state                   |
| [006](0006-oklch-colour-space.md)                                | ✅ Accepted                                                        | Oklch colour space                                        |
| [007](0007-shared-docs-template.md)                              | ✅ Accepted                                                        | Shared docs template in `pix-core`                        |
| [008](0008-element-internals.md)                                 | ✅ Accepted                                                        | `ElementInternals` for form association                   |
| [009](0009-release-standard-version.md)                          | 🔁 **Superseded** by [018](0018-release-commit-and-tag-version.md) | Release via standard-version                              |
| [010](0010-test-runner-suite.md)                                 | ✅ Accepted                                                        | Playwright e2e + node:test smoke                          |
| [011](0011-rename-a11y-panel.md)                                 | ✅ Accepted                                                        | Rename `pix-display-preferences` → `pix-a11y-panel`       |
| [012](0012-centralize-foundations.md)                            | ✅ Accepted                                                        | Centralize design foundations in `pix-foundations`        |
| [013](0013-centralize-focus-ring.md)                             | ✅ Accepted                                                        | Centralize focus ring in `pix-foundations`                |
| [014](0014-centralize-pix-core.md)                               | ✅ Accepted                                                        | Centralize shared runtime/scripts in `pix-core`           |
| [015](0015-foundations-independent.md)                           | ✅ Accepted                                                        | Keep `pix-foundations` independent of `pix-core`          |
| [016](0016-format-lint-scripts.md)                               | ✅ Accepted                                                        | Reproducible format/lint scripts                          |
| [017](0017-css-parser-validation.md)                             | ✅ Accepted                                                        | Validate CSS with a real parser                           |
| [018](0018-release-commit-and-tag-version.md)                    | ✅ Accepted                                                        | Local release via `commit-and-tag-version`, no CI publish |
| [019](0019-modern-only-browsers.md)                              | ✅ Accepted                                                        | Modern-only browser matrix, light-dark fallback kept      |
| [020](0020-zero-dependencies.md)                                 | ✅ Accepted                                                        | Zero runtime dependencies is absolute                     |
| [021](0021-wcag-aa-requirement.md)                               | ✅ Accepted                                                        | WCAG 2.2 AA is non-negotiable                             |
| [022](0022-branch-strategy.md)                                   | ✅ Accepted                                                        | `develop` trunk, `main` for releases                      |
| [023](0023-jsdoc-types-strict.md)                                | ✅ Accepted                                                        | JSDoc types + strict typecheck, no TS migration           |
| [024](0024-migrate-skills-to-mcp.md)                             | ✅ Accepted                                                        | Migrate `.agents` skills to `pix-galaxy-mcp`              |
| [026](0026-bdfl-governance-95-quality-bar-oss-polish-roadmap.md) | ✅ Accepted                                                        | BDFL governance + 95% quality bar + OSS roadmap           |

## How to add an ADR

1. Copy the next number (current: **025**).
2. Use the Nygard template (Status / Context / Decision / Consequences).
3. Add a row to the index table above.
4. Reference the ADR from code comments or docs when the decision affects them.
