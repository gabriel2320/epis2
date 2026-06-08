export {
  CHILE_CLINICAL_DICTIONARY,
  findClinicalTerms,
  isWhitelistedClinicalTerm,
  suggestFormalForm,
  type ChileClinicalTerm,
  type ChileClinicalTermCategory,
} from '../dictionaries/chileClinicalDictionary.js';

import { findClinicalTerms, suggestFormalForm } from '../dictionaries/chileClinicalDictionary.js';

/** Expande abreviatura si está en lista blanca (no autocorrige fármacos/dosis sin confirmación). */
export function expandWhitelistedAbbreviation(token: string): string | undefined {
  return suggestFormalForm(token);
}

export function autocompleteClinicalTerms(query: string, limit = 8) {
  return findClinicalTerms(query, limit);
}

export function isSensitiveClinicalToken(token: string): boolean {
  const lower = token.trim().toLowerCase();
  const hits = findClinicalTerms(lower, 3);
  return hits.some((h) => h.category === 'medication' || h.category === 'unit');
}
