import type { PaperPlannerWeekEvent } from './weekLayout.js';
import { startOfWeek } from './weekLayout.js';
import { DEMO_PLANNER_DATE } from './demoAgendaData.js';

/** Semana demo anclada a DEMO_PLANNER_DATE (2026-06-11 miércoles). */
export const DEMO_WEEK_START = startOfWeek(DEMO_PLANNER_DATE);

export const DEMO_WEEK_EVENTS: readonly PaperPlannerWeekEvent[] = [
  { id: 'w-mon-1', date: '2026-06-08', title: 'Ronda sala 3A', kind: 'encounter' },
  {
    id: 'w-mon-2',
    date: '2026-06-08',
    title: 'Firma consentimientos',
    kind: 'admin',
    pending: true,
  },
  { id: 'w-tue-1', date: '2026-06-09', title: 'Control HTA ambulatorio', kind: 'encounter' },
  { id: 'w-tue-2', date: '2026-06-09', title: 'Evolución SOAP', kind: 'evolution', pending: true },
  { id: 'w-tue-3', date: '2026-06-09', title: 'Lab perfil lipídico', kind: 'lab' },
  { id: 'w-wed-1', date: '2026-06-11', title: 'Visita ambulatoria', kind: 'encounter' },
  { id: 'w-wed-2', date: '2026-06-11', title: 'Interconsulta cardio', kind: 'encounter' },
  { id: 'w-wed-3', date: '2026-06-11', title: 'Resultados lab', kind: 'lab' },
  { id: 'w-wed-4', date: '2026-06-11', title: 'Epicrisis borrador', kind: 'admin', pending: true },
  { id: 'w-wed-5', date: '2026-06-11', title: 'Imagenología tórax', kind: 'imaging' },
  { id: 'w-wed-6', date: '2026-06-11', title: 'Nota enfermería', kind: 'procedure' },
  { id: 'w-thu-1', date: '2026-06-12', title: 'Alta programada', kind: 'admin' },
  { id: 'w-fri-1', date: '2026-06-13', title: 'Control post-alta tel', kind: 'encounter' },
];
