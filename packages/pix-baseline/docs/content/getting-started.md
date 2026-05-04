# Getting Started

@pix-galaxy/pix-baseline is released as a browser-native Web Component with zero runtime dependencies.

## Install

```bash
pnpm add @pix-galaxy/pix-baseline
```

## Basic Usage

```html
<script type="module">
  import '@pix-galaxy/pix-baseline';
</script>

<pix-baseline>
  Baseline content block
</pix-baseline>

<pix-baseline variant="outlined">
  Outlined baseline content block
</pix-baseline>
```

## Local Development

```bash
pnpm --filter @pix-galaxy/pix-baseline build
pnpm --filter @pix-galaxy/pix-baseline test
pnpm --filter @pix-galaxy/pix-baseline docs:build
```

The shared docs builder turns these markdown files into the interactive docs shell used across component packages.
