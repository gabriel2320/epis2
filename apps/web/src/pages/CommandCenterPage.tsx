import { copy } from '@epis2/design-system';

import { getCommandBarAiHint } from '@epis2/command-registry';

import { ClinicalGlobalTopBar } from '../layouts/ClinicalGlobalTopBar.js';

import {

  EpisAppShellLayout,

  EpisButton,

  EpisChip,

  EpisCommandCenterHero,

  EpisCommandCenterLayout,

  EpisCommandResult,

  EpisFloatingCommandDock,

  Stack,

} from '@epis2/epis2-ui';

import { useCallback, useState } from 'react';

import { INTENT_TO_ASSIST_BLUEPRINT } from '../api/clinicalApi.js';

import { useAiStatusQuery } from '../query/hooks/useAiStatusQuery.js';

import { useAuth } from '../auth/AuthContext.js';

import { useActivePatient } from '../clinical/ActivePatientContext.js';

import { useClinicalCommandSubmit } from '../clinical/useClinicalCommandSubmit.js';

import { useCommandResolveContext } from '../clinical/useCommandResolveContext.js';

import { Epis2NavigationRailFooter, useEpis2NavigationRailItems } from '../navigation/epis2NavigationRail.js';

import { usePatientClinicalAlerts } from '../clinical/usePatientClinicalAlerts.js';

import { useClinicalNavigate } from '../routes/clinicalNavigate.js';

import { CommandCenterMinimalBlocks } from '../components/CommandCenterMinimalBlocks.js';

import { CommandCenterContextLine } from '../components/CommandCenterContextLine.js';

import { CommandConfirmationDialog } from '../components/CommandConfirmationDialog.js';

import { DemoNarrativeWalkthroughPanel } from '../components/DemoNarrativeWalkthroughPanel.js';

import { isDemoNarrativesEnabled } from '../dev/demoNarrativesEnv.js';

import { getDemoCaseByCode, type DemoNarrativeEpisode } from '@epis2/test-fixtures';



export function CommandCenterPage() {

  const { session } = useAuth();

  const { patient: activePatient, setPatient } = useActivePatient();

  const navigate = useClinicalNavigate();

  const railItems = useEpis2NavigationRailItems();

  const [demoPanelOpen, setDemoPanelOpen] = useState(false);

  const { aiAvailable } = useAiStatusQuery();

  const demoNarrativesEnabled = isDemoNarrativesEnabled();



  const role = session?.user.role ?? 'physician';

  const permissions = session?.permissions ?? [];

  const roleDisplay = copy.roles[role as keyof typeof copy.roles] ?? role;

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

    lastResult?.status === 'resolved'

      ? INTENT_TO_ASSIST_BLUEPRINT[lastResult.intent]

      : undefined;

  const alertContextLabel =

    lastResult?.status === 'resolved' ? lastResult.labelEs : undefined;



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



  return (

    <EpisAppShellLayout

      railItems={railItems}

      railFooter={<Epis2NavigationRailFooter />}

      railHidden

      appBar={<ClinicalGlobalTopBar active="command" />}

      testId="epis2-command-shell"

    >

      <EpisCommandCenterLayout>

        <EpisCommandCenterHero

          role={role}

          permissions={permissions}

          aiAvailable={aiAvailable === true}

          onSelect={selectSuggestion}

          contextSlot={<CommandCenterContextLine />}

        />

        <CommandCenterMinimalBlocks />



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

            <EpisButton

              size="small"

              appearance="tonal"

              onClick={() => void navigate({ to: '/espacio/ficha' })}

            >

              {copy.activePatient.pickPatient}

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



        <CommandConfirmationDialog

          pending={pendingConfirmation}

          onConfirm={() => void confirmPending()}

          onCancel={cancelPending}

        />

      </EpisCommandCenterLayout>



      <EpisFloatingCommandDock

        prompt={copy.commandCenter.title}

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

        compact

      />

    </EpisAppShellLayout>

  );

}


