# Changelog

All notable changes to this project will be documented in this file.

## Unreleased

### Added

- pnpm-first developer workflow with npm reserved for final publish only.
- docs markdown source in src/docs/content/ and generated docs site in src/docs/ built with marked and Vite.
- local release helper commands rel:patch, rel:minor and rel:major.
- release pipeline that validates with pnpm, publishes to npm, then deploys docs to GitHub Pages.
- component source relocation into src/components/.

## 0.1.0 - 2026-04-28

### Added

- npm-ready packaging with minified ESM and CommonJS outputs.
- Native Node.js test runner setup with jsdom and raw-text loader support.
- Source split for PixHighlighter constants and utilities.
- Physical SVG assets imported as raw strings at build and test time.
- Ten bundled themes with coherent semantic token color coverage.
- Open-source governance files, issue templates, CI workflow and release workflow.
