/** @legacy-runtime PR6 — redirects `/espacio/*` → CICA `/app/*` cuando `VITE_ENABLE_CICA_UI=true`. */
import { redirect } from '@tanstack/react-router';
import { isCicaUiEnabled } from '../dev/cicaUiEnv.js';
import { parseClinicalFormSearch, parseClinicalPatientSearch } from './clinicalNavigate.js';

/**
 * Mapa de redirects (solo con CICA activo; draftId se preserva cuando aplica):
 * - /espacio/buscar-paciente → /app/buscar
 * - /espacio/ficha?patientId= → /app/pacientes/$patientId/resumen
 * - /espacio/resumen?patientId= → /app/pacientes/$patientId/resumen
 * - /espacio/evolucion?patientId= → /app/pacientes/$patientId/evoluciones/nueva
 * - /espacio/receta?patientId= → /app/pacientes/$patientId/indicaciones/nueva
 * - /espacio/certificado?patientId= → /app/pacientes/$patientId/documentos/nuevo
 * - /espacio/resultados?patientId= → /app/pacientes/$patientId/examenes
 * - /espacio/laboratorio?patientId= → /app/pacientes/$patientId/examenes
 * - /espacio/imagenologia?patientId= → /app/pacientes/$patientId/examenes
 * - /espacio/interconsulta?patientId= → /app/pacientes/$patientId/documentos
 * - /espacio/procedimiento?patientId= → /app/pacientes/$patientId/indicaciones
 * - /espacio/enfermeria?patientId= → /app/pacientes/$patientId/indicaciones
 * - /espacio/alergia?patientId= → /app/pacientes/$patientId/resumen
 * - /espacio/problema?patientId= → /app/pacientes/$patientId/resumen
 * - /espacio/ingreso?patientId= → /app/pacientes/$patientId/resumen
 * - /espacio/ambulatorio?patientId= → /app/pacientes/$patientId/resumen
 * - /espacio/farmacia?patientId= → /app/pacientes/$patientId/indicaciones
 * - /espacio/mar?patientId= → /app/pacientes/$patientId/indicaciones
 * - /espacio/conciliacion?patientId= → /app/pacientes/$patientId/indicaciones
 * - /espacio/traslado?patientId= → /app/pacientes/$patientId/resumen
 * - /espacio/informe-interconsulta?patientId= → /app/pacientes/$patientId/documentos
 * - /espacio/epicrisis?patientId= → /app/pacientes/$patientId/epicrisis/nueva
 */
export function redirectLegacyPatientSearchToCicaIfEnabled() {
  if (isCicaUiEnabled()) {
    throw redirect({ to: '/app/buscar' });
  }
}

export function redirectLegacyFichaToCicaIfEnabled(search: Record<string, unknown>) {
  if (!isCicaUiEnabled()) return;
  const { patientId } = parseClinicalPatientSearch(search);
  if (patientId) {
    throw redirect({
      to: '/app/pacientes/$patientId/resumen',
      params: { patientId },
    });
  }
  throw redirect({ to: '/app/buscar' });
}

export function redirectLegacyEvolutionToCicaIfEnabled(search: Record<string, unknown>) {
  redirectLegacyClinicalFormToCicaIfEnabled(search, '/app/pacientes/$patientId/evoluciones/nueva');
}

type CicaPatientRedirectTarget =
  | '/app/pacientes/$patientId/resumen'
  | '/app/pacientes/$patientId/indicaciones'
  | '/app/pacientes/$patientId/documentos'
  | '/app/pacientes/$patientId/examenes';

type CicaClinicalFormRedirectTarget =
  | '/app/pacientes/$patientId/evoluciones/nueva'
  | '/app/pacientes/$patientId/indicaciones/nueva'
  | '/app/pacientes/$patientId/documentos/nuevo'
  | '/app/pacientes/$patientId/epicrisis/nueva';

export function redirectLegacyClinicalFormToCicaIfEnabled(
  search: Record<string, unknown>,
  to: CicaClinicalFormRedirectTarget,
) {
  if (!isCicaUiEnabled()) return;
  const parsed = parseClinicalFormSearch(search);
  if (parsed.patientId) {
    throw redirect({
      to,
      params: { patientId: parsed.patientId },
      ...(parsed.draftId ? { search: { draftId: parsed.draftId } } : {}),
    });
  }
  throw redirect({ to: '/app/buscar' });
}

export function redirectLegacyFormToCicaPatientIfEnabled(
  search: Record<string, unknown>,
  to: CicaPatientRedirectTarget,
) {
  if (!isCicaUiEnabled()) return;
  const parsed = parseClinicalFormSearch(search);
  if (parsed.patientId) {
    throw redirect({
      to,
      params: { patientId: parsed.patientId },
      ...(parsed.draftId ? { search: { draftId: parsed.draftId } } : {}),
    });
  }
  throw redirect({ to: '/app/buscar' });
}

export function redirectLegacyPrescriptionToCicaIfEnabled(search: Record<string, unknown>) {
  redirectLegacyClinicalFormToCicaIfEnabled(search, '/app/pacientes/$patientId/indicaciones/nueva');
}

export function redirectLegacyCertificateToCicaIfEnabled(search: Record<string, unknown>) {
  redirectLegacyClinicalFormToCicaIfEnabled(search, '/app/pacientes/$patientId/documentos/nuevo');
}

export function redirectLegacyEpicrisisToCicaIfEnabled(search: Record<string, unknown>) {
  redirectLegacyClinicalFormToCicaIfEnabled(search, '/app/pacientes/$patientId/epicrisis/nueva');
}
