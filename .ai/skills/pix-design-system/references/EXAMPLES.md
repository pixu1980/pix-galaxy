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

## docs-site

Use `assets/examples/docs-site` when a static token overview page is useful.

It shows:
- native HTML and CSS only
- a simple foundations overview
- docs-site scaffolding copied by `--docs-site`

## Example Selection Guide

- Choose `app-basic` for local app integration.
- Choose `package-basic` for workspace package integration.
- Choose `docs-site` for stakeholder-facing docs or token overview pages.
