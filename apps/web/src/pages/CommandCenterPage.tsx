import { copy } from '@epis2/design-system';

import { getCommandBarAiHint } from '@epis2/command-registry';

import { EpisAppScaffold } from '../components/layout/EpisAppScaffold.js';
import { EpisTopAppBar } from '../components/layout/EpisTopAppBar.js';
import { EpisCommandCenterGoogleBar } from '../components/command-center/EpisCommandCenterGoogleBar.js';

import { EpisButton, EpisCommandCenterLayout, Alert, Stack, Typography } from '@epis2/epis2-ui';

import { useCallback, useEffect, useState } from 'react';
import { useSearch } from '@tanstack/react-router';

import { INTENT_TO_ASSIST_BLUEPRINT } from '../api/clinicalApi.js';

import { useAiStatusQuery } from '../query/hooks/useAiStatusQuery.js';

import { useAuth } from '../auth/AuthContext.js';

import { useActivePatient } from '../clinical/ActivePatientContext.js';

import { useClinicalCommandSubmit } from '../clinical/useClinicalCommandSubmit.js';

import { useCommandResolveContext } from '../clinical/useCommandResolveContext.js';

import {
  Epis2NavigationRailFooter,
  useEpis2NavigationRailItems,
} from '../navigation/epis2NavigationRail.js';

import { usePatientClinicalAlerts } from '../clinical/usePatientClinicalAlerts.js';

import { useClinicalNavigate } from '../routes/clinicalNavigate.js';

import { useEpisSession } from '../session/EpisSessionContext.js';

import { CommandCenterRecentActivity } from '../components/CommandCenterRecentActivity.js';

import { ClinicalShellCommandPalette } from '../components/ClinicalShellCommandPalette.js';

import { CommandCenterContextLine } from '../components/CommandCenterContextLine.js';

import { CommandConfirmationDialog } from '../components/CommandConfirmationDialog.js';

import { DemoNarrativeWalkthroughPanel } from '../components/DemoNarrativeWalkthroughPanel.js';

import { isDemoNarrativesEnabled } from '../dev/demoNarrativesEnv.js';

import { getDemoCaseByCode, type DemoNarrativeEpisode } from '@epis2/test-fixtures';

/** Launcher delgado census-first — búsqueda paciente sin hero dashboard (MF-08/09). */
function CommandLauncherSlim({
  onOpenCensus,
  onOpenFicha,
  patientId,
}: {
  onOpenCensus: () => void;
  onOpenFicha?: (() => void) | undefined;
  patientId?: string | undefined;
}) {
  return (
    <Stack
      spacing={2}
      data-testid="epis2-command-launcher-slim"
      data-layout="slim census-first search-only"
      sx={{ width: '100%', mb: 2 }}
    >
      <Stack spacing={0.5}>
        <Typography variant="h5" component="h1">
          {copy.commandCenter.censusTitle}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {copy.commandCenter.censusSubtitle}
        </Typography>
      </Stack>
      <Stack direction="row" spacing={1} flexWrap="wrap">
        <EpisButton appearance="filled" onClick={onOpenCensus} data-testid="epis2-census-open-search">
          {copy.commandCenter.censusOpenSearch}
        </EpisButton>
        {patientId && onOpenFicha ? (
          <EpisButton appearance="outlined" onClick={onOpenFicha} data-testid="epis2-census-open-ficha">
            {copy.chartModes.traditional}
          </EpisButton>
        ) : null}
      </Stack>
      <Typography variant="caption" color="text.secondary">
        {copy.commandCenter.slimLauncherHint}
      </Typography>
    </Stack>
  );
}

export function CommandCenterPage() {
  const { session } = useAuth();
  const { patient: activePatient, setPatient } = useActivePatient();
  const navigate = useClinicalNavigate();
  const { openClassicMode } = useEpisSession();
  const search = useSearch({ strict: false }) as {
    intent?: string;
    nextMode?: string;
  };
  const selectPatientIntent = search.intent === 'selectPatient' && search.nextMode === 'classic';
  const railItems = useEpis2NavigationRailItems();
  const [demoPanelOpen, setDemoPanelOpen] = useState(false);
  const { aiAvailable } = useAiStatusQuery();
  const demoNarrativesEnabled = isDemoNarrativesEnabled();

  const role = session?.user.role ?? 'physician';
  const permissions = session?.permissions ?? [];
  const aiHint = getCommandBarAiHint(role, aiAvailable === true);
  const commandContext = useCommandResolveContext('command_center');

  const {
    query,
    setQuery,
    error,
    setError,
    isResolving,
    lastResult,
    pendingConfirmation,
    confirmPending,
    cancelPending,
    submit,
  } = useClinicalCommandSubmit({
    patientId: activePatient?.id,
    commandContext,
    onResolved: (result) => {
      void result;
    },
  });

  const alertBlueprintId =
    lastResult?.status === 'resolved' ? INTENT_TO_ASSIST_BLUEPRINT[lastResult.intent] : undefined;

  const alertContextLabel = lastResult?.status === 'resolved' ? lastResult.labelEs : undefined;

  usePatientClinicalAlerts({
    patientId: activePatient?.id,
    blueprintId: alertBlueprintId,
    contextLabel: alertContextLabel,
  });

  const selectDemoEpisode = useCallback(
    (episode: DemoNarrativeEpisode) => {
      const demo = getDemoCaseByCode(episode.demoCaseCode);
      if (!demo) return;
      setPatient({
        id: demo.patientId,
        displayName: demo.displayName,
        demoCaseCode: demo.demoCaseCode,
        isSynthetic: true,
      });
      setQuery(episode.suggestedCommandEs);
      setError(undefined);
    },
    [setPatient, setError, setQuery],
  );

  const selectSuggestion = useCallback(
    (command: string) => {
      setQuery(command);
      setError(undefined);
    },
    [setQuery, setError],
  );

  useEffect(() => {
    if (selectPatientIntent && activePatient?.id) {
      openClassicMode(activePatient.id);
    }
  }, [activePatient?.id, openClassicMode, selectPatientIntent]);

  return (
    <>
      <EpisAppScaffold
        screenKind="command"
        topBar={<EpisTopAppBar active="command" />}
        sideNavItems={railItems}
        sideNavFooter={<Epis2NavigationRailFooter />}
        railHidden
        testId="epis2-command-shell"
      >
        <EpisCommandCenterLayout maxWidth={720} reserveDockSpace={false}>
          <CommandLauncherSlim
            onOpenCensus={() => void navigate({ to: '/espacio/buscar-paciente' })}
            onOpenFicha={
              activePatient?.id
                ? () =>
                    void navigate({
                      to: '/espacio/ficha',
                      search: { patientId: activePatient.id, chartMode: 'traditional' },
                    })
                : undefined
            }
            patientId={activePatient?.id}
          />
          <EpisCommandCenterGoogleBar
            role={role}
            permissions={permissions}
            aiAvailable={aiAvailable === true}
            query={query}
            onQueryChange={setQuery}
            onSubmit={() => void submit()}
            onSelectSuggestion={selectSuggestion}
            isResolving={isResolving}
            {...(error ? { error } : {})}
            {...(error ? {} : { aiHint: aiHint ?? undefined })}
            contextSlot={activePatient ? <CommandCenterContextLine /> : null}
            clarificationCandidates={
              lastResult?.status === 'needs_clarification' ? lastResult.candidates : undefined
            }
            onClarificationSelect={(label) => void submit(label)}
            footerSlot={
              <>
                {selectPatientIntent && !activePatient ? (
                  <Alert severity="info" data-testid="epis2-select-patient-for-classic">
                    {copy.threeModes.selectPatientForClassic}
                  </Alert>
                ) : null}

                <CommandCenterRecentActivity />

                {error === copy.commandCenter.needsPatient ||
                lastResult?.status === 'needs_patient' ? (
                  <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ width: '100%' }}>
                    <EpisButton
                      size="small"
                      appearance="outlined"
                      onClick={() => void navigate({ to: '/espacio/buscar-paciente' })}
                    >
                      {copy.commandCenter.pickPatientToContinue}
                    </EpisButton>
                  </Stack>
                ) : null}

                {demoNarrativesEnabled ? (
                  <Stack direction="row" justifyContent="center" sx={{ width: '100%' }}>
                    <EpisButton
                      appearance="text"
                      size="small"
                      onClick={() => setDemoPanelOpen((open) => !open)}
                      data-testid="epis2-toggle-demo-narratives"
                    >
                      {demoPanelOpen
                        ? copy.commandCenter.demoNarrativesToggleHide
                        : copy.commandCenter.demoNarrativesToggleShow}
                    </EpisButton>
                  </Stack>
                ) : null}

                {demoNarrativesEnabled && demoPanelOpen ? (
                  <DemoNarrativeWalkthroughPanel onSelectEpisode={selectDemoEpisode} />
                ) : null}
              </>
            }
          />

          <CommandConfirmationDialog
            pending={pendingConfirmation}
            onConfirm={() => void confirmPending()}
            onCancel={cancelPending}
          />
        </EpisCommandCenterLayout>
      </EpisAppScaffold>
      <ClinicalShellCommandPalette />
    </>
  );
}
