# Getting Started

@pix-galaxy/pix-card is released as a browser-native Web Component with zero runtime dependencies.

## Install

```bash
pnpm add @pix-galaxy/pix-card
```

## Basic Usage

```html
<script type="module">
  import '@pix-galaxy/pix-card';
</script>

<pix-card>
  <span slot="header">Header</span>
  Body content
  <span slot="footer">Footer</span>
</pix-card>
```

When `href` is set, the card renders as a native anchor while keeping the same light-DOM content model.
