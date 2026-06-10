import { ApiError } from '../api/client.js';

export type ServerFieldErrorSetter = (
  fieldId: string,
  error: { type: 'server'; message: string },
) => void;

/**
 * MF-NORM-404 — mapea `details` del envelope de error (paths Zod del API,
 * p. ej. `body.encounterDate`) a errores por campo de react-hook-form.
 *
 * Devuelve cuántos errores se aplicaron a campos conocidos; los paths que no
 * corresponden a campos del blueprint se ignoran (quedan en el mensaje global).
 */
export function applyServerFieldErrors(
  error: unknown,
  fieldIds: readonly string[],
  setError: ServerFieldErrorSetter,
): number {
  if (!(error instanceof ApiError) || !error.details?.length) return 0;
  const known = new Set(fieldIds);
  let applied = 0;
  for (const detail of error.details) {
    // El API valida `{ patientId, title, body: { <fieldId>: ... } }`:
    // el id del campo RHF es el último segmento del path.
    const fieldId = detail.path.split('.').pop() ?? detail.path;
    if (!known.has(fieldId)) continue;
    setError(fieldId, { type: 'server', message: detail.message });
    applied += 1;
  }
  return applied;
}
