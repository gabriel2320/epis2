import type { PaperPlannerMonthEvent } from './monthLayout.js';
import { DEMO_PLANNER_DATE } from './demoAgendaData.js';
import { yearMonthFromDate } from './monthLayout.js';

/** Mes demo anclado a DEMO_PLANNER_DATE. */
export const DEMO_MONTH_YEAR_MONTH = yearMonthFromDate(DEMO_PLANNER_DATE);

export const DEMO_MONTH_EVENTS: readonly PaperPlannerMonthEvent[] = [
  { id: 'm-01', date: '2026-06-02', kind: 'encounter' },
  { id: 'm-02', date: '2026-06-05', kind: 'lab' },
  { id: 'm-03', date: '2026-06-08', kind: 'encounter' },
  { id: 'm-04', date: '2026-06-08', kind: 'admin', pending: true },
  { id: 'm-05', date: '2026-06-09', kind: 'encounter' },
  { id: 'm-06', date: '2026-06-09', kind: 'evolution', pending: true },
  { id: 'm-07', date: '2026-06-11', kind: 'encounter' },
  { id: 'm-08', date: '2026-06-11', kind: 'encounter' },
  { id: 'm-09', date: '2026-06-11', kind: 'lab' },
  { id: 'm-10', date: '2026-06-11', kind: 'admin', pending: true },
  { id: 'm-11', date: '2026-06-15', kind: 'imaging' },
  { id: 'm-12', date: '2026-06-18', kind: 'procedure' },
  { id: 'm-13', date: '2026-06-22', kind: 'admin' },
  { id: 'm-14', date: '2026-06-28', kind: 'encounter' },
];
