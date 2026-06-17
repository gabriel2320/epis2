/** Fixtures demo — estructura epis2g SystemGlobalViews (sin PHI). */

export type CicaRecentCard = {
  id: string;
  displayName: string;
  location: string;
  rut: string;
  ageLabel: string;
  lastActivity: string;
};

export type CicaWorkTask = {
  id: string;
  title: string;
  patientName: string;
  reason: string;
  status: 'PENDIENTE' | 'URGENTE';
};

export type CicaAgendaEvent = {
  time: string;
  title: string;
  room: string;
  status: 'Realizado' | 'Pendiente';
};

export const CICA_DEMO_RECENT: readonly CicaRecentCard[] = [
  {
    id: 'recent-1',
    displayName: 'María Loreto Soto',
    location: 'UTI 402',
    rut: '12.345.678-9',
    ageLabel: '68 años',
    lastActivity: 'Revisión evolución matinal',
  },
  {
    id: 'recent-2',
    displayName: 'Juan Andrés Pérez',
    location: 'UCI 205-A',
    rut: '9.876.543-2',
    ageLabel: '54 años',
    lastActivity: 'Ajuste indicaciones vasoactivas',
  },
];

export const CICA_DEMO_WORK_TASKS: readonly CicaWorkTask[] = [
  {
    id: 'task-1',
    title: 'Completar epicrisis de alta',
    patientName: 'María Loreto Soto',
    reason: 'Paciente estable en UTI 402',
    status: 'PENDIENTE',
  },
  {
    id: 'task-2',
    title: 'Firmar evolución SOAP de urgencia',
    patientName: 'Juan Andrés Pérez',
    reason: 'Paciente grave en UCI 205-A',
    status: 'URGENTE',
  },
];

export const CICA_DEMO_AGENDA: readonly CicaAgendaEvent[] = [
  {
    time: '08:30 - 09:30',
    title: 'Pase de guardia intermedio UTI',
    room: 'Salón de sesiones UTI',
    status: 'Realizado',
  },
  {
    time: '10:00 - 11:30',
    title: 'Visita clínica multidisciplinaria UCI',
    room: 'Unidad de cuidados críticos',
    status: 'Realizado',
  },
  {
    time: '14:30 - 15:30',
    title: 'Reunión de auditoría de camas críticas',
    room: 'Dirección médica central',
    status: 'Pendiente',
  },
  {
    time: '16:00 - 17:00',
    title: 'Procedimiento programado: angiografía de control',
    room: 'Pabellón cardiovascular',
    status: 'Pendiente',
  },
];
