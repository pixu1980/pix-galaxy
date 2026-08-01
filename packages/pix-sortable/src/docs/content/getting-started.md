# Getting Started

## Installation

```bash
npm install @pix-galaxy/pix-command
```

## Usage

```html
<pix-command src="/api/commands.json"></pix-command>

<script type="module">
  import '@pix-galaxy/pix-command';
</script>
```

## Inline Data

```html
<pix-command>
  <script type="application/json">
    [{ "id": "hello", "label": "Say Hello", "description": "Greet the user" }]
  </script>
</pix-command>
```
