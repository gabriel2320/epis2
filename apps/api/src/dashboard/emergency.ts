import type { Database } from '../db/client.js';
import { patients } from '../db/schema.js';

const EMERGENCY_IDC_PANELS = [
  { idc: 101, label: 'Triaje urgencias', status: 'active' as const },
  { idc: 102, label: 'Box urgencias', status: 'active' as const },
  { idc: 103, label: 'Reanimación (Clave Azul)', status: 'active' as const },
  { idc: 104, label: 'Trauma / FAST', status: 'planned' as const },
  { idc: 105, label: 'Hoja observación corta', status: 'active' as const },
  { idc: 106, label: 'Alta urgencias', status: 'planned' as const },
  { idc: 107, label: 'Derivación hospitalización', status: 'planned' as const },
  { idc: 108, label: 'Procedimientos urgencia', status: 'planned' as const },
  { idc: 109, label: 'Consentimiento urgente', status: 'planned' as const },
  { idc: 110, label: 'Epicrisis urgencias', status: 'planned' as const },
];

export async function getEmergencyDashboardSummary(db: Database, role: string) {
  const rows = await db
    .select({ id: patients.id, displayName: patients.displayName })
    .from(patients)
    .limit(4);

  const triageQueue = rows.map((p, index) => ({
    id: `triage-${index + 1}`,
    patientDisplayName: p.displayName,
    chiefComplaint: ['Dolor torácico', 'Trauma menor', 'Fiebre alta', 'Cefalea intensa'][index] ?? 'Consulta',
    triageLevel: (String(Math.min(index + 2, 5)) as '1' | '2' | '3' | '4' | '5'),
    arrivedAt: new Date(Date.now() - index * 18 * 60_000).toISOString(),
    status: (index === 0 ? 'observation' : 'waiting') as 'waiting' | 'observation' | 'discharged' | 'admitted',
  }));

  return {
    readOnly: true as const,
    roleView: (role === 'admin' || role === 'nurse' ? role : 'physician') as
      | 'physician'
      | 'nurse'
      | 'admin',
    idcPanels: EMERGENCY_IDC_PANELS,
    triageQueue,
    observationBeds: 3,
    metrics: {
      waiting: triageQueue.filter((t) => t.status === 'waiting').length,
      inObservation: triageQueue.filter((t) => t.status === 'observation').length,
      dischargedToday: 1,
    },
  };
}
