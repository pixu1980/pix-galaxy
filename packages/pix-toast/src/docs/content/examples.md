# Examples

## All variants

```js
stack.add({ title: 'Info', message: 'Update available', variant: 'info' });
stack.add({ title: 'Success', message: 'Saved!', variant: 'success' });
stack.add({ title: 'Warning', message: 'Low disk space', variant: 'warning' });
stack.add({ title: 'Error', message: 'Connection lost', variant: 'error', duration: 0 });
```

## Persistent toast

```js
stack.add({ message: 'This stays until dismissed', duration: 0 });
```

## Auto-dismiss after 8s

```js
stack.add({ message: 'Go away after 8 seconds', duration: 8000 });
```
