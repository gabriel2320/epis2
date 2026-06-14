/**
 * Validación Node-only de casos SIM (usa node:crypto vía simCaseIds).
 */

import { SIM_CLINICAL_CASES } from './simClinicalCases.js';
import { stableSimCaseUuids } from './simCaseIds.js';

export { SIM_CLINICAL_CASES, getSimCaseByCode, getSimCaseByPatientId } from './simClinicalCases.js';

const FORBIDDEN_REAL_ID = /\b\d{7,8}[-\s]?\d{1,2}\b/;

export function assertSimCasesInvariants(): string[] {
  const errors: string[] = [];
  const codes = new Set<string>();
  const ids = new Set<string>();
  for (const c of SIM_CLINICAL_CASES) {
    if (!c.demoCaseCode.startsWith('SIM-')) {
      errors.push(`Código SIM inválido: ${c.demoCaseCode}`);
    }
    const expected = stableSimCaseUuids(c.demoCaseCode);
    if (c.patientId !== expected.patientId) {
      errors.push(`patientId no alineado con stableSimCaseUuids: ${c.demoCaseCode}`);
    }
    if (c.encounterId !== expected.encounterId) {
      errors.push(`encounterId no alineado con stableSimCaseUuids: ${c.demoCaseCode}`);
    }
    if (codes.has(c.demoCaseCode)) errors.push(`Código duplicado: ${c.demoCaseCode}`);
    if (ids.has(c.patientId)) errors.push(`UUID duplicado: ${c.patientId}`);
    codes.add(c.demoCaseCode);
    ids.add(c.patientId);
    if (FORBIDDEN_REAL_ID.test(c.displayName)) {
      errors.push(`Posible identificador real en nombre: ${c.displayName}`);
    }
    if (!c.displayName.includes('Sim') && !c.displayName.includes('Demo')) {
      errors.push(`Nombre sin marca ficticia: ${c.displayName}`);
    }
  }
  return errors;
}
