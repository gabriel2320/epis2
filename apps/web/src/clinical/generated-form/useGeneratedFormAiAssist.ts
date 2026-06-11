import { sanitizeAiSuggestedFields } from '@epis2/clinical-domain';
import { copy } from '@epis2/design-system';
import { consumeCommandAssistDraft } from '@epis2/local-ai/commandAssistDraft';
import { useSearch } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { requestDraftAssist } from '../../api/aiApi.js';
import { ApiError } from '../../api/client.js';
import type { ClinicalFormSearch } from '../../routes/clinicalNavigate.js';

type Options = {
  blueprintId: string;
  collectFields: () => Record<string, string>;
  /** Aplica la sugerencia solo si el campo está vacío (borrador ≠ dato aprobado). */
  applyIfEmpty: (fieldId: string, value: string) => void;
  assistContext: Record<string, string>;
  patientId: string | undefined;
  onStatus: (message?: string) => void;
};

/** Asistencia IA del formulario generado — sugiere borradores, nunca aprueba. */
export function useGeneratedFormAiAssist({
  blueprintId,
  collectFields,
  applyIfEmpty,
  assistContext,
  patientId,
  onStatus,
}: Options) {
  const [isSuggesting, setIsSuggesting] = useState(false);
  const appliedCommandAssistRef = useRef(false);
  const rawSearch = useSearch({ strict: false }) as ClinicalFormSearch;
  const shouldApplyCommandAssist = rawSearch.assistDraft === true;

  useEffect(() => {
    if (!shouldApplyCommandAssist || appliedCommandAssistRef.current) return;
    const pending = consumeCommandAssistDraft(blueprintId);
    if (!pending) return;
    appliedCommandAssistRef.current = true;
    for (const [key, value] of Object.entries(sanitizeAiSuggestedFields(pending.fields))) {
      applyIfEmpty(key, value);
    }
    onStatus(copy.forms.aiApplied);
  }, [applyIfEmpty, blueprintId, onStatus, shouldApplyCommandAssist]);

  const suggestWithAi = async () => {
    setIsSuggesting(true);
    onStatus(undefined);
    try {
      const assistBody: Parameters<typeof requestDraftAssist>[0] = {
        blueprintId,
        currentFields: collectFields(),
        context: { demo: copy.demoBadge, ...assistContext },
      };
      if (patientId !== undefined) assistBody.patientId = patientId;
      const result = await requestDraftAssist(assistBody);
      if (result.status === 'success') {
        for (const [key, value] of Object.entries(
          sanitizeAiSuggestedFields(result.suggestedFields),
        )) {
          applyIfEmpty(key, value);
        }
        onStatus(copy.forms.aiApplied);
        return;
      }
      if (result.status === 'rejected') {
        onStatus(result.message || copy.forms.aiRejected);
        return;
      }
      onStatus(result.message || copy.forms.aiUnavailable);
    } catch (e) {
      if (e instanceof ApiError && (e.status === 503 || e.status === 422)) {
        onStatus(e.message || copy.forms.aiUnavailable);
      } else {
        onStatus(copy.forms.aiUnavailable);
      }
    } finally {
      setIsSuggesting(false);
    }
  };

  return { isSuggesting, suggestWithAi };
}
