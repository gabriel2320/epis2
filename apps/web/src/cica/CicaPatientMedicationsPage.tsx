import { copy } from '@epis2/design-system';
import { findCicaScreenById, type ClinicalLayoutAction } from '@epis2/epis2-ui';
import { TraditionalMedsSection } from '../components/chart/sections/TraditionalMedsSection.js';
import { CicaPatientBlueprintPage } from './CicaPatientBlueprintPage.js';
import { PATIENT_MEDICATIONS_BLUEPRINT } from './blueprints/patientScreens.blueprint.js';
import { useCicaPatientPage } from './hooks/useCicaPatientPage.js';

/** CICA Clean Room — medicamentos activos (/app/pacientes/:patientId/medicamentos). */
export function CicaPatientMedicationsPage() {
  const page = useCicaPatientPage();
  const { patientId, longitudinal, demoCase, go } = page;
  const screen = findCicaScreenById('patient-medications');

  if (!patientId) return null;

  const actions: ClinicalLayoutAction[] = [
    {
      id: 'new-prescription',
      label: screen?.primaryAction ?? 'Nueva prescripción',
      kind: 'primary',
      onClick: () => go('new-prescription', { patientId }),
      testId: 'cica-medications-new-prescription',
    },
    {
      id: 'open-paper',
      label: copy.chartModes.paper,
      kind: 'secondary',
      onClick: () => go('paper-book', { patientId }),
      testId: 'cica-medications-open-paper',
    },
  ];

  return (
    <CicaPatientBlueprintPage
      blueprint={PATIENT_MEDICATIONS_BLUEPRINT}
      actions={actions}
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
