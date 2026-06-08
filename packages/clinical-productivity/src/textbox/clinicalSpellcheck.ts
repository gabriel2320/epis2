import { findClinicalTerms, isWhitelistedClinicalTerm } from './clinicalDictionary.js';

export type ClinicalSpellIssue = {
  token: string;
  suggestions: string[];
};

export type LanguageToolAdapter = {
  check: (text: string) => Promise<ClinicalSpellIssue[]>;
};

/** Adaptador simulado — reemplazable por LanguageTool self-hosted. */
export const simulatedLanguageToolAdapter: LanguageToolAdapter = {
  async check(text) {
    return runLocalClinicalSpellcheck(text);
  },
};

/** Sugiere ortografía; nunca reemplaza texto automáticamente. */
export function runLocalClinicalSpellcheck(text: string, limit = 5): ClinicalSpellIssue[] {
  const tokens = text.split(/\s+/).filter(Boolean);
  const unknown = tokens.filter((t) => !isWhitelistedClinicalTerm(t) && t.length > 2).slice(0, limit);
  return unknown.map((token) => ({
    token,
    suggestions: findClinicalTerms(token, 2).map((hit) => hit.formal ?? hit.term),
  }));
}

export async function runClinicalSpellcheck(
  text: string,
  adapter: LanguageToolAdapter = simulatedLanguageToolAdapter,
): Promise<ClinicalSpellIssue[]> {
  const local = runLocalClinicalSpellcheck(text);
  if (!text.trim()) return local;
  try {
    const lt = await adapter.check(text);
    return lt.length > 0 ? lt : local;
  } catch {
    return local;
  }
}
