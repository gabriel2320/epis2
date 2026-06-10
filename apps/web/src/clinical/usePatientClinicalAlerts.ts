import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { fetchPatientClinicalAlerts } from '../api/clinicalApi.js';
import { queryKeys } from '../query/queryKeys.js';

export type UsePatientClinicalAlertsOptions = {
  patientId?: string | undefined;
  blueprintId?: string | undefined;
  currentFields?: Record<string, string> | undefined;
  contextLabel?: string | undefined;
  debounceMs?: number | undefined;
  enabled?: boolean | undefined;
};

export function usePatientClinicalAlerts(options: UsePatientClinicalAlertsOptions) {
  const fieldsKey = useMemo(
    () => (options.currentFields ? JSON.stringify(options.currentFields) : ''),
    [options.currentFields],
  );

  const [debouncedReady, setDebouncedReady] = useState(
    !options.debounceMs || options.debounceMs <= 0,
  );

  useEffect(() => {
    if (!options.debounceMs || options.debounceMs <= 0) {
      setDebouncedReady(true);
      return;
    }
    setDebouncedReady(false);
    const timer = setTimeout(() => setDebouncedReady(true), options.debounceMs);
    return () => clearTimeout(timer);
  }, [options.patientId, options.blueprintId, fieldsKey, options.debounceMs]);

  const enabled =
    options.enabled !== false && Boolean(options.patientId) && debouncedReady;

  const query = useQuery({
    queryKey: queryKeys.patients.clinicalAlerts(
      options.patientId ?? '',
      options.blueprintId,
      fieldsKey,
    ),
    queryFn: () => {
      const fetchOpts: Parameters<typeof fetchPatientClinicalAlerts>[1] = {};
      if (options.blueprintId !== undefined) fetchOpts.blueprintId = options.blueprintId;
      if (options.currentFields !== undefined) fetchOpts.currentFields = options.currentFields;
      return fetchPatientClinicalAlerts(options.patientId!, fetchOpts);
    },
    enabled,
    placeholderData: (previous) => previous,
  });

  const alerts = query.data?.alerts ?? [];
  const loading = query.isFetching && alerts.length === 0;

  return {
    alerts,
    loading,
    contextLabel: options.contextLabel,
    reload: query.refetch,
  };
}
