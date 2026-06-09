import { copy } from '@epis2/design-system';
import { useSearch } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';
import { readPrintPreview } from '../printPreviewStorage.js';
import { useAuth } from '../../auth/AuthContext.js';
import { fetchPatientDetail, type PatientDetailResponse } from '../../api/clinicalApi.js';

export type PrintPagePatient = {
  patientId: string | undefined;
  /** Valores del formulario guardados en sessionStorage al abrir la vista. */
  values: Record<string, string>;
  error: string | undefined;
  physician: string;
  patientName: string;
};

/** Estado común de las páginas Print* — paciente, preview y profesional (norma §24.1). */
export function usePrintPagePatient(blueprintId: string): PrintPagePatient {
  const search = useSearch({ strict: false }) as { patientId?: string };
  const { session } = useAuth();
  const [detail, setDetail] = useState<PatientDetailResponse | null>(null);
  const [error, setError] = useState<string | undefined>();
  const values = useMemo(() => readPrintPreview(blueprintId) ?? {}, [blueprintId]);

  useEffect(() => {
    if (!search.patientId) return;
    void fetchPatientDetail(search.patientId)
      .then(setDetail)
      .catch(() => setError(copy.errors.genericMessage));
  }, [search.patientId]);

  return {
    patientId: search.patientId,
    values,
    error,
    physician: session?.user.displayName ?? copy.print.physicianFallback,
    patientName: detail?.patient.displayName ?? copy.print.patientFallback,
  };
}
