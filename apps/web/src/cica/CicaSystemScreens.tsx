import { CicaBlueprintPage } from './CicaBlueprintPage.js';
import {
  AGENDA_BLUEPRINT,
  MY_WORK_BLUEPRINT,
  RECENT_PATIENTS_BLUEPRINT,
} from './blueprints/systemScreens.blueprint.js';

export { CicaPatientTimelinePage } from './CicaPatientTimelinePage.js';

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
