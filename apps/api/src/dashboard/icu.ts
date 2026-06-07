import type { Database } from '../db/client.js';
import { patients } from '../db/schema.js';

const ICU_IDC_PANELS = [
  { idc: 41, label: 'Dashboard monitorización UCI', status: 'active' as const },
  { idc: 42, label: 'Sábana clínica (flujograma)', status: 'active' as const },
  { idc: 43, label: 'Balance hídrico estricto', status: 'planned' as const },
  { idc: 44, label: 'Parámetros ventilación', status: 'planned' as const },
  { idc: 45, label: 'Vías venosas e invasivos', status: 'planned' as const },
  { idc: 46, label: 'Valoración neurológica', status: 'planned' as const },
  { idc: 47, label: 'Escalas severidad', status: 'planned' as const },
  { idc: 48, label: 'Titulación vasoactivos', status: 'planned' as const },
  { idc: 49, label: 'Sedoanalgesia', status: 'planned' as const },
  { idc: 50, label: 'Epicrisis traslado UCI', status: 'planned' as const },
];

const ICU_SPECIALIZED_PANELS = [
  { idc: 131, label: 'Prueba ventilación espontánea', status: 'planned' as const },
  { idc: 132, label: 'Terapias renales continuas', status: 'planned' as const },
  { idc: 133, label: 'Nutrición parenteral total', status: 'planned' as const },
  { idc: 134, label: 'Nutrición enteral', status: 'planned' as const },
  { idc: 135, label: 'Monitorización hemodinámica', status: 'active' as const },
  { idc: 136, label: 'Muerte encefálica', status: 'planned' as const },
  { idc: 137, label: 'Procuramiento órganos', status: 'planned' as const },
  { idc: 138, label: 'Diario UCI (humanización)', status: 'planned' as const },
  { idc: 139, label: 'Seguimiento delirium', status: 'planned' as const },
  { idc: 140, label: 'Protocolo decúbito prono', status: 'planned' as const },
];

export async function getIcuDashboardSummary(db: Database, role: string) {
  const rows = await db
    .select({ id: patients.id, displayName: patients.displayName })
    .from(patients)
    .limit(3);

  const criticalBeds = rows.map((p, index) => ({
    bedId: `icu-bed-${index + 1}`,
    bedLabel: `UCI-${index + 1}`,
    patientId: p.id,
    patientDisplayName: p.displayName,
    demoCaseCode: ['DEMO-004', 'DEMO-005', 'DEMO-001'][index],
    onVentilator: index === 0,
  }));

  const flowsheetHours = [6, 8, 10, 12, 14, 16].map((hour, index) => ({
    hourLabel: `${String(hour).padStart(2, '0')}:00`,
    heartRate: 82 + index * 2,
    map: 70 + index,
    spo2: 97 - (index % 2),
  }));

  const hemodynamics = criticalBeds
    .filter((b) => b.patientDisplayName)
    .map((b, index) => ({
      patientDisplayName: b.patientDisplayName!,
      map: 68 + index * 3,
      cvp: 8 + index,
      lactate: 1.2 + index * 0.3,
    }));

  return {
    readOnly: true as const,
    roleView: (role === 'admin' || role === 'nurse' ? role : 'physician') as
      | 'physician'
      | 'nurse'
      | 'admin',
    idcPanels: ICU_IDC_PANELS,
    specializedPanels: ICU_SPECIALIZED_PANELS,
    criticalBeds,
    flowsheetHours,
    hemodynamics,
    metrics: {
      occupied: criticalBeds.length,
      available: 1,
      onVentilator: criticalBeds.filter((b) => b.onVentilator).length,
    },
  };
}
