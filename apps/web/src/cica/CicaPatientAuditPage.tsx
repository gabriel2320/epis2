import { copy } from '@epis2/design-system';
import { type ClinicalLayoutAction } from '@epis2/epis2-ui';
import { TraditionalAuditSection } from '../components/chart/sections/TraditionalAuditSection.js';
import { useClinicalNavigate } from '../routes/clinicalNavigate.js';
import { CicaPatientBlueprintPage } from './CicaPatientBlueprintPage.js';
import { PATIENT_AUDIT_BLUEPRINT } from './blueprints/patientScreens.blueprint.js';
import { useCicaPatientPage } from './hooks/useCicaPatientPage.js';

/** CICA Clean Room — auditoría (/app/pacientes/:patientId/auditoria). */
export function CicaPatientAuditPage() {
  const page = useCicaPatientPage();
  const { patientId, demoCase, go } = page;
  const clinicalNavigate = useClinicalNavigate();

  if (!patientId) return null;

  const actions: ClinicalLayoutAction[] = [
    {
      id: 'audit-console',
      label: copy.adminConsole.tabAudit,
      kind: 'primary',
      onClick: () => clinicalNavigate({ to: '/espacio/admin', search: { tab: 'audit' } }),
      testId: 'cica-audit-open-console',
    },
    {
      id: 'open-paper',
      label: copy.chartModes.paper,
      kind: 'secondary',
      onClick: () => go('paper-book', { patientId }),
      testId: 'cica-audit-open-paper',
    },
  ];

  return (
    <CicaPatientBlueprintPage
      blueprint={PATIENT_AUDIT_BLUEPRINT}
      actions={actions}
      testId="cica-patient-audit-screen"
      slots={{
        audit: (
          <TraditionalAuditSection
            demoCaseCode={demoCase?.demoCaseCode}
            compositionMode="cica-classic"
            testId="cica-audit-list"
          />
        ),
      }}
    />
  );
}
