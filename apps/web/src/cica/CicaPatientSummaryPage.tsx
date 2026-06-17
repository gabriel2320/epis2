import { copy } from '@epis2/design-system';
import { CicaPatientScreenFrame, type ClinicalLayoutAction } from '@epis2/epis2-ui';
import { ClassicChartSummaryPanel } from '../components/chart/ClassicChartSummaryPanel.js';
import { ErrorState } from '../components/ErrorState.js';
import { CicaSummaryGrid } from './CicaSummaryGrid.js';
import { useCicaPatientPage } from './hooks/useCicaPatientPage.js';

/** CICA Clean Room — ficha resumen (/app/pacientes/:patientId/resumen). */
export function CicaPatientSummaryPage() {
  const page = useCicaPatientPage();
  const {
    patientId,
    detailQuery,
    presentation,
    summaryFields,
    longitudinal,
    demoCase,
    go,
    goPath,
  } = page;

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
      id: 'new-evolution',
      label: copy.clinicalSummary.registerEvolution,
      kind: 'primary',
      onClick: () => go('new-evolution', { patientId }),
    },
    {
      id: 'new-epicrisis',
      label: copy.inpatient.prepareDischarge,
      kind: 'secondary',
      onClick: () => go('new-epicrisis', { patientId }),
      testId: 'cica-summary-prepare-epicrisis',
    },
  ];

  return (
    <CicaPatientScreenFrame
      screenId="patient-summary"
      patientId={patientId}
      activeTabId={page.activeTabId}
      onNavigate={goPath}
      identity={presentation.identity}
      contextItems={presentation.contextItems}
      actions={actions}
      testId="cica-patient-summary-screen"
    >
      <CicaSummaryGrid>
        <ClassicChartSummaryPanel
          demoCaseCode={demoCase?.demoCaseCode}
          summaryFields={summaryFields}
          longitudinal={longitudinal}
          onViewFullTimeline={() => go('patient-evolutions', { patientId })}
          onOpenResults={() => go('patient-exams', { patientId })}
          onOpenDocuments={() => go('patient-documents', { patientId })}
          testId="cica-classic-summary-panel"
        />
      </CicaSummaryGrid>
    </CicaPatientScreenFrame>
  );
}
