import { copy } from '@epis2/design-system';
import {
  CicaPatientScreenFrame,
  CicaScreenFrame,
  EpisM3Text,
  Stack,
  type ClinicalLayoutAction,
} from '@epis2/epis2-ui';
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
    <CicaScreenFrame
      screenId="recent-patients"
      title="Recientes"
      subtitle="Pacientes abiertos recientemente en esta estación."
      hideActionBar
      testId="cica-recent-patients-screen"
    >
      <EpisM3Text role="bodyMedium" color="text.secondary">
        Lista de recientes — conectar con historial local en siguiente iteración.
      </EpisM3Text>
    </CicaScreenFrame>
  );
}

export function CicaMyWorkPage() {
  return (
    <CicaScreenFrame
      screenId="my-work"
      title="Mi trabajo"
      subtitle="Pendientes asignados al profesional en guardia."
      hideActionBar
      testId="cica-my-work-screen"
    >
      <EpisM3Text role="bodyMedium" color="text.secondary">
        Bandeja personal — borradores, firmas y tareas clínicas pendientes.
      </EpisM3Text>
    </CicaScreenFrame>
  );
}

export function CicaAgendaPage() {
  return (
    <CicaScreenFrame
      screenId="agenda"
      title="Agenda guardia"
      subtitle="Turno actual y próximos eventos del servicio."
      hideActionBar
      testId="cica-agenda-screen"
    >
      <EpisM3Text role="bodyMedium" color="text.secondary">
        Vista agenda — calendario de guardia en demo próximo.
      </EpisM3Text>
    </CicaScreenFrame>
  );
}
