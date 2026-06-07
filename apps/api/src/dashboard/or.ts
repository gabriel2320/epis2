import type { Database } from '../db/client.js';
import { patients } from '../db/schema.js';

const OR_IDC_PANELS = [
  { idc: 151, label: 'Tabla quirúrgica', status: 'active' as const },
  { idc: 152, label: 'Checklist cirugía segura OMS', status: 'active' as const },
  { idc: 153, label: 'Evaluación preanestésica', status: 'planned' as const },
  { idc: 154, label: 'Hoja anestesia intraoperatoria', status: 'planned' as const },
  { idc: 155, label: 'Protocolo operatorio', status: 'planned' as const },
  { idc: 156, label: 'Recuento compresas / insumos', status: 'planned' as const },
  { idc: 157, label: 'Biopsia intraoperatoria', status: 'planned' as const },
  { idc: 158, label: 'Recuperación URPA', status: 'planned' as const },
  { idc: 159, label: 'Banco de sangre', status: 'planned' as const },
  { idc: 160, label: 'Esterilización / trazabilidad', status: 'planned' as const },
];

export async function getOrDashboardSummary(db: Database, role: string) {
  const rows = await db
    .select({ id: patients.id, displayName: patients.displayName })
    .from(patients)
    .limit(4);

  const surgicalSchedule = rows.map((p, index) => ({
    caseId: `or-case-${index + 1}`,
    patientId: p.id,
    patientDisplayName: p.displayName,
    procedureName: ['Colecistectomía laparoscópica', 'Apendicectomía', 'Hernioplastia inguinal', 'Artroscopía rodilla'][index] ?? 'Procedimiento programado',
    operatingRoom: `QX-${index + 1}`,
    scheduledStart: `${String(8 + index * 2).padStart(2, '0')}:00`,
    estimatedDurationMin: 90 + index * 15,
    status: (index === 0 ? 'in_progress' : index === 1 ? 'preparing' : 'scheduled') as
      | 'scheduled'
      | 'preparing'
      | 'in_progress'
      | 'completed',
    surgeonDisplayName: ['Dra. Morales', 'Dr. Soto', 'Dr. Vega', 'Dra. Ríos'][index] ?? 'Equipo quirúrgico',
  }));

  const inProgress = surgicalSchedule.filter((row) => row.status === 'in_progress').length;
  const scheduledToday = surgicalSchedule.filter((row) => row.status !== 'completed').length;

  const whoSafetyChecklist = surgicalSchedule
    .filter((row) => row.status === 'in_progress' || row.status === 'preparing')
    .flatMap((row) => {
      const pauses = [
        { pauseId: `${row.caseId}-sign-in`, pauseLabel: 'Sign In (pre-inducción)', totalItems: 7 },
        { pauseId: `${row.caseId}-time-out`, pauseLabel: 'Time Out (pre-incisión)', totalItems: 6 },
        { pauseId: `${row.caseId}-sign-out`, pauseLabel: 'Sign Out (pre-salida)', totalItems: 5 },
      ];
      return pauses.map((pause, index) => {
        const completedItems =
          row.status === 'in_progress'
            ? index === 0
              ? 7
              : index === 1
                ? 4
                : 0
            : index === 0
              ? 3
              : 0;
        const status =
          completedItems === 0
            ? ('pending' as const)
            : completedItems >= pause.totalItems
              ? ('completed' as const)
              : ('in_progress' as const);
        return {
          ...pause,
          caseId: row.caseId,
          patientDisplayName: row.patientDisplayName,
          operatingRoom: row.operatingRoom,
          completedItems,
          status,
        };
      });
    });

  return {
    readOnly: true as const,
    roleView: (role === 'admin' || role === 'nurse' ? role : 'physician') as
      | 'physician'
      | 'nurse'
      | 'admin',
    idcPanels: OR_IDC_PANELS,
    surgicalSchedule,
    whoSafetyChecklist,
    metrics: {
      operatingRoomsInUse: inProgress + (surgicalSchedule.some((r) => r.status === 'preparing') ? 1 : 0),
      scheduledToday,
      inProgress,
    },
  };
}
