import type { FormField } from '@epis2/clinical-forms';
import { EpisTextField } from '../primitives/EpisTextField.js';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { EpisDatePicker } from '../pickers/EpisDatePicker.js';
import { EpisSelect } from '../primitives/EpisSelect.js';
import { copy } from '@epis2/design-system';

export type EpisClinicalFieldProps = {
  field: FormField;
  value: string;
  error?: string;
  onChange: (fieldId: string, value: string) => void;
};

export function EpisClinicalField({ field, value, error, onChange }: EpisClinicalFieldProps) {
  if (field.type === 'checkbox') {
    return (
      <FormControl error={Boolean(error)}>
        <FormControlLabel
          control={
            <Checkbox
              checked={value === 'true'}
              disabled={field.readOnly}
              onChange={(e) => onChange(field.id, e.target.checked ? 'true' : 'false')}
            />
          }
          label={field.label}
        />
        {error ? <FormHelperText>{error}</FormHelperText> : null}
      </FormControl>
    );
  }

  if (field.type === 'date') {
    const dateLabel =
      field.id === 'encounterDate'
        ? copy.forms.encounterDate
        : field.id === 'scheduledDate'
          ? copy.forms.scheduledDate
          : field.label;
    return (
      <EpisDatePicker
        label={dateLabel}
        value={value}
        required={Boolean(field.required)}
        {...(error ? { error } : {})}
        {...(field.readOnly ? { disabled: true } : {})}
        onChange={(iso) => onChange(field.id, iso)}
        data-testid={`epis2-field-${field.id}`}
      />
    );
  }

  if (field.type === 'select') {
    return (
      <FormControl fullWidth error={Boolean(error)}>
        <InputLabel id={`${field.id}-label`}>{field.label}</InputLabel>
        <EpisSelect
          labelId={`${field.id}-label`}
          label={field.label}
          value={value}
          {...(field.readOnly ? { disabled: true } : {})}
          onChange={(e) => onChange(field.id, String(e.target.value))}
        >
          {(field.options ?? []).map((opt) => (
            <MenuItem key={opt} value={opt}>
              {opt}
            </MenuItem>
          ))}
        </EpisSelect>
        {error ? <FormHelperText>{error}</FormHelperText> : null}
      </FormControl>
    );
  }

  return (
    <EpisTextField
      label={field.label}
      value={value}
      multiline={field.type === 'textarea'}
      {...(field.type === 'textarea' ? { minRows: 3 } : {})}
      type="text"
      required={Boolean(field.required)}
      error={Boolean(error)}
      {...(error ? { helperText: error } : {})}
      {...(field.readOnly ? { disabled: true } : {})}
      onChange={(e) => onChange(field.id, e.target.value)}
    />
  );
}
