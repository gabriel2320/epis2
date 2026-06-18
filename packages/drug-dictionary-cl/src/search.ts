import { DRUG_DICTIONARY_CL_SEED } from './drugSeedEsCl.js';
import type { DrugDictionaryEntry, DrugSearchResult } from './types.js';

export const DRUG_DICTIONARY_CL: readonly DrugDictionaryEntry[] = DRUG_DICTIONARY_CL_SEED;

const byId = new Map(DRUG_DICTIONARY_CL.map((entry) => [entry.id, entry]));

function normalizeQuery(raw: string): string {
  return raw.trim().toLowerCase().normalize('NFD').replace(/\p{M}/gu, '').replace(/\s+/g, ' ');
}

export function getDrugById(id: string): DrugDictionaryEntry | undefined {
  return byId.get(id);
}

export function searchDrugsEsCl(query: string, limit = 8): DrugSearchResult[] {
  const q = normalizeQuery(query);
  if (!q) return [];

  const results: DrugSearchResult[] = [];

  for (const entry of DRUG_DICTIONARY_CL) {
    const ingredient = normalizeQuery(entry.activeIngredient);
    if (ingredient.startsWith(q) || ingredient.includes(q)) {
      results.push({ entry, score: ingredient.startsWith(q) ? 100 : 80, matchedOn: 'ingredient' });
      continue;
    }
    for (const name of entry.commonNames) {
      const n = normalizeQuery(name);
      if (n.startsWith(q) || n.includes(q)) {
        results.push({ entry, score: n.startsWith(q) ? 92 : 75, matchedOn: 'name' });
        break;
      }
    }
    if (results.some((r) => r.entry.id === entry.id)) continue;
    for (const order of entry.usualOrders) {
      const o = normalizeQuery(order);
      if (o.includes(q)) {
        results.push({ entry, score: 70, matchedOn: 'order' });
        break;
      }
    }
  }

  return results
    .sort(
      (a, b) =>
        b.score - a.score || a.entry.activeIngredient.localeCompare(b.entry.activeIngredient),
    )
    .slice(0, limit);
}

export function assertDrugDictionaryClInvariants(): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();

  if (DRUG_DICTIONARY_CL.length < 50) {
    errors.push(`DRUG_DICTIONARY_CL tiene ${DRUG_DICTIONARY_CL.length} entradas (min 50)`);
  }

  for (const entry of DRUG_DICTIONARY_CL) {
    if (ids.has(entry.id)) {
      errors.push(`id duplicado: ${entry.id}`);
    }
    ids.add(entry.id);
    if (!entry.activeIngredient.trim()) {
      errors.push(`${entry.id}: activeIngredient vacio`);
    }
    if (entry.usualOrders.length === 0) {
      errors.push(`${entry.id}: sin usualOrders`);
    }
    if (entry.routes.length === 0) {
      errors.push(`${entry.id}: sin routes`);
    }
  }

  return errors;
}
