/**
 * @typedef {Object} PixToastItem
 * @property {string} [id] — Unique ID (auto-generated if omitted)
 * @property {string} message — Toast message
 * @property {'info'|'success'|'warning'|'error'} [variant='info'] — Visual variant
 * @property {number} [duration=5000] — Auto-dismiss ms (0 = no auto-dismiss)
 * @property {string} [title] — Optional heading
 * @property {boolean} [dismissible=true] — Show dismiss button
 */

/**
 * @fires PixToastStack#toast-add
 * @type {CustomEvent<PixToastItem>}
 */

/**
 * @fires PixToastStack#toast-dismiss
 * @type {CustomEvent<{id: string}>}
 */
