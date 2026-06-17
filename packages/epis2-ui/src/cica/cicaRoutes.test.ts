import { describe, expect, it } from 'vitest';
import { buildCicaPath, parseCicaPatientId } from './cicaRoutes.js';
import { CICA_CHART_TAB_REGISTRY } from './CICA_CHART_TAB_REGISTRY.js';
import { EPIS_CICA_SCREEN_REGISTRY } from './EPIS_CICA_SCREEN_REGISTRY.js';

describe('cicaRoutes', () => {
  it('buildCicaPath resuelve rutas con params', () => {
    expect(buildCicaPath('patient-search')).toBe('/app/buscar');
    expect(buildCicaPath('patient-summary', { patientId: 'p1' })).toBe('/app/pacientes/p1/resumen');
    expect(buildCicaPath('paper-day', { patientId: 'p1', date: '2026-06-11' })).toBe(
      '/app/pacientes/p1/papel/dia/2026-06-11',
    );
    expect(buildCicaPath('new-prescription', { patientId: 'p1' })).toBe(
      '/app/pacientes/p1/indicaciones/nueva',
    );
    expect(buildCicaPath('new-epicrisis', { patientId: 'p1' })).toBe(
      '/app/pacientes/p1/epicrisis/nueva',
    );
    expect(buildCicaPath('evolution-book', { patientId: 'p1' })).toBe(
      '/app/pacientes/p1/evoluciones/libro',
    );
    expect(buildCicaPath('evolution-detail', { patientId: 'p1', evolutionId: 'ev-1' })).toBe(
      '/app/pacientes/p1/evoluciones/ev-1',
    );
    expect(buildCicaPath('paper-book', { patientId: 'p1' })).toBe('/app/pacientes/p1/papel/libro');
    expect(buildCicaPath('recent-patients')).toBe('/app/recientes');
    expect(buildCicaPath('patient-admission', { patientId: 'p1' })).toBe(
      '/app/pacientes/p1/ingreso',
    );
    expect(buildCicaPath('patient-timeline', { patientId: 'p1' })).toBe(
      '/app/pacientes/p1/timeline',
    );
  });

  it('parseCicaPatientId extrae id desde pathname', () => {
    expect(parseCicaPatientId('/app/pacientes/abc/resumen')).toBe('abc');
    expect(parseCicaPatientId('/app/buscar')).toBeUndefined();
  });
});

describe('CICA registries alignment', () => {
  it('cada tab apunta a screenId del registry', () => {
    const ids = new Set(EPIS_CICA_SCREEN_REGISTRY.map((s) => s.id));
    for (const tab of CICA_CHART_TAB_REGISTRY) {
      expect(ids.has(tab.screenId)).toBe(true);
    }
  });
});
