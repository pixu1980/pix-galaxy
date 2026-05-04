---
description: "Use when editing HTML, CSS, JavaScript, JSON, or Markdown to enforce pix styleguides, semantic structure, WCAG 2.2 AA baseline, and formatting consistency."
name: "pix Styleguides Enforcement"
applyTo: "**/*.{html,css,js,mjs,json,md}"
---
# pix Styleguides Instructions

- Apply strict styleguide enforcement by default unless user requests pragmatic mode.
- Preserve existing behavior while improving structure, semantics, and consistency.

## CSS rules

- Use native CSS only.
- Require `@layer` organization (base/components/utilities at minimum).
- Use CSS nesting for scoped, shallow selectors.
- Strongly prefer element and attribute selectors.
- Avoid class selectors unless no safe alternative exists.
- Use CSS custom properties for reusable values.
- Use `@property` for animated custom properties when typing is needed.
- Do not use naming standards/frameworks such as BEM, OOCSS, ITCSS, SMACSS, or CUBE CSS.
- Default to baseline widely available CSS APIs; use newer APIs only on explicit request with fallback notes.

## HTML rules

- Prefer semantic elements over generic wrappers.
- Avoid `div` when `section`/`article`/landmarks fit the use case.
- Keep one `h1` per document and valid heading hierarchy.
- Prefer native semantics before ARIA.

## Accessibility rules

- Enforce WCAG 2.2 AA baseline checks (contrast, focus, keyboard, readable spacing, form labels/errors, reduced motion).
- Keep focus visible and keyboard interaction intact.

## Repository structure rules

- In runtime `src/`, `scripts/`, and `tests/` folders, keep `index.*` as the public barrel or entrypoint.
- All sibling implementation files in those folders must be underscore-prefixed, for example `_pix-card.js`, `_build-docs.js`, or `_template.test.js`.
- Package tests live in `tests/`, never `test/`.
- Root script coverage lives in `scripts/tests/`, with one test file per script and `scripts/tests/index.js` as the barrel.
- Root repository community-health files should live at the repository root for `CHANGELOG.md`, `CODE_OF_CONDUCT.md`, `CONTRIBUTING.md`, `GOVERNANCE.md`, `SECURITY.md`, and `SUPPORT.md`.
- GitHub repository-community files should live under `.github/`, with issue templates in `.github/ISSUE_TEMPLATE/`, pull-request templates in `.github/pull_request_template.md`, ownership in `.github/CODEOWNERS`, and funding metadata in `.github/FUNDING.yml`.
- When a repository uses Conventional Commits for release notes, keep `CHANGELOG.md` generated from commit subjects and document the generation command.

## JSON and Markdown rules

- JSON: valid syntax, stable keys/types, explicit units and dates.
- Markdown: one H1, ordered headings, language-tagged code fences, clear structure.
