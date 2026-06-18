import { type ClinicalLayoutAction } from '@epis2/epis2-ui';
import { CicaBlueprintPage } from './CicaBlueprintPage.js';
import {
  AGENDA_BLUEPRINT,
  MY_WORK_BLUEPRINT,
  RECENT_PATIENTS_BLUEPRINT,
} from './blueprints/systemScreens.blueprint.js';
import { CicaPatientSectionPage } from './CicaPatientSectionPages.js';
import { useCicaPatientPage } from './hooks/useCicaPatientPage.js';

export { CicaPatientTimelinePage } from './CicaPatientTimelinePage.js';

export function CicaPatientAdmissionPage() {
  return (
    <CicaPatientSectionPage
      screenId="patient-admission"
      placeholder="Ingreso clínico — datos de admisión y motivo de hospitalización (demo próximo)."
    />
  );
}

export function CicaPatientInterconsultasPage() {
  return (
    <CicaPatientSectionPage
      screenId="patient-interconsultas"
      placeholder="Interconsultas solicitadas y respuestas pendientes de revisión."
    />
  );
}

export function CicaPatientProceduresPage() {
  return (
    <CicaPatientSectionPage
      screenId="patient-procedures"
      placeholder="Procedimientos y pabellón — registro operatorio del episodio."
    />
  );
}

export function CicaPatientDischargePage() {
  const { patientId, go } = useCicaPatientPage();
  const actions: ClinicalLayoutAction[] =
    patientId != null
      ? [
          {
            id: 'new-epicrisis',
            label: 'Nueva epicrisis',
            kind: 'primary',
            onClick: () => go('new-epicrisis', { patientId }),
          },
        ]
      : [];

  return (
    <CicaPatientSectionPage
      screenId="patient-discharge"
      placeholder="Epicrisis y alta — resumen de cierre del episodio clínico."
      actions={actions}
    />
  );
}

export function CicaPatientAuditPage() {
  return (
    <CicaPatientSectionPage
      screenId="patient-audit"
      placeholder="Auditoría y trazas — acceso, firmas y eventos de cumplimiento (demo)."
    />
  );
}

export function CicaRecentPatientsPage() {
  return (
    <CicaBlueprintPage
      blueprint={RECENT_PATIENTS_BLUEPRINT}
      title="Recientes"
      subtitle="Pacientes abiertos recientemente en esta estación."
      testId="cica-recent-patients-screen"
    />
  );
}

export function CicaMyWorkPage() {
  return (
    <CicaBlueprintPage
      blueprint={MY_WORK_BLUEPRINT}
      title="Mi trabajo"
      subtitle="Pendientes asignados al profesional en guardia."
      testId="cica-my-work-screen"
    />
  );
}

export function CicaAgendaPage() {
  return (
    <CicaBlueprintPage
      blueprint={AGENDA_BLUEPRINT}
      title="Agenda guardia"
      subtitle="Turno actual y próximos eventos del servicio."
      testId="cica-agenda-screen"
    />
  );
}
