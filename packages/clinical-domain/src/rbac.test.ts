import { describe, expect, it } from 'vitest';
import { PERMISSIONS } from './permissions.js';
import { ROLE_PERMISSIONS, roleHasPermission } from './rbac.js';

describe('RBAC', () => {
  it('no usa wildcards en permisos', () => {
    for (const p of PERMISSIONS) {
      expect(p).not.toMatch(/\*/);
      expect(p).not.toMatch(/^admin\.\*$/);
    }
  });

  it('médico puede aprobar borradores', () => {
    expect(roleHasPermission('physician', 'draft.approve')).toBe(true);
  });

  it('enfermería no puede aprobar borradores', () => {
    expect(roleHasPermission('nurse', 'draft.approve')).toBe(false);
  });

  it('auditor puede exportar FHIR', () => {
    expect(roleHasPermission('auditor', 'fhir.export')).toBe(true);
  });

  it('cada rol tiene al menos session.read', () => {
    for (const role of Object.keys(ROLE_PERMISSIONS)) {
      expect(roleHasPermission(role as keyof typeof ROLE_PERMISSIONS, 'session.read')).toBe(
        true,
      );
    }
  });
});
