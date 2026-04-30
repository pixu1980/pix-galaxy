---
name: pix-styleguides
description: 'Apply pix coding styleguides for HTML, CSS, JavaScript, JSON, and Markdown. Use when implementing, refactoring, reviewing, or generating frontend files and docs to enforce consistent structure, semantics, accessibility, formatting, and quality gates.'
argument-hint: 'Task to execute with pix styleguides (e.g., "refactor component styles" or "review docs and fix style violations")'
---

# pix Styleguides

## Outcome
Produce or review frontend artifacts that conform to pix style rules across:
- HTML semantics and accessibility (WCAG 2.2 AA base)
- CSS architecture, tokens, cascade hygiene, and baseline API usage
- JavaScript readability, safety, and component lifecycle rules
- JSON validity and schema consistency
- Markdown structure and documentation quality

## When to use
Use this skill when the user asks to:
- create or update frontend UI files
- refactor styling or markup for consistency
- perform code review focused on style compliance
- generate docs or configuration files
- standardize mixed-quality files before release

Trigger phrases:
- styleguide
- coding standards
- lint and fix style
- clean up frontend code
- semantic HTML
- CSS architecture
- WCAG 2.2 AA
- accessibility
- contrast
- spacing
- typography
- iconography
- radii
- JS conventions
- JSON formatting
- Markdown standards

## Inputs
Collect these inputs before making changes:
1. The task goal and expected output files.
2. Scope: one file, one package, or whole workspace.
3. Strictness mode (default: `strict`):
   - `strict`: enforce every guideline unless technically blocked.
   - `pragmatic`: enforce critical rules first, then best-effort improvements.
4. Whether to prioritize:
   - accessibility
   - readability/maintainability
   - minimal diff size

## Reference files
Use these local files as canonical style references during execution:
- [./references/html.md](./references/html.md)
- [./references/css.md](./references/css.md)
- [./references/a11y.md](./references/a11y.md)
- [./references/javascript.md](./references/javascript.md)
- [./references/json.md](./references/json.md)
- [./references/markdown.md](./references/markdown.md)

## Decision flow
1. Detect file types in scope (`.html`, `.css`, `.js`, `.json`, `.md`).
2. Map each file to applicable guide sections.
3. Decide execution mode:
   - new files: scaffold from style-compliant structure.
   - existing files: apply smallest safe patch.
4. For CSS features, default to APIs baseline widely available.
5. If user explicitly asks for newer CSS APIs, use them with graceful fallback notes.
6. If rules conflict, prioritize in this order:
   1. validity and runtime correctness
   2. accessibility and semantics
   3. project-specific conventions
   4. formatting preferences
7. If a requested change conflicts with non-negotiable quality rules, explain tradeoff and propose a compliant alternative.

## Procedure
1. Analyze task scope and list target files.
2. Build a per-file checklist from relevant sections (HTML/CSS/JS/JSON/Markdown).
3. For CSS and HTML, enforce semantic/a11y-first structure before visual refinements.
4. Implement changes with minimal disruption to existing behavior.
5. Run project validation where available (tests, typecheck, lint, build).
6. Perform a final compliance pass and report:
   - what was fixed
   - what could not be fixed
   - residual risks and follow-up actions

## Per-language checklist

### HTML checklist
- Use semantic elements before generic containers.
- Avoid `div` when semantic alternatives fit.
- Prefer `section` for thematic grouping and `article` for standalone, reusable content blocks.
- Keep heading hierarchy valid and with one `h1` per document.
- Preserve accessibility basics (`label` association, meaningful `alt`, valid nesting).
- Prefer native semantics over ARIA.
- Keep markup minimal, readable, and valid.

### CSS checklist
- Use native CSS with predictable cascade structure.
- Structure stylesheet with `@layer` (at least `base`, `components`, `utilities`).
- Use CSS nesting to keep selectors shallow and component-scoped.
- Prefer element selectors and attribute selectors; avoid class selectors unless no safe alternative exists.
- Use CSS custom properties for colors, spacing, typography, and reusable component values.
- For animated custom properties, define typed properties with `@property`.
- Preserve declaration ordering for readability.
- Avoid `!important` unless unavoidable.
- Do not apply naming/methodology standards like BEM, OOCSS, ITCSS, SMACSS, or CUBE CSS.
- Prefer CSS APIs baseline widely available by default.
- Use non-baseline or newer CSS APIs only on explicit user request, with fallback strategy documented.
- Keep responsive behavior and accessibility media queries intact.

### Accessibility checklist (WCAG 2.2 AA base)
- Respect color contrast targets (normal text and large text) and avoid color-only meaning.
- Ensure readable typography and spacing (line-height, paragraph spacing, letter/word spacing support).
- Preserve visible focus indicators and keyboard navigability.
- Ensure touch/click targets are adequately sized and spacing avoids accidental activation.
- Ensure forms and interactive controls have programmatic labels and clear error/help text.
- Support reduced motion and avoid motion-triggered discomfort.
- Validate semantic structure, landmarks, and heading order for assistive tech.
- Use `./references/a11y.md` for detailed acceptance checks.

### JavaScript checklist
- Use `const`/`let`, semicolons, and 2-space indentation.
- Keep functions focused and readable with early returns when useful.
- Avoid dangerous constructs (`eval`, implicit globals, fragile coercion).
- For custom elements, keep lifecycle-safe listener setup/cleanup.
- Add comments only for non-obvious logic.

### JSON checklist
- Ensure valid JSON (double quotes, no trailing commas).
- Keep key names and object shape consistent.
- Use clear numeric units (`timeoutMs`, `sizeRem`).
- Prefer ISO 8601 UTC timestamps when needed.
- Keep formatting stable for low-noise diffs.

### Markdown checklist
- Exactly one H1 and ordered heading levels.
- Use concise, direct language.
- Use fenced code blocks with language tags.
- Keep list and spacing conventions consistent.
- Prefer descriptive links and clean sectioning.

## Completion criteria
A task is complete when:
1. All modified files pass applicable style checks from this skill.
2. CSS files follow custom properties + layer + nesting requirements, and `@property` where animation requires typed custom props.
3. HTML files use semantic structure (`section`/`article` where appropriate) and avoid unnecessary `div` wrappers.
4. WCAG 2.2 AA baseline checks are evaluated for affected UI (contrast, spacing, keyboard, focus, targets).
5. Any deviations are documented with reason.
6. Validation commands (if available) complete successfully, or failures are explicitly reported.
7. The final report includes changed files, key compliance fixes, and remaining risks.

## Response template
Use this structure in final responses:
1. `Applied rules`: brief summary of the styleguide areas enforced.
2. `Files updated`: list of files and key changes.
3. `Validation`: commands run and outcomes.
4. `Open items`: unresolved constraints or intentional deviations.

## Notes
- Prefer smallest viable patches over broad rewrites.
- Preserve project-specific constraints before applying generic conventions.
- Default to baseline widely available CSS APIs unless user asks for additional CSS APIs.
- If no file change is requested, provide a focused compliance review checklist only.
