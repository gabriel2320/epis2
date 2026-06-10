import MuiAutocomplete, { type AutocompleteProps } from '@mui/material/Autocomplete';
import { EpisTextField } from './EpisTextField.js';

export type EpisAutocompleteProps<
  Value,
  Multiple extends boolean | undefined = false,
  DisableClearable extends boolean | undefined = false,
  FreeSolo extends boolean | undefined = false,
> = AutocompleteProps<Value, Multiple, DisableClearable, FreeSolo>;

/** Autocomplete MUI — puerta única EPIS2 (MF-CLINICAL-PRODUCTIVITY). */
export function EpisAutocomplete<
  Value,
  Multiple extends boolean | undefined = false,
  DisableClearable extends boolean | undefined = false,
  FreeSolo extends boolean | undefined = false,
>(props: EpisAutocompleteProps<Value, Multiple, DisableClearable, FreeSolo>) {
  return <MuiAutocomplete {...props} />;
}

export { EpisTextField as EpisAutocompleteTextField };
