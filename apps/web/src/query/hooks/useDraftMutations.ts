import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  approveDraft,
  createDraft,
  updateDraft,
  type ClinicalDraftDetail,
} from '../../api/clinicalApi.js';
import { invalidateClinicalDraftQueries } from '../invalidateClinical.js';

function invalidateFromDraft(
  queryClient: ReturnType<typeof useQueryClient>,
  draft: Pick<ClinicalDraftDetail, 'id' | 'patientId'>,
) {
  invalidateClinicalDraftQueries(queryClient, {
    patientId: draft.patientId,
    draftId: draft.id,
  });
}

export function useCreateDraftMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createDraft,
    onSuccess: (data) => invalidateFromDraft(queryClient, data.draft),
  });
}

export function useUpdateDraftMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ draftId, body }: { draftId: string; body: Parameters<typeof updateDraft>[1] }) =>
      updateDraft(draftId, body),
    onSuccess: (data) => invalidateFromDraft(queryClient, data.draft),
  });
}

export function useApproveDraftMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: approveDraft,
    onSuccess: (data) => invalidateFromDraft(queryClient, data.draft),
  });
}
