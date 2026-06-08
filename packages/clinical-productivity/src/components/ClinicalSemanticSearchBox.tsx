import { copy } from '@epis2/design-system';
import { EpisTextField } from '@epis2/epis2-ui';
import { type ChangeEvent } from 'react';
import { findClinicalTerms } from '../dictionaries/chileClinicalDictionary.js';

export type ClinicalSemanticSearchBoxProps = {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  disabled?: boolean;
  testId?: string;
};

/** Búsqueda semántica Fase C — fallback local por diccionario. */
export function ClinicalSemanticSearchBox({
  label = copy.clinicalProductivity.semanticSearchLabel,
  value,
  onChange,
  onSubmit,
  disabled = false,
  testId = 'epis2-clinical-semantic-search',
}: ClinicalSemanticSearchBoxProps) {
  const hints = findClinicalTerms(value, 3).map((t) => t.term).join(', ');

  return (
    <EpisTextField
      label={label}
      value={value}
      onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
      {...(onSubmit
        ? {
            onKeyDown: (e) => {
              if (e.key === 'Enter') onSubmit();
            },
          }
        : {})}
      disabled={disabled}
      helperText={
        disabled
          ? copy.clinicalProductivity.semanticSearchDisabled
          : hints
            ? `${copy.clinicalProductivity.semanticFallback}: ${hints}`
            : copy.clinicalProductivity.semanticFallback
      }
      fullWidth
      size="small"
      data-testid={testId}
    />
  );
}
