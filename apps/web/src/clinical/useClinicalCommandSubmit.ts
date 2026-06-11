import type { CommandResolveResponse } from '@epis2/contracts';
import { copy } from '@epis2/design-system';
import type { CommandActiveContext } from '@epis2/command-registry';
import {
  resolveAssistBlueprintForIntent,
  shouldInvokeCommandAssistDraft,
  stashCommandAssistDraft,
} from '@epis2/local-ai/commandAssistDraft';
import { useCallback, useState } from 'react';
import { fetchAiStatus, requestDraftAssist } from '../api/aiApi.js';
import { ApiError } from '../api/client.js';
import { resolveCommand as resolveCommandApi } from '../api/commandApi.js';
import { formSearchFromCommandSlots } from './commandFormSearch.js';
import { navigateClinicalCommandResult } from './navigateClinicalCommandResult.js';
import type { ClinicalFormRoutePath, ClinicalNavigateFn } from '../routes/clinicalNavigate.js';
import { useClinicalNavigate } from '../routes/clinicalNavigate.js';

type UseClinicalCommandSubmitOptions = {
  patientId?: string | undefined;
  commandContext?: CommandActiveContext | undefined;
  onResolved?:
    | ((result: Extract<CommandResolveResponse, { status: 'resolved' }>) => void)
    | undefined;
  onNeedsPatient?: (() => void) | undefined;
};

async function navigateResolvedWithAssistDraft(
  navigate: ClinicalNavigateFn,
  result: Extract<CommandResolveResponse, { status: 'resolved' }>,
  patientId: string | undefined,
  commandText: string,
): Promise<void> {
  const blueprintId = resolveAssistBlueprintForIntent(result.intent);
  let assistDraft = false;

  if (blueprintId && patientId) {
    try {
      const aiStatus = await fetchAiStatus();
      if (shouldInvokeCommandAssistDraft(result.intent, aiStatus.available)) {
        const assist = await requestDraftAssist({
          blueprintId,
          patientId,
          context: { source: 'command_bar', commandText },
        });
        if (assist.status === 'success') {
          stashCommandAssistDraft(blueprintId, assist.suggestedFields, assist.runId);
          assistDraft = true;
        }
      }
    } catch {
      /* Degradación sin Ollama — navegación manual */
    }
  }

  if (assistDraft && result.routePath !== '/epis2/dashboard') {
    const search = {
      ...formSearchFromCommandSlots(patientId, result.slots),
      assistDraft: true as const,
    };
    navigate({
      to: result.routePath as ClinicalFormRoutePath,
      search,
    });
    return;
  }

  navigateClinicalCommandResult(navigate, result, patientId);
}

export function useClinicalCommandSubmit(options: UseClinicalCommandSubmitOptions = {}) {
  const { patientId, commandContext, onResolved, onNeedsPatient } = options;
  const navigate = useClinicalNavigate();
  const [query, setQuery] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [isResolving, setIsResolving] = useState(false);
  const [lastResult, setLastResult] = useState<CommandResolveResponse | null>(null);
  const [pendingConfirmation, setPendingConfirmation] = useState<Extract<
    CommandResolveResponse,
    { status: 'needs_confirmation' }
  > | null>(null);
  const [pendingText, setPendingText] = useState('');

  const handleResult = useCallback(
    async (result: CommandResolveResponse, trimmed: string) => {
      setLastResult(result);
      if (result.status === 'resolved') {
        setPendingConfirmation(null);
        onResolved?.(result);
        await navigateResolvedWithAssistDraft(navigate, result, patientId, trimmed);
        return;
      }
      if (result.status === 'needs_confirmation') {
        setPendingConfirmation(result);
        setPendingText(trimmed);
        setError(undefined);
        return;
      }
      setPendingConfirmation(null);
      if (result.status === 'needs_patient') {
        setError(copy.commandCenter.needsPatient);
        onNeedsPatient?.();
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
    },
    [navigate, onNeedsPatient, onResolved, patientId],
  );

  const submit = useCallback(
    async (overrideText?: string, submitOptions?: { confirmed?: boolean }) => {
      const trimmed = (overrideText ?? query).trim();
      if (!trimmed) {
        setError(copy.commandCenter.emptyCommand);
        setLastResult(null);
        setPendingConfirmation(null);
        return;
      }
      setError(undefined);
      setIsResolving(true);
      if (!submitOptions?.confirmed) {
        setLastResult(null);
        setPendingConfirmation(null);
      }
      try {
        const resolveBody: Parameters<typeof resolveCommandApi>[0] = { text: trimmed };
        if (patientId) resolveBody.patientId = patientId;
        if (commandContext) resolveBody.context = commandContext;
        if (submitOptions?.confirmed) resolveBody.confirmed = true;
        const result = await resolveCommandApi(resolveBody);
        await handleResult(result, trimmed);
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
    },
    [query, patientId, commandContext, handleResult, navigate],
  );

  const confirmPending = useCallback(() => {
    if (!pendingConfirmation) return;
    void submit(pendingText, { confirmed: true });
  }, [pendingConfirmation, pendingText, submit]);

  const cancelPending = useCallback(() => {
    setPendingConfirmation(null);
    setPendingText('');
  }, []);

  return {
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
  };
}

/** @internal export for tests — navegación post-comando con assist opcional. */
export { navigateResolvedWithAssistDraft };
