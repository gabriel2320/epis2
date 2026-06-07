import { useQuery } from '@tanstack/react-query';
import { listDrafts } from '../../api/clinicalApi.js';
import { queryKeys } from '../queryKeys.js';

export function useDraftsQuery(params?: { patientId?: string; status?: string }, enabled = true) {
  return useQuery({
    queryKey: queryKeys.drafts.list(params),
    queryFn: () => listDrafts(params),
    enabled,
    select: (data) => data.drafts,
  });
}
