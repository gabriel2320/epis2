import { QueryClient } from '@tanstack/react-query';

/** Lecturas clínicas: caché corta, revalidación al foco, sin reintentos agresivos. */
export const CLINICAL_QUERY_DEFAULTS = {
  staleTime: 30_000,
  gcTime: 120_000,
  refetchOnWindowFocus: true,
  retry: 1,
} as const;

export function createEpis2QueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        ...CLINICAL_QUERY_DEFAULTS,
      },
    },
  });
}

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });
}
