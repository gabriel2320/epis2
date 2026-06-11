import { useCallback, useEffect, useRef, useState } from 'react';
import {
  fetchPaperChartDraft,
  patchPaperChartSection,
  type PaperChartSections,
} from '../api/clinicalApi.js';
import type { PaperChartSectionId } from '../components/chart/paper/paperChartSections.js';

const SAVE_DEBOUNCE_MS = 600;

/** Borrador ficha papel — persistencia PostgreSQL vía API (ADR-002 MF-DUAL-CHART-02). */
export function usePaperChartDraft(patientId: string | undefined) {
  const [values, setValues] = useState<Partial<Record<PaperChartSectionId, string>>>({});
  const [loading, setLoading] = useState(Boolean(patientId));
  const [error, setError] = useState<string | undefined>();
  const pendingRef = useRef<Map<PaperChartSectionId, string>>(new Map());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!patientId) {
      setValues({});
      setLoading(false);
      return;
    }
    setLoading(true);
    void fetchPaperChartDraft(patientId)
      .then((res) => {
        setValues(res.sections as PaperChartSections);
        setError(undefined);
      })
      .catch(() => setError('No se pudo cargar la ficha papel'))
      .finally(() => setLoading(false));
  }, [patientId]);

  const flushPending = useCallback(async () => {
    if (!patientId || pendingRef.current.size === 0) return;
    const entries = [...pendingRef.current.entries()];
    pendingRef.current.clear();
    for (const [sectionId, body] of entries) {
      try {
        const res = await patchPaperChartSection(patientId, sectionId, body);
        setValues(res.sections);
        setError(undefined);
      } catch {
        setError('No se pudo guardar la sección');
      }
    }
  }, [patientId]);

  const scheduleSave = useCallback(
    (sectionId: PaperChartSectionId, body: string) => {
      if (!patientId) return;
      pendingRef.current.set(sectionId, body);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        void flushPending();
      }, SAVE_DEBOUNCE_MS);
    },
    [patientId, flushPending],
  );

  const onSectionChange = useCallback(
    (sectionId: PaperChartSectionId, body: string) => {
      setValues((prev) => ({ ...prev, [sectionId]: body }));
      scheduleSave(sectionId, body);
    },
    [scheduleSave],
  );

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  return { values, loading, error, onSectionChange };
}
