---
description: "Use when integrating template-engine workflows, static HTML generation, SSG, SSR, or template directives such as extends/include/block/if/for/switch."
name: "pix Template Engine Integration"
applyTo: "**/*.{html,js,mjs}"
---
# pix Template Engine Instructions

- Use the full DOM-based template engine bundle only for Node-side static HTML generation, SSG, or SSR workflows.
- For browser runtime modules and custom elements, use the browser-safe tagged runtime at `assets/tagged-runtime/index.js` only.
- Keep source structure aligned with skill assets to simplify sync and updates.
- Include engine sources, tests, and usage examples when integrating the full Node-side engine into a target project.

## Integration workflow

1. Decide whether the target is Node-side rendering (`template-engine/`) or browser runtime tagged literals (`tagged-runtime/`).
2. For Node-side rendering, install engine files into the target project using the skill installer flow.
3. Ensure `jsdom` and `marked` are present only when using the full Node-side engine.
4. For browser runtime tagged literals, copy only `assets/tagged-runtime/index.js` into the target shared runtime folder.
5. Run template-engine tests after installing the full Node-side engine, or validate bundling/build when using the browser-safe tagged runtime.

## Template syntax constraints

- Use project template tags for control flow and composition only with the full Node-side engine.
- In the browser-safe tagged runtime, use JavaScript `${...}` interpolations only. Do not rely on `{{ ... }}`, filters, or file directives there.
- Do not introduce Liquid/Jekyll syntax in template files.
