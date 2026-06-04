/** Roles iniciales EPIS2 — alineados con design-system. */
export const CLINICAL_ROLES = [
  'physician',
  'nurse',
  'pharmacist',
  'admin',
  'auditor',
] as const;

export type ClinicalRole = (typeof CLINICAL_ROLES)[number];

export function isClinicalRole(value: string): value is ClinicalRole {
  return (CLINICAL_ROLES as readonly string[]).includes(value);
}
