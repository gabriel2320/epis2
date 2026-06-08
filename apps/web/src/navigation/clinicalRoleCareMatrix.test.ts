import { describe, expect, it } from 'vitest';
import { CLINICAL_ROLES } from '@epis2/clinical-domain';
import {
  CLINICAL_WORKSPACE_ORDER,
  EPIS_ROLE_CARE_PROFILES,
  roleMayUseWorkspace,
  workspacesForRole,
} from './clinicalRoleCareMatrix.js';
import { CLINICAL_WORKSPACE_DEFINITIONS } from './clinicalWorkspaceRegistry.js';

describe('clinicalRoleCareMatrix', () => {
  it('cada rol tiene perfil, workspaces y ámbitos', () => {
    for (const role of CLINICAL_ROLES) {
      const profile = EPIS_ROLE_CARE_PROFILES[role];
      expect(profile.workspaces.length).toBeGreaterThan(0);
      expect(profile.actionWindows.length).toBeGreaterThan(0);
      expect(profile.workspaces[0]).toBe('command');
    }
  });

  it('separa ambulatorio de hospitalización y UCI', () => {
    expect(roleMayUseWorkspace('physician', 'ambulatory')).toBe(true);
    expect(roleMayUseWorkspace('physician', 'inpatient_ward')).toBe(true);
    expect(roleMayUseWorkspace('physician', 'icu')).toBe(true);
    expect(workspacesForRole('pharmacist')).toEqual(['command', 'pharmacy_clinical']);
    expect(roleMayUseWorkspace('paramedic', 'ambulatory')).toBe(false);
    expect(roleMayUseWorkspace('paramedic', 'emergency')).toBe(true);
  });

  it('cada workspace del registry está asignado a al menos un rol', () => {
    const allRoleWorkspaces = new Set(
      CLINICAL_ROLES.flatMap((role) => [...EPIS_ROLE_CARE_PROFILES[role].workspaces]),
    );
    for (const id of Object.keys(CLINICAL_WORKSPACE_DEFINITIONS)) {
      expect(allRoleWorkspaces.has(id as never)).toBe(true);
    }
  });

  it('orden canónico de workspaces coincide con el registry', () => {
    expect(CLINICAL_WORKSPACE_ORDER).toEqual(Object.keys(CLINICAL_WORKSPACE_DEFINITIONS));
  });
});
