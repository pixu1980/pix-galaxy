/**
 * e2e/ports.mjs — live port discovery for the e2e suite.
 *
 * dev:all assigns ports dynamically from 3000 (skipping busy ones), so the
 * canonical mapping from scripts/port-map.mjs can be off by one when another
 * dev server occupies 3000. Instead of hardcoding ports, this helper probes
 * the running docs sites and maps each `<title>` back to its component.
 *
 * Titles seen in the wild:
 *   "pix-galaxy · Web Component suite"
 *   "pix-a11y docs", "pix-color docs", …
 */

const PORTAL_TITLE = 'pix-galaxy · Web Component suite';

/**
 * @param {number} port
 * @returns {Promise<string | null>} the page <title>, or null when the port
 *   does not serve a pix-galaxy docs site.
 */
async function probeTitle(port) {
  try {
    const res = await fetch(`http://localhost:${port}/`, {
      signal: AbortSignal.timeout(1_500),
    });
    if (!res.ok) return null;
    const html = await res.text();
    const m = html.match(/<title>([^<]*)<\/title>/);
    return m ? m[1].trim() : null;
  } catch {
    return null;
  }
}

/**
 * Probe ports [min, max] and return { componentName: port }.
 * Entry names use the package directory names ("pix-galaxy", "pix-color", …).
 *
 * @param {{ min?: number, max?: number }} [opts]
 * @returns {Promise<Record<string, number>>}
 */
export async function discoverPorts({ min = 3000, max = 3015 } = {}) {
  /** @type {Record<string, number>} */
  const map = {};

  for (let port = min; port <= max; port += 1) {
    const title = await probeTitle(port);
    if (!title) continue;

    if (title === PORTAL_TITLE) {
      map.pix_galaxy = port;
      continue;
    }

    const m = title.match(/^(.+) docs$/);
    if (m) map[m[1]] = port;
  }

  return map;
}

/**
 * Resolve every required server or throw a clear error. Use in `beforeAll`
 * so a missing dev server fails loudly instead of failing individual tests.
 *
 * @param {string[]} required Names that must be reachable.
 * @param {Record<string, number>} ports Map from discoverPorts().
 */
export function requirePorts(required, ports) {
  const missing = required.filter((name) => ports[name] == null);
  if (missing.length > 0) {
    throw new Error(`Missing docs servers: ${missing.join(', ')}. Start them with: pnpm dev:all`);
  }
}
