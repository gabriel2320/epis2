import { describe, expect, it } from 'vitest';
import { EPIS_CICA_SCREEN_REGISTRY, registryRouteToTanstackPath } from '@epis2/epis2-ui';
import { CICA_ROUTE_COMPONENTS } from './cicaRouteComponents.js';
import {
  CICA_REGISTRY_ROUTE_WIRING,
  buildCicaRoutesFromRegistry,
  listCicaRegistryScreenIds,
} from './buildCicaRoutesFromRegistry.js';

describe('buildCicaRoutesFromRegistry', () => {
  it('expone componente para cada screenId del registry', () => {
    const ids = listCicaRegistryScreenIds();
    expect(ids.length).toBe(EPIS_CICA_SCREEN_REGISTRY.length);
    for (const id of ids) {
      expect(CICA_ROUTE_COMPONENTS[id]).toBeTruthy();
    }
  });

  it('wiring sigue orden y paths del registry sin drift', () => {
    expect(CICA_REGISTRY_ROUTE_WIRING.length).toBe(EPIS_CICA_SCREEN_REGISTRY.length);
    for (let i = 0; i < EPIS_CICA_SCREEN_REGISTRY.length; i += 1) {
      const screen = EPIS_CICA_SCREEN_REGISTRY[i]!;
      const wiring = CICA_REGISTRY_ROUTE_WIRING[i]!;
      expect(wiring.id).toBe(screen.id);
      expect(wiring.path).toBe(registryRouteToTanstackPath(screen.route));
    }
  });

  it('genera una ruta por screen del wiring', () => {
    const parent = { id: 'cica-shell-mock' };
    const routes = buildCicaRoutesFromRegistry(parent as never);
    expect(routes.length).toBe(CICA_REGISTRY_ROUTE_WIRING.length);
  });
});
