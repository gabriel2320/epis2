import { findCicaScreenById, type ClinicalLayoutAction } from '@epis2/epis2-ui';
import { TraditionalDemoSection } from '../components/chart/sections/TraditionalDemoSection.js';
import { CicaPatientBlueprintPage } from './CicaPatientBlueprintPage.js';
import { PATIENT_ADMISSION_BLUEPRINT } from './blueprints/patientScreens.blueprint.js';
import { useCicaPatientPage } from './hooks/useCicaPatientPage.js';

/** CICA Clean Room — ingreso (/app/pacientes/:patientId/ingreso). */
export function CicaPatientAdmissionPage() {
  const page = useCicaPatientPage();
  const { patientId, demoCase, go } = page;
  const screen = findCicaScreenById('patient-admission');

  if (!patientId) return null;

  const actions: ClinicalLayoutAction[] = [
    {
      id: 'back-to-summary',
      label: screen?.primaryAction ?? 'Editar ingreso',
      kind: 'primary',
      onClick: () => go('patient-summary', { patientId }),
      testId: 'cica-admission-primary',
    },
  ];

  return (
    <CicaPatientBlueprintPage
      blueprint={PATIENT_ADMISSION_BLUEPRINT}
      actions={actions}
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
