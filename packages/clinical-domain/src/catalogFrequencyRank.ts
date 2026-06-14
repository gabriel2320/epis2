export type CatalogUsageDomain = 'medication' | 'laboratory' | 'diagnosis';

export type RankCatalogEntryInput<T> = {
  items: readonly T[];
  query: string;
  getKey: (item: T) => string;
  getSearchText: (item: T) => string;
  personalUsage?: Readonly<Record<string, number>> | undefined;
  institutionalWeights?: Readonly<Record<string, number>> | undefined;
  limit: number;
  frequentOnly?: boolean | undefined;
};

function fold(value: string): string {
  return value.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
}

function institutionalBoost(
  searchText: string,
  weights: Readonly<Record<string, number>>,
): number {
  const hay = fold(searchText);
  let boost = 0;
  for (const [needle, score] of Object.entries(weights)) {
    if (hay.includes(fold(needle))) boost = Math.max(boost, score);
  }
  return boost;
}

/** MF-DI-03 — ranking determinístico institucional + personal. */
export function rankCatalogEntries<T>(input: RankCatalogEntryInput<T>): T[] {
  const q = fold(input.query.trim());
  const personal = input.personalUsage ?? {};
  const institutional = input.institutionalWeights ?? {};

  const scored = input.items
    .map((item) => {
      const key = input.getKey(item);
      const text = input.getSearchText(item);
      const textFold = fold(text);
      const textMatch =
        !q || textFold.includes(q) || textFold.startsWith(q) ? (q ? 40 : 0) : -1;
      if (!input.frequentOnly && textMatch < 0) return null;

      const personalScore = (personal[key] ?? 0) * 12;
      const institutionalScore = institutional[key] ?? institutionalBoost(text, institutional);
      const score = textMatch + personalScore + institutionalScore;
      return { item, score };
    })
    .filter((row): row is { item: T; score: number } => row !== null)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, input.limit).map((row) => row.item);
}

/** Pesos demo institucionales (piloto ambulatorio CR). */
export const INSTITUTIONAL_MEDICATION_WEIGHTS: Record<string, number> = {
  metformina: 92,
  losartan: 88,
  atorvastatina: 84,
  omeprazol: 78,
  amoxicilina: 74,
  warfarina: 70,
  enalapril: 68,
};

export const INSTITUTIONAL_LAB_PHRASE_WEIGHTS: Record<string, number> = {
  hemograma: 82,
  hba1c: 90,
  'panel control dm2': 88,
  creatinina: 76,
  perfil: 72,
};

export const INSTITUTIONAL_DIAGNOSIS_PHRASE_WEIGHTS: Record<string, number> = {
  diabetes: 90,
  dm2: 88,
  hipertension: 86,
  hta: 84,
  dislipidemia: 70,
};

export function rankAutocompletePhrases(
  phrases: readonly string[],
  query: string,
  options?: {
    personalUsage?: Readonly<Record<string, number>> | undefined;
    institutionalWeights?: Readonly<Record<string, number>> | undefined;
    limit?: number | undefined;
  },
): string[] {
  const items = phrases.map((phrase) => ({ phrase }));
  const ranked = rankCatalogEntries({
    items,
    query,
    getKey: (item) => fold(item.phrase),
    getSearchText: (item) => item.phrase,
    personalUsage: options?.personalUsage,
    institutionalWeights: options?.institutionalWeights,
    limit: options?.limit ?? 8,
  });
  return ranked.map((item) => item.phrase);
}

export function bumpUsageCount(
  counts: Readonly<Record<string, number>>,
  key: string,
  delta = 1,
): Record<string, number> {
  const normalized = fold(key);
  return { ...counts, [normalized]: (counts[normalized] ?? 0) + delta };
}
