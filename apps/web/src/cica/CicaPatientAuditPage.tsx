import { TraditionalAuditSection } from '../components/chart/sections/TraditionalAuditSection.js';
import { CicaPatientBlueprintPage } from './CicaPatientBlueprintPage.js';
import { PATIENT_AUDIT_BLUEPRINT } from './blueprints/patientScreens.blueprint.js';
import { useCicaPatientPage } from './hooks/useCicaPatientPage.js';

/** CICA Clean Room — auditoría (/app/pacientes/:patientId/auditoria). */
export function CicaPatientAuditPage() {
  const page = useCicaPatientPage();
  const { patientId, demoCase } = page;

  if (!patientId) return null;

  return (
    <CicaPatientBlueprintPage
      blueprint={PATIENT_AUDIT_BLUEPRINT}
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
