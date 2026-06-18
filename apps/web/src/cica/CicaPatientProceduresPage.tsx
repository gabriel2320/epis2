import { CicaPatientDemoSectionPage } from './CicaPatientDemoSectionPage.js';
import { PATIENT_PROCEDURES_BLUEPRINT } from './blueprints/patientScreens.blueprint.js';
import { useCicaPatientPage } from './hooks/useCicaPatientPage.js';

/** CICA Clean Room — procedimientos (/app/pacientes/:patientId/procedimientos). */
export function CicaPatientProceduresPage() {
  const page = useCicaPatientPage();
  const { patientId } = page;

  if (!patientId) return null;

  return (
    <CicaPatientDemoSectionPage
      blueprint={PATIENT_PROCEDURES_BLUEPRINT}
      sectionId="navProcedures"
      slotId="procedures"
      testId="cica-patient-procedures-screen"
      listTestId="cica-procedures-list"
    />
  );
}
