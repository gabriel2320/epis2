import { describe, expect, it } from 'vitest';
import { layoutMonthGrid } from './monthLayout.js';
import { DEMO_MONTH_EVENTS } from './demoMonthData.js';

describe('monthLayout', () => {
  it('genera grid 6×7 con encabezados', () => {
    const grid = layoutMonthGrid('2026-06', DEMO_MONTH_EVENTS);
    expect(grid.weekdayHeaders).toHaveLength(7);
    expect(grid.weeks).toHaveLength(6);
    expect(grid.weeks[0]).toHaveLength(7);
    expect(grid.monthLabel.toLowerCase()).toContain('junio');
  });

  it('marca días con eventos y pendientes', () => {
    const grid = layoutMonthGrid('2026-06', DEMO_MONTH_EVENTS);
    const flat = grid.weeks.flat();
    const busy = flat.find((c) => c.date === '2026-06-11');
    expect(busy?.totalEvents).toBeGreaterThanOrEqual(4);
    expect(busy?.pendingCount).toBeGreaterThanOrEqual(1);
    expect(busy?.markers.length).toBeGreaterThan(0);
  });

  it('atenua días fuera del mes', () => {
    const grid = layoutMonthGrid('2026-06', []);
    const outside = grid.weeks.flat().filter((c) => !c.inCurrentMonth);
    expect(outside.length).toBeGreaterThan(0);
  });
});
