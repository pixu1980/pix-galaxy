---
description: "Use when creating, scaffolding, or editing Custom Elements v1 — including autonomous elements (e.g. <pix-card>) and customized built-ins (e.g. <details is=\"pix-details\">) — and any code involving customElements.define, adoptedStyleSheets, or componentDecorator."
name: "pix Custom Element"
applyTo: "**/*.{js,mjs,css,html}"
---
# pix Custom Element Instructions

- Build Custom Elements v1 in light DOM only. Never use Shadow DOM, never use `<template>` elements.
- CSS belongs to `document.adoptedStyleSheets` only. Never inject `<style>` tags inside `render`/`onRender`/`connectedCallback`.
- Wire every component through `componentDecorator(this)` inside a `static {}` initialization block.
- Declare component intent through static metadata: `static attributes`, `static events`, `static styles`, `static extendsElement`, `static isAttribute`.
- Implement only the optional hooks (`onRender`, `onConnected`, `onDisconnected`, `onAttributeChanged`). The decorator generates `connectedCallback`, `disconnectedCallback`, `attributeChangedCallback`, and `handleEvent`.
- Register DOM listeners through `static events` so the decorator attaches and detaches them automatically. Never store bound function references for cleanup.
- Use private class fields (`#field`) for internal state. Expose data via setters when reactive re-render is needed.
- For rendering use `pix-template-engine` tagged template literals (`engine.html\`...\``) compiled once at module load.
- Use pix-design-system tokens (`--space-*`, `--color-*`, `--radius-*`, `--card-*`) on the right-hand side of component-scoped tokens (`--<tag>--*`).
- Prefer attribute selectors (`[is="pix-details"]`, `[data-part="title"]`) over classes. Avoid id selectors.
- CSS lives under `@layer components.<tag>` to compose with the design-system cascade.

## Centralization rules

- `decorator/` and `events/` helper folders are project singletons. Install them once at a shared path (`src/lib/custom-element/`, `lib/custom-element/`, or `packages/<pkg>/src/lib/custom-element/`).
- Before scaffolding any new component, search the project for an existing `componentDecorator` and import from there. Never copy `decorator/` or `events/` into a component folder.
- Never import helpers from a sibling component. Always import from the canonical shared path (or its alias).

## Scaffolding

- Use `node ./.github/skills/pix-custom-element/scripts/scaffold-component.mjs --name <PascalName>` to scaffold a new component. The script auto-detects an existing shared library or installs one with `--install-shared`.
- Component folder naming: `PascalCase` (matches the class). File naming: `kebab-case` (matches the custom element tag).
- Customized built-ins (`is="..."`) are not natively supported on Safari. When targeting Safari, ship the `@ungap/custom-elements` polyfill at app entry or fall back to autonomous elements.

## Bundler-agnostic CSS

- Import CSS as a string. Use `bundle-text:` (Parcel), `?raw` (Vite/Rollup/webpack 5), or configure a `text` loader (esbuild). The decorator's `registerStylesheet` accepts strings, `CSSStyleSheet` instances, or arrays of either.
