import type { CommandResolveResponse } from '@epis2/contracts';
import { copy } from '@epis2/design-system';
import { DASHBOARD_TAB_BY_INTENT, getCommandBarAiHint } from '@epis2/command-registry';
import type { ClinicalIntent } from '@epis2/command-registry';
import {
  Box,
  Button,
  Chip,
  EpisAlert,
  EpisButton,
  EpisCard,
  EpisCommandBar,
  EpisCommandCenterLayout,
  EpisCommandResult,
  EpisCommandSuggestions,
  Stack,
  Typography,
} from '@epis2/epis2-ui';
import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '../api/client.js';
import { resolveCommand as resolveCommandApi } from '../api/commandApi.js';
import { fetchAiStatus } from '../api/aiApi.js';
import { INTENT_TO_ASSIST_BLUEPRINT, listPatients, type PatientListRow } from '../api/clinicalApi.js';
import { useAuth } from '../auth/AuthContext.js';
import { useActivePatient } from '../clinical/ActivePatientContext.js';
import { usePatientClinicalAlerts } from '../clinical/usePatientClinicalAlerts.js';
import { useClinicalNavigate } from '../routes/clinicalNavigate.js';
import type { ClinicalFormRoutePath } from '../routes/clinicalNavigate.js';
import { ActivePatientBanner } from '../components/ActivePatientBanner.js';
import { ClinicalAlertsPanel } from '../components/ClinicalAlertsPanel.js';

export function CommandCenterPage() {
  const { session, logout, hasPermission } = useAuth();
  const { patient: activePatient, setPatient } = useActivePatient();
  const navigate = useClinicalNavigate();
  const [query, setQuery] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [isResolving, setIsResolving] = useState(false);
  const [lastResult, setLastResult] = useState<CommandResolveResponse | null>(null);
  const [patients, setPatients] = useState<PatientListRow[]>([]);
  const [aiAvailable, setAiAvailable] = useState<boolean | null>(null);

  const role = session?.user.role ?? 'physician';
  const permissions = session?.permissions ?? [];
  const roleDisplay = copy.roles[role as keyof typeof copy.roles] ?? role;
  const aiHint = getCommandBarAiHint(role, aiAvailable === true);

  useEffect(() => {
    void fetchAiStatus()
      .then((s) => setAiAvailable(s.available))
      .catch(() => setAiAvailable(false));
  }, []);

  const alertBlueprintId =
    lastResult?.status === 'resolved'
      ? INTENT_TO_ASSIST_BLUEPRINT[lastResult.intent]
      : undefined;
  const alertContextLabel =
    lastResult?.status === 'resolved' ? lastResult.labelEs : undefined;

  const { alerts: clinicalAlerts, loading: alertsLoading, contextLabel } =
    usePatientClinicalAlerts({
      patientId: activePatient?.id,
      blueprintId: alertBlueprintId,
      contextLabel: alertContextLabel,
    });

  const loadPatients = useCallback(async () => {
    try {
      const res = await listPatients();
      setPatients(res.patients);
    } catch {
      setPatients([]);
    }
  }, []);

  const submit = useCallback(async () => {
    const trimmed = query.trim();
    if (!trimmed) {
      setError(copy.commandCenter.emptyCommand);
      setLastResult(null);
      return;
    }
    setError(undefined);
    setIsResolving(true);
    setLastResult(null);
    try {
      const resolveBody: Parameters<typeof resolveCommandApi>[0] = { text: trimmed };
      if (activePatient?.id) resolveBody.patientId = activePatient.id;
      const result = await resolveCommandApi(resolveBody);
      setLastResult(result);
      if (result.status === 'resolved') {
        if (result.routePath === '/epis2/dashboard') {
          const tab =
            DASHBOARD_TAB_BY_INTENT[result.intent as ClinicalIntent] ?? 'work';
          navigate({
            to: '/epis2/dashboard',
            search: {
              tab: tab as 'work' | 'patient' | 'service' | 'quality',
              patientId:
                tab === 'patient' ? activePatient?.id : undefined,
            },
          });
          return;
        }
        const search = activePatient?.id ? { patientId: activePatient.id } : {};
        navigate({
          to: result.routePath as ClinicalFormRoutePath,
          search,
        });
        return;
      }
      if (result.status === 'needs_patient') {
        setError(copy.commandCenter.needsPatient);
        return;
      }
      if (result.status === 'needs_clarification') {
        setError(result.message || copy.commandCenter.needsClarification);
        return;
      }
      if (result.status === 'forbidden') {
        setError(result.message || copy.commandCenter.forbidden);
        return;
      }
      if (result.status === 'empty') {
        setError(result.message);
      }
    } catch (e) {
      if (e instanceof ApiError && e.status === 403) {
        setError(e.message || copy.commandCenter.forbidden);
      } else {
        setError(copy.errors.genericMessage);
      }
    } finally {
      setIsResolving(false);
    }
  }, [query, navigate, activePatient?.id]);

  const header = (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      sx={{ maxWidth: 720, mx: 'auto', mb: 4 }}
    >
      <Chip label={copy.demoBadge} size="small" color="warning" variant="outlined" />
      <Button size="small" color="inherit" onClick={logout}>
        Cerrar sesión
      </Button>
    </Stack>
  );

  return (
    <EpisCommandCenterLayout header={header}>
      <Stack spacing={1} alignItems="center">
        <Typography variant="h4" component="h1" color="primary" fontWeight={700}>
          {copy.appName}
        </Typography>
        {session ? (
          <Typography variant="body2" color="text.secondary">
            {session.user.displayName}
          </Typography>
        ) : null}
      </Stack>

      <Box sx={{ width: '100%', textAlign: 'center' }}>
        <Typography variant="h5" component="h2" data-testid="epis2-command-prompt">
          {copy.commandCenter.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {copy.commandCenter.subtitle}
        </Typography>
      </Box>

      <Box sx={{ width: '100%' }}>
        <EpisCommandBar
          label={copy.commandCenter.powerBarLabel}
          placeholder={copy.commandCenter.powerBarPlaceholder}
          submitLabel={isResolving ? copy.commandCenter.resolving : copy.commandCenter.submit}
          value={query}
          onChange={setQuery}
          onSubmit={() => void submit()}
          error={error}
          aiAvailable={aiAvailable}
          aiHint={error ? undefined : aiHint}
          roleLabel={roleDisplay}
          disabled={isResolving}
        />
      </Box>

      <EpisCard variant="outlined" sx={{ p: 2, width: '100%' }} data-testid="epis2-active-patient-panel">
        <Typography variant="subtitle2" gutterBottom>
          {copy.activePatient.commandPanelTitle}
        </Typography>
        <Box sx={{ mb: 2 }}>
          <ActivePatientBanner />
        </Box>
        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: patients.length ? 1 : 0 }}>
          <EpisButton size="small" variant="outlined" onClick={() => void loadPatients()}>
            {copy.activePatient.pickPatient}
          </EpisButton>
          {activePatient ? (
            <EpisButton
              size="small"
              onClick={() =>
                void navigate({
                  to: '/espacio/ficha',
                  search: { patientId: activePatient.id },
                })
              }
            >
              {copy.activePatient.workspace}
            </EpisButton>
          ) : null}
        </Stack>
        {patients.length > 0 ? (
          <Stack direction="row" flexWrap="wrap" gap={0.5}>
            {patients.slice(0, 5).map((p) => (
              <Chip
                key={p.id}
                label={p.demoCaseCode ?? p.displayName.slice(0, 20)}
                size="small"
                variant={activePatient?.id === p.id ? 'filled' : 'outlined'}
                color={activePatient?.id === p.id ? 'primary' : 'default'}
                clickable
                onClick={() => {
                  setPatient(p);
                  setLastResult(null);
                  void navigate({ to: '/espacio/ficha', search: { patientId: p.id } });
                }}
              />
            ))}
          </Stack>
        ) : null}
      </EpisCard>

      {activePatient ? (
        <ClinicalAlertsPanel
          alerts={clinicalAlerts}
          loading={alertsLoading}
          hintBlueprintLabel={contextLabel}
        />
      ) : null}

      <Stack direction="row" flexWrap="wrap" gap={1} justifyContent="center" sx={{ width: '100%' }}>
        <EpisButton
          size="small"
          variant="outlined"
          data-testid="epis2-open-dashboard"
          onClick={() =>
            void navigate({
              to: '/epis2/dashboard',
              search: {
                tab: activePatient ? 'patient' : 'work',
                patientId: activePatient?.id,
              },
            })
          }
        >
          {copy.dashboard.openBoard}
        </EpisButton>
      </Stack>

      <EpisCommandSuggestions
        role={role}
        permissions={permissions}
        aiAvailable={aiAvailable === true && hasPermission('ai.read')}
        onSelect={(cmd) => {
          setQuery(cmd);
          setError(undefined);
        }}
      />

      {lastResult && lastResult.status === 'resolved' ? (
        <EpisCommandResult title={copy.commandCenter.previewTitle}>
          <Typography variant="body2">
            {lastResult.labelEs} → {lastResult.routePath}
          </Typography>
          <EpisAlert severity="success" sx={{ mt: 2 }}>
            {copy.commandCenter.resolvedNavigate}
          </EpisAlert>
        </EpisCommandResult>
      ) : null}

      {lastResult?.status === 'needs_clarification' && lastResult.candidates.length > 0 ? (
        <EpisCommandResult title="Opciones posibles">
          <Stack direction="row" flexWrap="wrap" gap={1}>
            {lastResult.candidates.map((c) => (
              <Chip key={c.intent} label={c.labelEs} size="small" variant="outlined" />
            ))}
          </Stack>
        </EpisCommandResult>
      ) : null}
    </EpisCommandCenterLayout>
  );
}
