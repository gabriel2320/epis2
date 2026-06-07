import { eq } from 'drizzle-orm';
import type { Database } from '../db/client.js';
import { clinicalDrafts, patientMedications, patients } from '../db/schema.js';

const PHARMACY_IDC_PANELS = [
  { idc: 161, label: 'Compatibilidad Y-Site', status: 'active' as const },
  { idc: 162, label: 'Ajuste dosis renal', status: 'active' as const },
  { idc: 163, label: 'Monitorización TDM', status: 'active' as const },
  { idc: 164, label: 'RAM', status: 'active' as const },
  { idc: 165, label: 'Conciliación medicamentos', status: 'active' as const },
  { idc: 166, label: 'Dispensación recetas', status: 'active' as const },
  { idc: 167, label: 'Carro de paro', status: 'active' as const },
  { idc: 168, label: 'Estupefacientes', status: 'active' as const },
  { idc: 169, label: 'Devolución fármacos', status: 'active' as const },
  { idc: 170, label: 'Quiebre de stock', status: 'active' as const },
];

export async function getPharmacyDashboardSummary(db: Database) {
  const patientRows = await db
    .select({ id: patients.id, displayName: patients.displayName })
    .from(patients);
  const nameById = new Map(patientRows.map((p) => [p.id, p.displayName]));
  const names = patientRows.slice(0, 3).map((p) => p.displayName);

  const draftRows = await db.select().from(clinicalDrafts);
  const pendingValidations = draftRows
    .filter(
      (d) =>
        d.draftType === 'pharmacy_validation' &&
        ['draft', 'editing', 'ready_for_review'].includes(d.status),
    )
    .map((d) => ({
      id: d.id,
      patientId: d.patientId,
      patientDisplayName: nameById.get(d.patientId) ?? 'Paciente',
      title: d.title,
      status: d.status,
      updatedAt: d.updatedAt.toISOString(),
    }));

  const medRows = await db
    .select()
    .from(patientMedications)
    .where(eq(patientMedications.status, 'active'));

  const reconciliationCandidates = patientRows
    .map((p) => {
      const meds = medRows.filter((m) => m.patientId === p.id);
      if (meds.length < 2) return null;
      return {
        patientId: p.id,
        patientDisplayName: p.displayName,
        activeMedicationCount: meds.length,
        medications: meds.map((m) => m.name).slice(0, 4),
        reason: 'Conciliación medicamentosa pendiente (demo)',
      };
    })
    .filter((r): r is NonNullable<typeof r> => r !== null);

  const ySiteChecks = [
    { drugA: 'Midazolam', drugB: 'Fentanilo', compatible: true, note: 'Compatible en Y-Site (demo)' },
    { drugA: 'Amiodarona', drugB: 'Heparina', compatible: false, note: 'Precipitación — usar vía separada' },
  ];

  const renalDoseAdjustments = names.slice(0, 2).map((name, index) => ({
    patientDisplayName: name,
    medication: index === 0 ? 'Gabapentina' : 'Metformina',
    gfrMlMin: index === 0 ? 38 : 52,
    recommendedDose: index === 0 ? '300 mg c/48 h' : '500 mg c/12 h',
  }));

  const tdmMonitoring = names.slice(0, 2).map((name, index) => ({
    patientDisplayName: name,
    drug: index === 0 ? 'Vancomicina' : 'Digoxina',
    levelMcgMl: index === 0 ? 18.2 : 1.4,
    targetRange: index === 0 ? '15–20 µg/mL' : '0.8–2.0 ng/mL',
  }));

  const ramReports = names.slice(0, 2).map((name, index) => ({
    patientDisplayName: name,
    suspectDrug: index === 0 ? 'Amoxicilina' : 'AINE',
    reactionType: index === 0 ? 'Urticaria' : 'Broncoespasmo',
    severity: (index === 0 ? 'moderate' : 'severe') as 'moderate' | 'severe',
  }));

  const dispensingQueue = names.slice(0, 2).map((name, index) => ({
    prescriptionId: `RX-DEMO-${index + 1}`,
    patientDisplayName: name,
    medication: index === 0 ? 'Losartán 50 mg' : 'Insulina glargina',
    status: (index === 0 ? 'pending' : 'held') as 'pending' | 'held',
  }));

  const crashCartInventory = [
    { cartId: 'CP-UCI-01', location: 'UCI box 3', expiryAlerts: 1, lastCheck: '2026-06-07T08:00:00' },
    { cartId: 'CP-URG-02', location: 'Urgencias triage', expiryAlerts: 0, lastCheck: '2026-06-07T06:30:00' },
  ];

  const controlledSubstances = [
    { medication: 'Fentanilo 0.1 mg/mL', balanceUnits: 12, discrepancyFlag: false },
    { medication: 'Midazolam 5 mg/mL', balanceUnits: 8, discrepancyFlag: true },
  ];

  const drugReturns = names.slice(0, 1).map((name) => ({
    patientDisplayName: name,
    medication: 'Morfina 10 mg',
    quantity: 2,
    reason: 'Alta hospitalaria — sobrante sello intacto',
  }));

  const stockoutAlerts = [
    { medication: 'Meropenem 1 g', daysUntilStockout: 3, alternativeSuggested: 'Imipenem/cilastatina' },
    { medication: 'Enoxaparina 40 mg', daysUntilStockout: 5 },
  ];

  return {
    readOnly: true as const,
    roleView: 'pharmacist' as const,
    idcPanels: PHARMACY_IDC_PANELS,
    pendingValidations,
    reconciliationCandidates,
    ySiteChecks,
    renalDoseAdjustments,
    tdmMonitoring,
    ramReports,
    dispensingQueue,
    crashCartInventory,
    controlledSubstances,
    drugReturns,
    stockoutAlerts,
    demoTasks: [
      {
        id: 'pharm-task-validation',
        label: 'Validación farmacéutica',
        commandSample: 'validacion farmaceutica',
      },
      {
        id: 'pharm-task-reconciliation',
        label: 'Conciliación medicamentosa',
        commandSample: 'conciliacion medicamentosa',
      },
    ],
    metrics: {
      activePharmacyModules: PHARMACY_IDC_PANELS.length,
      pendingValidationsCount: pendingValidations.length,
      reconciliationCandidatesCount: reconciliationCandidates.length,
    },
  };
}
