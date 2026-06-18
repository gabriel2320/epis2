import type { PatientLongitudinalResponse } from '@epis2/contracts';
import { copy } from '@epis2/design-system';
import {
  EpisM3Text,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
  type ClinicalLayoutAction,
} from '@epis2/epis2-ui';
import { useMemo } from 'react';
import {
  formatLabObservedAt,
  selectLabHighlights,
} from '../components/clinical-summary/clinicalSummaryData.js';
import { getDemoChartSectionRows } from '../fixtures/devFixturesBridge.js';
import { useClinicalNavigate } from '../routes/clinicalNavigate.js';
import { CicaPatientBlueprintPage } from './CicaPatientBlueprintPage.js';
import { PATIENT_EXAMS_BLUEPRINT } from './blueprints/patientScreens.blueprint.js';
import { useCicaPatientPage } from './hooks/useCicaPatientPage.js';

const CICA_EXAMS_MAX_ROWS = 5;

type ExamRow = {
  id: string;
  label: string;
  detail: string;
};

type CicaExamsListProps = {
  observations: PatientLongitudinalResponse['observations'];
  demoCaseCode?: string | undefined;
  testId?: string;
};

function buildExamRows(
  observations: PatientLongitudinalResponse['observations'],
  demoCaseCode?: string | undefined,
): ExamRow[] {
  const fromLongitudinal = selectLabHighlights(observations, CICA_EXAMS_MAX_ROWS).map((o) => ({
    id: o.id,
    label: o.label,
    detail: `${o.valueText} · ${formatLabObservedAt(o.observedAt)}`,
  }));

  if (fromLongitudinal.length > 0) {
    return fromLongitudinal;
  }

  return getDemoChartSectionRows(demoCaseCode, 'navLabs')
    .slice(0, CICA_EXAMS_MAX_ROWS)
    .map((row, index) => ({
      id: `${row.label}-${index}`,
      label: row.label,
      detail: row.value,
    }));
}

/** Lista clínica de exámenes relevantes — sin grid administrativo (CICA-L-06). */
function CicaExamsList({
  observations,
  demoCaseCode,
  testId = 'cica-exams-list',
}: CicaExamsListProps) {
  const rows = useMemo(
    () => buildExamRows(observations, demoCaseCode),
    [observations, demoCaseCode],
  );

  if (rows.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" data-testid={testId}>
        {copy.longitudinal.emptySection}
      </Typography>
    );
  }

  return (
    <Stack spacing={1} data-testid={testId} data-cica-composition="classic">
      <EpisM3Text role="labelMedium" component="h3" color="text.secondary">
        {copy.clinicalSummary.classicBlocks.relevantExams}
      </EpisM3Text>
      <List dense disablePadding>
        {rows.map((row) => (
          <ListItem
            key={row.id}
            disablePadding
            data-testid={`${testId}-row-${row.id}`}
            sx={{ py: 0.75 }}
          >
            <ListItemText primary={row.label} secondary={row.detail} />
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}

/** CICA Clean Room — exámenes (/app/pacientes/:patientId/examenes). */
export function CicaPatientExamsPage() {
  const clinicalNavigate = useClinicalNavigate();
  const page = useCicaPatientPage();
  const { patientId, longitudinal, demoCase } = page;

  if (!patientId) return null;

  const actions: ClinicalLayoutAction[] = [
    {
      id: 'view-results',
      label: 'Ver resultados',
      kind: 'primary',
      onClick: () => clinicalNavigate({ to: '/espacio/resultados', search: { patientId } }),
    },
  ];

  return (
    <CicaPatientBlueprintPage
      blueprint={PATIENT_EXAMS_BLUEPRINT}
      actions={actions}
      testId="cica-patient-exams-screen"
      slots={{
        exams: (
          <CicaExamsList
            observations={longitudinal?.observations ?? []}
            demoCaseCode={demoCase?.demoCaseCode}
          />
        ),
      }}
    />
  );
}
