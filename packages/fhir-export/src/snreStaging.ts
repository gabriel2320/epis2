/**
 * MF-IC-02 — SNRE staging MedicationRequest (demo EPIS2, sin envío real a SNRE).
 * @see https://interoperabilidad.minsal.cl/fhir/ig/snre/
 */
import { EPIS2_DATA_ORIGIN_SYSTEM } from './constants.js';
import { toFhirMedicationRequest, type PrescriptionDraftSource } from './mappers.js';
import type { Epis2MedicationRequestResource } from './profile.js';
import { epis2MedicationRequestResourceSchema } from './profile.js';

/** IG SNRE MINSAL — referencia normativa (solo constantes; sin fetch). */
export const SNRE_IG_BASE = 'https://interoperabilidad.minsal.cl/fhir/ig/snre' as const;

/** Base FHIR demo EPIS2 alineada a SNRE staging local. */
export const EPIS2_SNRE_FHIR_BASE = 'http://epis2.cl/fhir' as const;

export const SNRE_STAGING_PROFILES = {
  medicationRequest: `${EPIS2_SNRE_FHIR_BASE}/StructureDefinition/snre-medication-request-staging`,
} as const;

export const EPIS2_SNRE_STAGING_TAG_SYSTEM =
  `${EPIS2_SNRE_FHIR_BASE}/CodeSystem/snre-staging` as const;

export type SnreStagingPayload = {
  staging: true;
  noRealSend: true;
  medicationRequest: Epis2MedicationRequestResource;
};

function snreStagingMeta(isSynthetic: boolean): Epis2MedicationRequestResource['meta'] {
  const meta: Epis2MedicationRequestResource['meta'] = {
    profile: [SNRE_STAGING_PROFILES.medicationRequest],
    tag: [
      {
        system: EPIS2_SNRE_STAGING_TAG_SYSTEM,
        code: 'staging',
        display: 'SNRE staging (sin envío real)',
      },
    ],
  };
  if (isSynthetic) {
    meta.tag!.push({
      system: EPIS2_DATA_ORIGIN_SYSTEM,
      code: 'synthetic',
      display: 'DEMO/SINTÉTICO',
    });
  }
  return meta;
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
