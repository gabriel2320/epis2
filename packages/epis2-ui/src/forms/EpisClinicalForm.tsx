import type { ClinicalFormBlueprint } from '@epis2/clinical-forms';
import { ExpandMoreIcon } from '../mui/index.js';
import { EpisM3Text } from '../primitives/EpisM3Text.js';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Stack from '@mui/material/Stack';
import { epis2BarLayout } from '../theme/breakpoints.js';
import { EpisClinicalField } from './EpisClinicalField.js';

const clinicalSectionPadding = epis2BarLayout.clinicalPaddingX;

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
    <Stack spacing={3.5} data-testid={`epis2-form-${blueprint.blueprintId}`}>
      <EpisM3Text role="bodyLarge" color="text.secondary" sx={{ px: 1 }}>
        {blueprint.purpose}
      </EpisM3Text>
      {blueprint.sections.map((sec) => {
        const fields = sec.fieldIds
          .map((id) => fieldMap.get(id))
          .filter((f): f is NonNullable<typeof f> => Boolean(f));

        const body = (
          <Stack spacing={epis2BarLayout.fieldStackGap}>
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
            <Accordion
              key={sec.id}
              defaultExpanded={false}
              disableGutters
              elevation={0}
              sx={{
                border: 1,
                borderColor: 'divider',
                borderRadius: 1,
                bgcolor: 'transparent',
                boxShadow: 'none',
                '&:before': { display: 'none' },
              }}
              TransitionProps={{ timeout: 0 }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: clinicalSectionPadding }}>
                <EpisM3Text role="labelLarge">{sec.label}</EpisM3Text>
              </AccordionSummary>
              <AccordionDetails sx={{ px: clinicalSectionPadding, pb: 2 }}>{body}</AccordionDetails>
            </Accordion>
          );
        }

        return (
          <Stack key={sec.id} spacing={2.5} data-testid={`epis2-form-section-${sec.id}`}>
            <EpisM3Text role="labelLarge" color="text.primary" sx={{ px: 1 }}>
              {sec.label}
            </EpisM3Text>
            {body}
          </Stack>
        );
      })}
    </Stack>
  );
}
