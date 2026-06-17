import {
  Box,
  CicaScreenFrame,
  CicaStructuredSection,
  CicaSystemWorkspaceHeader,
  EpisM3Text,
  Stack,
  Typography,
  type CicaScreenId,
} from '@epis2/epis2-ui';
import type { ReactNode } from 'react';
import { CICA_DEMO_AGENDA, CICA_DEMO_RECENT, CICA_DEMO_WORK_TASKS } from './cicaEpis2gDemoData.js';

export {
  CicaPatientAdmissionPage,
  CicaPatientAuditPage,
  CicaPatientDischargePage,
  CicaPatientInterconsultasPage,
  CicaPatientMedicationsPage,
  CicaPatientProceduresPage,
  CicaPatientTimelinePage,
} from './CicaPatientSectionPages.js';

function SystemWorkspacePage({
  screenId,
  blocks,
}: {
  screenId: CicaScreenId;
  blocks: Partial<Record<string, ReactNode>>;
}) {
  return (
    <CicaScreenFrame screenId={screenId} hideActionBar testId={`cica-screen-${screenId}`}>
      <CicaSystemWorkspaceHeader screenId={screenId} />
      <CicaStructuredSection screenId={screenId} blocks={blocks} />
    </CicaScreenFrame>
  );
}

export function CicaRecentPatientsPage() {
  return (
    <SystemWorkspacePage
      screenId="recent-patients"
      blocks={{
        'recent-grid': (
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} flexWrap="wrap" useFlexGap>
            {CICA_DEMO_RECENT.map((card) => (
              <Stack
                key={card.id}
                spacing={0.75}
                sx={{
                  flex: { md: '1 1 45%' },
                  minWidth: 240,
                  p: 2.5,
                  borderRadius: 2,
                  border: 1,
                  borderColor: 'divider',
                  borderTop: 3,
                  borderTopColor: 'primary.main',
                  bgcolor: 'background.paper',
                }}
                data-testid={`cica-recent-card-${card.id}`}
              >
                <Typography variant="caption" color="primary" fontWeight={700}>
                  {card.location}
                </Typography>
                <Typography variant="subtitle2" fontWeight={700}>
                  {card.displayName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  RUT {card.rut} · {card.ageLabel}
                </Typography>
                <Typography variant="caption" color="text.secondary" fontStyle="italic">
                  Último acceso: {card.lastActivity}
                </Typography>
              </Stack>
            ))}
          </Stack>
        ),
      }}
    />
  );
}

export function CicaMyWorkPage() {
  return (
    <SystemWorkspacePage
      screenId="my-work"
      blocks={{
        'copilot-banner': (
          <EpisM3Text role="bodyMedium">
            Se detectan fichas UCI con alertas o firmas pendientes. Revíselas antes de la entrega de
            turno.
          </EpisM3Text>
        ),
        'task-list': (
          <Stack spacing={1.5}>
            {CICA_DEMO_WORK_TASKS.map((task) => (
              <Stack
                key={task.id}
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: 1,
                  borderColor: 'divider',
                  borderLeft: 3,
                  borderLeftColor: 'warning.main',
                  bgcolor: 'background.paper',
                }}
                data-testid={`cica-work-task-${task.id}`}
              >
                <Stack spacing={0.25}>
                  <Typography variant="subtitle2">{task.title}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Paciente: {task.patientName} · {task.reason}
                  </Typography>
                </Stack>
                <Typography variant="caption" fontWeight={700} color="warning.dark">
                  {task.status}
                </Typography>
              </Stack>
            ))}
          </Stack>
        ),
      }}
    />
  );
}

export function CicaAgendaPage() {
  return (
    <SystemWorkspacePage
      screenId="agenda"
      blocks={{
        'agenda-timeline': (
          <Stack
            divider={<Box sx={{ borderBottom: 1, borderColor: 'divider' }} />}
            sx={{ border: 1, borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}
          >
            {CICA_DEMO_AGENDA.map((evt) => (
              <Stack
                key={evt.time}
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ p: 2, bgcolor: 'background.paper' }}
                data-testid={`cica-agenda-event-${evt.time}`}
              >
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Typography variant="caption" fontFamily="monospace" color="text.secondary">
                    {evt.time}
                  </Typography>
                  <Stack spacing={0.25}>
                    <Typography variant="body2" fontWeight={600}>
                      {evt.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {evt.room}
                    </Typography>
                  </Stack>
                </Stack>
                <Typography
                  variant="caption"
                  fontWeight={700}
                  color={evt.status === 'Realizado' ? 'success.main' : 'text.secondary'}
                >
                  {evt.status}
                </Typography>
              </Stack>
            ))}
          </Stack>
        ),
      }}
    />
  );
}
