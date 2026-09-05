/**
 * catalog.js — pure catalog logic for the component portal (src/docs).
 *
 * Kept free of browser/import.meta dependencies so the ordering, grouping
 * and summarising rules can be unit-tested (see catalog.test.mjs).
 */

/**
 * Curated importance order per section. Used as the tie-breaker when two
 * packages have the same download count (or none). "Most likely to be
 * used first" wins.
 */
export const LIBRARY_ORDER = ['pix-foundations', 'pix-color', 'pix-vanilla-reactive'];
export const COMPONENT_ORDER = [
  'pix-color-scheme-selector',
  'pix-accent-color-selector',
  'pix-toast',
  'pix-sortable',
  'pix-command',
  'pix-splitter',
  'pix-highlighter',
  'pix-recorder',
  'pix-a11y-panel',
];

/**
 * Build a Map<package-dir-name, 'ready' | 'wip'> from the package.json
 * entries discovered by the portal. Packages without a releaseStatus mark
 * (or with a non-"ready" value) are treated as WIP.
 *
 * @param {Array<[string, object]>} entries [name, pkg] pairs.
 * @returns {Map<string, 'ready' | 'wip'>}
 */
export function buildReleaseStatus(entries) {
  const map = new Map();
  for (const [name, pkg] of entries) {
    if (name && typeof pkg === 'object' && pkg !== null) {
      map.set(name, pkg.releaseStatus === 'ready' ? 'ready' : 'wip');
    }
  }
  return map;
}

/**
 * Rank a component within a curated order list. Unknown names sort last.
 *
 * @param {string[]} order
 * @returns {(comp: { name: string }) => number}
 */
export function makeOrderRank(order) {
  return (comp) => {
    const idx = order.indexOf(comp.name);
    return idx === -1 ? order.length : idx;
  };
}

/**
 * Sort a section's cards:
 *   1. release-ready (non-WIP) first, WIP second, placeholders last
 *   2. then by npm downloads (descending; absent = -1)
 *   3. then by the curated order
 *
 * @param {Array<{ name: string, packageName?: string }>} items
 * @param {string[]} order
 * @param {Map<string, 'ready' | 'wip'>} releaseStatus
 * @param {Record<string, number>} downloads
 * @returns {typeof items}
 */
export function sortSection(items, order, releaseStatus, downloads) {
  const rank = makeOrderRank(order);
  const downloadsOf = (comp) => (comp.packageName ? (downloads[comp.packageName] ?? -1) : -1);

  return [...items].sort((a, b) => {
    const statusRank = (comp) => {
      if (!comp.packageName) return 2;
      return releaseStatus.get(comp.name) === 'ready' ? 0 : 1;
    };
    const diffStatus = statusRank(a) - statusRank(b);
    if (diffStatus !== 0) return diffStatus;

    const diff = downloadsOf(b) - downloadsOf(a);
    return diff !== 0 ? diff : rank(a) - rank(b);
  });
}

/**
 * Build the two portal sections (Components first, then Libraries) from the
 * catalog, sorting each with sortSection().
 *
 * @param {Array<{ name: string, packageName?: string, kind?: string }>} components
 * @param {{ releaseStatus: Map<string, 'ready'|'wip'>, downloads: Record<string, number>, isLibrary?: (comp: any) => boolean }} opts
 * @returns {Array<{ id: string, title: string, items: any[] }>}
 */
export function groupSections(components, { releaseStatus, downloads, isLibrary }) {
  const library = isLibrary ?? ((comp) => comp.kind === 'library');
  return [
    {
      id: 'portal-components',
      title: 'Components',
      items: sortSection(
        components.filter((comp) => !library(comp)),
        COMPONENT_ORDER,
        releaseStatus,
        downloads
      ),
    },
    {
      id: 'portal-libraries',
      title: 'Libraries',
      items: sortSection(components.filter(library), LIBRARY_ORDER, releaseStatus, downloads),
    },
  ];
}

/**
 * Summaries for the hero pills. Placeholder entries (no packageName) are
 * excluded from the WIP count.
 *
 * @param {Array<{ items: Array<{ name: string, packageName?: string }> }>} sections
 * @param {Map<string, 'ready'|'wip'>} releaseStatus
 * @returns {{ wipCount: number, totalCount: number }}
 */
export function summarize(sections, releaseStatus) {
  const catalogStatus = sections
    .flatMap((s) => s.items)
    .map((comp) => (comp.packageName ? (releaseStatus.get(comp.name) ?? 'wip') : null))
    .filter(Boolean);
  return {
    wipCount: catalogStatus.filter((status) => status === 'wip').length,
    totalCount: sections.reduce((sum, section) => sum + section.items.length, 0),
  };
}
