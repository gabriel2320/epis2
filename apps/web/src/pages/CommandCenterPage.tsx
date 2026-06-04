import type { CommandResolveResponse } from '@epis2/contracts';
import { copy } from '@epis2/design-system';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useClinicalNavigate } from '../routes/clinicalNavigate.js';
import type { ClinicalFormRoutePath } from '../routes/clinicalNavigate.js';
import type { ClinicalAlert } from '@epis2/contracts';
import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '../api/client.js';
import { resolveCommand as resolveCommandApi } from '../api/commandApi.js';
import { CommandSuggestionChips } from '../components/CommandSuggestionChips.js';
import { PowerBar } from '../components/PowerBar.js';
import { useAuth } from '../auth/AuthContext.js';
import { useActivePatient } from '../clinical/ActivePatientContext.js';
import {
  fetchPatientClinicalAlerts,
  INTENT_TO_ASSIST_BLUEPRINT,
  listPatients,
  type PatientListRow,
} from '../api/clinicalApi.js';
import { ActivePatientBanner } from '../components/ActivePatientBanner.js';
import { ClinicalAlertsPanel } from '../components/ClinicalAlertsPanel.js';

export function CommandCenterPage() {
  const { session, logout } = useAuth();
  const { patient: activePatient, setPatient } = useActivePatient();
  const navigate = useClinicalNavigate();
  const [query, setQuery] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [isResolving, setIsResolving] = useState(false);
  const [lastResult, setLastResult] = useState<CommandResolveResponse | null>(null);
  const [patients, setPatients] = useState<PatientListRow[]>([]);
  const [clinicalAlerts, setClinicalAlerts] = useState<ClinicalAlert[]>([]);
  const [alertsLoading, setAlertsLoading] = useState(false);
  const [alertContextLabel, setAlertContextLabel] = useState<string | undefined>();

  const loadClinicalAlerts = useCallback(
    async (patientId: string, blueprintId?: string, labelEs?: string) => {
      setAlertsLoading(true);
      try {
        const res = await fetchPatientClinicalAlerts(patientId, { blueprintId });
        setClinicalAlerts(res.alerts);
        setAlertContextLabel(labelEs);
      } catch {
        setClinicalAlerts([]);
        setAlertContextLabel(undefined);
      } finally {
        setAlertsLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (!activePatient?.id) {
      setClinicalAlerts([]);
      setAlertContextLabel(undefined);
      return;
    }
    const blueprintId =
      lastResult?.status === 'resolved'
        ? INTENT_TO_ASSIST_BLUEPRINT[lastResult.intent]
        : undefined;
    const label =
      lastResult?.status === 'resolved' ? lastResult.labelEs : undefined;
    void loadClinicalAlerts(activePatient.id, blueprintId, label);
  }, [activePatient?.id, lastResult, loadClinicalAlerts]);

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

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        px: 2,
        py: 3,
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ maxWidth: 720, mx: 'auto', mb: 4 }}>
        <Chip label={copy.demoBadge} size="small" color="warning" variant="outlined" />
        <Button size="small" color="inherit" onClick={logout}>
          Cerrar sesión
        </Button>
      </Stack>

      <Stack
        spacing={4}
        alignItems="center"
        data-testid="epis2-command-center"
        sx={{ maxWidth: 720, mx: 'auto' }}
      >
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
          <PowerBar
            label={copy.commandCenter.powerBarLabel}
            placeholder={copy.commandCenter.powerBarPlaceholder}
            submitLabel={isResolving ? copy.commandCenter.resolving : copy.commandCenter.submit}
            value={query}
            onChange={setQuery}
            onSubmit={() => void submit()}
            error={error}
          />
        </Box>

        <Paper variant="outlined" sx={{ p: 2, width: '100%' }} data-testid="epis2-active-patient-panel">
          <Typography variant="subtitle2" gutterBottom>
            {copy.activePatient.commandPanelTitle}
          </Typography>
          <Box sx={{ mb: 2 }}>
            <ActivePatientBanner />
          </Box>
          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: patients.length ? 1 : 0 }}>
            <Button size="small" variant="outlined" onClick={() => void loadPatients()}>
              {copy.activePatient.pickPatient}
            </Button>
            {activePatient ? (
              <Button
                size="small"
                onClick={() =>
                  void navigate({
                    to: '/espacio/ficha',
                    search: { patientId: activePatient.id },
                  })
                }
              >
                {copy.activePatient.workspace}
              </Button>
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
        </Paper>

        {activePatient ? (
          <ClinicalAlertsPanel
            alerts={clinicalAlerts}
            loading={alertsLoading}
            hintBlueprintLabel={alertContextLabel}
          />
        ) : null}

        <CommandSuggestionChips
          onSelect={(cmd) => {
            setQuery(cmd);
            setError(undefined);
          }}
        />

        {lastResult && lastResult.status === 'resolved' ? (
          <Paper variant="outlined" sx={{ p: 2, width: '100%' }}>
            <Typography variant="subtitle2" gutterBottom>
              {copy.commandCenter.previewTitle}
            </Typography>
            <Typography variant="body2">
              {lastResult.labelEs} → {lastResult.routePath}
            </Typography>
            <Alert severity="success" sx={{ mt: 2 }}>
              {copy.commandCenter.resolvedNavigate}
            </Alert>
          </Paper>
        ) : null}

        {lastResult?.status === 'needs_clarification' && lastResult.candidates.length > 0 ? (
          <Paper variant="outlined" sx={{ p: 2, width: '100%' }}>
            <Typography variant="subtitle2" gutterBottom>
              Opciones posibles
            </Typography>
            <Stack direction="row" flexWrap="wrap" gap={1}>
              {lastResult.candidates.map((c) => (
                <Chip key={c.intent} label={c.labelEs} size="small" variant="outlined" />
              ))}
            </Stack>
          </Paper>
        ) : null}
      </Stack>
    </Box>
  );
}
