import type { CommandResolveResponse } from '@epis2/contracts';
import { copy } from '@epis2/design-system';
import { DASHBOARD_TAB_BY_INTENT, getCommandBarAiHint } from '@epis2/command-registry';
import type { ClinicalIntent } from '@epis2/command-registry';
import {
  Box,
  EpisButton,
  EpisCard,
  EpisChip,
  EpisCommandBar,
  EpisCommandCenterLayout,
  EpisCommandResult,
  EpisCommandSuggestions,
  EpisM3Text,
  EpisTopAppBar,
  EpisBrandMark,
  EpisAppearancePreferencesLink,
  EpisThemeModeToggle,
  DashboardIcon,
  GroupsIcon,
  LogoutIcon,
  PersonIcon,
  PersonOutlineIcon,
  ScienceIcon,
  Stack,
  VisibilityIcon,
  VisibilityOffIcon,
} from '@epis2/epis2-ui';
import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '../api/client.js';
import { resolveCommand as resolveCommandApi } from '../api/commandApi.js';
import { fetchAiStatus } from '../api/aiApi.js';
import { INTENT_TO_ASSIST_BLUEPRINT, listPatients, type PatientListRow } from '../api/clinicalApi.js';
import { useAuth } from '../auth/AuthContext.js';
import { useActivePatient } from '../clinical/ActivePatientContext.js';
import { usePatientClinicalAlerts } from '../clinical/usePatientClinicalAlerts.js';
import { useClinicalNavigate, type ClinicalFormRoutePath, type DashboardTab } from '../routes/clinicalNavigate.js';
import { ActivePatientBanner } from '../components/ActivePatientBanner.js';
import { ClinicalAlertsPanel } from '../components/ClinicalAlertsPanel.js';
import { ClinicalWidgetPanel } from '../widgets/ClinicalWidgetPanel.js';

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
  const [patientPanelOpen, setPatientPanelOpen] = useState(false);

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

  const submit = useCallback(async (overrideText?: string) => {
    const trimmed = (overrideText ?? query).trim();
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
            (DASHBOARD_TAB_BY_INTENT[result.intent as ClinicalIntent] ?? 'work') as DashboardTab;
          navigate({
            to: '/epis2/dashboard',
            search: {
              tab,
              ...(tab === 'patient' && activePatient?.id
                ? { patientId: activePatient.id }
                : {}),
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
        setPatientPanelOpen(true);
        return;
      }
      if (result.status === 'needs_clarification') {
        setError(result.message || copy.commandCenter.needsClarification);
        return;
      }
      if (result.status === 'forbidden') {
        void navigate({
          to: '/sin-acceso',
          search: { detail: result.message || copy.commandCenter.forbidden },
        });
        return;
      }
      if (result.status === 'empty') {
        setError(result.message);
      }
    } catch (e) {
      if (e instanceof ApiError && e.status === 403) {
        void navigate({
          to: '/sin-acceso',
          search: { detail: e.message || copy.commandCenter.forbidden },
        });
      } else {
        setError(copy.errors.genericMessage);
      }
    } finally {
      setIsResolving(false);
    }
  }, [query, navigate, activePatient?.id]);

  const header = (
    <EpisTopAppBar
      data-testid="epis2-command-top-bar"
      startAction={
        <EpisChip
          icon={<ScienceIcon />}
          label={copy.demoBadge}
          size="small"
          variant="outlined"
          sx={{ fontWeight: 600, borderColor: 'warning.main', color: 'warning.dark', bgcolor: 'warning.light' }}
        />
      }
      endActions={
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <EpisAppearancePreferencesLink />
          <EpisThemeModeToggle />
          <EpisButton appearance="text" size="small" startIcon={<LogoutIcon />} onClick={logout}>
            {copy.layout.logout}
          </EpisButton>
        </Stack>
      }
    />
  );

  return (
    <EpisCommandCenterLayout header={header}>
      {session ? (
        <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
          <PersonIcon color="primary" fontSize="small" />
          <EpisM3Text role="labelLarge" color="primary.main" textAlign="center">
            {session.user.displayName}
          </EpisM3Text>
        </Stack>
      ) : null}

      <Box sx={{ width: '100%', textAlign: 'center' }}>
        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
          justifyContent="center"
          sx={{ flexWrap: 'wrap', rowGap: 1 }}
        >
          <EpisBrandMark size={44} />
          <EpisM3Text role="displayMedium" component="h1" data-testid="epis2-command-prompt">
            {copy.commandCenter.title}
          </EpisM3Text>
        </Stack>
        <EpisM3Text role="bodyMedium" color="text.secondary" sx={{ mt: 1.5, px: 1, lineHeight: 1.55 }}>
          {copy.commandCenter.subtitle}
        </EpisM3Text>
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
          role={role}
          disabled={isResolving}
        />
      </Box>

      <Stack direction="row" flexWrap="wrap" gap={1} justifyContent="center" sx={{ width: '100%' }}>
        <EpisButton
          appearance="text"
          size="small"
          startIcon={patientPanelOpen ? <VisibilityOffIcon /> : <VisibilityIcon />}
          onClick={() => setPatientPanelOpen((open) => !open)}
          data-testid="epis2-toggle-patient-panel"
        >
          {patientPanelOpen ? copy.commandCenter.hidePatientContext : copy.commandCenter.showPatientContext}
        </EpisButton>
        <EpisButton
          size="small"
          appearance="outlined"
          color="info"
          startIcon={<DashboardIcon />}
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

      {patientPanelOpen ? (
        <EpisCard variant="outlined" sx={{ p: 2, width: '100%' }} data-testid="epis2-active-patient-panel">
          <EpisM3Text role="titleMedium" gutterBottom>
            {copy.activePatient.commandPanelTitle}
          </EpisM3Text>
          <Box sx={{ mb: 2 }}>
            <ActivePatientBanner />
          </Box>
          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: patients.length ? 1 : 0 }}>
            <EpisButton
              size="small"
              appearance="outlined"
              startIcon={<GroupsIcon />}
              onClick={() => void loadPatients()}
            >
              {copy.forms.searchPatients}
            </EpisButton>
            {activePatient ? (
              <EpisButton
                size="small"
                appearance="tonal"
                startIcon={<PersonOutlineIcon />}
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
                <EpisChip
                  key={p.id}
                  icon={<PersonOutlineIcon />}
                  label={p.demoCaseCode ?? p.displayName}
                  title={p.displayName}
                  size="small"
                  variant={activePatient?.id === p.id ? 'filled' : 'outlined'}
                  color={activePatient?.id === p.id ? 'primary' : 'info'}
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
      ) : null}

      {patientPanelOpen && activePatient ? (
        <ClinicalAlertsPanel
          alerts={clinicalAlerts}
          loading={alertsLoading}
          hintBlueprintLabel={contextLabel}
        />
      ) : null}

      {activePatient ? (
        <ClinicalWidgetPanel
          surface="command-center"
          patientId={activePatient.id}
          explicitlyShownWidgetIds={['pending-drafts']}
          data-testid="epis2-command-widget-panel"
        />
      ) : null}

      <EpisCommandSuggestions
        role={role}
        permissions={permissions}
        aiAvailable={aiAvailable === true && hasPermission('ai.read')}
        onSelect={(cmd) => {
          setQuery(cmd);
          setError(undefined);
        }}
      />

      {error === copy.commandCenter.needsPatient ? (
        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ width: '100%' }}>
          <EpisButton
            size="small"
            appearance="outlined"
            onClick={() => void navigate({ to: '/espacio/buscar-paciente' })}
          >
            {copy.commandCenter.pickPatientToContinue}
          </EpisButton>
          <EpisButton
            size="small"
            appearance="tonal"
            onClick={() => {
              setPatientPanelOpen(true);
              void loadPatients();
            }}
          >
            {copy.activePatient.pickPatient}
          </EpisButton>
        </Stack>
      ) : null}

      {lastResult?.status === 'needs_clarification' && lastResult.candidates.length > 0 ? (
        <EpisCommandResult title={copy.commandCenter.clarificationTitle}>
          <Stack direction="row" flexWrap="wrap" gap={1}>
            {lastResult.candidates.map((c) => (
              <EpisChip
                key={c.intent}
                label={c.labelEs}
                size="small"
                variant="outlined"
                clickable
                onClick={() => void submit(c.labelEs)}
              />
            ))}
          </Stack>
        </EpisCommandResult>
      ) : null}
    </EpisCommandCenterLayout>
  );
}
