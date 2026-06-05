import { describe, expect, it } from 'vitest';
import { resolveWidgetPlacement, WIDGET_GRID_COLUMNS } from './widget-layout.js';

describe('widget-layout', () => {
  it('usa rejilla de 12 columnas', () => {
    expect(WIDGET_GRID_COLUMNS).toBe(12);
  });

  it('compacta widgets en breakpoint compact', () => {
    const placement = resolveWidgetPlacement('medium', 'compact');
    expect(placement.columnSpan).toBe(12);
  });

  it('distribuye wide en desktop', () => {
    const placement = resolveWidgetPlacement('wide', 'expanded');
    expect(placement.columnSpan).toBe(12);
    expect(placement.minHeight).toBeGreaterThan(0);
  });

  it('respeta reduced motion sin transición', () => {
    const placement = resolveWidgetPlacement('compact', 'medium', true);
    expect(placement.transition).toBe('none');
  });
});
