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
    expect(EPIS_ICON_BUDGET.document).toBe(0);
  });

  it('clasifica rutas clínicas canónicas', () => {
    expect(screenKindForRoute('/comando')).toBe('command');
    expect(screenKindForRoute('/espacio/ficha')).toBe('workspace');
    expect(screenKindForRoute('/espacio/evolucion')).toBe('form');
    expect(screenKindForRoute('/espacio/borrador/abc')).toBe('document');
  });

  it('registra pantallas auditadas con scaffold', () => {
    expect(EPIS_SCREEN_REGISTRY.command.scaffold).toBe('EpisAppScaffold');
    expect(EPIS_SCREEN_REGISTRY.patientChart.scaffold).toBe('EpisClinicalWorkspaceShell');
  });
});
