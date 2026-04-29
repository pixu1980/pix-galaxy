---
description: "Use when integrating template-engine workflows, static HTML generation, SSG, SSR, or template directives such as extends/include/block/if/for/switch."
name: "PIX Template Engine Integration"
applyTo: "**/*.{html,js,mjs}"
---
# PIX Template Engine Instructions

- Prefer the bundled DOM-based template engine implementation for nested directive reliability.
- Keep source structure aligned with skill assets to simplify sync and updates.
- Include engine sources, tests, and usage examples when integrating into a target project.

## Integration workflow

1. Install engine files into target project using skill installer flow.
2. Ensure runtime dependency for DOM rendering (`jsdom`) is present.
3. Select use mode:
   - static HTML generation
   - SSG build pipeline
   - SSR request-time rendering
4. Run template-engine tests after install.
5. Adapt one concrete example flow in project (`static-html`, `ssg`, or `ssr`).

## Template syntax constraints

- Use project template tags for control flow and composition.
- Do not introduce Liquid/Jekyll syntax in template files.
