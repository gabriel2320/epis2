import { EPIS2_FORM_BLUEPRINTS } from '@epis2/clinical-forms';
import { describe, expect, it } from 'vitest';
import { CLINICAL_WORKSPACE_ORDER } from './clinicalWorkspaceRegistry.js';
import {
  EPIS2_NAVIGATION_TREE,
  EPIS2_NAVIGATION_TREE_BY_ROUTE,
  assertNavigationTreeInvariants,
  getNavigationSurfacesForWorkspace,
} from './epis2NavigationTree.js';

describe('epis2NavigationTree', () => {
  it('pasa invariantes de conciliación', () => {
    expect(assertNavigationTreeInvariants()).toEqual([]);
  });

  it('incluye los 19 blueprints del registry único', () => {
    const blueprintIds = EPIS2_NAVIGATION_TREE.filter((n) => n.blueprintId).map(
      (n) => n.blueprintId,
    );
    for (const bp of EPIS2_FORM_BLUEPRINTS) {
      expect(blueprintIds).toContain(bp.blueprintId);
    }
  });

  it('registra home primaria en censo y /comando como compat', () => {
    const census = EPIS2_NAVIGATION_TREE.find(
      (n) => n.route === '/espacio/buscar-paciente' && n.blueprintId === 'patient_search',
    );
    expect(census?.navigationTier).toBe('primary');

    const command = EPIS2_NAVIGATION_TREE_BY_ROUTE.get('/comando');
    expect(command?.navigationTier).toBe('compat');
  });

  it('marca todos los dashboard tabs como secundarios', () => {
    const dashboardNodes = EPIS2_NAVIGATION_TREE.filter((n) => n.kind === 'dashboard_tab');
    expect(dashboardNodes.length).toBeGreaterThan(0);
    for (const node of dashboardNodes) {
      expect(node.navigationTier).toBe('secondary');
    }
  });

  it('asigna cada workspace al menos una superficie habilitada o parcial', () => {
    for (const ws of CLINICAL_WORKSPACE_ORDER) {
      if (ws === 'command') continue;
      const surfaces = getNavigationSurfacesForWorkspace(ws);
      expect(surfaces.some((s) => s.status === 'complete' || s.status === 'partial')).toBe(true);
    }
  });

  it('no coloca dashboard como home', () => {
    const dashboardNodes = EPIS2_NAVIGATION_TREE.filter((n) =>
      n.route.startsWith('/epis2/dashboard'),
    );
    for (const node of dashboardNodes) {
      expect(node.workspace).not.toBe('command');
      expect(node.md3Level).toBeGreaterThanOrEqual(0);
    }
  });
});
