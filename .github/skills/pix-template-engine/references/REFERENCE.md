# PIX Template Engine reference

The bundled engine includes:

- `index.js`: main `TemplateEngine` class
- `_renderer.js`: DOM-based renderer and directive handling
- `_expression-parser.js`: expression parsing and evaluation
- `_filters.js`: built-in filters and custom filter hooks
- `tests/*.test.js`: functional tests for directives and rendering behavior

## Supported directives and features

- `{{ expression }}` interpolation
- filter pipelines
- `<if condition="...">`
- `<for each="item in items">`
- `<switch expr="...">`, `<case>`, `<default>`
- `<include src="...">`
- `<extends src="...">` with `<block name="...">`

## Recommended project layout after install

- `src/template-engine/` for engine and tests
- `examples/template-engine/` for runnable usage samples

## Typical integration points

- static build scripts (`node scripts/build-static.mjs`)
- SSG generation step in build pipeline
- SSR route handlers that render templates per request

## Dependency note

The bundled renderer uses `jsdom`. Ensure target project has `jsdom` available in dependencies or devDependencies.
