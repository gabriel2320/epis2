import { describe, expect, it } from 'vitest';
import { buildCommandResolveContext, parseEhrSectionSearch } from './useCommandResolveContext.js';

describe('buildCommandResolveContext', () => {
  it('propaga chartMode=paper en patient_chart', () => {
    const ctx = buildCommandResolveContext('patient_chart', {
      pendingDraftCount: 0,
      activeAlertCount: 0,
      chartMode: 'paper',
    });
    expect(ctx.chartMode).toBe('paper');
    expect(ctx.workspace).toBe('patient_chart');
  });

  it('propaga paperSurface y plannerView cuando chartMode=paper', () => {
    const ctx = buildCommandResolveContext('patient_chart', {
      pendingDraftCount: 0,
      activeAlertCount: 0,
      chartMode: 'paper',
      paperSurface: 'planner',
      plannerView: 'week',
    });
    expect(ctx.paperSurface).toBe('planner');
    expect(ctx.plannerView).toBe('week');
  });

  it('no propaga chartMode fuera de patient_chart', () => {
    const ctx = buildCommandResolveContext('command_center', {
      pendingDraftCount: 1,
      activeAlertCount: 0,
      chartMode: 'paper',
    });
    expect(ctx.chartMode).toBeUndefined();
    expect(ctx.pendingDraftCount).toBe(1);
  });

  it('propaga traditionalSection sin chartMode explícito (default tradicional)', () => {
    const ctx = buildCommandResolveContext('patient_chart', {
      pendingDraftCount: 0,
      activeAlertCount: 0,
      traditionalSection: 'navOrders',
    });
    expect(ctx.traditionalSection).toBe('navOrders');
    expect(ctx.chartMode).toBeUndefined();
  });

  it('propaga traditionalSection en chartMode=traditional (MF-CM-04)', () => {
    const ctx = buildCommandResolveContext('patient_chart', {
      pendingDraftCount: 0,
      activeAlertCount: 0,
      chartMode: 'traditional',
      traditionalSection: 'navMeds',
    });
    expect(ctx.traditionalSection).toBe('navMeds');
  });

  it('propaga assistBlueprintId', () => {
    const ctx = buildCommandResolveContext('patient_chart', {
      pendingDraftCount: 0,
      activeAlertCount: 0,
      assistBlueprintId: 'evolution_note',
    });
    expect(ctx.assistBlueprintId).toBe('evolution_note');
  });
});

describe('parseEhrSectionSearch MF-CM-04', () => {
  it('acepta nav ids válidos', () => {
    expect(parseEhrSectionSearch({ ehrSection: 'navOrders' })).toBe('navOrders');
  });

  it('rechaza ids desconocidos', () => {
    expect(parseEhrSectionSearch({ ehrSection: 'navFoo' })).toBeUndefined();
  });
});
