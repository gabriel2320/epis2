import type { FormField } from '@epis2/clinical-forms';
import { memo } from 'react';
import { EpisTextField } from '../primitives/EpisTextField.js';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import MenuItem from '@mui/material/MenuItem';
import { EpisDatePicker } from '../pickers/EpisDatePicker.js';
import { EpisSelect } from '../primitives/EpisSelect.js';
import { copy } from '@epis2/design-system';
import {
  CLINICAL_TEXTAREA_ROWS,
  ClinicalFieldStack,
  clinicalFieldShellSx,
  clinicalOutlinedInputSlotProps,
} from './clinical-field-layout.js';

export type EpisClinicalFieldProps = {
  field: FormField;
  value: string;
  error?: string;
  onChange: (fieldId: string, value: string) => void;
};

const fieldInputSx = {
  '& .MuiInputBase-input': {
    fontSize: '0.875rem',
    lineHeight: 1.5,
  },
};

function EpisClinicalFieldInner({ field, value, error, onChange }: EpisClinicalFieldProps) {
  const fieldId = `epis2-field-input-${field.id}`;

  if (field.type === 'checkbox') {
    return (
      <Box sx={clinicalFieldShellSx()}>
        <FormControl error={Boolean(error)} fullWidth>
          <FormControlLabel
            sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem', lineHeight: 1.5 } }}
            control={
              <Checkbox
                checked={value === 'true'}
                disabled={field.readOnly}
                onChange={(e) => onChange(field.id, e.target.checked ? 'true' : 'false')}
              />
            }
            label={field.label}
          />
          <FormHelperText sx={{ minHeight: '1.25rem' }}>{error ?? ' '}</FormHelperText>
        </FormControl>
      </Box>
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
      <ClinicalFieldStack
        label={dateLabel}
        htmlFor={fieldId}
        required={Boolean(field.required)}
      >
        <EpisDatePicker
          label=""
          value={value}
          required={Boolean(field.required)}
          {...(error ? { error } : {})}
          {...(field.readOnly ? { disabled: true } : {})}
          onChange={(iso) => onChange(field.id, iso)}
          data-testid={`epis2-field-${field.id}`}
        />
      </ClinicalFieldStack>
    );
  }

  if (field.type === 'select') {
    return (
      <ClinicalFieldStack label={field.label} htmlFor={fieldId} required={Boolean(field.required)}>
        <FormControl fullWidth error={Boolean(error)} margin="dense" variant="outlined" sx={clinicalFieldShellSx()}>
          <EpisSelect
            id={fieldId}
            displayEmpty
            value={value}
            {...(field.readOnly ? { disabled: true } : {})}
            onChange={(e) => onChange(field.id, String(e.target.value))}
            slotProps={clinicalOutlinedInputSlotProps}
            sx={fieldInputSx}
          >
            {(field.options ?? []).map((opt) => (
              <MenuItem key={opt} value={opt} sx={{ fontSize: '0.875rem' }}>
                {opt}
              </MenuItem>
            ))}
          </EpisSelect>
          <FormHelperText sx={{ minHeight: '1.25rem' }}>{error ?? ' '}</FormHelperText>
        </FormControl>
      </ClinicalFieldStack>
    );
  }

  const multiline = field.type === 'textarea';

  return (
    <ClinicalFieldStack
      label={field.label}
      htmlFor={fieldId}
      required={Boolean(field.required)}
      multiline={multiline}
    >
      <EpisTextField
        id={fieldId}
        variant="outlined"
        hiddenLabel
        value={value}
        multiline={multiline}
        {...(multiline ? { rows: CLINICAL_TEXTAREA_ROWS } : {})}
        type="text"
        margin="dense"
        error={Boolean(error)}
        helperText={error ?? ' '}
        {...(field.readOnly ? { disabled: true } : {})}
        onChange={(e) => onChange(field.id, e.target.value)}
        sx={fieldInputSx}
        slotProps={{
          input: clinicalOutlinedInputSlotProps.input,
          htmlInput: { 'aria-label': field.label },
        }}
      />
    </ClinicalFieldStack>
  );
}

/** Evita re-render de todos los campos al escribir en uno solo. */
export const EpisClinicalField = memo(EpisClinicalFieldInner);
