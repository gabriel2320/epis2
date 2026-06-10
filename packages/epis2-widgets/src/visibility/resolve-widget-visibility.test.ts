import { describe, expect, it } from 'vitest';
import { getWidgetById } from '../registry/widget-registry.js';
import {
  filterFetchableWidgetIds,
  resolveWidgetVisibility,
  resolveVisibleWidgets,
} from './resolve-widget-visibility.js';

describe('resolve-widget-visibility', () => {
  const patientContext = {
    surface: 'command-center' as const,
    userId: 'user-1',
    role: 'physician' as const,
    patientId: 'demo-patient-001',
  };

  it('oculta widgets sin paciente cuando lo requieren', () => {
    const context = getWidgetById('patient-context')!;
    const vis = resolveWidgetVisibility(context, {
      surface: 'command-center',
      userId: 'user-1',
      role: 'physician',
    });
    expect(vis.visible).toBe(false);
    expect(vis.shouldFetch).toBe(false);
    expect(vis.reason).toBe('missing-context');
  });

  it('muestra patient-context con paciente y no oculto por defecto', () => {
    const widget = getWidgetById('patient-context')!;
    const vis = resolveWidgetVisibility(widget, patientContext);
    expect(vis.visible).toBe(true);
    expect(vis.shouldFetch).toBe(true);
  });

  it('widgets ocultos por defecto no cargan datos', () => {
    const drafts = getWidgetById('pending-drafts')!;
    const vis = resolveWidgetVisibility(drafts, patientContext);
    expect(vis.shouldFetch).toBe(false);
    expect(vis.reason).toBe('hidden-by-default');
  });

  it('widgets ocultos cargan solo si se revelan explícitamente', () => {
    const drafts = getWidgetById('pending-drafts')!;
    const vis = resolveWidgetVisibility(drafts, {
      ...patientContext,
      explicitlyShownWidgetIds: ['pending-drafts'],
    });
    expect(vis.shouldFetch).toBe(true);
  });

  it('dashboard no aparece en home del Centro de Comando', () => {
    const myWork = getWidgetById('my-work')!;
    const vis = resolveWidgetVisibility(myWork, {
      surface: 'command-center',
      userId: 'user-1',
      role: 'physician',
      explicitlyShownWidgetIds: ['my-work'],
    });
    expect(vis.visible).toBe(false);
    expect(vis.reason).toBe('dashboard-not-on-home');
  });

  it('rol no autorizado no revela datos (sin fetch)', () => {
    const labs = getWidgetById('recent-labs')!;
    const vis = resolveWidgetVisibility(labs, {
      ...patientContext,
      role: 'auditor',
      explicitlyShownWidgetIds: ['recent-labs'],
    });
    expect(vis.visible).toBe(false);
    expect(vis.shouldFetch).toBe(false);
    expect(vis.reason).toBe('forbidden');
  });

  it('filterFetchableWidgetIds excluye ocultos', () => {
    const ids = filterFetchableWidgetIds(
      [getWidgetById('patient-context')!, getWidgetById('pending-drafts')!],
      patientContext,
    );
    expect(ids).toEqual(['patient-context']);
  });

  it('marca offline cuando el contexto está sin conexión', () => {
    const widget = getWidgetById('patient-summary')!;
    const vis = resolveWidgetVisibility(widget, {
      ...patientContext,
      offline: true,
      explicitlyShownWidgetIds: ['patient-summary'],
    });
    expect(vis.presentation).toBe('offline');
  });

  it('pending-drafts y my-work requieren usuario', () => {
    for (const id of ['pending-drafts', 'my-work'] as const) {
      const widget = getWidgetById(id)!;
      expect(widget.requiredContext).toContain('user');
    }
    const vis = resolveVisibleWidgets([getWidgetById('my-work')!], {
      surface: 'dashboard',
      role: 'physician',
      explicitlyShownWidgetIds: ['my-work'],
    });
    expect(vis[0]?.shouldFetch).toBe(false);
    expect(vis[0]?.reason).toBe('missing-context');
  });
});
