import { describe, expect, it } from 'vitest';
import {
  CLINICAL_WORKSPACE_DEFINITIONS,
  CLINICAL_WORKSPACE_ORDER,
  getClinicalWorkspaceDefinition,
  getWorkspaceDefaultRoute,
  parseClinicalRoute,
  resolveWorkspaceForRole,
  routeMatchesPath,
} from './clinicalWorkspaceRegistry.js';
import { resolveWorkspaceCopyKey } from './workspaceCopy.js';

describe('clinicalWorkspaceRegistry', () => {
  it('define los once espacios de trabajo canónicos (rol × ámbito)', () => {
    expect(CLINICAL_WORKSPACE_ORDER).toEqual([
      'command',
      'reception',
      'ambulatory',
      'inpatient_ward',
      'intermediate_care',
      'emergency',
      'icu',
      'or',
      'pharmacy_clinical',
      'quality_iaas',
      'admin_system',
    ]);
    for (const id of CLINICAL_WORKSPACE_ORDER) {
      expect(CLINICAL_WORKSPACE_DEFINITIONS[id].id).toBe(id);
    }
  });

  it('resuelve ruta por defecto del workspace', () => {
    expect(getWorkspaceDefaultRoute('command')).toEqual({ to: '/comando' });
    expect(getWorkspaceDefaultRoute('ambulatory')).toEqual({
      to: '/epis2/dashboard',
      search: { tab: 'work' },
    });
    expect(getWorkspaceDefaultRoute('reception')).toEqual({
      to: '/epis2/dashboard',
      search: { tab: 'reception' },
    });
    expect(getWorkspaceDefaultRoute('or')).toEqual({
      to: '/epis2/dashboard',
      search: { tab: 'or' },
    });
    expect(getWorkspaceDefaultRoute('admin_system')).toEqual({
      to: '/espacio/admin',
      search: { tab: 'ops' },
    });
  });

  it('parsea query en rutas del registry', () => {
    expect(parseClinicalRoute('/espacio/admin?tab=forms')).toEqual({
      to: '/espacio/admin',
      search: { tab: 'forms' },
    });
  });

  it('empareja pathname y search', () => {
    expect(routeMatchesPath('/epis2/dashboard', '?tab=work', '/epis2/dashboard?tab=work')).toBe(
      true,
    );
    expect(routeMatchesPath('/epis2/dashboard', '?tab=quality', '/epis2/dashboard?tab=work')).toBe(
      false,
    );
  });

  it('sugiere workspace inicial por rol demo', () => {
    expect(resolveWorkspaceForRole('admin')).toBe('admin_system');
    expect(resolveWorkspaceForRole('auditor')).toBe('quality_iaas');
    expect(resolveWorkspaceForRole('physician')).toBe('ambulatory');
    expect(resolveWorkspaceForRole('nurse')).toBe('inpatient_ward');
    expect(resolveWorkspaceForRole('paramedic')).toBe('emergency');
    expect(resolveWorkspaceForRole('kinesiologist')).toBe('ambulatory');
    expect(resolveWorkspaceForRole('pharmacist')).toBe('pharmacy_clinical');
  });

  it('expone copy español para cada workspace', () => {
    for (const id of CLINICAL_WORKSPACE_ORDER) {
      const def = getClinicalWorkspaceDefinition(id);
      expect(resolveWorkspaceCopyKey(def.labelKey)).not.toBe(def.labelKey);
      expect(resolveWorkspaceCopyKey(def.descriptionKey)).not.toBe(def.descriptionKey);
    }
  });
});
