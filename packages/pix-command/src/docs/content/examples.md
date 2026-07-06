# Examples

## Minimal

```html
<pix-command>
  <script type="application/json">
    [
      { "id": "ping", "label": "Ping", "description": "Ping the server" },
      { "id": "pong", "label": "Pong", "description": "Reply to ping" }
    ]
  </script>
</pix-command>
```

## With Remote Data

```html
<pix-command src="/api/commands.json"></pix-command>
```

## Programmatic Control

```js
const cmd = document.querySelector('pix-command');
cmd.open = true;
cmd.addEventListener('command-selected', (e) => {
  console.log('User selected:', e.detail.label);
});
```
