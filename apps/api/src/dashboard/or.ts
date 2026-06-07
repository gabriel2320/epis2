import type { Database } from '../db/client.js';
import { patients } from '../db/schema.js';

const OR_IDC_PANELS = [
  { idc: 151, label: 'Tabla quirúrgica', status: 'active' as const },
  { idc: 152, label: 'Checklist cirugía segura OMS', status: 'active' as const },
  { idc: 153, label: 'Evaluación preanestésica', status: 'active' as const },
  { idc: 154, label: 'Hoja anestesia intraoperatoria', status: 'active' as const },
  { idc: 155, label: 'Protocolo operatorio', status: 'active' as const },
  { idc: 156, label: 'Recuento compresas / insumos', status: 'active' as const },
  { idc: 157, label: 'Biopsia intraoperatoria', status: 'active' as const },
  { idc: 158, label: 'Recuperación URPA', status: 'active' as const },
  { idc: 159, label: 'Banco de sangre', status: 'active' as const },
  { idc: 160, label: 'Esterilización / trazabilidad', status: 'active' as const },
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

  const activeCase = surgicalSchedule.find((row) => row.status === 'in_progress');
  const preparingCase = surgicalSchedule.find((row) => row.status === 'preparing');

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

  const preanesthesiaEvaluations = surgicalSchedule
    .filter((row) => row.status !== 'completed')
    .map((row, index) => ({
      caseId: row.caseId,
      patientId: row.patientId,
      patientDisplayName: row.patientDisplayName,
      operatingRoom: row.operatingRoom,
      asaClass: (['II', 'III', 'II', 'I'][index] ?? 'II') as 'I' | 'II' | 'III' | 'IV' | 'V',
      mallampati: (['II', 'III', 'I', 'II'][index] ?? 'II') as 'I' | 'II' | 'III' | 'IV',
      allergyAlert: index === 0 ? 'Penicilina documentada' : index === 2 ? 'Látex — precaución' : null,
      evaluationStatus: (row.status === 'scheduled' ? 'pending' : 'complete') as 'pending' | 'complete',
    }));

  const intraopAnesthesia = activeCase
    ? [0, 15, 30, 45].map((minute, index) => ({
        caseId: activeCase.caseId,
        timeLabel: `T+${minute} min`,
        heartRate: 72 + index * 3,
        map: 68 + index,
        spo2: 98 - (index % 2),
        agent: index < 2 ? 'Sevoflurano 2.0%' : 'Remifentanilo titulado',
      }))
    : [];

  const operativeProtocols = activeCase
    ? [
        {
          caseId: activeCase.caseId,
          patientDisplayName: activeCase.patientDisplayName,
          operatingRoom: activeCase.operatingRoom,
          procedureSummary: `${activeCase.procedureName} — abordaje laparoscópico, hemostasia verificada`,
          documentedBy: activeCase.surgeonDisplayName,
        },
      ]
    : preparingCase
      ? [
          {
            caseId: preparingCase.caseId,
            patientDisplayName: preparingCase.patientDisplayName,
            operatingRoom: preparingCase.operatingRoom,
            procedureSummary: `${preparingCase.procedureName} — borrador preoperatorio`,
            documentedBy: preparingCase.surgeonDisplayName,
          },
        ]
      : [];

  const spongeCounts = activeCase
    ? [
        {
          caseId: activeCase.caseId,
          operatingRoom: activeCase.operatingRoom,
          initialCount: 10,
          finalCount: 10,
          verifiedBy: 'Enf. pabellón demo',
          status: 'balanced' as const,
        },
      ]
    : [];

  const intraopBiopsies = activeCase
    ? [
        {
          caseId: activeCase.caseId,
          specimenLabel: 'Colecistectomía — pieza quirúrgica',
          urgency: 'Congelación si indicado',
          status: 'requested' as const,
        },
      ]
    : [];

  const urpaRecovery = preparingCase
    ? [
        {
          caseId: preparingCase.caseId,
          patientDisplayName: preparingCase.patientDisplayName,
          aldreteScore: 8,
          disposition: 'Alta URPA programada',
        },
      ]
    : [];

  const bloodBankOrders = activeCase
    ? [
        {
          caseId: activeCase.caseId,
          product: 'Concentrado eritrocitario',
          units: 0,
          status: 'reserved' as const,
        },
      ]
    : [];

  const sterilizationLots = surgicalSchedule.slice(0, 2).map((row, index) => ({
    instrumentSet: index === 0 ? 'Set laparoscópico básico' : 'Set general mayor',
    lotNumber: `EST-2026-${String(120 + index).padStart(3, '0')}`,
    expiryDate: '2026-12-31',
    operatingRoom: row.operatingRoom,
  }));

  return {
    readOnly: true as const,
    roleView: (role === 'admin' || role === 'nurse' ? role : 'physician') as
      | 'physician'
      | 'nurse'
      | 'admin',
    idcPanels: OR_IDC_PANELS,
    surgicalSchedule,
    whoSafetyChecklist,
    preanesthesiaEvaluations,
    intraopAnesthesia,
    operativeProtocols,
    spongeCounts,
    intraopBiopsies,
    urpaRecovery,
    bloodBankOrders,
    sterilizationLots,
    metrics: {
      operatingRoomsInUse: inProgress + (surgicalSchedule.some((r) => r.status === 'preparing') ? 1 : 0),
      scheduledToday,
      inProgress,
    },
  };
}
