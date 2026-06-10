import type { FormField } from '@epis2/clinical-forms';
import { memo, useState } from 'react';
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
import {
  CLINICAL_CONTEXT_DRAG_MIME,
  parseClinicalContextDrag,
  type ClinicalContextDragPayload,
} from './clinical-context-dnd.js';

export type EpisClinicalFieldProps = {
  field: FormField;
  value: string;
  error?: string;
  clinicalProse?: boolean;
  /** Habilita drop de fragmentos del panel de contexto (solo textareas). */
  clinicalDropEnabled?: boolean;
  onClinicalDrop?: (fieldId: string, payload: ClinicalContextDragPayload) => void;
  onChange: (fieldId: string, value: string) => void;
};

const fieldInputSx = {
  '& .MuiInputBase-input': {
    fontSize: '0.875rem',
    lineHeight: 1.5,
  },
};

function EpisClinicalFieldInner({
  field,
  value,
  error,
  clinicalProse,
  clinicalDropEnabled = false,
  onClinicalDrop,
  onChange,
}: EpisClinicalFieldProps) {
  const [dropActive, setDropActive] = useState(false);
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
      <ClinicalFieldStack label={dateLabel} htmlFor={fieldId} required={Boolean(field.required)}>
        <EpisDatePicker
          label=""
          id={fieldId}
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
        <FormControl
          fullWidth
          error={Boolean(error)}
          margin="dense"
          variant="outlined"
          sx={clinicalFieldShellSx()}
        >
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
  const acceptsDrop =
    multiline && clinicalDropEnabled && Boolean(onClinicalDrop) && !field.readOnly;

  const textField = (
    <EpisTextField
      id={fieldId}
      data-testid={`epis2-field-${field.id}`}
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
  );

  return (
    <ClinicalFieldStack
      label={field.label}
      htmlFor={fieldId}
      required={Boolean(field.required)}
      multiline={multiline}
      {...(clinicalProse && multiline ? { clinicalProse: true } : {})}
    >
      {acceptsDrop ? (
        <Box
          data-testid={`epis2-field-drop-${field.id}`}
          onDragOver={(e) => {
            if (!e.dataTransfer.types.includes(CLINICAL_CONTEXT_DRAG_MIME)) return;
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
            setDropActive(true);
          }}
          onDragLeave={() => setDropActive(false)}
          onDrop={(e) => {
            setDropActive(false);
            const payload = parseClinicalContextDrag(
              e.dataTransfer.getData(CLINICAL_CONTEXT_DRAG_MIME),
            );
            if (!payload) return;
            e.preventDefault();
            onClinicalDrop?.(field.id, payload);
          }}
          sx={{
            borderRadius: 1,
            outline: dropActive ? 2 : 0,
            outlineStyle: 'solid',
            outlineColor: 'primary.main',
            outlineOffset: 2,
          }}
        >
          {textField}
        </Box>
      ) : (
        textField
      )}
    </ClinicalFieldStack>
  );
}

/** Evita re-render de todos los campos al escribir en uno solo. */
export const EpisClinicalField = memo(EpisClinicalFieldInner);
