/** Base canónica del perfil mínimo EPIS2 (laboratorio / demo). */
export const EPIS2_FHIR_BASE = 'http://epis2.local/fhir' as const;

/** Base FHIR demo EPIS2 alineada a interop Chile (MINSAL / SNRE staging). */
export const EPIS2_CL_FHIR_BASE = 'http://epis2.cl/fhir' as const;

export const EPIS2_PROFILES = {
  patient: `${EPIS2_FHIR_BASE}/StructureDefinition/epis2-patient-minimal`,
  encounter: `${EPIS2_FHIR_BASE}/StructureDefinition/epis2-encounter-minimal`,
  documentReference: `${EPIS2_FHIR_BASE}/StructureDefinition/epis2-document-reference-minimal`,
  serviceRequest: `${EPIS2_FHIR_BASE}/StructureDefinition/epis2-service-request-minimal`,
  bundle: `${EPIS2_FHIR_BASE}/StructureDefinition/epis2-patient-export-bundle`,
  allergyIntolerance: `${EPIS2_FHIR_BASE}/StructureDefinition/epis2-allergy-minimal`,
  medicationStatement: `${EPIS2_FHIR_BASE}/StructureDefinition/epis2-medication-minimal`,
  medicationRequest: `${EPIS2_FHIR_BASE}/StructureDefinition/epis2-medication-request-snre`,
  provenance: `${EPIS2_FHIR_BASE}/StructureDefinition/epis2-provenance-ai-assist`,
  device: `${EPIS2_FHIR_BASE}/StructureDefinition/epis2-ai-device-minimal`,
} as const;

export const EPIS2_IDENTIFIER_SYSTEM_DEMO = `${EPIS2_FHIR_BASE}/NamingSystem/demo` as const;
export const EPIS2_DATA_ORIGIN_SYSTEM = `${EPIS2_FHIR_BASE}/CodeSystem/data-origin` as const;
/** Tag AIAST — documento aprobado con asistencia IA (MF-IM-06). */
export const EPIS2_AIAST_SYSTEM = `${EPIS2_FHIR_BASE}/CodeSystem/ai-assist` as const;
export const EPIS2_AI_RUN_SYSTEM = `${EPIS2_FHIR_BASE}/NamingSystem/ai-run` as const;
/** Versión canónica de model card estática (MF-IM-07). */
export const EPIS2_MODEL_CARD_VERSION = 'epis2-model-card/2026-06-14' as const;
export const EPIS2_MODEL_CARD_SYSTEM = `${EPIS2_FHIR_BASE}/NamingSystem/ai-model-card` as const;
