/**
 * MF-IC-02 — SNRE staging MedicationRequest (demo EPIS2, sin envío real a SNRE).
 * @see https://interoperabilidad.minsal.cl/fhir/ig/snre/
 */
import { buildChileProfileMeta } from './chileInteropMeta.js';
import { EPIS2_CL_FHIR_BASE } from './constants.js';
import { toFhirMedicationRequest, type PrescriptionDraftSource } from './mappers.js';
import type { Epis2MedicationRequestResource } from './profile.js';
import { epis2MedicationRequestResourceSchema } from './profile.js';

/** IG SNRE MINSAL — referencia normativa (solo constantes; sin fetch). */
export const SNRE_IG_BASE = 'https://interoperabilidad.minsal.cl/fhir/ig/snre' as const;

/** @deprecated Use EPIS2_CL_FHIR_BASE — alias SNRE staging. */
export const EPIS2_SNRE_FHIR_BASE = EPIS2_CL_FHIR_BASE;

export const SNRE_STAGING_PROFILES = {
  medicationRequest: `${EPIS2_CL_FHIR_BASE}/StructureDefinition/snre-medication-request-staging`,
} as const;

export const EPIS2_SNRE_STAGING_TAG_SYSTEM =
  `${EPIS2_CL_FHIR_BASE}/CodeSystem/snre-staging` as const;

export type SnreStagingPayload = {
  staging: true;
  noRealSend: true;
  medicationRequest: Epis2MedicationRequestResource;
};

function snreStagingMeta(isSynthetic: boolean): Epis2MedicationRequestResource['meta'] {
  return buildChileProfileMeta(SNRE_STAGING_PROFILES.medicationRequest, {
    isSynthetic,
    tags: [
      {
        system: EPIS2_SNRE_STAGING_TAG_SYSTEM,
        code: 'staging',
        display: 'SNRE staging (sin envío real)',
      },
    ],
  });
}

/** MedicationRequest con perfil SNRE staging (borrador prescription → JSON listo para revisión). */
export function toSnreStagingMedicationRequest(
  source: PrescriptionDraftSource,
  isSynthetic: boolean,
): Epis2MedicationRequestResource | null {
  const base = toFhirMedicationRequest(source, isSynthetic);
  if (!base) return null;
  return {
    ...base,
    meta: snreStagingMeta(isSynthetic),
  };
}

/** Envelope explícito: staging demo, prohibido envío SNRE real. */
export function buildSnreStagingJson(
  source: PrescriptionDraftSource,
  isSynthetic: boolean,
): SnreStagingPayload | null {
  const medicationRequest = toSnreStagingMedicationRequest(source, isSynthetic);
  if (!medicationRequest) return null;
  return {
    staging: true,
    noRealSend: true,
    medicationRequest,
  };
}

export function validateSnreStagingMedicationRequest(resource: unknown) {
  const parsed = epis2MedicationRequestResourceSchema.safeParse(resource);
  if (!parsed.success) return { ok: false as const, errors: parsed.error.flatten() };
  if (!parsed.data.meta.profile?.includes(SNRE_STAGING_PROFILES.medicationRequest)) {
    return {
      ok: false as const,
      errors: { formErrors: ['meta.profile snre-medication-request-staging requerido'] },
    };
  }
  const hasStagingTag = parsed.data.meta.tag?.some(
    (t) => t.system === EPIS2_SNRE_STAGING_TAG_SYSTEM && t.code === 'staging',
  );
  if (!hasStagingTag) {
    return {
      ok: false as const,
      errors: { formErrors: ['meta.tag SNRE staging requerido'] },
    };
  }
  return { ok: true as const, resource: parsed.data };
}
