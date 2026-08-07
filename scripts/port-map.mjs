/**
 * port-map.mjs - canonical dev-port order for pix-galaxy.
 *
 * Single source of truth shared by:
 *   - scripts/dev-all.mjs  (assigns VITE_DEV_PORTS)
 *   - src/docs/index.js    (portal getDevPort fallback)
 *
 * Port = 3000 + index (index 0 = pix-galaxy root portal).
 * Order is alphabetical over packages/ entries that have a vite.config.
 */
export const DEV_PORT_ORDER = [
  'pix-galaxy',
  'pix-a11y-panel',
  'pix-accent-color-selector',
  'pix-color',
  'pix-color-scheme-selector',
  'pix-command',
  'pix-foundations',
  'pix-highlighter',
  'pix-recorder',
  'pix-sortable',
  'pix-splitter',
  'pix-toast',
  'pix-vanilla-reactive',
];

export const DEV_PORT_BASE = 3000;

/**
 * @param {string} compName Package name (e.g. "pix-color").
 * @returns {number | null} Dev port or null when unknown.
 */
export function devPortFor(compName) {
  const idx = DEV_PORT_ORDER.indexOf(compName);
  return idx >= 0 ? DEV_PORT_BASE + idx : null;
}
