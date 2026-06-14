/**
 * MF-IC-01 — Perfiles export MINSAL (subset demo EPIS2, sin llamadas a servidores externos).
 * @see docs/product/EPIS2_CHILE_CLINICAL_MODEL.md
 */

import { CHILE_RUT_IDENTIFIER_SYSTEM } from './constants.js';
import {
  DEFAULT_RUN_IDENTIFIER_TYPE,
  type ChilePatientIdentifierType,
} from './identifier-types.js';
import { normalizeRut } from './rut.js';

/** IG NID MINSAL — referencia normativa (solo constantes; sin fetch). */
export const MINSAL_NID_IG_BASE = 'https://interoperabilidad.minsal.cl/fhir/ig/nid' as const;

/** CodeSystem tipos identificador paciente (NID MINSAL). */
export const MINSAL_IDENTIFIER_TYPE_SYSTEM =
  `${MINSAL_NID_IG_BASE}/CodeSystem/CSTipoIdentificador` as const;

/** Base FHIR demo EPIS2 alineada a Chile (perfiles StructureDefinition locales). */
export const EPIS2_MINSAL_FHIR_BASE = 'http://epis2.cl/fhir' as const;

export const MINSAL_PROFILES = {
  patient: `${EPIS2_MINSAL_FHIR_BASE}/StructureDefinition/minsal-patient`,
  encounter: `${EPIS2_MINSAL_FHIR_BASE}/StructureDefinition/minsal-encounter`,
  documentReference: `${EPIS2_MINSAL_FHIR_BASE}/StructureDefinition/minsal-document-reference`,
  bundle: `${EPIS2_MINSAL_FHIR_BASE}/StructureDefinition/minsal-export-bundle`,
} as const;

const IDENTIFIER_TYPE_CODING: Record<
  ChilePatientIdentifierType,
  { code: string; display: string }
> = {
  RUN: { code: '1', display: 'RUN' },
  RUN_PROVISIONAL: { code: '2', display: 'RUN Provisorio' },
  RUN_MOTHER_RN: { code: '3', display: 'RUN Madre' },
  PASSPORT: { code: '5', display: 'PPN' },
  BIRTH_FOLIO: { code: '4', display: 'Número Folio' },
  OTHER: { code: '14', display: 'OTRO' },
  DEMO: { code: '12', display: 'Número de Ficha Clínica Sistema Local' },
};

export type MinsalIdentifierCoding = {
  system: typeof MINSAL_IDENTIFIER_TYPE_SYSTEM;
  code: string;
  display: string;
};

/** Coding CSTipoIdentificador para un tipo EPIS2 (subset MINSAL NID). */
export function buildMinsalIdentifierCoding(
  type: ChilePatientIdentifierType,
): MinsalIdentifierCoding {
  const entry = IDENTIFIER_TYPE_CODING[type];
  return {
    system: MINSAL_IDENTIFIER_TYPE_SYSTEM,
    code: entry.code,
    display: entry.display,
  };
}

export type MinsalPatientIdentifierFhir = {
  use: 'official';
  type: { coding: MinsalIdentifierCoding[] };
  system: typeof CHILE_RUT_IDENTIFIER_SYSTEM;
  value: string;
};

/** Identifier FHIR con system RUT EPIS2 y type.coding MINSAL. */
export function mapPatientIdentifierToFhir(
  rut: string,
  identifierType: ChilePatientIdentifierType = DEFAULT_RUN_IDENTIFIER_TYPE,
): MinsalPatientIdentifierFhir {
  const normalized = normalizeRut(rut);
  if (!normalized) {
    throw new Error(`RUT inválido para export MINSAL: ${rut}`);
  }
  return {
    use: 'official',
    type: { coding: [buildMinsalIdentifierCoding(identifierType)] },
    system: CHILE_RUT_IDENTIFIER_SYSTEM,
    value: normalized,
  };
}
