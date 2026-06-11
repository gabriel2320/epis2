import type { PaperPlannerEventKind } from './types.js';

/** Evento posicionado en un día de la semana (MF-PLANNER-01). */
export type PaperPlannerWeekEvent = {
  id: string;
  date: string;
  title: string;
  kind: PaperPlannerEventKind;
  pending?: boolean;
};

export type PaperPlannerWeekItem = {
  id: string;
  title: string;
  kind: PaperPlannerEventKind;
  pending?: boolean;
};

export type WeekDayColumn = {
  date: string;
  weekdayLabel: string;
  dayLabel: string;
  items: PaperPlannerWeekItem[];
  overflowCount: number;
};

export const PLANNER_WEEK_MAX_ITEMS_PER_DAY = 4;

function toIsoDateLocal(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Lunes como inicio de semana (calendario clínico CL). */
export function startOfWeek(isoDate: string): string {
  const d = new Date(`${isoDate}T12:00:00`);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return toIsoDateLocal(d);
}

export function buildWeekDayDates(weekStart: string): string[] {
  const start = new Date(`${weekStart}T12:00:00`);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return toIsoDateLocal(d);
  });
}

function sortDayEvents(a: PaperPlannerWeekEvent, b: PaperPlannerWeekEvent): number {
  if (a.pending && !b.pending) return -1;
  if (!a.pending && b.pending) return 1;
  return a.title.localeCompare(b.title, 'es');
}

function formatDayLabels(isoDate: string): { weekdayLabel: string; dayLabel: string } {
  const d = new Date(`${isoDate}T12:00:00`);
  const weekdayLabel = d.toLocaleDateString('es-CL', { weekday: 'short' });
  const dayLabel = d.toLocaleDateString('es-CL', { day: 'numeric', month: 'short' });
  return { weekdayLabel, dayLabel };
}

/** Agrupa eventos en 7 columnas; máx `maxPerDay` visibles + overflow. */
export function layoutWeekGrid(
  weekStart: string,
  events: readonly PaperPlannerWeekEvent[],
  maxPerDay = PLANNER_WEEK_MAX_ITEMS_PER_DAY,
): WeekDayColumn[] {
  const dates = buildWeekDayDates(weekStart);
  const byDate = new Map<string, PaperPlannerWeekEvent[]>();

  for (const evt of events) {
    const list = byDate.get(evt.date) ?? [];
    list.push(evt);
    byDate.set(evt.date, list);
  }

  return dates.map((date) => {
    const sorted = [...(byDate.get(date) ?? [])].sort(sortDayEvents);
    const visible = sorted.slice(0, maxPerDay);
    const overflowCount = Math.max(0, sorted.length - maxPerDay);
    const { weekdayLabel, dayLabel } = formatDayLabels(date);

    return {
      date,
      weekdayLabel,
      dayLabel,
      overflowCount,
      items: visible.map((evt) => ({
        id: evt.id,
        title: evt.title,
        kind: evt.kind,
        ...(evt.pending ? { pending: true as const } : {}),
      })),
    };
  });
}
