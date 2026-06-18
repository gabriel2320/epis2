import { LAB_DICTIONARY_SEED } from './labSeedEsCl.js';
import type {
  LabCriticalFlag,
  LabDictionaryEntry,
  LabSearchResult,
  LabValueAssessment,
} from './types.js';

export const LAB_DICTIONARY: readonly LabDictionaryEntry[] = LAB_DICTIONARY_SEED;

const byId = new Map(LAB_DICTIONARY.map((entry) => [entry.id, entry]));

function normalizeQuery(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/\s+/g, ' ');
}

export function getLabById(id: string): LabDictionaryEntry | undefined {
  return byId.get(id);
}

export function searchLabsEsCl(query: string, limit = 8): LabSearchResult[] {
  const q = normalizeQuery(query);
  if (!q) return [];

  const results: LabSearchResult[] = [];

  for (const entry of LAB_DICTIONARY) {
    const idNorm = normalizeQuery(entry.id);
    if (idNorm.startsWith(q) || idNorm === q) {
      results.push({ entry, score: 100, matchedOn: 'id' });
      continue;
    }
    const label = normalizeQuery(entry.label);
    if (label.includes(q) || label.startsWith(q)) {
      results.push({ entry, score: 90, matchedOn: 'label' });
      continue;
    }
    for (const syn of entry.synonyms) {
      const s = normalizeQuery(syn);
      if (s === q || s.startsWith(q) || q.startsWith(s)) {
        results.push({ entry, score: 88, matchedOn: 'synonym' });
        break;
      }
    }
  }

  return results
    .sort((a, b) => b.score - a.score || a.entry.label.localeCompare(b.entry.label))
    .slice(0, limit);
}

export function assessLabValue(id: string, value: number): LabValueAssessment | undefined {
  const entry = getLabById(id);
  if (!entry) return undefined;

  let flag: LabCriticalFlag = 'none';
  let message: string | undefined;

  if (entry.criticalLow !== undefined && value <= entry.criticalLow) {
    flag = 'critical_low';
    message = `${entry.label} crítico bajo (${value} ${entry.unit})`;
  } else if (entry.criticalHigh !== undefined && value >= entry.criticalHigh) {
    flag = 'critical_high';
    message = `${entry.label} crítico alto (${value} ${entry.unit})`;
  }

  return { entry, value, flag, ...(message ? { message } : {}) };
}

export function parseLabToken(token: string): { id?: string; value?: number } {
  const normalized = normalizeQuery(token);
  const valueMatch = normalized.match(/(-?\d+(?:[.,]\d+)?)/);
  const value = valueMatch ? Number(valueMatch[1]!.replace(',', '.')) : undefined;

  for (const entry of LAB_DICTIONARY) {
    const tokens = [entry.id, ...entry.synonyms, entry.label].map(normalizeQuery);
    if (tokens.some((t) => normalized.includes(t) || t.includes(normalized.replace(/\d/g, '').trim()))) {
      return { id: entry.id, ...(value !== undefined && !Number.isNaN(value) ? { value } : {}) };
    }
  }

  return value !== undefined && !Number.isNaN(value) ? { value } : {};
}

export function assertLabDictionaryInvariants(): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();

  if (LAB_DICTIONARY.length < 20) {
    errors.push(`LAB_DICTIONARY tiene ${LAB_DICTIONARY.length} entradas (min 20)`);
  }

  const required = ['potasio', 'sodio', 'hemoglobina', 'pcr'];
  for (const id of required) {
    if (!byId.has(id)) {
      errors.push(`falta examen requerido: ${id}`);
    }
  }

  for (const entry of LAB_DICTIONARY) {
    if (ids.has(entry.id)) {
      errors.push(`id duplicado: ${entry.id}`);
    }
    ids.add(entry.id);
    if (!entry.unit.trim()) {
      errors.push(`${entry.id}: unit vacia`);
    }
    const hasCritical = entry.criticalLow !== undefined || entry.criticalHigh !== undefined;
    if (!hasCritical) {
      errors.push(`${entry.id}: sin umbral critico`);
    }
  }

  return errors;
}
