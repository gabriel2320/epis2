import type { PatientResultsInboxResponse } from '@epis2/contracts';
import { copy } from '@epis2/design-system';
import {
  Alert,
  Chip,
  EpisM3Text,
  EpisWorkspaceSection,
  Stack,
  Typography,
  epis2ShellContentIslandSx,
} from '@epis2/epis2-ui';
import { useSearch } from '@tanstack/react-router';
import { useCallback, useEffect, useState } from 'react';
import { fetchPatientResultsInbox } from '../api/clinicalApi.js';
import { acknowledgeCriticalResult } from '../api/dashboardApi.js';
import { useActivePatient } from '../clinical/ActivePatientContext.js';
import { ClinicalPageNav } from '../components/ClinicalPageNav.js';
import { ErrorState } from '../components/ErrorState.js';
import { ResultsInboxCriticalGrid } from '../components/grids/ResultsInboxCriticalGrid.js';
import { ResultsInboxPendingOrdersGrid } from '../components/grids/ResultsInboxPendingOrdersGrid.js';
import { LabObservationsGrid } from '../components/LabObservationsGrid.js';
import { EpisRadGridSurface } from '../components/rad/EpisRadGridSurface.js';
import { ResultsInboxTrends } from '../components/ResultsInboxTrends.js';

export function ResultsInboxPage() {
  const search = useSearch({ strict: false }) as { patientId?: string };
  const { patient: active } = useActivePatient();
  const patientId = search.patientId ?? active?.id;
  const [inbox, setInbox] = useState<PatientResultsInboxResponse | null>(null);
  const [error, setError] = useState<string | undefined>();
  const [ackingId, setAckingId] = useState<string | null>(null);
  const [ackMessage, setAckMessage] = useState<string | undefined>();

  const loadInbox = useCallback(async (id: string) => {
    setError(undefined);
    try {
      const data = await fetchPatientResultsInbox(id);
      setInbox(data);
    } catch {
      setError(copy.errors.genericMessage);
    }
  }, []);

  useEffect(() => {
    if (patientId) {
      void loadInbox(patientId);
    }
  }, [patientId, loadInbox]);

  const handleAcknowledge = async (criticalId: string) => {
    if (!patientId) return;
    setAckingId(criticalId);
    setError(undefined);
    try {
      await acknowledgeCriticalResult(criticalId);
      await loadInbox(patientId);
      setAckMessage(copy.results.acknowledgeSuccess);
    } catch {
      setError(copy.errors.genericMessage);
    } finally {
      setAckingId(null);
    }
  };

  const handleCopyLines = useCallback(async (lines: string[]) => {
    if (lines.length === 0) return;
    try {
      await navigator.clipboard.writeText(lines.join('\n'));
    } catch {
      /* noop en test */
    }
  }, []);

  if (!patientId) {
    return (
      <Stack spacing={2} sx={epis2ShellContentIslandSx} data-testid="epis2-results-inbox-no-patient">
        <Alert severity="info">{copy.activePatient.pinHint}</Alert>
        <ClinicalPageNav showFicha={false} />
      </Stack>
    );
  }

  if (error && !inbox) {
    return (
      <Stack spacing={2} sx={epis2ShellContentIslandSx}>
        <ErrorState
          title={copy.errors.genericTitle}
          message={error}
          onRetry={() => void loadInbox(patientId)}
          retryLabel={copy.errors.retry}
        />
        <ClinicalPageNav patientId={patientId} />
      </Stack>
    );
  }

  if (!inbox) {
    return (
      <Stack spacing={2} sx={epis2ShellContentIslandSx}>
        <Typography color="text.secondary">{copy.drafts.loading}</Typography>
        <ClinicalPageNav patientId={patientId} />
      </Stack>
    );
  }

  return (
    <EpisRadGridSurface testId="epis2-results-inbox">
      <Stack spacing={2} sx={epis2ShellContentIslandSx}>
        <Stack spacing={1}>
          <EpisM3Text role="titleLarge" component="h1">
            {copy.results.inboxTitle}
          </EpisM3Text>
          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.55 }}>
            {copy.results.inboxSubtitle}
          </Typography>
          {inbox.demoCaseCode ? (
            <Chip label={inbox.demoCaseCode} size="small" sx={{ alignSelf: 'flex-start' }} />
          ) : null}
        </Stack>

        <ResultsInboxTrends inbox={inbox} />

        <EpisWorkspaceSection title={copy.longitudinal.observations}>
          <LabObservationsGrid
            rows={inbox.observations}
            showOrderTrace
            emptyMessage={copy.longitudinal.emptySection}
            data-testid="epis2-results-observations-grid"
          />
        </EpisWorkspaceSection>

        <EpisWorkspaceSection title={copy.results.criticalSection}>
          {inbox.criticalResults.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              {copy.results.emptyCritical}
            </Typography>
          ) : (
            <ResultsInboxCriticalGrid
              rows={inbox.criticalResults}
              ackingId={ackingId}
              onAcknowledge={(id) => void handleAcknowledge(id)}
              onCopySelection={(lines) => void handleCopyLines(lines)}
            />
          )}
        </EpisWorkspaceSection>

        <EpisWorkspaceSection title={copy.results.pendingOrdersSection}>
          {inbox.pendingOrders.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              {copy.results.emptyPendingOrders}
            </Typography>
          ) : (
            <ResultsInboxPendingOrdersGrid
              rows={inbox.pendingOrders}
              onCopySelection={(lines) => void handleCopyLines(lines)}
            />
          )}
        </EpisWorkspaceSection>

        {ackMessage ? (
          <Alert
            severity="success"
            onClose={() => setAckMessage(undefined)}
            data-testid="epis2-results-ack-notice"
          >
            {ackMessage}
          </Alert>
        ) : null}

        {error ? (
          <Alert severity="error" onClose={() => setError(undefined)}>
            {error}
          </Alert>
        ) : null}

        <ClinicalPageNav patientId={patientId} />
      </Stack>
    </EpisRadGridSurface>
  );
}
