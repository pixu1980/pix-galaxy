# Design System Examples

## app-basic

Use `assets/examples/app-basic` to understand app-mode consumption.

It shows:
- importing the local CSS entrypoint
- using `data-layout`
- using proportional typography and spacing foundations
- documenting component hooks without shipping concrete component CSS
- using helper attributes

## package-basic

Use `assets/examples/package-basic` to understand package-mode consumption.

It shows:
- depending on the generated package
- importing `__PACKAGE_NAME__/css`
- keeping consumer CSS thin while leaving concrete component styling to the consuming project

## docs-site

Use `assets/examples/docs-site` when a static token overview page is useful.

It shows:
- native HTML and CSS only
- a simple overview of proportional foundations
- docs-site scaffolding copied by `--docs-site`
- a `components` layer kept as commented placeholder guidance only

## Example Selection Guide

- Choose `app-basic` for local app integration.
- Choose `package-basic` for workspace package integration.
- Choose `docs-site` for stakeholder-facing docs or token overview pages.
