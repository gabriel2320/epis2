/**
 * Tipos de identificador paciente — alineado IG MINSAL NID (subset EPIS2).
 * @see https://interoperabilidad.minsal.cl/fhir/ig/nid/0.4.1/ValueSet-VSTiposIdentificadorPaciente.html
 */

export const CHILE_PATIENT_IDENTIFIER_TYPES = [
  'RUN',
  'RUN_PROVISIONAL',
  'RUN_MOTHER_RN',
  'PASSPORT',
  'BIRTH_FOLIO',
  'OTHER',
  'DEMO',
] as const;

export type ChilePatientIdentifierType = (typeof CHILE_PATIENT_IDENTIFIER_TYPES)[number];

const TYPE_SET = new Set<string>(CHILE_PATIENT_IDENTIFIER_TYPES);

export function isChilePatientIdentifierType(value: string): value is ChilePatientIdentifierType {
  return TYPE_SET.has(value);
}

/** Tipo por defecto para filas RUT en EPIS2. */
export const DEFAULT_RUN_IDENTIFIER_TYPE: ChilePatientIdentifierType = 'RUN';
