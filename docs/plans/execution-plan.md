# pix-component-template overhaul

- [x] Fix template docs to use `@pix-galaxy/shared/docs/docs-site.js` (shared module)
- [x] Fix CSS to be valid even before placeholder replacement (`:where()` selector)
- [x] Remove vite.config.mjs from template (no auto-start via dev-all)
- [x] Remove template from dev-all.mjs auto-discovery + knownColors
- [x] Create `scripts/scaffold-component.mjs` — PascalName → full scaffold
- [x] Add `pnpm scaffold` to root package.json
- [x] Remove duplicate pix-color entry from components.json
