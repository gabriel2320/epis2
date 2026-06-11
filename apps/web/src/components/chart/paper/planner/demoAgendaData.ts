import type { PaperPlannerEvent, PaperPlannerPendingItem } from './types.js';

/** Datos demo MF-PLANNER-00 — reemplazar por API en MF-PLANNER-01+. */
export const DEMO_PLANNER_DATE = '2026-06-11';

export const DEMO_PLANNER_EVENTS: readonly PaperPlannerEvent[] = [
  {
    id: 'evt-1',
    time: '08:30',
    durationMin: 30,
    title: 'Visita ambulatoria — control HTA',
    kind: 'encounter',
    location: 'Box 3',
  },
  {
    id: 'evt-2',
    time: '10:00',
    durationMin: 15,
    title: 'Evolución SOAP pendiente',
    kind: 'evolution',
    pending: true,
  },
  {
    id: 'evt-3',
    time: '11:30',
    durationMin: 20,
    title: 'Resultados laboratorio — perfil lipídico',
    kind: 'lab',
    location: 'Bandeja resultados',
  },
  {
    id: 'evt-4',
    time: '14:00',
    durationMin: 45,
    title: 'Interconsulta cardiología',
    kind: 'encounter',
    location: 'Poli consulta',
  },
  {
    id: 'evt-5',
    time: '16:30',
    durationMin: 15,
    title: 'Firma epicrisis borrador',
    kind: 'admin',
    pending: true,
  },
];

export const DEMO_PLANNER_PENDING: readonly PaperPlannerPendingItem[] = [
  {
    id: 'pend-1',
    label: 'Confirmar alergias en carátula',
    dueBy: '12:00',
    priority: 'urgent',
  },
  {
    id: 'pend-2',
    label: 'Solicitar imagenología tórax',
    dueBy: 'Hoy',
    priority: 'routine',
  },
  {
    id: 'pend-3',
    label: 'Revisar interconsulta pendiente',
    priority: 'routine',
  },
];

export const PLANNER_DAY_HOURS = [
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
] as const;
