import { findCicaScreenById, type ClinicalLayoutAction } from '@epis2/epis2-ui';
import { CicaPatientDemoSectionPage } from './CicaPatientDemoSectionPage.js';
import { PATIENT_INTERCONSULTAS_BLUEPRINT } from './blueprints/patientScreens.blueprint.js';
import { useCicaPatientPage } from './hooks/useCicaPatientPage.js';

/** CICA Clean Room — interconsultas (/app/pacientes/:patientId/interconsultas). */
export function CicaPatientInterconsultasPage() {
  const page = useCicaPatientPage();
  const { patientId, go } = page;
  const screen = findCicaScreenById('patient-interconsultas');

  if (!patientId) return null;

  const actions: ClinicalLayoutAction[] = [
    {
      id: 'request-consult',
      label: screen?.primaryAction ?? 'Solicitar interconsulta',
      kind: 'primary',
      onClick: () => go('patient-summary', { patientId }),
      testId: 'cica-interconsultas-primary',
    },
  ];

  return (
    <CicaPatientDemoSectionPage
      blueprint={PATIENT_INTERCONSULTAS_BLUEPRINT}
      sectionId="navConsults"
      slotId="interconsultas"
      actions={actions}
      testId="cica-patient-interconsultas-screen"
      listTestId="cica-interconsultas-list"
    />
  );
}
