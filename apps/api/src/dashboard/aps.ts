import type { Database } from '../db/client.js';
import { patients } from '../db/schema.js';

const APS_IDC_PANELS = [
  { idc: 121, label: 'Control salud cardiovascular', status: 'active' as const },
  { idc: 122, label: 'Calculadora Framingham', status: 'active' as const },
  { idc: 123, label: 'Examen medicina preventiva', status: 'active' as const },
  { idc: 124, label: 'Pie diabético', status: 'active' as const },
  { idc: 125, label: 'Tamizaje salud mental', status: 'active' as const },
  { idc: 126, label: 'Control niño sano', status: 'active' as const },
  { idc: 127, label: 'Calendario inmunizaciones PNI', status: 'active' as const },
  { idc: 128, label: 'Control prenatal', status: 'active' as const },
  { idc: 129, label: 'Derivación programas ministeriales', status: 'active' as const },
  { idc: 130, label: 'Visita domiciliaria integral', status: 'active' as const },
];

export async function getApsDashboardSummary(db: Database, role: string) {
  const rows = await db
    .select({ id: patients.id, displayName: patients.displayName })
    .from(patients)
    .limit(4);

  const cardiovascularControls = rows.map((p, index) => ({
    patientId: p.id,
    patientDisplayName: p.displayName,
    hba1c: index === 0 ? 7.2 : 6.1,
    bloodPressure: index === 0 ? '142/88' : '128/78',
    ldl: index === 0 ? 118 : 95,
    targetMet: index !== 0,
  }));

  const framinghamScores = rows.slice(0, 3).map((p, index) => ({
    patientId: p.id,
    patientDisplayName: p.displayName,
    riskPercent10y: 12 + index * 8,
    riskCategory: (index === 2 ? 'high' : index === 1 ? 'moderate' : 'low') as
      | 'low'
      | 'moderate'
      | 'high',
  }));

  const preventiveExams = rows.map((p, index) => ({
    patientId: p.id,
    patientDisplayName: p.displayName,
    ageYears: 45 + index * 12,
    pendingItems:
      index === 0 ? ['Mamografía', 'PSA'] : index === 1 ? ['Citología'] : ['Colonoscopia'],
  }));

  const diabeticFootScreenings = rows.slice(0, 2).map((p, index) => ({
    patientId: p.id,
    patientDisplayName: p.displayName,
    monofilamentResult: (index === 0 ? 'abnormal' : 'normal') as 'normal' | 'abnormal',
    pulseStatus: index === 0 ? 'Dorsalis pedis disminuido' : 'Pulsos simétricos',
  }));

  const mentalHealthScreenings = rows.slice(0, 3).map((p, index) => ({
    patientId: p.id,
    patientDisplayName: p.displayName,
    phq9Score: 4 + index * 3,
    gad7Score: 3 + index * 2,
    referralSuggested: index >= 2,
  }));

  const childWellnessControls = rows.slice(0, 2).map((p, index) => ({
    patientId: p.id,
    patientDisplayName: p.displayName,
    ageMonths: 18 + index * 24,
    growthPercentile: 45 + index * 10,
    nextControlDue: `2026-0${7 + index}-15`,
  }));

  const immunizationSchedule = rows.map((p, index) => ({
    patientId: p.id,
    patientDisplayName: p.displayName,
    vaccine:
      ['Influenza estacional', 'Hepatitis B refuerzo', 'Neumocócica', 'COVID-19'][index] ?? 'PNI',
    dueDate: `2026-06-${String(10 + index).padStart(2, '0')}`,
    status: (index === 0 ? 'due' : index === 1 ? 'overdue' : 'complete') as
      | 'due'
      | 'overdue'
      | 'complete',
  }));

  const prenatalControls = rows.slice(0, 2).map((p, index) => ({
    patientId: p.id,
    patientDisplayName: p.displayName,
    gestationalWeeks: 24 + index * 8,
    fundalHeightCm: 22 + index * 6,
    fetalHeartRate: 140 + index * 4,
  }));

  const ministerialReferrals = rows.slice(0, 3).map((p, index) => ({
    patientId: p.id,
    patientDisplayName: p.displayName,
    program: ['ERA hipertensión', 'Programa diabetes', 'IRA leve'][index] ?? 'Programa crónico',
    status: (index === 0 ? 'enrolled' : index === 1 ? 'eligible' : 'pending') as
      | 'eligible'
      | 'enrolled'
      | 'pending',
  }));

  const homeVisits = rows.map((p, index) => ({
    visitId: `home-${index + 1}`,
    patientId: p.id,
    patientDisplayName: p.displayName,
    scheduledAt: `2026-06-07T${String(9 + index).padStart(2, '0')}:00:00`,
    territory:
      ['Sector Norte', 'Sector Centro', 'Sector Sur', 'Sector Rural'][index] ?? 'Territorio',
    status: (index === 0 ? 'in_progress' : index === 1 ? 'scheduled' : 'completed') as
      | 'scheduled'
      | 'in_progress'
      | 'completed',
  }));

  return {
    readOnly: true as const,
    roleView: (role === 'admin' || role === 'nurse' ? role : 'physician') as
      | 'physician'
      | 'nurse'
      | 'admin',
    idcPanels: APS_IDC_PANELS,
    cardiovascularControls,
    framinghamScores,
    preventiveExams,
    diabeticFootScreenings,
    mentalHealthScreenings,
    childWellnessControls,
    immunizationSchedule,
    prenatalControls,
    ministerialReferrals,
    homeVisits,
    metrics: {
      enrolledPrograms: ministerialReferrals.filter((r) => r.status === 'enrolled').length,
      pendingScreenings: preventiveExams.reduce((acc, row) => acc + row.pendingItems.length, 0),
      homeVisitsToday: homeVisits.filter((v) => v.status !== 'completed').length,
    },
  };
}
