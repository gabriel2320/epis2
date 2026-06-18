import { CicaPatientDemoSectionPage } from './CicaPatientDemoSectionPage.js';
import { PATIENT_INTERCONSULTAS_BLUEPRINT } from './blueprints/patientScreens.blueprint.js';
import { useCicaPatientPage } from './hooks/useCicaPatientPage.js';

/** CICA Clean Room — interconsultas (/app/pacientes/:patientId/interconsultas). */
export function CicaPatientInterconsultasPage() {
  const page = useCicaPatientPage();
  const { patientId } = page;

  if (!patientId) return null;

  return (
    <CicaPatientDemoSectionPage
      blueprint={PATIENT_INTERCONSULTAS_BLUEPRINT}
      sectionId="navConsults"
      slotId="interconsultas"
      testId="cica-patient-interconsultas-screen"
      listTestId="cica-interconsultas-list"
    />
  );
}
