import type { ClinicalFormBlueprint } from '@epis2/clinical-forms';
import { resolveFieldColumnSpan } from '@epis2/clinical-forms';
import { ExpandMoreIcon } from '../mui/index.js';
import { EpisM3Text } from '../primitives/EpisM3Text.js';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { epis2BarLayout } from '../theme/breakpoints.js';
import {
  epis2M3ColumnSpanSx,
  epis2M3FormGridSx,
  epis2M3FormLayout,
} from '../theme/m3-layout-tokens.js';
import type { ClinicalContextDragPayload } from './clinical-context-dnd.js';
import { EpisClinicalField } from './EpisClinicalField.js';

const clinicalSectionPadding = epis2BarLayout.clinicalPaddingX;

export type EpisClinicalFormProps = {
  blueprint: ClinicalFormBlueprint;
  values: Record<string, string>;
  errors?: Record<string, string>;
  /** Textareas con prosa clínica (65ch, line-height 1.5). */
  clinicalProse?: boolean;
  /** Drop de fragmentos del panel de contexto en textareas (LAYOUT-04). */
  clinicalDropEnabled?: boolean;
  onClinicalDrop?: (fieldId: string, payload: ClinicalContextDragPayload) => void;
  onChange: (fieldId: string, value: string) => void;
  /** MF-RAD-M3-A — colapsar secciones secundarias (solo primera expandida). */
  collapseNonPrimarySections?: boolean;
};

/** Renderiza un blueprint clínico con secciones y campos MUI. */
export function EpisClinicalForm({
  blueprint,
  values,
  errors = {},
  clinicalProse = false,
  clinicalDropEnabled = false,
  onClinicalDrop,
  onChange,
  collapseNonPrimarySections = false,
}: EpisClinicalFormProps) {
  const fieldMap = new Map(blueprint.fields.map((f) => [f.id, f]));

  return (
    <Stack
      spacing={epis2M3FormLayout.sectionGap}
      data-testid={`epis2-form-${blueprint.blueprintId}`}
    >
      <EpisM3Text role="bodyLarge" color="text.secondary" sx={{ px: 1 }}>
        {blueprint.purpose}
      </EpisM3Text>
      {blueprint.sections.map((sec, sectionIndex) => {
        const fields = sec.fieldIds
          .map((id) => fieldMap.get(id))
          .filter((f): f is NonNullable<typeof f> => Boolean(f));

        const body = (
          <Box sx={epis2M3FormGridSx} data-testid={`epis2-form-section-grid-${sec.id}`}>
            {fields.map((f) => {
              const err = errors[f.id];
              return (
                <Box
                  key={f.id}
                  sx={epis2M3ColumnSpanSx(resolveFieldColumnSpan(f))}
                  data-testid={`epis2-form-field-cell-${f.id}`}
                >
                  <EpisClinicalField
                    field={f}
                    value={values[f.id] ?? ''}
                    clinicalProse={clinicalProse}
                    clinicalDropEnabled={clinicalDropEnabled}
                    {...(onClinicalDrop ? { onClinicalDrop } : {})}
                    {...(err ? { error: err } : {})}
                    onChange={onChange}
                  />
                </Box>
              );
            })}
          </Box>
        );
        const useAccordion =
          sec.initialVisibility === 'collapsed' || (collapseNonPrimarySections && sectionIndex > 0);
        if (useAccordion) {
          return (
            <Accordion
              key={sec.id}
              id={`epis2-section-${sec.id}`}
              defaultExpanded={sec.initialVisibility !== 'collapsed' && sectionIndex === 0}
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
          <Stack
            key={sec.id}
            id={`epis2-section-${sec.id}`}
            spacing={epis2M3FormLayout.sectionLabelGap}
            data-testid={`epis2-form-section-${sec.id}`}
          >
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
