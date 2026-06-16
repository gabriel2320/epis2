import type { DemoShiftCensusPresentation } from '../fixtures/demoFixtureTypes.js';
import {
  getDemoShiftCensusPresentation,
  listDemoShiftCensusPresentations,
} from '../fixtures/devFixturesBridge.js';

export type { DemoShiftCensusPresentation };

export { getDemoShiftCensusPresentation, listDemoShiftCensusPresentations };

export type CensusPrimaryActionRoute = {
  to: '/espacio/evolucion' | '/espacio/ficha';
  search: { patientId: string; chartMode?: 'traditional' | 'paper' };
};

export function resolveCensusPrimaryActionRoute(
  presentation: DemoShiftCensusPresentation,
  patientId: string,
): CensusPrimaryActionRoute {
  switch (presentation.primaryAction) {
    case 'create_evolution':
    case 'continue_evolution':
      return { to: '/espacio/evolucion', search: { patientId } };
    case 'review_draft':
      return { to: '/espacio/ficha', search: { patientId, chartMode: 'traditional' } };
    case 'open_chart':
    default:
      return { to: '/espacio/ficha', search: { patientId, chartMode: 'paper' } };
  }
}
