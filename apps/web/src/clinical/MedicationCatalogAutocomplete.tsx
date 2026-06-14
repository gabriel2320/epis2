import type { ClinicalCatalogEntry } from '@epis2/contracts';
import { EpisAutocomplete, EpisAutocompleteTextField } from '@epis2/epis2-ui';
import { useEffect, useRef, useState, type SyntheticEvent } from 'react';
import { searchMedicationCatalog } from '../api/clinicalApi.js';
import { bumpCatalogUsage } from '../api/userOperationalMemoryApi.js';

const DEBOUNCE_MS = 250;

export type MedicationCatalogAutocompleteProps = {
  label: string;
  value: string;
  required?: boolean;
  error?: string;
  onChange: (value: string) => void;
};

/**
 * MF-184 / MF-DI-03 — autocomplete medicamento con ranking institucional + personal.
 */
export function MedicationCatalogAutocomplete({
  label,
  value,
  required = false,
  error,
  onChange,
}: MedicationCatalogAutocompleteProps) {
  const [options, setOptions] = useState<ClinicalCatalogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const requestSeq = useRef(0);

  useEffect(() => {
    const seq = ++requestSeq.current;
    const timer = setTimeout(() => {
      setLoading(true);
      searchMedicationCatalog(value, { frequent: !value.trim() })
        .then((response) => {
          if (requestSeq.current === seq) setOptions(response.entries);
        })
        .catch(() => {
          if (requestSeq.current === seq) setOptions([]);
        })
        .finally(() => {
          if (requestSeq.current === seq) setLoading(false);
        });
    }, DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [value]);

  const handleSelect = (
    _event: SyntheticEvent,
    selected: string | ClinicalCatalogEntry | (string | ClinicalCatalogEntry)[] | null,
  ) => {
    const single = Array.isArray(selected) ? selected[0] : selected;
    if (single === null || single === undefined) return;
    if (typeof single === 'string') {
      onChange(single);
      return;
    }
    onChange(single.label);
    void bumpCatalogUsage({ domain: 'medication', key: single.entryCode }).catch(() => {
      /* best-effort personal rank */
    });
  };

  return (
    <EpisAutocomplete
      freeSolo
      options={options}
      loading={loading}
      filterOptions={(x) => x}
      inputValue={value}
      onInputChange={(_event, nextValue) => onChange(nextValue)}
      onChange={handleSelect}
      getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
      isOptionEqualToValue={(a, b) =>
        typeof a === 'string' || typeof b === 'string'
          ? a === b
          : a.entryCode === b.entryCode
      }
      renderInput={(params) => (
        <EpisAutocompleteTextField
          id={params.id}
          disabled={params.disabled}
          fullWidth={params.fullWidth}
          InputProps={params.InputProps}
          inputProps={{
            ...params.inputProps,
            'data-testid': 'epis2-medication-catalog-autocomplete-input',
          }}
          name="medication"
          label={label}
          required={required}
          error={Boolean(error)}
          {...(error ? { helperText: error } : {})}
          size="small"
        />
      )}
      data-testid="epis2-medication-catalog-autocomplete"
    />
  );
}
