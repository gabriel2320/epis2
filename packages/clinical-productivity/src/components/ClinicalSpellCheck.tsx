import { copy } from '@epis2/design-system';
import { Typography } from '@epis2/epis2-ui';
import { findClinicalTerms, isWhitelistedClinicalTerm } from '../dictionaries/chileClinicalDictionary.js';

export type ClinicalSpellCheckProps = {
  text: string;
  testId?: string;
};

/** Corrector local Fase B — diccionario chileno; LanguageTool pendiente. */
export function ClinicalSpellCheck({ text, testId = 'epis2-clinical-spellcheck' }: ClinicalSpellCheckProps) {
  const tokens = text.split(/\s+/).filter(Boolean);
  const unknown = tokens.filter((t) => !isWhitelistedClinicalTerm(t) && t.length > 2).slice(0, 5);

  if (unknown.length === 0) return null;

  const suggestions = unknown.flatMap((token) =>
    findClinicalTerms(token, 1).map((hit) => `${token} → ${hit.formal ?? hit.term}`),
  );

  return (
    <Typography variant="caption" color="text.secondary" data-testid={testId}>
      {copy.clinicalProductivity.spellSuggestions}: {suggestions.join(' · ') || unknown.join(', ')}
    </Typography>
  );
}
