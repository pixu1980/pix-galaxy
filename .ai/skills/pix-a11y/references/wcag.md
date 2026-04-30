# WCAG 2.2 AA references

This document collects canonical links for accessibility audits and remediation.

## Primary standards

- WCAG 2.2 Overview (W3C): https://www.w3.org/WAI/standards-guidelines/wcag/
- WCAG 2.2 Recommendation: https://www.w3.org/TR/WCAG22/
- How to Meet WCAG (Quick Reference): https://www.w3.org/WAI/WCAG22/quickref/
- Understanding WCAG 2.2: https://www.w3.org/WAI/WCAG22/Understanding/

## Conformance and levels

- Conformance details (A/AA/AAA): https://www.w3.org/TR/WCAG22/#conformance
- WCAG 2.2 at a glance: https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/

## Practical testing support

- ARIA Authoring Practices Guide: https://www.w3.org/WAI/ARIA/apg/
- Accessible Name and Description Computation: https://www.w3.org/TR/accname-1.2/
- HTML Accessibility API Mappings: https://www.w3.org/TR/html-aam-1.0/

## Automated tooling references

- axe-core GitHub: https://github.com/dequelabs/axe-core
- axe-core API docs: https://github.com/dequelabs/axe-core/blob/develop/doc/API.md
- axe DevTools rules overview: https://dequeuniversity.com/rules/axe/

## Baseline WCAG 2.2 AA checks to enforce

1. Contrast minimum for normal/large text and UI components.
2. Keyboard operability and visible focus.
3. Semantic structure, headings, and landmarks.
4. Form labels, errors, and instructions.
5. Target size and spacing for pointer interactions.
6. Reduced motion support and non-color-only cues.

## Reporting guidance

When exporting reports, include:
- scope (page/component URL)
- timestamp
- pass/violation counts
- violations grouped by impact (`critical`, `serious`, `moderate`, `minor`)
- remediation hints and node snippets
