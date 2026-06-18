import { TraditionalDemoSection } from '../components/chart/sections/TraditionalDemoSection.js';
import { CicaPatientBlueprintPage } from './CicaPatientBlueprintPage.js';
import { PATIENT_ADMISSION_BLUEPRINT } from './blueprints/patientScreens.blueprint.js';
import { useCicaPatientPage } from './hooks/useCicaPatientPage.js';

/** CICA Clean Room — ingreso (/app/pacientes/:patientId/ingreso). */
export function CicaPatientAdmissionPage() {
  const page = useCicaPatientPage();
  const { patientId, demoCase } = page;

  if (!patientId) return null;

  return (
    <CicaPatientBlueprintPage
      blueprint={PATIENT_ADMISSION_BLUEPRINT}
      testId="cica-patient-admission-screen"
      slots={{
        anamnesis: (
          <TraditionalDemoSection
            demoCaseCode={demoCase?.demoCaseCode}
            sectionId="navAnamnesis"
            compositionMode="cica-classic"
            testId="cica-admission-anamnesis"
          />
        ),
        admin: (
          <TraditionalDemoSection
            demoCaseCode={demoCase?.demoCaseCode}
            sectionId="navAdmin"
            compositionMode="cica-classic"
            testId="cica-admission-admin"
          />
        ),
      }}
    />
  );
}
