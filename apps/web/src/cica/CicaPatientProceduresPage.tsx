import { findCicaScreenById, type ClinicalLayoutAction } from '@epis2/epis2-ui';
import { CicaPatientDemoSectionPage } from './CicaPatientDemoSectionPage.js';
import { PATIENT_PROCEDURES_BLUEPRINT } from './blueprints/patientScreens.blueprint.js';
import { useCicaPatientPage } from './hooks/useCicaPatientPage.js';

/** CICA Clean Room — procedimientos (/app/pacientes/:patientId/procedimientos). */
export function CicaPatientProceduresPage() {
  const page = useCicaPatientPage();
  const { patientId, go } = page;
  const screen = findCicaScreenById('patient-procedures');

  if (!patientId) return null;

  const actions: ClinicalLayoutAction[] = [
    {
      id: 'register-procedure',
      label: screen?.primaryAction ?? 'Registrar procedimiento',
      kind: 'primary',
      onClick: () => go('patient-summary', { patientId }),
      testId: 'cica-procedures-primary',
    },
  ];

  return (
    <CicaPatientDemoSectionPage
      blueprint={PATIENT_PROCEDURES_BLUEPRINT}
      sectionId="navProcedures"
      slotId="procedures"
      actions={actions}
      testId="cica-patient-procedures-screen"
      listTestId="cica-procedures-list"
    />
  );
}
