import type { PatientResultsInboxResponse } from '@epis2/contracts';
import { copy } from '@epis2/design-system';
import {
  Alert,
  Button,
  Chip,
  EpisM3Text,
  List,
  ListItem,
  ListItemText,
  Paper,
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
import { LabObservationsGrid } from '../components/LabObservationsGrid.js';
import { ResultsInboxTrends } from '../components/ResultsInboxTrends.js';

function orderTypeLabel(orderType: string) {
  if (orderType === 'lab') return copy.results.orderTypeLab;
  if (orderType === 'imaging') return copy.results.orderTypeImaging;
  return orderType;
}

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

  if (!patientId) {
    return (
      <Stack spacing={2} sx={epis2ShellContentIslandSx} data-testid="epis2-results-inbox-no-patient">
        <Alert severity="info">{copy.activePatient.pinHint}</Alert>
        <ClinicalPageNav showFicha={false} />
      </Stack>
    );
  }

  if (error) {
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
    <Stack spacing={3} sx={epis2ShellContentIslandSx} data-testid="epis2-results-inbox">
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

      <Paper variant="outlined" sx={{ p: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          {copy.longitudinal.observations}
        </Typography>
        <LabObservationsGrid
          rows={inbox.observations}
          showOrderTrace
          emptyMessage={copy.longitudinal.emptySection}
          data-testid="epis2-results-observations-grid"
        />
      </Paper>

      <Paper variant="outlined" sx={{ p: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          {copy.results.criticalSection}
        </Typography>
        {inbox.criticalResults.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            {copy.results.emptyCritical}
          </Typography>
        ) : (
          <List dense disablePadding data-testid="epis2-results-critical-list">
            {inbox.criticalResults.map((row) => (
              <ListItem
                key={row.id}
                disablePadding
                sx={{ py: 0.75, alignItems: 'flex-start' }}
                secondaryAction={
                  !row.acknowledged ? (
                    <Button
                      size="small"
                      variant="outlined"
                      disabled={ackingId === row.id}
                      onClick={() => void handleAcknowledge(row.id)}
                      data-testid={`epis2-results-ack-${row.id}`}
                    >
                      {copy.results.acknowledgeCritical}
                    </Button>
                  ) : undefined
                }
              >
                <ListItemText
                  primary={`${row.label}: ${row.valueText}`}
                  secondary={
                    row.orderTitle
                      ? `${copy.results.orderTrace}: ${row.orderTitle} · ${new Date(row.observedAt).toLocaleString('es-CL')}`
                      : new Date(row.observedAt).toLocaleString('es-CL')
                  }
                />
                <Stack direction="row" spacing={0.5} sx={{ ml: 1, flexShrink: 0 }}>
                  <Chip
                    size="small"
                    color={row.severity === 'critical' ? 'error' : 'warning'}
                    label={row.severity === 'critical' ? 'Crítico' : 'Alto'}
                  />
                  <Chip
                    size="small"
                    variant="outlined"
                    label={row.acknowledged ? copy.results.acknowledged : copy.results.pendingAck}
                  />
                </Stack>
              </ListItem>
            ))}
          </List>
        )}
      </Paper>

      <Paper variant="outlined" sx={{ p: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          {copy.results.pendingOrdersSection}
        </Typography>
        {inbox.pendingOrders.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            {copy.results.emptyPendingOrders}
          </Typography>
        ) : (
          <List dense disablePadding data-testid="epis2-results-pending-orders">
            {inbox.pendingOrders.map((order) => (
              <ListItem key={order.id} disablePadding>
                <ListItemText
                  primary={order.title}
                  secondary={`${orderTypeLabel(order.orderType)} · ${order.priority} · ${copy.results.pendingOrderHint} · ${new Date(order.orderedAt).toLocaleString('es-CL')}`}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>

      {ackMessage ? (
        <Alert
          severity="success"
          onClose={() => setAckMessage(undefined)}
          data-testid="epis2-results-ack-notice"
        >
          {ackMessage}
        </Alert>
      ) : null}

      <ClinicalPageNav patientId={patientId} />
    </Stack>
  );
}
