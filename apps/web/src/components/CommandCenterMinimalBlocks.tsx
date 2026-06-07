import { copy } from '@epis2/design-system';
import { useQuery } from '@tanstack/react-query';
import {
  EpisBentoCell,
  EpisBentoGrid,
  EpisChip,
  EpisM3Text,
  Stack,
} from '@epis2/epis2-ui';
import { fetchDashboardWork } from '../api/dashboardApi.js';
import { readRecentPatients } from '../clinical/recentPatients.js';
import { useActivePatient } from '../clinical/ActivePatientContext.js';
import { usePatientClinicalAlerts } from '../clinical/usePatientClinicalAlerts.js';
import { useDraftsQuery } from '../query/hooks/useDraftsQuery.js';
import { queryKeys } from '../query/queryKeys.js';
import type { ClinicalDraftSummary } from '../api/clinicalApi.js';
import { useClinicalNavigate } from '../routes/clinicalNavigate.js';

function alertColor(severity: 'critical' | 'warning' | 'info'): 'error' | 'warning' | 'info' {
  if (severity === 'critical') return 'error';
  return 'warning';
}

/** Bento 2×2 bajo el área central — visible solo si hay datos (Vista 1). */
export function CommandCenterMinimalBlocks() {
  const navigate = useClinicalNavigate();
  const { patient: activePatient } = useActivePatient();
  const recentPatients = readRecentPatients();

  const workQuery = useQuery({
    queryKey: queryKeys.dashboard.work(),
    queryFn: () => fetchDashboardWork(),
  });

  const draftsQuery = useDraftsQuery(undefined, true);

  const { alerts, loading: alertsLoading } = usePatientClinicalAlerts({
    patientId: activePatient?.id,
  });

  const openDrafts = (draftsQuery.data ?? []).slice(0, 4);
  const tasks = (workQuery.data?.pendingReview ?? []).slice(0, 4);

  const hasRecent = recentPatients.length > 0;
  const hasTasks = tasks.length > 0;
  const hasDrafts = openDrafts.length > 0;
  const hasAlerts = Boolean(activePatient && !alertsLoading && alerts.length > 0);

  if (!hasRecent && !hasTasks && !hasDrafts && !hasAlerts) {
    return null;
  }

  return (
    <EpisBentoGrid testId="epis2-command-minimal-blocks">
      {hasRecent ? (
        <EpisBentoCell title={copy.commandCenter.blockRecentPatients} testId="epis2-command-block-recent">
          <Stack direction="row" flexWrap="wrap" gap={0.5}>
            {recentPatients.map((p) => (
              <EpisChip
                key={p.id}
                label={p.demoCaseCode ?? p.displayName}
                title={p.displayName}
                size="small"
                variant={activePatient?.id === p.id ? 'filled' : 'outlined'}
                clickable
                onClick={() =>
                  void navigate({ to: '/espacio/ficha', search: { patientId: p.id } })
                }
              />
            ))}
          </Stack>
        </EpisBentoCell>
      ) : null}

      {hasTasks ? (
        <EpisBentoCell title={copy.commandCenter.blockPendingTasks} testId="epis2-command-block-tasks">
          <Stack spacing={0.5}>
            {tasks.map((task) => (
              <EpisM3Text key={task.id} role="bodyMedium">
                {task.title}
              </EpisM3Text>
            ))}
          </Stack>
        </EpisBentoCell>
      ) : null}

      {hasDrafts ? (
        <EpisBentoCell title={copy.commandCenter.blockDrafts} testId="epis2-command-block-drafts">
          <Stack direction="row" flexWrap="wrap" gap={0.5}>
            {openDrafts.map((draft: ClinicalDraftSummary) => (
              <EpisChip
                key={draft.id}
                label={draft.title}
                size="small"
                variant="outlined"
                clickable
                onClick={() =>
                  void navigate({
                    to: '/espacio/borrador/$draftId',
                    params: { draftId: draft.id },
                    search: { patientId: draft.patientId },
                  })
                }
              />
            ))}
          </Stack>
        </EpisBentoCell>
      ) : null}

      {hasAlerts ? (
        <EpisBentoCell title={copy.commandCenter.blockAlerts} testId="epis2-command-block-alerts">
          <Stack spacing={0.5} data-testid="epis2-clinical-alerts">
            {alerts.slice(0, 3).map((alert) => (
              <EpisM3Text
                key={`${alert.ruleId}-${alert.message}`}
                role="bodyMedium"
                color={`${alertColor(alert.severity)}.main`}
                data-testid={`epis2-clinical-alert-${alert.ruleId}`}
              >
                {alert.message}
              </EpisM3Text>
            ))}
          </Stack>
        </EpisBentoCell>
      ) : null}
    </EpisBentoGrid>
  );
}
