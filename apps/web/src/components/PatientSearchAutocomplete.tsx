import type { PatientListRow } from '../api/clinicalApi.js';
import { copy } from '@epis2/design-system';
import { EpisAutocomplete, EpisAutocompleteTextField } from '@epis2/epis2-ui';
import { useMemo, type SyntheticEvent } from 'react';

type PatientOption = {
  id: string;
  label: string;
  row: PatientListRow;
};

export type PatientSearchAutocompleteProps = {
  patients: PatientListRow[];
  query: string;
  onQueryChange: (query: string) => void;
  onSelectPatient: (patient: PatientListRow) => void;
  loading?: boolean;
  disabled?: boolean;
};

/** Autocompletado de pacientes demo — complementa grid en búsqueda (Fase B). */
export function PatientSearchAutocomplete({
  patients,
  query,
  onQueryChange,
  onSelectPatient,
  loading = false,
  disabled = false,
}: PatientSearchAutocompleteProps) {
  const options = useMemo<PatientOption[]>(
    () =>
      patients.map((row) => ({
        id: row.id,
        label: row.displayName,
        row,
      })),
    [patients],
  );

  const handleChange = (_event: SyntheticEvent, value: PatientOption | PatientOption[] | null) => {
    const selected = Array.isArray(value) ? value[0] : value;
    if (selected) onSelectPatient(selected.row);
  };

  return (
    <EpisAutocomplete
      options={options}
      value={null}
      disabled={disabled}
      loading={loading}
      filterOptions={(x) => x}
      inputValue={query}
      onInputChange={(_event, nextQuery) => onQueryChange(nextQuery)}
      onChange={handleChange}
      getOptionLabel={(option) => option.label}
      isOptionEqualToValue={(a, b) => a.id === b.id}
      noOptionsText={copy.longitudinal.emptySection}
      renderInput={(params) => (
        <EpisAutocompleteTextField
          id={params.id}
          disabled={params.disabled}
          fullWidth={params.fullWidth}
          InputProps={params.InputProps}
          inputProps={params.inputProps}
          label={copy.forms.searchPatient}
          placeholder={copy.commandCenter.powerBarPlaceholder}
          size="small"
        />
      )}
      data-testid="epis2-patient-search-autocomplete"
    />
  );
}
