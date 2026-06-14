import {
  canSignPaperChart,
  emptyPaperChartDraft,
  paperChartFieldValues,
  paperChartSignBlockMessage,
  type PaperChartDraftBody,
} from '@epis2/clinical-forms';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  approvePaperChartDraft,
  fetchPaperChartDraft,
  patchPaperChartSection,
  type PaperChartFieldState,
  type PaperChartSectionPatchRequest,
} from '../api/clinicalApi.js';
import type { PaperChartSectionId } from '../components/chart/paper/paperChartSections.js';

const SAVE_DEBOUNCE_MS = 600;

/** Borrador ficha papel — persistencia PostgreSQL + metadatos IA (MF-PAPER-03). */
export function usePaperChartDraft(patientId: string | undefined) {
  const [fields, setFields] = useState<PaperChartDraftBody>(() => emptyPaperChartDraft());
  const [draftId, setDraftId] = useState<string | undefined>();
  const [readOnly, setReadOnly] = useState(false);
  const [loading, setLoading] = useState(Boolean(patientId));
  const [saving, setSaving] = useState(false);
  const [signing, setSigning] = useState(false);
  const [notice, setNotice] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  const pendingRef = useRef<Map<PaperChartSectionId, PaperChartSectionPatchRequest>>(new Map());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const values = useMemo(() => paperChartFieldValues(fields), [fields]);
  const canSign = useMemo(() => canSignPaperChart(fields).ok && !readOnly, [fields, readOnly]);
  const signBlockMessage = useMemo(() => paperChartSignBlockMessage(fields), [fields]);
  const unconfirmedAiCount = useMemo(
    () => Object.values(fields).filter((f) => f.source === 'ai_draft' && !f.confirmed).length,
    [fields],
  );
  const aiPendingSections = useMemo(() => {
    const flags: Partial<Record<PaperChartSectionId, boolean>> = {};
    for (const [id, field] of Object.entries(fields) as [
      PaperChartSectionId,
      PaperChartFieldState,
    ][]) {
      if (field.source === 'ai_draft' && !field.confirmed) flags[id] = true;
    }
    return flags;
  }, [fields]);

  const applyServerSections = useCallback(
    (sections: Record<PaperChartSectionId, PaperChartFieldState>) => {
      setFields(normalizeSectionsResponse(sections));
    },
    [],
  );

  useEffect(() => {
    if (!patientId) {
      setFields(emptyPaperChartDraft());
      setDraftId(undefined);
      setReadOnly(false);
      setLoading(false);
      return;
    }
    setLoading(true);
    void fetchPaperChartDraft(patientId)
      .then((res) => {
        applyServerSections(res.sections);
        setDraftId(res.draftId);
        setReadOnly(res.readOnly);
        setError(undefined);
      })
      .catch(() => setError('No se pudo cargar la ficha papel'))
      .finally(() => setLoading(false));
  }, [patientId, applyServerSections]);

  const flushPending = useCallback(async () => {
    if (!patientId || pendingRef.current.size === 0) return true;
    const entries = [...pendingRef.current.entries()];
    pendingRef.current.clear();
    setSaving(true);
    try {
      for (const [, patch] of entries) {
        const res = await patchPaperChartSection(patientId, patch);
        applyServerSections(res.sections);
        setDraftId(res.draftId);
        setError(undefined);
      }
      return true;
    } catch {
      setError('No se pudo guardar la sección');
      return false;
    } finally {
      setSaving(false);
    }
  }, [patientId, applyServerSections]);

  const saveNow = useCallback(async () => {
    if (!patientId) return false;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    const ok = await flushPending();
    if (ok) setNotice(undefined);
    return ok;
  }, [patientId, flushPending]);

  const scheduleSave = useCallback(
    (patch: PaperChartSectionPatchRequest) => {
      if (!patientId || readOnly) return;
      pendingRef.current.set(patch.sectionId, patch);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        void flushPending();
      }, SAVE_DEBOUNCE_MS);
    },
    [patientId, readOnly, flushPending],
  );

  const onSectionChange = useCallback(
    (sectionId: PaperChartSectionId, body: string) => {
      if (readOnly) return;
      setFields((prev) => ({
        ...prev,
        [sectionId]: { value: body, source: 'human', confirmed: true },
      }));
      scheduleSave({ sectionId, body });
    },
    [readOnly, scheduleSave],
  );

  const confirmSection = useCallback(
    (sectionId: PaperChartSectionId) => {
      if (readOnly) return;
      setFields((prev) => {
        const current = prev[sectionId];
        scheduleSave({
          sectionId,
          body: current.value,
          confirmed: true,
        });
        return {
          ...prev,
          [sectionId]: { ...current, source: 'human', confirmed: true },
        };
      });
    },
    [readOnly, scheduleSave],
  );

  const applyAiDraft = useCallback(
    (sectionId: PaperChartSectionId, body: string) => {
      if (readOnly) return;
      setFields((prev) => ({
        ...prev,
        [sectionId]: { value: body, source: 'ai_draft', confirmed: false },
      }));
      scheduleSave({ sectionId, body, source: 'ai_draft' });
    },
    [readOnly, scheduleSave],
  );

  const signDraft = useCallback(async () => {
    if (!patientId || readOnly) return { ok: false as const, reason: 'readonly' as const };
    if (!canSignPaperChart(fields).ok) {
      return { ok: false as const, reason: 'ai_pending' as const };
    }
    const saved = await saveNow();
    if (!saved) return { ok: false as const, reason: 'save_failed' as const };
    setSigning(true);
    setError(undefined);
    try {
      const res = await approvePaperChartDraft(patientId);
      setDraftId(res.draftId);
      setReadOnly(true);
      return { ok: true as const, noteId: res.noteId };
    } catch {
      setError('No se pudo firmar el documento');
      return { ok: false as const, reason: 'approve_failed' as const };
    } finally {
      setSigning(false);
    }
  }, [patientId, readOnly, fields, saveNow]);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  return {
    fields,
    values,
    draftId,
    readOnly,
    loading,
    saving,
    signing,
    notice,
    error,
    onSectionChange,
    confirmSection,
    applyAiDraft,
    saveNow,
    signDraft,
    canSign,
    signBlockMessage,
    unconfirmedAiCount,
    aiPendingSections,
    setNotice,
  };
}

function normalizeSectionsResponse(sections: Record<PaperChartSectionId, PaperChartFieldState>) {
  const base = emptyPaperChartDraft();
  for (const id of Object.keys(base) as PaperChartSectionId[]) {
    const raw = sections[id];
    if (!raw) continue;
    base[id] = {
      value: raw.value ?? '',
      source: raw.source ?? 'human',
      confirmed: raw.confirmed ?? true,
    };
  }
  return base;
}
