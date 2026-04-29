# Violation to design-system remediation mapping

This mapping links common axe violations to practical component-level fixes.

## Core mapping

- `color-contrast`
  - Components: button, badge, text, links
  - Fix: adjust semantic color tokens for AA contrast
- `aria-*`
  - Components: custom controls, dialogs, menus
  - Fix: prefer native semantic element; validate name/role/state
- `label`
  - Components: form controls
  - Fix: add explicit labels and descriptive error/help bindings
- `focus-*`
  - Components: all interactive controls
  - Fix: ensure visible focus indicator and keyboard flow
- `landmark-*` / heading issues
  - Components: page shell/layout
  - Fix: correct landmarks and heading hierarchy

## Checklist output intent

`map-violations-checklist.mjs` creates markdown grouped by inferred component.

Each item includes:
- violation id + impact
- target selector
- short rule description
- two concrete remediation checkbox steps

## Customization

For project-specific components, extend component inference in script:

- detect `pix-*` tags
- map selectors to internal design-system names
- add rule-specific remediation templates
