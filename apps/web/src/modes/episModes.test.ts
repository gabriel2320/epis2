/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest';
import {
  getDefaultModeAfterLogin,
  getDefaultRouteAfterLogin,
  requiresPatientSelection,
  resolveModeRoute,
} from './episModeGuards.js';
import { resolveActiveMode, EPIS_MODES } from './episModes.js';
import {
  ThreeModesArchitectureResultSchema,
  ModeTransitionResultSchema,
} from '../design-agents/schemas.js';

describe('episModes', () => {
  it('define exactamente tres modos', () => {
    expect(EPIS_MODES).toEqual(['command', 'classic', 'dashboard']);
  });

  it('resuelve modo activo desde ruta', () => {
    expect(resolveActiveMode('/comando', {})).toBe('command');
    expect(resolveActiveMode('/espacio/buscar-paciente', {})).toBe('command');
    expect(resolveActiveMode('/epis2/dashboard', { mode: 'dashboard' })).toBe('dashboard');
    expect(resolveActiveMode('/espacio/ficha', { mode: 'classic' })).toBe('classic');
  });

  it('login default siempre es comando (censo-first)', () => {
    expect(getDefaultModeAfterLogin({ role: 'physician', permissions: [] })).toBe('command');
    expect(getDefaultRouteAfterLogin({ role: 'physician', permissions: [] })).toBe(
      '/espacio/buscar-paciente',
    );
  });

  it('classic requiere paciente', () => {
    expect(requiresPatientSelection('classic')).toBe(true);
    expect(requiresPatientSelection('dashboard')).toBe(false);
  });

  it('resolveModeRoute dashboard incluye mode=dashboard', () => {
    const route = resolveModeRoute('dashboard', { dashboardTab: 'pharmacy' });
    expect(route.to).toBe('/epis2/dashboard');
    expect(route.search.mode).toBe('dashboard');
    expect(route.search.tab).toBe('pharmacy');
  });

  it('schemas orquestación validan JSON', () => {
    ThreeModesArchitectureResultSchema.parse({
      score: 90,
      violations: [],
      suggestions: [],
      risk: 'low',
      commandIsHome: true,
      noParallelRouter: true,
      modesConnected: true,
    });
    ModeTransitionResultSchema.parse({
      score: 85,
      violations: [],
      suggestions: [],
      risk: 'low',
      returnToPreserved: true,
      activePatientPreserved: true,
      draftLossRisk: false,
    });
  });
});
