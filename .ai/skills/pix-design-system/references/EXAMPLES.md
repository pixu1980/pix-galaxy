# Design System Examples

## app-basic

Use `assets/examples/app-basic` to understand app-mode consumption.

It shows:
- importing the local CSS entrypoint
- using `data-layout`
- using `data-component`
- using helper attributes

## package-basic

Use `assets/examples/package-basic` to understand package-mode consumption.

It shows:
- depending on the generated package
- importing `__PACKAGE_NAME__/css`
- keeping consumer CSS thin

## web-component-theme

Use `assets/examples/web-component-theme` when custom elements need to consume global design tokens.

It shows:
- a vanilla custom element
- Shadow DOM styles using host-accessible custom properties
- component-local CSS without framework dependencies

## docs-site

Use `assets/examples/docs-site` when a static token overview page is useful.

It shows:
- native HTML and CSS only
- a simple foundations overview
- docs-site scaffolding copied by `--docs-site`

## Example Selection Guide

- Choose `app-basic` for local app integration.
- Choose `package-basic` for workspace package integration.
- Choose `web-component-theme` for Shadow DOM theming.
- Choose `docs-site` for stakeholder-facing docs or token overview pages.
