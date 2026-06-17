import { copy } from '@epis2/design-system';
import {
  CicaPatientScreenFrame,
  EpisM3Text,
  Stack,
  type ClinicalLayoutAction,
} from '@epis2/epis2-ui';
import { CicaBlueprintPage } from './CicaBlueprintPage.js';
import {
  AGENDA_BLUEPRINT,
  MY_WORK_BLUEPRINT,
  RECENT_PATIENTS_BLUEPRINT,
} from './blueprints/systemScreens.blueprint.js';
import { filterAndGroupClinicalTimeline } from '../components/chart/timeline/clinicalTimeline.js';
import { useMemo } from 'react';
import { CicaPatientSectionPage } from './CicaPatientSectionPages.js';
import { useCicaPatientPage } from './hooks/useCicaPatientPage.js';

export function CicaPatientAdmissionPage() {
  return (
    <CicaPatientSectionPage
      screenId="patient-admission"
      placeholder="Ingreso clínico — datos de admisión y motivo de hospitalización (demo próximo)."
    />
  );
}

export function CicaPatientMedicationsPage() {
  return (
    <CicaPatientSectionPage
      screenId="patient-medications"
      placeholder="Receta y fármacos activos — vista dedicada distinta del listado de indicaciones."
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

/** Línea de tiempo completa — agrupada por periodo (patrón epis2g timeline). */
export function CicaPatientTimelinePage() {
  const page = useCicaPatientPage();
  const { patientId, presentation, longitudinal, goPath, activeTabId } = page;

  const grouped = useMemo(
    () => filterAndGroupClinicalTimeline(longitudinal?.timeline ?? [], 'all'),
    [longitudinal?.timeline],
  );

  if (!patientId || !presentation) return null;

  return (
    <CicaPatientScreenFrame
      screenId="patient-timeline"
      patientId={patientId}
      activeTabId={activeTabId}
      onNavigate={goPath}
      identity={presentation.identity}
      contextItems={presentation.contextItems}
      hideActionBar
      testId="cica-patient-timeline-screen"
    >
      {grouped.length === 0 ? (
        <EpisM3Text role="bodyMedium" color="text.secondary">
          {copy.longitudinal.emptySection}
        </EpisM3Text>
      ) : (
        <Stack spacing={2} data-testid="cica-patient-timeline-list">
          {grouped.map((group) => (
            <Stack key={group.bucket} spacing={0.5}>
              <EpisM3Text role="labelMedium" component="h3" color="text.secondary">
                {group.label}
              </EpisM3Text>
              {group.events.map((event) => (
                <EpisM3Text key={event.id} role="bodyMedium" component="p">
                  {event.title}
                  {event.detail ? ` — ${event.detail}` : ''}
                </EpisM3Text>
              ))}
            </Stack>
          ))}
        </Stack>
      )}
    </CicaPatientScreenFrame>
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
