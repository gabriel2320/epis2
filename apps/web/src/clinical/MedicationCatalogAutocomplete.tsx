import type { ClinicalCatalogEntry } from '@epis2/contracts';
import { EpisAutocomplete, EpisAutocompleteTextField } from '@epis2/epis2-ui';
import { useEffect, useRef, useState, type SyntheticEvent } from 'react';
import { searchMedicationCatalog } from '../api/clinicalApi.js';

const DEBOUNCE_MS = 250;

export type MedicationCatalogAutocompleteProps = {
  label: string;
  value: string;
  required?: boolean;
  error?: string;
  onChange: (value: string) => void;
};

/**
 * MF-184 — autocomplete del campo medicamento alimentado por el catálogo
 * promovido (`GET /api/clinical/catalogs/medication`). `freeSolo`: el catálogo
 * sugiere, no restringe — el valor guardado sigue siendo texto y el borrador
 * mantiene revisión humana aguas abajo. Si la API falla, degrada a texto libre.
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
      searchMedicationCatalog(value)
        .then((response) => {
          if (requestSeq.current === seq) setOptions(response.entries);
        })
        .catch(() => {
          // Catálogo no disponible → solo texto libre, sin romper el formulario.
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
    onChange(typeof single === 'string' ? single : single.label);
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
      isOptionEqualToValue={(a, b) => a.entryCode === b.entryCode}
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
