import { TraditionalMedsSection } from '../components/chart/sections/TraditionalMedsSection.js';
import { CicaPatientBlueprintPage } from './CicaPatientBlueprintPage.js';
import { PATIENT_MEDICATIONS_BLUEPRINT } from './blueprints/patientScreens.blueprint.js';
import { useCicaPatientPage } from './hooks/useCicaPatientPage.js';

/** CICA Clean Room — medicamentos activos (/app/pacientes/:patientId/medicamentos). */
export function CicaPatientMedicationsPage() {
  const page = useCicaPatientPage();
  const { patientId, longitudinal, demoCase } = page;

  if (!patientId) return null;

  return (
    <CicaPatientBlueprintPage
      blueprint={PATIENT_MEDICATIONS_BLUEPRINT}
      testId="cica-patient-medications-screen"
      slots={{
        medications: (
          <TraditionalMedsSection
            demoCaseCode={demoCase?.demoCaseCode}
            longitudinal={longitudinal}
            compositionMode="cica-classic"
            testId="cica-medications-list"
          />
        ),
      }}
    />
  );
}
