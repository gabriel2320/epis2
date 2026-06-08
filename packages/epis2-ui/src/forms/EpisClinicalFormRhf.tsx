import type { ClinicalFormBlueprint } from '@epis2/clinical-forms';
import { resolveFieldColumnSpan } from '@epis2/clinical-forms';
import { ExpandMoreIcon } from '../mui/index.js';
import { EpisM3Text } from '../primitives/EpisM3Text.js';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { Controller, useFormContext } from 'react-hook-form';
import { epis2BarLayout } from '../theme/breakpoints.js';
import { epis2M3ColumnSpanSx, epis2M3FormGridSx, epis2M3FormLayout } from '../theme/m3-layout-tokens.js';
import type { ClinicalContextDragPayload } from './clinical-context-dnd.js';
import { EpisClinicalField } from './EpisClinicalField.js';
import type { EpisClinicalFormValues } from './useEpisClinicalBlueprintForm.js';

export type EpisClinicalFormRhfProps = {
  blueprint: ClinicalFormBlueprint;
  clinicalProse?: boolean;
  clinicalDropEnabled?: boolean;
  onClinicalDrop?: (fieldId: string, payload: ClinicalContextDragPayload) => void;
  collapseNonPrimarySections?: boolean;
};

/** Formulario clínico MD3 con React Hook Form + Zod (resolver en FormProvider). */
export function EpisClinicalFormRhf({
  blueprint,
  clinicalProse = false,
  clinicalDropEnabled = false,
  onClinicalDrop,
  collapseNonPrimarySections = false,
}: EpisClinicalFormRhfProps) {
  const { control } = useFormContext<EpisClinicalFormValues>();
  const fieldMap = new Map(blueprint.fields.map((f) => [f.id, f]));

  return (
    <Stack spacing={epis2M3FormLayout.sectionGap} data-testid={`epis2-form-${blueprint.blueprintId}`}>
      <EpisM3Text role="bodyLarge" color="text.secondary" sx={{ px: 1 }}>
        {blueprint.purpose}
      </EpisM3Text>
      {blueprint.sections.map((sec, sectionIndex) => {
        const fields = sec.fieldIds
          .map((id) => fieldMap.get(id))
          .filter((f): f is NonNullable<typeof f> => Boolean(f));

        const body = (
          <Box sx={epis2M3FormGridSx} data-testid={`epis2-form-section-grid-${sec.id}`}>
            {fields.map((f) => (
              <Box
                key={f.id}
                sx={epis2M3ColumnSpanSx(resolveFieldColumnSpan(f))}
                data-testid={`epis2-form-field-cell-${f.id}`}
              >
                <Controller
                  name={f.id}
                  control={control}
                  render={({ field: rhf, fieldState }) => (
                    <EpisClinicalField
                      field={f}
                      value={rhf.value ?? ''}
                      clinicalProse={clinicalProse}
                      clinicalDropEnabled={clinicalDropEnabled}
                      {...(onClinicalDrop ? { onClinicalDrop } : {})}
                      {...(fieldState.error?.message ? { error: fieldState.error.message } : {})}
                      onChange={(_fieldId, value) => rhf.onChange(value)}
                    />
                  )}
                />
              </Box>
            ))}
          </Box>
        );

        const useAccordion =
          sec.initialVisibility === 'collapsed' ||
          (collapseNonPrimarySections && sectionIndex > 0);

        if (useAccordion) {
          return (
            <Accordion
              key={sec.id}
              defaultExpanded={sectionIndex === 0 && !collapseNonPrimarySections}
              disableGutters
              data-testid={`epis2-form-section-${sec.id}`}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <EpisM3Text role="titleMedium">{sec.label}</EpisM3Text>
              </AccordionSummary>
              <AccordionDetails sx={{ px: epis2BarLayout.clinicalPaddingX, pt: 0 }}>
                {body}
              </AccordionDetails>
            </Accordion>
          );
        }

        return (
          <Stack key={sec.id} spacing={1.5} data-testid={`epis2-form-section-${sec.id}`}>
            <EpisM3Text role="titleMedium" sx={{ px: 1 }}>
              {sec.label}
            </EpisM3Text>
            {body}
          </Stack>
        );
      })}
    </Stack>
  );
}
