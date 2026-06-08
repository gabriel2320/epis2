import { copy } from '@epis2/design-system';
import {
  EpisAutocomplete,
  EpisAutocompleteTextField,
} from '@epis2/epis2-ui';
import { useMemo, type SyntheticEvent } from 'react';
import {
  findClinicalTerms,
  type ChileClinicalTerm,
  type ChileClinicalTermCategory,
} from '../dictionaries/chileClinicalDictionary.js';

export type ClinicalAutocompleteOption = {
  id: string;
  label: string;
  category: ChileClinicalTermCategory;
  requiresConfirmation: boolean;
};

export type ClinicalAutocompleteProps = {
  category?: ChileClinicalTermCategory;
  label: string;
  query?: string;
  onQueryChange?: (query: string) => void;
  confirmHighRisk?: (option: ClinicalAutocompleteOption) => boolean;
  value?: ClinicalAutocompleteOption | ClinicalAutocompleteOption[] | null;
  onChange?: (value: ClinicalAutocompleteOption | ClinicalAutocompleteOption[] | null) => void;
  multiple?: boolean;
  disabled?: boolean;
  size?: 'small' | 'medium';
};

function toOption(term: ChileClinicalTerm): ClinicalAutocompleteOption {
  return {
    id: term.id,
    label: term.formal ?? term.expansions?.[0] ?? term.term,
    category: term.category,
    requiresConfirmation: term.category === 'medication',
  };
}

/** Autocompletado clínico — diccionario chileno; medicación requiere confirmación. */
export function ClinicalAutocomplete({
  category,
  label,
  query = '',
  onQueryChange,
  confirmHighRisk,
  value = null,
  onChange,
  multiple = false,
  disabled = false,
  size = 'small',
}: ClinicalAutocompleteProps) {
  const options = useMemo(() => {
    const terms = findClinicalTerms(query, 20);
    const filtered = category ? terms.filter((t) => t.category === category) : terms;
    return filtered.map(toOption);
  }, [category, query]);

  const handleChange = (
    _event: SyntheticEvent,
    next: ClinicalAutocompleteOption | ClinicalAutocompleteOption[] | null,
  ) => {
    const single = Array.isArray(next) ? next[0] : next;
    if (single?.requiresConfirmation) {
      const ok = confirmHighRisk
        ? confirmHighRisk(single)
        : window.confirm(copy.clinicalProductivity.confirmMedication);
      if (!ok) return;
    }
    onChange?.(next);
  };

  return (
    <EpisAutocomplete
      options={options}
      value={value}
      multiple={multiple}
      disabled={disabled}
      getOptionLabel={(opt) => opt.label}
      isOptionEqualToValue={(a, b) => a.id === b.id}
      filterOptions={(x) => x}
      inputValue={query}
      {...(onQueryChange ? { onInputChange: (_e, nextQuery) => onQueryChange(nextQuery) } : {})}
      onChange={handleChange}
      renderInput={(params) => (
        <EpisAutocompleteTextField
          id={params.id}
          disabled={params.disabled}
          fullWidth={params.fullWidth}
          InputProps={params.InputProps}
          inputProps={params.inputProps}
          label={label}
          size={size}
        />
      )}
      data-testid="epis2-clinical-autocomplete"
    />
  );
}
