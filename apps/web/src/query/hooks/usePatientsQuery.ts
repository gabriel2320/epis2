import { useQuery } from '@tanstack/react-query';
import { listPatients } from '../../api/clinicalApi.js';
import { queryKeys } from '../queryKeys.js';

type UsePatientsQueryOptions = {
  search?: string | undefined;
  enabled?: boolean | undefined;
};

export function usePatientsQuery(options: UsePatientsQueryOptions = {}) {
  const search = options.search?.trim() || undefined;
  const enabled = options.enabled ?? true;

  const query = useQuery({
    queryKey: queryKeys.patients.list(search),
    queryFn: () => listPatients(search),
    enabled,
    select: (data) => data.patients,
  });

  return {
    patients: query.data ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,
  };
}
