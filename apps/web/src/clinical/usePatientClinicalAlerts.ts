import type { ClinicalAlert } from '@epis2/contracts';
import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchPatientClinicalAlerts } from '../api/clinicalApi.js';

export type UsePatientClinicalAlertsOptions = {
  patientId?: string;
  blueprintId?: string;
  currentFields?: Record<string, string>;
  contextLabel?: string;
  debounceMs?: number;
  enabled?: boolean;
};

export function usePatientClinicalAlerts(options: UsePatientClinicalAlertsOptions) {
  const [alerts, setAlerts] = useState<ClinicalAlert[]>([]);
  const [loading, setLoading] = useState(false);
  const [contextLabel, setContextLabel] = useState(options.contextLabel);
  const hasAlertsRef = useRef(false);

  useEffect(() => {
    hasAlertsRef.current = alerts.length > 0;
  }, [alerts]);

  const reload = useCallback(async () => {
    if (!options.patientId) {
      setAlerts([]);
      setContextLabel(undefined);
      return;
    }
    if (!hasAlertsRef.current) {
      setLoading(true);
    }
    try {
      const fetchOpts: Parameters<typeof fetchPatientClinicalAlerts>[1] = {};
      if (options.blueprintId !== undefined) fetchOpts.blueprintId = options.blueprintId;
      if (options.currentFields !== undefined) fetchOpts.currentFields = options.currentFields;
      const res = await fetchPatientClinicalAlerts(options.patientId, fetchOpts);
      setAlerts(res.alerts);
      setContextLabel(options.contextLabel);
    } catch {
      setAlerts([]);
      setContextLabel(undefined);
    } finally {
      setLoading(false);
    }
  }, [options.patientId, options.blueprintId, options.currentFields, options.contextLabel]);

  useEffect(() => {
    if (options.enabled === false) return;
    if (!options.patientId) {
      setAlerts([]);
      return;
    }
    if (options.debounceMs && options.debounceMs > 0) {
      const timer = setTimeout(() => void reload(), options.debounceMs);
      return () => clearTimeout(timer);
    }
    void reload();
  }, [
    options.patientId,
    options.blueprintId,
    options.currentFields,
    options.debounceMs,
    options.enabled,
    reload,
  ]);

  return { alerts, loading, contextLabel, reload };
};
