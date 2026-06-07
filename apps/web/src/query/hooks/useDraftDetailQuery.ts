import { useQuery } from '@tanstack/react-query';
import { fetchDraftDetail } from '../../api/clinicalApi.js';
import { queryKeys } from '../queryKeys.js';

export function useDraftDetailQuery(draftId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.drafts.detail(draftId ?? ''),
    queryFn: () => fetchDraftDetail(draftId!),
    enabled: Boolean(draftId),
  });
}
