# How It Works

`<pix-toast>` renders individual notification elements. `<pix-toast-stack>` manages a queue of toasts, handling:

- **Positioning**: Uses `position: fixed` with configurable corner
- **Max visible**: When the limit is hit, new toasts are queued until space frees
- **Dedup**: If a toast with the same `id` is added while visible, it's bumped (reset timer)
- **Timer**: Each toast has a progress bar. Hover pauses via `animation-play-state: paused`
- **ARIA**: Uses `role="status"` (info/success) or `role="alert"` (warning/error)
