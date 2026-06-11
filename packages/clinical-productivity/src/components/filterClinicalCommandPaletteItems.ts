import type { ClinicalCommandPaletteItem } from './ClinicalCommandPalette.js';

function searchableText(item: ClinicalCommandPaletteItem): string {
  return [item.label, item.keywords, item.group].filter(Boolean).join(' ').toLowerCase();
}

/** Puntúa coincidencia fuzzy por tokens (todas las palabras deben aparecer). */
export function scoreClinicalCommandPaletteMatch(
  query: string,
  item: ClinicalCommandPaletteItem,
): number {
  const q = query.trim().toLowerCase();
  if (!q) return 1;

  const haystack = searchableText(item);
  const tokens = q.split(/\s+/).filter(Boolean);
  let score = 0;

  for (const token of tokens) {
    const label = item.label.toLowerCase();
    const idx = haystack.indexOf(token);
    if (idx < 0) return 0;

    if (label.startsWith(token)) score += 20;
    else if (label.includes(token)) score += 12;
    else score += 6;

    if (idx === 0) score += 4;
  }

  return score;
}

/** Filtra y ordena ítems de paleta con búsqueda fuzzy por tokens. */
export function filterClinicalCommandPaletteItems(
  items: ClinicalCommandPaletteItem[],
  query: string,
  maxVisible: number,
): ClinicalCommandPaletteItem[] {
  const q = query.trim();
  if (!q) return items.slice(0, maxVisible);

  return items
    .map((item) => ({ item, score: scoreClinicalCommandPaletteMatch(q, item) }))
    .filter(({ score }) => score > 0)
    .sort(
      (a, b) =>
        b.score - a.score || a.item.label.localeCompare(b.item.label, 'es'),
    )
    .slice(0, maxVisible)
    .map(({ item }) => item);
}
