# Getting Started

@pix-galaxy/pix-button is released as a browser-native Web Component with zero runtime dependencies.

## Install

```bash
pnpm add @pix-galaxy/pix-button
```

## Basic Usage

```html
<script type="module">
  import '@pix-galaxy/pix-button';
</script>

<pix-button>Click me</pix-button>
<pix-button variant="secondary">Secondary</pix-button>
<pix-button variant="ghost">Ghost</pix-button>
<pix-button disabled>Disabled</pix-button>
```

The component keeps native button semantics in light DOM, so keyboard activation and focus behavior stay aligned with the platform.
