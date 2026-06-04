import type { ClinicalRole } from './roles.js';

/**
 * Usuarios sintéticos DEMO — sin contraseñas reales en repo.
 * `demoAuthKey` es una clave pública de laboratorio, no un secreto de producción.
 */
export type SyntheticUser = {
  id: string;
  username: string;
  displayName: string;
  role: ClinicalRole;
  demoAuthKey: string;
};

export const SYNTHETIC_USERS: readonly SyntheticUser[] = [
  {
    id: 'usr-physician-01',
    username: 'medico.demo',
    displayName: 'Dra. Ana Demo',
    role: 'physician',
    demoAuthKey: 'DEMO-CLAVE-MEDICO',
  },
  {
    id: 'usr-nurse-01',
    username: 'enfermeria.demo',
    displayName: 'Enf. Luis Demo',
    role: 'nurse',
    demoAuthKey: 'DEMO-CLAVE-ENFERMERIA',
  },
  {
    id: 'usr-pharmacist-01',
    username: 'farmacia.demo',
    displayName: 'Q.F. Rosa Demo',
    role: 'pharmacist',
    demoAuthKey: 'DEMO-CLAVE-FARMACIA',
  },
  {
    id: 'usr-admin-01',
    username: 'admin.demo',
    displayName: 'Admin Demo',
    role: 'admin',
    demoAuthKey: 'DEMO-CLAVE-ADMIN',
  },
  {
    id: 'usr-auditor-01',
    username: 'auditor.demo',
    displayName: 'Auditor Demo',
    role: 'auditor',
    demoAuthKey: 'DEMO-CLAVE-AUDITOR',
  },
] as const;

export function findSyntheticUser(username: string): SyntheticUser | undefined {
  const normalized = username.trim().toLowerCase();
  return SYNTHETIC_USERS.find((u) => u.username === normalized);
}

export function verifyDemoAuthKey(user: SyntheticUser, demoAuthKey: string): boolean {
  return user.demoAuthKey === demoAuthKey.trim();
}
