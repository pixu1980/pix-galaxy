---
name: pix-template-engine
description: 'Install and use a DOM-based template engine for static HTML generation, SSG, and SSR. Use when user requests template-engine integration, HTML rendering pipelines, includes/extends, or server-side template rendering.'
argument-hint: 'Target request, e.g. "set up template engine for SSG pages"'
---

# PIX Template Engine

## Outcome
Copy a ready-to-use template engine into the target project and use it for static HTML generation, SSG, or SSR workflows.

This skill bundles:
- engine source files
- test suite
- usage examples for static HTML, SSG, and SSR

## When to use
Use this skill when a user or another skill asks to:
- integrate a template engine in a project
- generate HTML from templates in build scripts
- implement SSG or SSR using template files
- use template directives such as `extends`, `include`, `block`, `if`, `for`, `switch`

Trigger phrases:
- template engine
- static html generation
- ssg
- ssr
- server-side rendering
- html templating
- include extends block

## Inputs
1. Target project root path.
2. Installation destination (default: `src/template-engine`).
3. Runtime usage mode:
   - `static-html`
   - `ssg`
   - `ssr`
4. Optional output path for generated pages.

## Resources
- Engine bundle: [./assets/template-engine/index.js](./assets/template-engine/index.js)
- Engine tests: [./assets/template-engine/tests/core.test.js](./assets/template-engine/tests/core.test.js)
- Installer script: [./scripts/install-template-engine.mjs](./scripts/install-template-engine.mjs)
- Usage examples:
  - [./assets/examples/static-html/build-static.mjs](./assets/examples/static-html/build-static.mjs)
  - [./assets/examples/ssg/build-site.mjs](./assets/examples/ssg/build-site.mjs)
  - [./assets/examples/ssr/server.mjs](./assets/examples/ssr/server.mjs)
- Reference: [./references/REFERENCE.md](./references/REFERENCE.md)

## Decision flow
1. If the project already has a template engine, reuse it unless migration is requested.
2. If no engine exists, install bundled source and tests via installer script.
3. Pick usage mode:
   - static-html: one-off page generation script
   - ssg: many pages generated at build time
   - ssr: runtime rendering on request
4. Validate the engine by running bundled tests in the target project.
5. Add or adapt example implementation for the selected mode.

## Procedure
1. Install engine in target project:
   - `node ./.github/skills/pix-template-engine/scripts/install-template-engine.mjs --target "<project-root>" --dest "src/template-engine" --with-examples`
2. Ensure `jsdom` is available in target project (engine dependency).
3. Choose one example and adapt paths/data.
4. Execute tests:
   - `node --test ./src/template-engine/tests/*.test.js`
5. Use `TemplateEngine` in build/runtime pipeline.

## Completion criteria
A task is complete when:
1. Source files are copied into the target project.
2. Template-engine tests are runnable in target project.
3. At least one concrete usage flow (static-html, ssg, or ssr) is implemented.
4. Final report includes installed paths, test status, and usage entrypoint.

## Notes
- Prefer the bundled DOM renderer implementation for nested directives reliability.
- Keep copied source structure unchanged to simplify updates.
- When updating engine behavior, update tests in the same change.
