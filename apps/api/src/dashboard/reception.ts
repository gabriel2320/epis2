import type { Database } from '../db/client.js';
import { patients } from '../db/schema.js';

const RECEPTION_IDC_PANELS = [
  { idc: 2, label: 'Dashboard recepción', status: 'active' as const },
  { idc: 3, label: 'Agenda diaria profesional', status: 'active' as const },
  { idc: 4, label: 'Calendario mensual centro', status: 'active' as const },
  { idc: 5, label: 'Formulario admisión administrativa', status: 'active' as const },
  { idc: 6, label: 'Biometría / firma', status: 'planned' as const },
  { idc: 7, label: 'Sala de espera virtual', status: 'active' as const },
  { idc: 8, label: 'Gestión sobrecupos', status: 'active' as const },
  { idc: 9, label: 'Registro acompañantes', status: 'active' as const },
  { idc: 10, label: 'Panel llamado (tótem)', status: 'active' as const },
];

export async function getReceptionDashboardSummary(db: Database, role: string) {
  const rows = await db
    .select({
      id: patients.id,
      displayName: patients.displayName,
    })
    .from(patients)
    .limit(5);

  const now = new Date();
  const todayAppointments = rows.map((p, index) => ({
    id: `appt-${index + 1}`,
    patientDisplayName: p.displayName,
    professionalName: 'Dra. Ana Demo',
    scheduledAt: new Date(now.getTime() + index * 45 * 60_000).toISOString(),
    status: (index === 0 ? 'in_consultation' : index === 1 ? 'checked_in' : 'scheduled') as
      | 'scheduled'
      | 'checked_in'
      | 'in_consultation'
      | 'completed'
      | 'no_show',
  }));

  const waitingQueue = rows.slice(1, 4).map((p, index) => ({
    ticket: `A-${String(index + 12).padStart(3, '0')}`,
    patientDisplayName: p.displayName,
    waitMinutes: 5 + index * 7,
  }));

  return {
    readOnly: true as const,
    roleView: (role === 'admin' || role === 'nurse' ? role : 'physician') as
      | 'physician'
      | 'nurse'
      | 'admin',
    idcPanels: RECEPTION_IDC_PANELS,
    todayAppointments,
    waitingQueue,
    callPanel: {
      lastCalled: waitingQueue[0]?.patientDisplayName,
      ticketNumber: waitingQueue[0]?.ticket,
    },
    metrics: {
      checkedIn: todayAppointments.filter((a) => a.status === 'checked_in').length,
      waiting: waitingQueue.length,
      companions: 2,
      overbookingAlerts: 0,
    },
  };
}
