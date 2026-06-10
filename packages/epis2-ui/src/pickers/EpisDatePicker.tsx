import Box from '@mui/material/Box';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  clinicalFieldShellSx,
  clinicalOutlinedInputSlotProps,
} from '../forms/clinical-field-layout.js';
import { dayjs } from './configureDayjs.js';

export type EpisDatePickerProps = {
  label: string;
  value: string;
  onChange: (isoDate: string) => void;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  /** Id del input — permite asociar un label externo visible (htmlFor). */
  id?: string;
  'data-testid'?: string;
};

function parseValue(value: string) {
  if (!value?.trim()) return null;
  const parsed = dayjs(value, 'YYYY-MM-DD', true);
  return parsed.isValid() ? parsed : null;
}

export function EpisDatePicker({
  label,
  value,
  onChange,
  required,
  error,
  disabled,
  id,
  'data-testid': testId,
}: EpisDatePickerProps) {
  return (
    <Box data-testid={testId} sx={{ width: '100%', ...clinicalFieldShellSx() }}>
      <DatePicker
        label={label}
        value={parseValue(value)}
        onChange={(next) => onChange(next?.isValid() ? next.format('YYYY-MM-DD') : '')}
        {...(disabled ? { disabled: true } : {})}
        slotProps={{
          textField: {
            fullWidth: true,
            margin: 'dense',
            hiddenLabel: true,
            error: Boolean(error),
            helperText: error ?? ' ',
            ...(id ? { id } : {}),
            ...(required ? { required: true } : {}),
            slotProps: clinicalOutlinedInputSlotProps,
          },
        }}
      />
    </Box>
  );
}
