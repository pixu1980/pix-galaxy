# Getting Started

## Installation

```bash
npm install @pix-galaxy/pix-toast
```

## Usage

```html
<pix-toast-stack position="top-right"></pix-toast-stack>

<script type="module">
  import '@pix-galaxy/pix-toast';

  const stack = document.querySelector('pix-toast-stack');
  stack.add({ message: 'Hello!', variant: 'success' });
</script>
```
