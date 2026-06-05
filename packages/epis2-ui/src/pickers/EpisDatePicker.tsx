import Box from '@mui/material/Box';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { dayjs } from './configureDayjs.js';

export type EpisDatePickerProps = {
  label: string;
  value: string;
  onChange: (isoDate: string) => void;
  required?: boolean;
  error?: string;
  disabled?: boolean;
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
  'data-testid': testId,
}: EpisDatePickerProps) {
  return (
    <Box data-testid={testId} sx={{ width: '100%' }}>
      <DatePicker
        label={label}
        value={parseValue(value)}
        onChange={(next) => onChange(next?.isValid() ? next.format('YYYY-MM-DD') : '')}
        {...(disabled ? { disabled: true } : {})}
        slotProps={{
          textField: {
            fullWidth: true,
            error: Boolean(error),
            ...(required ? { required: true } : {}),
            ...(error ? { helperText: error } : {}),
          },
        }}
      />
    </Box>
  );
}
