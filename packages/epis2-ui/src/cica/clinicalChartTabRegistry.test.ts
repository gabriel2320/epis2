import { describe, expect, it } from 'vitest';
import { EPIS_CICA_SCREEN_REGISTRY } from './EPIS_CICA_SCREEN_REGISTRY.js';
import {
  CLINICAL_CHART_TAB_REGISTRY,
  LEGACY_PATIENT_CHART_TABS,
  buildCicaChartTabPath,
  legacyPatientChartTabTarget,
  resolveLegacyPatientChartTabId,
} from './clinicalChartTabRegistry.js';

describe('clinicalChartTabRegistry', () => {
  it('cada tab apunta a screenId del registry CICA', () => {
    const ids = new Set(EPIS_CICA_SCREEN_REGISTRY.map((s) => s.id));
    for (const tab of CLINICAL_CHART_TAB_REGISTRY) {
      expect(ids.has(tab.screenId)).toBe(true);
    }
  });

  it('buildCicaChartTabPath resuelve rutas /app', () => {
    expect(buildCicaChartTabPath('resumen', 'p1')).toBe('/app/pacientes/p1/resumen');
    expect(buildCicaChartTabPath('papel', 'p1', { paperDate: '2026-06-11' })).toBe(
      '/app/pacientes/p1/papel/dia/2026-06-11',
    );
  });

  it('legacy adapter mapea tabs M3 y rutas /espacio', () => {
    expect(LEGACY_PATIENT_CHART_TABS.map((t) => t.id)).toEqual([
      'summary',
      'history',
      'encounter',
      'results',
      'orders',
    ]);
    expect(resolveLegacyPatientChartTabId('/espacio/evolucion')).toBe('encounter');
    expect(legacyPatientChartTabTarget('results', 'p1')).toEqual({
      to: '/espacio/resultados',
      search: { patientId: 'p1' },
    });
  });
});
