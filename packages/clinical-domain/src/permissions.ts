/**
 * Permisos explícitos — sin wildcards (gate EPIS2-03).
 * Formato: recurso.acción
 */
export const PERMISSIONS = [
  'session.read',
  'patient.read',
  'patient.search',
  'command.execute',
  'draft.write',
  'draft.read',
  'draft.approve',
  'audit.read',
  'admin.users.read',
  'fhir.export',
] as const;

export type Permission = (typeof PERMISSIONS)[number];

export function isPermission(value: string): value is Permission {
  return (PERMISSIONS as readonly string[]).includes(value);
}
