import type { Database } from '../db/client.js';
import { patients } from '../db/schema.js';

const SPECIALTY_IDC_PANELS = [
  { idc: 181, label: 'Partograma (obstetricia)', status: 'active' as const },
  { idc: 182, label: 'Comité oncológico', status: 'active' as const },
  { idc: 183, label: 'Odontograma', status: 'active' as const },
  { idc: 184, label: 'Informe endoscópico', status: 'active' as const },
  { idc: 185, label: 'Evaluación oftalmológica', status: 'active' as const },
  { idc: 186, label: 'Hemodiálisis ambulatoria', status: 'active' as const },
  { idc: 187, label: 'Ficha kinesiológica', status: 'active' as const },
  { idc: 188, label: 'Ficha nutricional', status: 'active' as const },
  { idc: 189, label: 'Protocolos quimioterapia', status: 'active' as const },
  { idc: 190, label: 'Seguimiento psiquiátrico', status: 'active' as const },
];

export async function getSpecialtyDashboardSummary(db: Database, role: string) {
  const rows = await db
    .select({ id: patients.id, displayName: patients.displayName })
    .from(patients)
    .limit(4);

  const names = rows.map((p) => p.displayName);

  const partograms = names.slice(0, 1).map((name) => ({
    patientDisplayName: name,
    cervicalDilationCm: 4,
    fetalStation: '-2',
    updatedAt: '2026-06-07T10:00:00',
  }));

  const oncologyBoardCases = names.slice(0, 2).map((name, index) => ({
    patientDisplayName: name,
    tumorType: index === 0 ? 'Adenocarcinoma pulmón' : 'Carcinoma mama',
    discussionDate: '2026-06-08',
    recommendation: index === 0 ? 'QT neoadyuvante' : 'Cirugía + RT',
  }));

  const odontograms = names.slice(0, 2).map((name, index) => ({
    patientDisplayName: name,
    teethAffected: index === 0 ? '16, 26' : '36',
    conditionSummary: index === 0 ? 'Caries profunda · endodoncia' : 'Periodontitis localizada',
  }));

  const endoscopyReports = names.slice(0, 2).map((name, index) => ({
    patientDisplayName: name,
    procedure: index === 0 ? 'EGD' : 'Colonoscopia',
    keyFinding: index === 0 ? 'Gastritis eritematosa antral' : 'Pólipo 5 mm sigmoide',
  }));

  const ophthalmologyEvaluations = names.slice(0, 2).map((name, index) => ({
    patientDisplayName: name,
    visualAcuity: index === 0 ? '20/25 OD · 20/30 OI' : '20/20 AO',
    iopMmHg: 14 + index * 2,
  }));

  const hemodialysisSessions = names.slice(0, 1).map((name) => ({
    patientDisplayName: name,
    sessionHours: 4,
    ultrafiltrationMl: 2100,
  }));

  const kinesiologyRecords = names.slice(0, 2).map((name, index) => ({
    patientDisplayName: name,
    joint: index === 0 ? 'Rodilla derecha' : 'Hombro izquierdo',
    romDegrees: index === 0 ? 95 : 120,
  }));

  const nutritionRecords = names.slice(0, 2).map((name, index) => ({
    patientDisplayName: name,
    bmi: 24.5 + index * 2,
    planStatus: index === 0 ? 'Plan hipocalórico activo' : 'Seguimiento semanal',
  }));

  const chemotherapyProtocols = names.slice(0, 2).map((name, index) => ({
    patientDisplayName: name,
    protocol: index === 0 ? 'FOLFOX' : 'AC-T',
    cycleDay: index === 0 ? 3 : 1,
  }));

  const psychiatryFollowups = names.slice(0, 2).map((name, index) => ({
    patientDisplayName: name,
    scaleName: 'PHQ-9',
    score: 6 + index * 4,
  }));

  return {
    readOnly: true as const,
    roleView: (role === 'admin' || role === 'nurse' ? role : 'physician') as
      | 'physician'
      | 'nurse'
      | 'admin',
    idcPanels: SPECIALTY_IDC_PANELS,
    partograms,
    oncologyBoardCases,
    odontograms,
    endoscopyReports,
    ophthalmologyEvaluations,
    hemodialysisSessions,
    kinesiologyRecords,
    nutritionRecords,
    chemotherapyProtocols,
    psychiatryFollowups,
    metrics: {
      activeSpecialtyModules: SPECIALTY_IDC_PANELS.length,
      pendingGraphicReviews: 2,
      scheduledBoards: oncologyBoardCases.length,
    },
  };
}
