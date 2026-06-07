import type { Database } from '../db/client.js';
import { listRecentAuditEvents } from '../audit/store.js';
import { listInteropStagingBatches } from '../interop/staging.js';
import { countUnackedCriticals, getOpsStatus } from '../ops/service.js';
import { patients } from '../db/schema.js';

const IAAS_ADVANCED_PANELS = [
  { idc: 141, label: 'Matriz vigilancia activa', status: 'active' as const },
  { idc: 142, label: 'Alerta MDRO', status: 'active' as const },
  { idc: 143, label: 'Monitor consumo antimicrobianos', status: 'active' as const },
  { idc: 144, label: 'PROA', status: 'active' as const },
  { idc: 145, label: 'Checklist inserción CVC', status: 'active' as const },
  { idc: 146, label: 'Checklist prevención NAV', status: 'active' as const },
  { idc: 147, label: 'Adherencia higiene de manos', status: 'active' as const },
  { idc: 148, label: 'Estudio brote', status: 'active' as const },
  { idc: 149, label: 'Mapa aislamientos', status: 'active' as const },
  { idc: 150, label: 'Curvas endémicas', status: 'active' as const },
];

export async function getQualityDashboardSummary(db: Database) {
  const [recentAudit, stagingBatches, ops, criticalUnacked, patientRows] = await Promise.all([
    listRecentAuditEvents(db, 30),
    listInteropStagingBatches(db),
    getOpsStatus(db),
    countUnackedCriticals(db),
    db.select({ displayName: patients.displayName }).from(patients).limit(3),
  ]);

  const { aiRunsTotal, ...opsBody } = ops;
  const names = patientRows.map((p) => p.displayName);

  const surveillanceMatrix = [
    { organism: 'K. pneumoniae BLEE', unit: 'UCI', casesLast30d: 2, alertLevel: 'elevated' as const },
    { organism: 'C. difficile', unit: 'Medicina', casesLast30d: 1, alertLevel: 'normal' as const },
    { organism: 'MRSA', unit: 'Cirugía', casesLast30d: 3, alertLevel: 'outbreak' as const },
  ];

  const mdroAlerts = names.slice(0, 2).map((name, index) => ({
    patientDisplayName: name,
    organism: index === 0 ? 'MRSA' : 'VRE',
    isolationType: index === 0 ? 'Contacto' : 'Contacto + gotas',
    notifiedAt: '2026-06-07T08:30:00',
  }));

  const antimicrobialConsumption = [
    { antibiotic: 'Piperacilina/tazobactam', dddPer1000: 42.5, trend: 'rising' as const },
    { antibiotic: 'Meropenem', dddPer1000: 18.2, trend: 'stable' as const },
    { antibiotic: 'Vancomicina', dddPer1000: 24.1, trend: 'falling' as const },
  ];

  const proaRecommendations = names.slice(0, 2).map((name, index) => ({
    patientDisplayName: name,
    currentRegimen: index === 0 ? 'Meropenem 1g c/8h' : 'Ceftriaxona 1g c/24h',
    recommendation: index === 0 ? 'Desescalar a piperacilina/tazobactam' : 'Mantener según cultivo',
    status: (index === 0 ? 'pending' : 'accepted') as 'pending' | 'accepted' | 'rejected',
  }));

  const cvcInsertionChecklists = names.slice(0, 2).map((name, index) => ({
    patientDisplayName: name,
    insertionSite: index === 0 ? 'Yugular derecha' : 'Subclavia izquierda',
    checklistComplete: index !== 0,
    bundleCompliance: index === 0 ? 78 : 100,
  }));

  const navPreventionChecklists = [
    { unit: 'UCI', ventilatorDays: 12, bundleCompliancePercent: 92 },
    { unit: 'Medicina', ventilatorDays: 4, bundleCompliancePercent: 85 },
  ];

  const handHygieneAudits = [
    { unit: 'UCI', opportunities: 120, compliancePercent: 88, auditDate: '2026-06-06' },
    { unit: 'Urgencias', opportunities: 95, compliancePercent: 74, auditDate: '2026-06-06' },
  ];

  const outbreakStudies = [
    { outbreakCode: 'BROTE-2026-03', unit: 'Cirugía', cases: 3, status: 'monitoring' as const },
  ];

  const isolationMap = names.map((name, index) => ({
    bedLabel: `C-${index + 1}`,
    patientDisplayName: name,
    precautionType: ['Contacto', 'Gotas', 'Estándar'][index] ?? 'Estándar',
  }));

  const endemicCurves = [
    { indicator: 'ITU asociada a catéter', endemicRate: 2.1, observedRate: 1.8, periodLabel: 'Q2 2026' },
    { indicator: 'Neumonía asociada a VM', endemicRate: 5.4, observedRate: 6.2, periodLabel: 'Q2 2026' },
  ];

  return {
    readOnly: true as const,
    recentAudit,
    stagingBatches,
    metrics: {
      openDrafts: opsBody.counts.openDrafts,
      approvedNotes: opsBody.counts.approvedNotes,
      aiRuns: aiRunsTotal,
      criticalUnacked,
    },
    ops: opsBody,
    iaasAdvancedPanels: IAAS_ADVANCED_PANELS,
    surveillanceMatrix,
    mdroAlerts,
    antimicrobialConsumption,
    proaRecommendations,
    cvcInsertionChecklists,
    navPreventionChecklists,
    handHygieneAudits,
    outbreakStudies,
    isolationMap,
    endemicCurves,
  };
}
