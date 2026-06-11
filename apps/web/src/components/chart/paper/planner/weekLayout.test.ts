import { describe, expect, it } from 'vitest';
import type { PaperPlannerWeekEvent } from './weekLayout.js';
import {
  PLANNER_WEEK_MAX_ITEMS_PER_DAY,
  buildWeekDayDates,
  layoutWeekGrid,
  startOfWeek,
} from './weekLayout.js';

describe('weekLayout', () => {
  it('startOfWeek ancla semana que contiene la fecha', () => {
    const start = startOfWeek('2026-06-11');
    const dates = buildWeekDayDates(start);
    expect(dates).toHaveLength(7);
    expect(dates).toContain('2026-06-11');
  });

  it('buildWeekDayDates genera 7 días consecutivos', () => {
    const start = startOfWeek('2026-06-11');
    const dates = buildWeekDayDates(start);
    const d0 = new Date(`${dates[0]}T12:00:00`);
    const d6 = new Date(`${dates[6]}T12:00:00`);
    expect((d6.getTime() - d0.getTime()) / 86400000).toBe(6);
  });

  it('layoutWeekGrid limita a 4 ítems visibles y cuenta overflow', () => {
    const weekStart = startOfWeek('2026-06-11');
    const events: PaperPlannerWeekEvent[] = Array.from({ length: 6 }, (_, i) => ({
      id: `e-${i}`,
      date: '2026-06-11',
      title: `Evento ${i}`,
      kind: 'admin',
    }));

    const columns = layoutWeekGrid(weekStart, events);
    const wed = columns.find((c) => c.date === '2026-06-11');
    expect(wed?.items).toHaveLength(PLANNER_WEEK_MAX_ITEMS_PER_DAY);
    expect(wed?.overflowCount).toBe(2);
  });

  it('prioriza pendientes antes de rutina en el mismo día', () => {
    const weekStart = startOfWeek('2026-06-11');
    const events: PaperPlannerWeekEvent[] = [
      { id: 'a', date: '2026-06-09', title: 'Z rutina', kind: 'lab' },
      { id: 'b', date: '2026-06-09', title: 'A pendiente', kind: 'evolution', pending: true },
    ];
    const col = layoutWeekGrid(weekStart, events).find((c) => c.date === '2026-06-09');
    expect(col?.items[0]?.id).toBe('b');
  });
});
