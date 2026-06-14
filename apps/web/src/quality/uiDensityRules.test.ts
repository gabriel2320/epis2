import { describe, expect, it } from 'vitest';
import {
  EPIS_ICON_BUDGET,
  EPIS_SCREEN_REGISTRY,
  iconBudgetForScreen,
  screenKindForRoute,
} from './uiDensityRules.js';

describe('uiDensityRules', () => {
  it('define presupuesto de iconos por tipo de pantalla', () => {
    expect(iconBudgetForScreen('command')).toBe(EPIS_ICON_BUDGET.command);
    expect(EPIS_ICON_BUDGET.workspace).toBe(10);
    expect(EPIS_ICON_BUDGET.document).toBe(0);
  });

  it('clasifica rutas clínicas canónicas', () => {
    expect(screenKindForRoute('/comando')).toBe('command');
    expect(screenKindForRoute('/espacio/buscar-paciente')).toBe('command');
    expect(screenKindForRoute('/espacio/ficha')).toBe('workspace');
    expect(screenKindForRoute('/espacio/evolucion')).toBe('form');
    expect(screenKindForRoute('/espacio/borrador/abc')).toBe('document');
    expect(screenKindForRoute('/epis2/dashboard')).toBe('workspace');
  });

  it('registra pantallas auditadas con scaffold', () => {
    expect(EPIS_SCREEN_REGISTRY.clinicalCensusHome.scaffold).toBe('EpisClinicalWorkspaceShell');
    expect(EPIS_SCREEN_REGISTRY.commandCompat.scaffold).toBe('EpisAppScaffold');
    expect(EPIS_SCREEN_REGISTRY.patientChart.scaffold).toBe('EpisClinicalWorkspaceShell');
    expect(EPIS_SCREEN_REGISTRY.dashboardSecondary.route).toBe('/epis2/dashboard');
  });
});
