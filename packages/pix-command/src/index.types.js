/**
 * @typedef {Object} PixCommandItem
 * @property {string} id - Unique command identifier
 * @property {string} label - Display label
 * @property {string} [description] - Optional description
 * @property {string[]} [keywords] - Additional search keywords
 * @property {string} [shortcut] - Keyboard shortcut (e.g. "Mod+Shift+P")
 * @property {string} [category] - Group category
 * @property {string} [icon] - SVG markup for icon
 */

/**
 * @fires PixCommand#command-selected
 * Fired when a command is activated.
 * @type {CustomEvent<PixCommandItem>}
 */
