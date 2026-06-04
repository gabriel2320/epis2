import type { ClinicalRole } from './roles.js';
import type { Permission } from './permissions.js';
import { isPermission } from './permissions.js';

/** Matriz rol → permisos explícitos (única fuente). */
export const ROLE_PERMISSIONS: Record<ClinicalRole, readonly Permission[]> = {
  physician: [
    'session.read',
    'patient.read',
    'patient.search',
    'command.execute',
    'draft.write',
    'draft.read',
    'draft.approve',
    'fhir.export',
    'dashboard.read',
    'ai.read',
  ],
  nurse: [
    'session.read',
    'patient.read',
    'patient.search',
    'command.execute',
    'draft.write',
    'draft.read',
    'fhir.export',
    'dashboard.read',
    'ai.read',
  ],
  pharmacist: [
    'session.read',
    'patient.read',
    'command.execute',
    'draft.write',
    'draft.read',
    'draft.approve',
    'fhir.export',
    'dashboard.read',
    'ai.read',
  ],
  admin: [
    'session.read',
    'patient.read',
    'patient.search',
    'command.execute',
    'draft.read',
    'audit.read',
    'admin.users.read',
    'fhir.export',
    'dashboard.read',
    'ai.read',
  ],
  auditor: [
    'session.read',
    'patient.read',
    'draft.read',
    'audit.read',
    'fhir.export',
    'dashboard.read',
    'ai.read',
  ],
};

export function permissionsForRole(role: ClinicalRole): readonly Permission[] {
  return ROLE_PERMISSIONS[role];
}

export function roleHasPermission(role: ClinicalRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}

export function assertPermission(
  role: ClinicalRole,
  permission: string,
): asserts permission is Permission {
  if (!isPermission(permission)) {
    throw new Error(`Permiso desconocido: ${permission}`);
  }
  if (!roleHasPermission(role, permission)) {
    throw new Error(`Rol ${role} sin permiso ${permission}`);
  }
}
