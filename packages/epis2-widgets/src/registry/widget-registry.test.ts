import { describe, expect, it } from 'vitest';
import { EPIS2_WIDGET_REGISTRY, getWidgetById, listWidgets } from './widget-registry.js';
import { validateWidgetRegistry } from './widget-registry-gates.js';

describe('widget-registry', () => {
  it('expone exactamente seis widgets demo', () => {
    expect(listWidgets()).toHaveLength(6);
  });

  it('garantiza unicidad de ids', () => {
    const ids = listWidgets().map((w) => w.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('valida gates del registry canónico', () => {
    const gate = validateWidgetRegistry(EPIS2_WIDGET_REGISTRY);
    expect(gate.ok, gate.details.join('; ')).toBe(true);
  });

  it('incluye widgets requeridos de demostración', () => {
    for (const id of [
      'patient-context',
      'pending-drafts',
      'patient-summary',
      'active-problems',
      'recent-labs',
      'my-work',
    ]) {
      expect(getWidgetById(id)?.id).toBe(id);
    }
  });

  it('no configura tablero como home', () => {
    const dashboard = getWidgetById('my-work');
    expect(dashboard?.category).toBe('dashboard');
    expect(dashboard?.route).not.toBe('/comando');
  });

  it('declara copy en español', () => {
    for (const widget of listWidgets()) {
      expect(widget.copy.loading).toMatch(/Cargando|Modo sin conexión|Sin datos/);
      expect(widget.copy.forbidden).toContain('rol');
    }
  });
});
