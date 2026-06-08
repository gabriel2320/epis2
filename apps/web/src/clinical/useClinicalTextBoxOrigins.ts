import {
  attachTextOriginsToDraftBody,
  type DraftFieldTextOrigins,
  type ClinicalTextBoxChangeMeta,
} from '@epis2/clinical-productivity';
import { useCallback, useState } from 'react';

/** Registra origen por campo ClinicalTextBox y lo adjunta al body del borrador al guardar. */
export function useClinicalTextBoxOrigins() {
  const [origins, setOrigins] = useState<DraftFieldTextOrigins>({});

  const recordFieldOrigin = useCallback((fieldId: string, meta: ClinicalTextBoxChangeMeta) => {
    setOrigins((prev) => ({ ...prev, [fieldId]: meta.origin }));
  }, []);

  const attachToDraftBody = useCallback(
    (body: Record<string, unknown>) => attachTextOriginsToDraftBody(body, origins),
    [origins],
  );

  const resetOrigins = useCallback(() => setOrigins({}), []);

  const loadOrigins = useCallback((next: DraftFieldTextOrigins) => {
    setOrigins(next);
  }, []);

  return { origins, recordFieldOrigin, attachToDraftBody, resetOrigins, loadOrigins };
}
