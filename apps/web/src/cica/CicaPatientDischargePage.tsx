import { findCicaScreenById, type ClinicalLayoutAction } from '@epis2/epis2-ui';
import { CicaPatientDemoSectionPage } from './CicaPatientDemoSectionPage.js';
import { PATIENT_DISCHARGE_BLUEPRINT } from './blueprints/patientScreens.blueprint.js';
import { useCicaPatientPage } from './hooks/useCicaPatientPage.js';

/** CICA Clean Room — alta / epicrisis (/app/pacientes/:patientId/alta). */
export function CicaPatientDischargePage() {
  const page = useCicaPatientPage();
  const { patientId, go } = page;
  const screen = findCicaScreenById('patient-discharge');

  if (!patientId) return null;

  const actions: ClinicalLayoutAction[] = [
    {
      id: 'new-epicrisis',
      label: screen?.primaryAction ?? 'Nueva epicrisis',
      kind: 'primary',
      onClick: () => go('new-epicrisis', { patientId }),
      testId: 'cica-discharge-new-epicrisis',
    },
  ];

  return (
    <CicaPatientDemoSectionPage
      blueprint={PATIENT_DISCHARGE_BLUEPRINT}
      sectionId="navEpicrisis"
      slotId="discharge"
      actions={actions}
      testId="cica-patient-discharge-screen"
      listTestId="cica-discharge-summary"
    />
  );
}
