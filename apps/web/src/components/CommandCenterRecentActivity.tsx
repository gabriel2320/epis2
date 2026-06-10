import { copy } from '@epis2/design-system';
import { COMMAND_CENTER_DENSITY } from '@epis2/command-registry';
import { useQuery } from '@tanstack/react-query';
import { ChevronRightIcon, EpisChip, EpisM3Text, Stack } from '@epis2/epis2-ui';
import { fetchDashboardWork } from '../api/dashboardApi.js';
import type { ClinicalDraftSummary } from '../api/clinicalApi.js';
import { readRecentPatients } from '../clinical/recentPatients.js';
import { useActivePatient } from '../clinical/ActivePatientContext.js';
import { useDraftsQuery } from '../query/hooks/useDraftsQuery.js';
import { queryKeys } from '../query/queryKeys.js';
import { useClinicalNavigate } from '../routes/clinicalNavigate.js';
import { useEpisSession } from '../session/EpisSessionContext.js';

type ActivityRow = {
  id: string;
  title: string;
  patientLabel: string;
  atLabel: string;
  badge: string;
  onClick: () => void;
};

function formatRelativeEs(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const sameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();
  const time = date.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
  return sameDay ? `Hoy ${time}` : date.toLocaleDateString('es-CL');
}

function patientLabelFor(draft: ClinicalDraftSummary, recentNames: Map<string, string>): string {
  return recentNames.get(draft.patientId) ?? copy.commandCenter.recentActivityPatientFallback;
}

/** Continuar trabajo — lista compacta bajo /comando (MF-UI-DENSITY, máx. 5 filas). */
export function CommandCenterRecentActivity() {
  const navigate = useClinicalNavigate();
  const { openDashboardMode } = useEpisSession();
  const { patient: activePatient } = useActivePatient();
  const recentPatients = readRecentPatients();
  const maxRows = COMMAND_CENTER_DENSITY.maxContinueWorkRows;

  const workQuery = useQuery({
    queryKey: queryKeys.dashboard.work(),
    queryFn: () => fetchDashboardWork(),
  });

  const draftsQuery = useDraftsQuery(undefined, true);

  const nameById = new Map(recentPatients.map((p) => [p.id, p.displayName]));
  if (activePatient) {
    nameById.set(activePatient.id, activePatient.displayName);
  }

  const rows: ActivityRow[] = [];

  for (const draft of (draftsQuery.data ?? []).slice(0, maxRows)) {
    rows.push({
      id: `draft-${draft.id}`,
      title: draft.title,
      patientLabel: patientLabelFor(draft, nameById),
      atLabel: formatRelativeEs(draft.updatedAt),
      badge: copy.drafts.statusLabels.draft,
      onClick: () =>
        void navigate({
          to: '/espacio/borrador/$draftId',
          params: { draftId: draft.id },
          search: { patientId: draft.patientId },
        }),
    });
  }

  for (const task of (workQuery.data?.pendingReview ?? []).slice(0, maxRows - rows.length)) {
    rows.push({
      id: `task-${task.id}`,
      title: task.title,
      patientLabel: activePatient?.displayName ?? copy.commandCenter.recentActivityPatientFallback,
      atLabel: copy.commandCenter.recentActivityNow,
      badge: copy.commandCenter.suggestionBadgePending,
      onClick: () => openDashboardMode('work'),
    });
  }

  if (rows.length === 0) {
    return null;
  }

  const visible = rows.slice(0, maxRows);

  return (
    <Stack spacing={1} sx={{ width: '100%' }} data-testid="epis2-command-recent-activity">
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
        <EpisM3Text role="titleMedium" component="h2">
          {copy.commandCenter.continueWorkTitle}
        </EpisM3Text>
        <EpisM3Text
          role="labelMedium"
          component="button"
          color="primary.dark"
          onClick={() => openDashboardMode('work')}
          sx={{ border: 0, bgcolor: 'transparent', cursor: 'pointer', p: 0, font: 'inherit' }}
        >
          {copy.commandCenter.recentCommandActivityViewAll}
        </EpisM3Text>
      </Stack>

      <Stack spacing={0}>
        {visible.map((row) => (
          <Stack
            key={row.id}
            component="button"
            type="button"
            direction="row"
            alignItems="center"
            spacing={1}
            onClick={row.onClick}
            data-testid={`epis2-command-activity-${row.id}`}
            sx={{
              m: 0,
              width: '100%',
              textAlign: 'left',
              border: 0,
              borderRadius: 1,
              bgcolor: 'transparent',
              cursor: 'pointer',
              px: 0.5,
              py: 1,
              '&:hover': { bgcolor: 'action.hover' },
            }}
          >
            <Stack sx={{ flex: 1, minWidth: 0 }}>
              <EpisM3Text role="bodyMedium" sx={{ display: 'block', fontWeight: 600 }}>
                {row.title}
              </EpisM3Text>
              <EpisM3Text role="labelMedium" color="text.secondary" sx={{ display: 'block' }}>
                {row.patientLabel} · {row.atLabel}
              </EpisM3Text>
            </Stack>
            <EpisChip
              size="small"
              label={row.badge}
              variant="outlined"
              tabIndex={-1}
              sx={{ flexShrink: 0 }}
            />
            <ChevronRightIcon fontSize="small" color="action" aria-hidden />
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}
