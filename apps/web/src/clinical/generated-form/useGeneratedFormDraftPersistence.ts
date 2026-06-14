import { BLUEPRINT_DRAFT_TYPES, type ClinicalFormBlueprint } from '@epis2/clinical-forms';
import { copy } from '@epis2/design-system';
import { ApiError } from '../../api/client.js';
import {
  useCreateDraftMutation,
  useUpdateDraftMutation,
} from '../../query/hooks/useDraftMutations.js';
import { useClinicalNavigate } from '../../routes/clinicalNavigate.js';

export type SaveDraftIntent = 'save' | 'sign';

type Options = {
  blueprint: ClinicalFormBlueprint;
  patientId: string | undefined;
  editingDraftId: string | undefined;
  hasEditingDraft: boolean;
  validate: () => Promise<boolean>;
  collectBody: () => Record<string, unknown>;
  onStatus: (message?: string) => void;
  /** MF-DI-09 — validaciones admin extra antes de persistir. */
  validateBeforeSave?: () => Promise<boolean>;
  /** MF-DI-09 — tras guardar borrador (no firma). */
  onDraftSaved?: (payload: { draftId: string; intent: SaveDraftIntent }) => void;
  /** MF-NORM-404: mapea details del envelope a errores RHF; devuelve cuántos aplicó. */
  applyServerErrors?: (error: unknown) => number;
};

/** Persistencia de borradores del formulario generado: crear/actualizar + firmar. */
export function useGeneratedFormDraftPersistence({
  blueprint,
  patientId,
  editingDraftId,
  hasEditingDraft,
  validate,
  collectBody,
  onStatus,
  validateBeforeSave,
  onDraftSaved,
  applyServerErrors,
}: Options) {
  const navigate = useClinicalNavigate();
  const createDraftMutation = useCreateDraftMutation();
  const updateDraftMutation = useUpdateDraftMutation();

  const saveDraft = async (intent: SaveDraftIntent = 'save') => {
    onStatus(undefined);
    const valid = await validate();
    if (!valid) {
      onStatus(copy.forms.validationRequired);
      return;
    }
    if (validateBeforeSave) {
      const adminOk = await validateBeforeSave();
      if (!adminOk) return;
    }
    const persistBody = collectBody();
    const draftType = BLUEPRINT_DRAFT_TYPES[blueprint.blueprintId];
    if (!draftType || !patientId) {
      onStatus(copy.forms.demoValidLocal);
      return;
    }

    const onSaved = (draftId: string) => {
      if (intent === 'sign') {
        void navigate({ to: '/espacio/borrador/$draftId', params: { draftId } });
        return;
      }
      onStatus(copy.forms.draftSaved);
      onDraftSaved?.({ draftId, intent });
    };
    const onError = (e: unknown) => {
      // MF-NORM-404: si el envelope trae errores por campo, marcarlos en el form.
      const appliedToFields = applyServerErrors?.(e) ?? 0;
      if (appliedToFields > 0) {
        onStatus(copy.forms.validationRequired);
        return;
      }
      onStatus(e instanceof ApiError ? e.message : copy.forms.saveDraftError);
    };

    if (editingDraftId && hasEditingDraft) {
      updateDraftMutation.mutate(
        { draftId: editingDraftId, body: { body: persistBody } },
        { onSuccess: (updated) => onSaved(updated.draft.id), onError },
      );
      return;
    }

    createDraftMutation.mutate(
      { patientId, draftType, title: blueprint.label, body: persistBody },
      { onSuccess: (created) => onSaved(created.draft.id), onError },
    );
  };

  return {
    saveDraft,
    isSaving: createDraftMutation.isPending || updateDraftMutation.isPending,
  };
}
