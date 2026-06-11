import type { PaperPlannerEventKind } from './types.js';

/** Evento en calendario mensual (MF-PAPER-PLANNER-02). */
export type PaperPlannerMonthEvent = {
  id: string;
  date: string;
  kind: PaperPlannerEventKind;
  pending?: boolean;
};

export type MonthMarker = {
  kind: PaperPlannerEventKind;
  count: number;
};

export type MonthDayCell = {
  date: string;
  day: number;
  inCurrentMonth: boolean;
  markers: MonthMarker[];
  pendingCount: number;
  totalEvents: number;
};

export type MonthGrid = {
  yearMonth: string;
  monthLabel: string;
  weekdayHeaders: readonly string[];
  weeks: readonly (readonly MonthDayCell[])[];
};

const WEEKDAY_HEADERS = ['lun', 'mar', 'mié', 'jue', 'vie', 'sáb', 'dom'] as const;

function toIsoDateLocal(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Primer día del mes (YYYY-MM). */
export function startOfMonth(yearMonth: string): string {
  return `${yearMonth}-01`;
}

export function yearMonthFromDate(isoDate: string): string {
  return isoDate.slice(0, 7);
}

function buildMarkers(events: readonly PaperPlannerMonthEvent[]): {
  markers: MonthMarker[];
  pendingCount: number;
} {
  const byKind = new Map<PaperPlannerEventKind, number>();
  let pendingCount = 0;
  for (const evt of events) {
    byKind.set(evt.kind, (byKind.get(evt.kind) ?? 0) + 1);
    if (evt.pending) pendingCount += 1;
  }
  const markers = [...byKind.entries()]
    .map(([kind, count]) => ({ kind, count }))
    .sort((a, b) => b.count - a.count);
  return { markers, pendingCount };
}

/** Calendario mensual 6×7 con markers por día (lunes primero). */
export function layoutMonthGrid(
  yearMonth: string,
  events: readonly PaperPlannerMonthEvent[],
): MonthGrid {
  const [yearStr, monthStr] = yearMonth.split('-');
  const year = Number.parseInt(yearStr ?? '2026', 10);
  const monthIndex = Number.parseInt(monthStr ?? '1', 10) - 1;
  const first = new Date(year, monthIndex, 1, 12);
  const monthLabel = first.toLocaleDateString('es-CL', { month: 'long', year: 'numeric' });

  const byDate = new Map<string, PaperPlannerMonthEvent[]>();
  for (const evt of events) {
    const list = byDate.get(evt.date) ?? [];
    list.push(evt);
    byDate.set(evt.date, list);
  }

  const gridStart = new Date(first);
  const dow = gridStart.getDay();
  const pad = dow === 0 ? 6 : dow - 1;
  gridStart.setDate(gridStart.getDate() - pad);

  const weeks: MonthDayCell[][] = [];
  const cursor = new Date(gridStart);

  for (let w = 0; w < 6; w += 1) {
    const row: MonthDayCell[] = [];
    for (let d = 0; d < 7; d += 1) {
      const iso = toIsoDateLocal(cursor);
      const inCurrentMonth = cursor.getMonth() === monthIndex;
      const dayEvents = byDate.get(iso) ?? [];
      const { markers, pendingCount } = buildMarkers(dayEvents);
      row.push({
        date: iso,
        day: cursor.getDate(),
        inCurrentMonth,
        markers,
        pendingCount,
        totalEvents: dayEvents.length,
      });
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(row);
  }

  return {
    yearMonth,
    monthLabel,
    weekdayHeaders: WEEKDAY_HEADERS,
    weeks,
  };
}
