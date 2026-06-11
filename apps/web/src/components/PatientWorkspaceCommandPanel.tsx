import { copy } from '@epis2/design-system';
import { getCommandBarAiHint } from '@epis2/command-registry';
import { Box, EpisChip, EpisCommandResult, EpisFloatingCommandDock, Stack } from '@epis2/epis2-ui';
import { useAuth } from '../auth/AuthContext.js';
import { CommandConfirmationDialog } from './CommandConfirmationDialog.js';
import { useClinicalCommandSubmit } from '../clinical/useClinicalCommandSubmit.js';
import { useCommandResolveContext } from '../clinical/useCommandResolveContext.js';
import { useAiStatusQuery } from '../query/hooks/useAiStatusQuery.js';

type PatientWorkspaceCommandPanelProps = {
  patientId: string;
  onResolved?: (intent: string, labelEs: string) => void;
};

/** Dock contextual en ficha — sin sugerencias ni duplicar chrome (UX-B.2 / Vista 2). */
export function PatientWorkspaceCommandPanel({
  patientId,
  onResolved,
}: PatientWorkspaceCommandPanelProps) {
  const { session } = useAuth();
  const { aiAvailable } = useAiStatusQuery();
  const role = session?.user.role ?? 'physician';
  const roleDisplay = copy.roles[role as keyof typeof copy.roles] ?? role;
  const aiHint = getCommandBarAiHint(role, aiAvailable === true);
  const commandContext = useCommandResolveContext('patient_chart');

  const {
    query,
    setQuery,
    error,
    isResolving,
    lastResult,
    pendingConfirmation,
    confirmPending,
    cancelPending,
    submit,
  } = useClinicalCommandSubmit({
    patientId,
    commandContext,
    onResolved: (result) => onResolved?.(result.intent, result.labelEs),
  });

  const showClarification =
    lastResult?.status === 'needs_clarification' && lastResult.candidates.length > 0;

  return (
    <div data-testid="epis2-ficha-command-panel">
      {showClarification ? (
        <Stack
          spacing={1}
          sx={{
            position: 'fixed',
            left: 0,
            right: 0,
            bottom: { xs: 168, sm: 152 },
            zIndex: (theme) => theme.zIndex.snackbar - 1,
            px: { xs: 2, sm: 3 },
            pointerEvents: 'none',
            alignItems: 'center',
          }}
        >
          <Box sx={{ pointerEvents: 'auto', maxWidth: 920, width: '100%' }}>
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
          </Box>
        </Stack>
      ) : null}

      <EpisFloatingCommandDock
        compact
        prompt={copy.activePatient.commandIntentTitle}
        label={copy.commandCenter.powerBarLabel}
        placeholder={copy.commandCenter.powerBarPlaceholder}
        submitLabel={isResolving ? copy.commandCenter.resolving : copy.commandCenter.submit}
        value={query}
        onChange={setQuery}
        onSubmit={() => void submit()}
        {...(error !== undefined ? { error } : {})}
        aiAvailable={aiAvailable}
        {...(error === undefined && aiHint !== undefined ? { aiHint } : {})}
        roleLabel={roleDisplay}
        role={role}
        disabled={isResolving}
      />
      {aiHint && error === undefined ? (
        <span data-testid="epis2-ficha-command-ai-hint" hidden>
          {aiHint}
        </span>
      ) : null}

      <CommandConfirmationDialog
        pending={pendingConfirmation}
        onConfirm={() => void confirmPending()}
        onCancel={cancelPending}
      />
    </div>
  );
}
