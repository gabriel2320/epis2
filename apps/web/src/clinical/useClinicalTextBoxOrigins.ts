import {
  attachClinicalTextBoxTraceToDraftBody,
  fieldMetaFromOrigins,
  type DraftFieldTextBoxMeta,
  type DraftFieldTextOrigins,
  type ClinicalTextBoxChangeMeta,
} from '@epis2/clinical-productivity';
import { useCallback, useState } from 'react';

/** Registra meta ClinicalTextBox por campo y la adjunta al body del borrador al guardar. */
export function useClinicalTextBoxOrigins() {
  const [fieldMeta, setFieldMeta] = useState<DraftFieldTextBoxMeta>({});

  const recordFieldOrigin = useCallback((fieldId: string, meta: ClinicalTextBoxChangeMeta) => {
    setFieldMeta((prev) => ({ ...prev, [fieldId]: meta }));
  }, []);

  const attachToDraftBody = useCallback(
    (body: Record<string, unknown>) => attachClinicalTextBoxTraceToDraftBody(body, fieldMeta),
    [fieldMeta],
  );

  const resetOrigins = useCallback(() => setFieldMeta({}), []);

  const loadFieldMeta = useCallback((next: DraftFieldTextBoxMeta) => {
    setFieldMeta(next);
  }, []);

  const loadOrigins = useCallback((next: DraftFieldTextOrigins) => {
    setFieldMeta(fieldMetaFromOrigins(next));
  }, []);

  const origins = Object.fromEntries(
    Object.entries(fieldMeta).map(([fieldId, entry]) => [fieldId, entry.origin]),
  );

  return {
    fieldMeta,
    origins,
    recordFieldOrigin,
    attachToDraftBody,
    resetOrigins,
    loadOrigins,
    loadFieldMeta,
  };
}
