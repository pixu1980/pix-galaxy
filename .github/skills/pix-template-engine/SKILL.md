---
name: pix-template-engine
description: 'Install and use a DOM-based template engine for static HTML generation, SSG, SSR, and inline tagged template literals. Use when user requests template-engine integration, HTML rendering pipelines, includes/extends, server-side template rendering, or engine.html/template literal rendering.'
argument-hint: 'Target request, e.g. "set up template engine for SSG pages"'
---

# PIX Template Engine

## Outcome
Copy a ready-to-use template engine into the target project and use it for static HTML generation, SSG, or SSR workflows.
It can also render inline templates through tagged template literals with `engine.template` or `engine.html`.

This skill bundles:
- engine source files
- test suite
- usage examples for static HTML, SSG, SSR, and tagged template literals

## When to use
Use this skill when a user or another skill asks to:
- integrate a template engine in a project
- generate HTML from templates in build scripts
- implement SSG or SSR using template files
- render inline templates as tagged template literals
- use template directives such as `extends`, `include`, `block`, `if`, `for`, `switch`

Trigger phrases:
- template engine
- static html generation
- ssg
- ssr
- server-side rendering
- html templating
- tagged template literal
- engine.html
- include extends block

## Inputs
1. Target project root path.
2. Installation destination (default: `src/template-engine`).
3. Runtime usage mode:
   - `static-html`
   - `ssg`
   - `ssr`
   - `tagged-template-literal`
4. Optional output path for generated pages.

## Resources
- Engine bundle: [./assets/template-engine/index.js](./assets/template-engine/index.js)
- Engine tests: [./assets/template-engine/tests/core.test.js](./assets/template-engine/tests/core.test.js)
- Tagged literal tests: [./assets/template-engine/tests/tagged-template-literal.test.js](./assets/template-engine/tests/tagged-template-literal.test.js)
- Installer script: [./scripts/install-template-engine.mjs](./scripts/install-template-engine.mjs)
- Usage examples:
  - [./assets/examples/static-html/build-static.mjs](./assets/examples/static-html/build-static.mjs)
  - [./assets/examples/ssg/build-site.mjs](./assets/examples/ssg/build-site.mjs)
  - [./assets/examples/ssr/server.mjs](./assets/examples/ssr/server.mjs)
  - [./assets/examples/tagged-template-literal/render-inline.mjs](./assets/examples/tagged-template-literal/render-inline.mjs)
  - [./assets/examples/tagged-template-literal/render-components.mjs](./assets/examples/tagged-template-literal/render-components.mjs)
- Reference: [./references/REFERENCE.md](./references/REFERENCE.md)

## Decision flow
1. If the project already has a template engine, reuse it unless migration is requested.
2. If no engine exists, install bundled source and tests via installer script.
3. Pick usage mode:
   - static-html: one-off page generation script
   - ssg: many pages generated at build time
   - ssr: runtime rendering on request
   - tagged-template-literal: inline reusable render functions with `engine.template` or `engine.html`
4. Validate the engine by running bundled tests in the target project.
5. Add or adapt example implementation for the selected mode.

## Procedure
1. Install engine in target project:
   - `node ./.github/skills/pix-template-engine/scripts/install-template-engine.mjs --target "<project-root>" --dest "src/template-engine" --with-examples`
2. Ensure `jsdom` and `marked` are available in target project (engine dependencies).
3. Choose one example and adapt paths/data.
4. Execute tests:
   - `node --test ./src/template-engine/tests/*.test.js`
5. Use `TemplateEngine` in build/runtime pipeline, or use the tagged literal API for inline templates.

## Tagged template literal usage
Use `engine.template` or the shorter `engine.html` alias when a template is small, component-like, or created inside a build/runtime module.
Use [./assets/examples/tagged-template-literal/render-inline.mjs](./assets/examples/tagged-template-literal/render-inline.mjs) for basic inline composition.
Use [./assets/examples/tagged-template-literal/render-components.mjs](./assets/examples/tagged-template-literal/render-components.mjs) for component-like render functions with different data scopes.

```js
import TemplateEngine from './src/template-engine/index.js';

const engine = new TemplateEngine();
const renderCard = engine.html`
  <article>
    <h2>{{ title }}</h2>
    <p>{{ summary }}</p>
  </article>
`;

const html = renderCard({
  title: 'Inline template',
  summary: 'Rendered without a template file.',
});
```

Prefer `{{ value }}` for data binding so filters and escaping behavior stay consistent with file templates. Use `${...}` only for static fragments, reusable render functions, or functions that derive markup from render data.

```js
const renderBadge = engine.html`<span>{{ label | upper }}</span>`;

const renderShell = engine.template`
  <main>
    ${renderBadge}
    ${(data) => `<small>${data.meta.generatedAt}</small>`}
  </main>
`;
```

JavaScript `${...}` interpolations are inserted before template rendering. If an interpolation is a function, it receives the render data.
Do not place a tagged render function inside `<for>` expecting loop-scoped data; use template directives for loop items or map data inside JavaScript interpolation.

## Tagged template literal tests
Keep tagged literal behavior covered in [./assets/template-engine/tests/tagged-template-literal.test.js](./assets/template-engine/tests/tagged-template-literal.test.js). Cover:
- `engine.template` rendering with directives and filters
- `engine.html` alias
- composition with reusable tagged render functions
- JavaScript interpolation functions
- non-tagged direct call rejection

## Completion criteria
A task is complete when:
1. Source files are copied into the target project.
2. Template-engine tests are runnable in target project.
3. At least one concrete usage flow (static-html, ssg, or ssr) is implemented.
   For tagged literal tasks, a reusable `engine.html` or `engine.template` render function is enough.
4. Final report includes installed paths, test status, and usage entrypoint.

## Notes
- Prefer the bundled DOM renderer implementation for nested directives reliability.
- Keep copied source structure unchanged to simplify updates.
- When updating engine behavior, update tests in the same change.
