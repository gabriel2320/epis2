import type { PatchOperationalMemoryRequest } from '@epis2/contracts';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import {
  fetchOperationalMemory,
  patchOperationalMemory,
  bumpCatalogUsage,
} from '../api/userOperationalMemoryApi.js';
import { queryKeys } from '../query/queryKeys.js';
import { hydrateRecentPatientsFromServer, readRecentPatients } from './recentPatients.js';
import type { TraditionalSectionId } from '../components/chart/TraditionalSectionNav.js';

export type UseOperationalMemoryOptions = {
  patientId?: string | undefined;
  enabled?: boolean | undefined;
};

/** MF-DI-02 — memoria operacional (sección ficha, recientes, favoritos). */
export function useOperationalMemory(options: UseOperationalMemoryOptions = {}) {
  const queryClient = useQueryClient();
  const enabled = options.enabled !== false;

  const query = useQuery({
    queryKey: queryKeys.user.operationalMemory(options.patientId),
    queryFn: () => fetchOperationalMemory(options.patientId),
    enabled,
    staleTime: 30_000,
  });

  const patchMutation = useMutation({
    mutationFn: (patch: PatchOperationalMemoryRequest) =>
      patchOperationalMemory(patch, options.patientId),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.user.operationalMemory(options.patientId), data);
      if (data.global.recentPatients.length > 0) {
        hydrateRecentPatientsFromServer(data.global.recentPatients);
      }
    },
  });

  const savedTraditionalSection = useMemo(() => {
    const section = query.data?.patient?.traditionalSection;
    return section as TraditionalSectionId | undefined;
  }, [query.data?.patient?.traditionalSection]);

  const saveTraditionalSection = useCallback(
    (section: TraditionalSectionId) => {
      if (!options.patientId) return;
      patchMutation.mutate({ traditionalSection: section });
    },
    [options.patientId, patchMutation],
  );

  const toggleFavoriteBlueprint = useCallback(
    (blueprintId: string) => {
      const current = query.data?.global.favoriteBlueprintIds ?? [];
      const next = current.includes(blueprintId)
        ? current.filter((id) => id !== blueprintId)
        : [...current, blueprintId];
      patchMutation.mutate({ favoriteBlueprintIds: next });
    },
    [query.data?.global.favoriteBlueprintIds, patchMutation],
  );

  const recordCatalogUsage = useCallback(
    (domain: 'medication' | 'laboratory' | 'diagnosis', key: string) => {
      void bumpCatalogUsage({ domain, key }).then((result) => {
        queryClient.setQueryData(
          queryKeys.user.operationalMemory(options.patientId),
          (prev: Awaited<ReturnType<typeof fetchOperationalMemory>> | undefined) =>
            prev
              ? {
                  ...prev,
                  global: { ...prev.global, catalogUsage: result.catalogUsage },
                }
              : prev,
        );
      });
    },
    [options.patientId, queryClient],
  );

  return {
    loading: query.isLoading,
    recentPatients: query.data?.global.recentPatients ?? readRecentPatients(),
    favoriteBlueprintIds: query.data?.global.favoriteBlueprintIds ?? [],
    catalogUsage: query.data?.global.catalogUsage,
    savedTraditionalSection,
    saveTraditionalSection,
    toggleFavoriteBlueprint,
    recordCatalogUsage,
    reload: query.refetch,
  };
}
