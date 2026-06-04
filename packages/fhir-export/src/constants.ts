/** Base canónica del perfil mínimo EPIS2 (laboratorio / demo). */
export const EPIS2_FHIR_BASE = 'http://epis2.local/fhir' as const;

export const EPIS2_PROFILES = {
  patient: `${EPIS2_FHIR_BASE}/StructureDefinition/epis2-patient-minimal`,
  encounter: `${EPIS2_FHIR_BASE}/StructureDefinition/epis2-encounter-minimal`,
  documentReference: `${EPIS2_FHIR_BASE}/StructureDefinition/epis2-document-reference-minimal`,
  serviceRequest: `${EPIS2_FHIR_BASE}/StructureDefinition/epis2-service-request-minimal`,
  bundle: `${EPIS2_FHIR_BASE}/StructureDefinition/epis2-patient-export-bundle`,
} as const;

export const EPIS2_IDENTIFIER_SYSTEM_DEMO = `${EPIS2_FHIR_BASE}/NamingSystem/demo` as const;
export const EPIS2_DATA_ORIGIN_SYSTEM = `${EPIS2_FHIR_BASE}/CodeSystem/data-origin` as const;
