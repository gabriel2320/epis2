import type { ClinicalFormBlueprint } from '@epis2/clinical-forms';
import { ExpandMoreIcon } from '../mui/index.js';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { EpisClinicalField } from './EpisClinicalField.js';

export type EpisClinicalFormProps = {
  blueprint: ClinicalFormBlueprint;
  values: Record<string, string>;
  errors?: Record<string, string>;
  onChange: (fieldId: string, value: string) => void;
};

/** Renderiza un blueprint clínico con secciones y campos MUI. */
export function EpisClinicalForm({
  blueprint,
  values,
  errors = {},
  onChange,
}: EpisClinicalFormProps) {
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
              return (
                <EpisClinicalField
                  key={f.id}
                  field={f}
                  value={values[f.id] ?? ''}
                  {...(err ? { error: err } : {})}
                  onChange={onChange}
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
          <Stack key={sec.id} spacing={1} data-testid={`epis2-form-section-${sec.id}`}>
            <Typography variant="subtitle2">{sec.label}</Typography>
            {body}
          </Stack>
        );
      })}
    </Stack>
  );
}
