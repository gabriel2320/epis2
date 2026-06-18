import { CicaPatientDemoSectionPage } from './CicaPatientDemoSectionPage.js';
import { PATIENT_DISCHARGE_BLUEPRINT } from './blueprints/patientScreens.blueprint.js';
import { useCicaPatientPage } from './hooks/useCicaPatientPage.js';

/** CICA Clean Room — alta / epicrisis (/app/pacientes/:patientId/alta). */
export function CicaPatientDischargePage() {
  const page = useCicaPatientPage();
  const { patientId } = page;

  if (!patientId) return null;

  return (
    <CicaPatientDemoSectionPage
      blueprint={PATIENT_DISCHARGE_BLUEPRINT}
      sectionId="navEpicrisis"
      slotId="discharge"
      testId="cica-patient-discharge-screen"
      listTestId="cica-discharge-summary"
    />
  );
}
