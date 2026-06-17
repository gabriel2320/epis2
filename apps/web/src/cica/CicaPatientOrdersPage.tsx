import type { PatientLongitudinalResponse } from '@epis2/contracts';
import { copy } from '@epis2/design-system';
import {
  CicaPatientScreenFrame,
  EpisM3Text,
  findCicaScreenById,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
  type ClinicalLayoutAction,
} from '@epis2/epis2-ui';
import { useMemo } from 'react';
import {
  formatMedicationLine,
  partitionMedicationZones,
} from '../components/clinical-summary/clinicalSummaryData.js';
import { ErrorState } from '../components/ErrorState.js';
import { getDemoChartSectionRows } from '../fixtures/devFixturesBridge.js';
import { useCicaPatientPage } from './hooks/useCicaPatientPage.js';

type Medication = PatientLongitudinalResponse['medications'][number];

type CicaOrdersListProps = {
  medications: readonly Medication[];
  demoCaseCode?: string | undefined;
  testId?: string;
};

/** Lista clínica de indicaciones — zonas de medicación o filas demo, sin grid administrativo. */
function CicaOrdersList({
  medications,
  demoCaseCode,
  testId = 'cica-orders-list',
}: CicaOrdersListProps) {
  const zones = useMemo(() => partitionMedicationZones(medications), [medications]);
  const hasMeds = zones.active.length > 0 || zones.prn.length > 0 || zones.suspended.length > 0;

  const demoRows = useMemo(
    () => (demoCaseCode ? getDemoChartSectionRows(demoCaseCode, 'navOrders') : []),
    [demoCaseCode],
  );

  const zoneSections = useMemo(() => {
    if (!hasMeds) return [];
    return [
      { key: 'active', label: copy.clinicalSummary.medsActiveZone, items: zones.active },
      { key: 'prn', label: copy.clinicalSummary.medsPrnZone, items: zones.prn },
      { key: 'suspended', label: copy.clinicalSummary.medsSuspendedZone, items: zones.suspended },
    ].filter((section) => section.items.length > 0);
  }, [hasMeds, zones]);

  if (!hasMeds && demoRows.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" data-testid={testId}>
        {copy.longitudinal.emptySection}
      </Typography>
    );
  }

  if (hasMeds) {
    return (
      <Stack spacing={2} data-testid={testId} data-cica-composition="classic">
        {zoneSections.map((section) => (
          <Stack key={section.key} spacing={1} data-testid={`${testId}-zone-${section.key}`}>
            <EpisM3Text role="labelMedium" component="h3" color="text.secondary">
              {section.label}
            </EpisM3Text>
            <List dense disablePadding>
              {section.items.map((med) => (
                <ListItem
                  key={med.id}
                  disablePadding
                  data-testid={`${testId}-med-${med.id}`}
                  sx={{ py: 0.75 }}
                >
                  <ListItemText primary={formatMedicationLine(med)} />
                </ListItem>
              ))}
            </List>
          </Stack>
        ))}
      </Stack>
    );
  }

  return (
    <Stack spacing={2} data-testid={testId} data-cica-composition="classic">
      <List dense disablePadding>
        {demoRows.map((row, index) => (
          <ListItem
            key={`${row.label}-${index}`}
            disablePadding
            data-testid={`${testId}-demo-${index}`}
            sx={{ py: 0.75 }}
          >
            <ListItemText primary={row.label} secondary={row.value} />
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}

/** CICA Clean Room — indicaciones (/app/pacientes/:patientId/indicaciones). */
export function CicaPatientOrdersPage() {
  const page = useCicaPatientPage();
  const { patientId, detailQuery, presentation, longitudinal, demoCase, go, goPath } = page;
  const screen = findCicaScreenById('patient-orders');

  if (!patientId || !presentation) return null;

  if (detailQuery.isError) {
    return (
      <ErrorState
        title={copy.errors.genericTitle}
        message={copy.errors.genericMessage}
        onRetry={() => detailQuery.refetch()}
      />
    );
  }

  if (!detailQuery.data) return null;

  const actions: ClinicalLayoutAction[] = [
    {
      id: 'add-order',
      label: screen?.primaryAction ?? 'Agregar indicación',
      kind: 'primary',
      onClick: () => go('new-prescription', { patientId }),
    },
  ];

  return (
    <CicaPatientScreenFrame
      screenId="patient-orders"
      patientId={patientId}
      activeTabId={page.activeTabId}
      onNavigate={goPath}
      identity={presentation.identity}
      contextItems={presentation.contextItems}
      actions={actions}
      testId="cica-patient-orders-screen"
    >
      <CicaOrdersList
        medications={longitudinal?.medications ?? []}
        demoCaseCode={demoCase?.demoCaseCode}
      />
    </CicaPatientScreenFrame>
  );
}
