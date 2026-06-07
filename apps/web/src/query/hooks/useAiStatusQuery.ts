import { useQuery } from '@tanstack/react-query';
import { fetchAiStatus } from '../../api/aiApi.js';
import { queryKeys } from '../queryKeys.js';

export function useAiStatusQuery() {
  const query = useQuery({
    queryKey: queryKeys.ai.status(),
    queryFn: fetchAiStatus,
    select: (data) => data.available,
  });

  return {
    aiAvailable: query.data ?? null,
    isLoading: query.isLoading,
    refetch: query.refetch,
  };
}
