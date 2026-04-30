---
name: "pix Styleguides Enforce"
description: "Strictly apply pix styleguides on HTML/CSS/JS/JSON/Markdown with a focus on semantics, accessibility, and consistency."
argument-hint: "Styleguide task (e.g. 'refactor component CSS and align semantic HTML')"
agent: "agent"
---
Apply `pix-styleguides` in strict mode.

Mandatory references:
- [skill pix-styleguides](../skills/pix-styleguides/SKILL.md)
- [css reference](../skills/pix-styleguides/references/css.md)
- [html reference](../skills/pix-styleguides/references/html.md)
- [a11y reference](../skills/pix-styleguides/references/a11y.md)
- [javascript reference](../skills/pix-styleguides/references/javascript.md)
- [json reference](../skills/pix-styleguides/references/json.md)
- [markdown reference](../skills/pix-styleguides/references/markdown.md)

Hard CSS checklist:
- `@layer` (base/components/utilities)
- CSS nesting
- custom properties for reusable values
- `@property` for animatable custom properties
- preferred selectors: element/attribute; classes only as last resort
- do not use BEM/OOCSS/ITCSS/SMACSS/CUBE CSS
- baseline CSS APIs by default; new APIs only on explicit request with documented fallback

Hard HTML + A11y checklist:
- avoid `div` where `section`/`article`/landmark is appropriate
- valid heading hierarchy, only one `h1`
- baseline WCAG 2.2 AA (contrast, focus, keyboard, spacing, labels/errors, reduced motion)

Mandatory final output:
1. `Applied rules`
2. `Files updated`
3. `Validation`
4. `Open items`
