import type { ClinicalFormBlueprint } from '@epis2/clinical-forms';

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  ExpandMoreIcon,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@epis2/epis2-ui';
export type ClinicalFormRendererProps = {
  blueprint: ClinicalFormBlueprint;
  values: Record<string, string>;
  errors?: Record<string, string>;
  onChange: (fieldId: string, value: string) => void;
};

export function ClinicalFormRenderer({
  blueprint,
  values,
  errors = {},
  onChange,
}: ClinicalFormRendererProps) {
  const fieldMap = new Map(blueprint.fields.map((f) => [f.id, f]));

  return (
    <Stack spacing={2} data-testid={`epis2-form-${blueprint.blueprintId}`}>
      <Typography variant="body2" color="text.secondary">
        {blueprint.purpose}
      </Typography>
      {blueprint.sections.map((sec) => {
        const fields = sec.fieldIds
          .map((id) => fieldMap.get(id))
          .filter((f): f is NonNullable<typeof f> => Boolean(f));

        const body = (
          <Stack spacing={2}>
            {fields.map((f) => {
              const err = errors[f.id];
              const value = values[f.id] ?? '';

              if (f.type === 'checkbox') {
                return (
                  <FormControl key={f.id} error={Boolean(err)}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={value === 'true'}
                          disabled={f.readOnly}
                          onChange={(e) => onChange(f.id, e.target.checked ? 'true' : 'false')}
                        />
                      }
                      label={f.label}
                    />
                    {err ? <FormHelperText>{err}</FormHelperText> : null}
                  </FormControl>
                );
              }

              if (f.type === 'select') {
                return (
                  <FormControl key={f.id} fullWidth error={Boolean(err)}>
                    <InputLabel id={`${f.id}-label`}>{f.label}</InputLabel>
                    <Select
                      labelId={`${f.id}-label`}
                      label={f.label}
                      value={value}
                      disabled={f.readOnly}
                      onChange={(e) => onChange(f.id, String(e.target.value))}
                    >
                      {(f.options ?? []).map((opt) => (
                        <MenuItem key={opt} value={opt}>
                          {opt}
                        </MenuItem>
                      ))}
                    </Select>
                    {err ? <FormHelperText>{err}</FormHelperText> : null}
                  </FormControl>
                );
              }

              return (
                <TextField
                  key={f.id}
                  label={f.label}
                  value={value}
                  fullWidth
                  multiline={f.type === 'textarea'}
                  minRows={f.type === 'textarea' ? 3 : undefined}
                  type={f.type === 'date' ? 'date' : 'text'}
                  required={Boolean(f.required)}
                  error={Boolean(err)}
                  helperText={err}
                  disabled={f.readOnly}
                  InputLabelProps={f.type === 'date' ? { shrink: true } : undefined}
                  onChange={(e) => onChange(f.id, e.target.value)}
                />
              );
            })}
          </Stack>
        );

        if (sec.initialVisibility === 'collapsed') {
          return (
            <Accordion key={sec.id} defaultExpanded={false}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle2">{sec.label}</Typography>
              </AccordionSummary>
              <AccordionDetails>{body}</AccordionDetails>
            </Accordion>
          );
        }

        return (
          <Stack key={sec.id} spacing={1}>
            <Typography variant="subtitle2">{sec.label}</Typography>
            {body}
          </Stack>
        );
      })}
    </Stack>
  );
}
