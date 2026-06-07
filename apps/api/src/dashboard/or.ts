import type { Database } from '../db/client.js';
import { patients } from '../db/schema.js';

const OR_IDC_PANELS = [
  { idc: 151, label: 'Tabla quirúrgica', status: 'active' as const },
  { idc: 152, label: 'Checklist cirugía segura OMS', status: 'planned' as const },
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

  return {
    readOnly: true as const,
    roleView: (role === 'admin' || role === 'nurse' ? role : 'physician') as
      | 'physician'
      | 'nurse'
      | 'admin',
    idcPanels: OR_IDC_PANELS,
    surgicalSchedule,
    metrics: {
      operatingRoomsInUse: inProgress + (surgicalSchedule.some((r) => r.status === 'preparing') ? 1 : 0),
      scheduledToday,
      inProgress,
    },
  };
}
