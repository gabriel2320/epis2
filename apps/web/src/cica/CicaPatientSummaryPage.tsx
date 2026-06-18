import { ClassicChartSummaryPanel } from '../components/chart/ClassicChartSummaryPanel.js';
import { CicaPatientBlueprintPage } from './CicaPatientBlueprintPage.js';
import { PATIENT_SUMMARY_BLUEPRINT } from './blueprints/patientScreens.blueprint.js';
import { CicaSummaryGrid } from './CicaSummaryGrid.js';
import { useCicaPatientPage } from './hooks/useCicaPatientPage.js';

/** CICA Clean Room — ficha resumen (/app/pacientes/:patientId/resumen). */
export function CicaPatientSummaryPage() {
  const page = useCicaPatientPage();
  const { patientId, summaryFields, longitudinal, demoCase, go } = page;

  if (!patientId) return null;

  return (
    <CicaPatientBlueprintPage
      blueprint={PATIENT_SUMMARY_BLUEPRINT}
      testId="cica-patient-summary-screen"
      slots={{
        summary: (
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
        ),
      }}
    />
  );
}
