import type { Database } from '../db/client.js';
import { patients } from '../db/schema.js';

const ICU_IDC_PANELS = [
  { idc: 41, label: 'Dashboard monitorización UCI', status: 'active' as const },
  { idc: 42, label: 'Sábana clínica (flujograma)', status: 'active' as const },
  { idc: 43, label: 'Balance hídrico estricto', status: 'active' as const },
  { idc: 44, label: 'Parámetros ventilación', status: 'active' as const },
  { idc: 45, label: 'Vías venosas e invasivos', status: 'active' as const },
  { idc: 46, label: 'Valoración neurológica', status: 'active' as const },
  { idc: 47, label: 'Escalas severidad', status: 'active' as const },
  { idc: 48, label: 'Titulación vasoactivos', status: 'active' as const },
  { idc: 49, label: 'Sedoanalgesia', status: 'active' as const },
  { idc: 50, label: 'Epicrisis traslado UCI', status: 'active' as const },
];

const ICU_SPECIALIZED_PANELS = [
  { idc: 131, label: 'Prueba ventilación espontánea', status: 'active' as const },
  { idc: 132, label: 'Terapias renales continuas', status: 'active' as const },
  { idc: 133, label: 'Nutrición parenteral total', status: 'active' as const },
  { idc: 134, label: 'Nutrición enteral', status: 'active' as const },
  { idc: 135, label: 'Monitorización hemodinámica', status: 'active' as const },
  { idc: 136, label: 'Muerte encefálica', status: 'active' as const },
  { idc: 137, label: 'Procuramiento órganos', status: 'active' as const },
  { idc: 138, label: 'Diario UCI (humanización)', status: 'active' as const },
  { idc: 139, label: 'Seguimiento delirium', status: 'active' as const },
  { idc: 140, label: 'Protocolo decúbito prono', status: 'active' as const },
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

  const fluidBalance = [
    { shiftLabel: 'Turno noche', intakeMl: 820, outputMl: 760, balanceMl: 60 },
    { shiftLabel: 'Turno día', intakeMl: 1450, outputMl: 1320, balanceMl: 130 },
    { shiftLabel: 'Turno tarde', intakeMl: 980, outputMl: 1010, balanceMl: -30 },
  ];

  const ventilation = criticalBeds
    .filter((b) => b.onVentilator && b.patientDisplayName)
    .map((b) => ({
      patientDisplayName: b.patientDisplayName!,
      mode: 'VCV',
      fio2Percent: 40,
      peep: 8,
      pip: 22,
    }));

  const netFluidBalanceMl = fluidBalance.reduce((sum, row) => sum + row.balanceMl, 0);

  const neurological = criticalBeds
    .filter((b) => b.patientDisplayName)
    .map((b, index) => ({
      patientDisplayName: b.patientDisplayName!,
      gcsTotal: 13 - index,
      pupils: index === 0 ? 'Isocóricas reactivas' : 'Midriasis leve derecha',
      motorResponse: index === 0 ? 'Obedece órdenes' : 'Localiza dolor',
    }));

  const severityScales = criticalBeds
    .filter((b) => b.patientDisplayName)
    .flatMap((b, index) => [
      {
        patientDisplayName: b.patientDisplayName!,
        scaleName: 'SOFA',
        score: 6 + index,
        interpretation: index === 0 ? 'Riesgo moderado' : 'Riesgo alto',
      },
      {
        patientDisplayName: b.patientDisplayName!,
        scaleName: 'APACHE II',
        score: 14 + index * 2,
        interpretation: 'Seguimiento 24h',
      },
    ]);

  const vasoactive = criticalBeds
    .filter((b, bedIndex) => b.patientDisplayName && bedIndex !== 2)
    .map((b, index) => ({
      patientDisplayName: b.patientDisplayName!,
      agent: index === 0 ? 'Noradrenalina' : 'Dobutamina',
      rateMcgKgMin: index === 0 ? 0.12 : 5.0,
      mapTarget: 65,
    }));

  const sedoanalgesia = criticalBeds
    .filter((b) => b.onVentilator && b.patientDisplayName)
    .map((b) => ({
      patientDisplayName: b.patientDisplayName!,
      sedative: 'Propofol 20 mg/h',
      analgesic: 'Fentanilo 100 mcg/h',
      rassScore: -2,
    }));

  const invasiveLines = criticalBeds
    .filter((b) => b.patientId && b.patientDisplayName)
    .flatMap((b, index) => [
      {
        patientId: b.patientId!,
        patientDisplayName: b.patientDisplayName!,
        lineType: index === 0 ? 'CVC yugular' : 'Vía periférica',
        site: index === 0 ? 'Yugular derecha' : 'Antebrazo izquierdo',
        daysInPlace: 2 + index,
      },
      ...(index === 0
        ? [
            {
              patientId: b.patientId!,
              patientDisplayName: b.patientDisplayName!,
              lineType: 'Línea arterial',
              site: 'Radial izquierda',
              daysInPlace: 1,
            },
          ]
        : []),
    ]);

  const ventPatient = criticalBeds.find((b) => b.onVentilator && b.patientDisplayName);

  const spontaneousVentTrials = ventPatient
    ? [
        {
          patientDisplayName: ventPatient.patientDisplayName!,
          trialType: 'T-piece 30 min',
          durationMin: 30,
          outcome: 'in_progress' as const,
        },
      ]
    : [];

  const renalTherapies = criticalBeds
    .filter((b) => b.patientDisplayName && b.bedLabel === 'UCI-1')
    .map((b) => ({
      patientDisplayName: b.patientDisplayName!,
      modality: 'CVVHDF',
      ultrafiltrationMl: 120,
      anticoagulation: 'Citrato regional',
    }));

  const parenteralNutrition = criticalBeds
    .filter((b) => b.patientDisplayName)
    .slice(0, 2)
    .map((b, index) => ({
      patientDisplayName: b.patientDisplayName!,
      caloriesKcal: 1800 + index * 200,
      proteinG: 90 + index * 10,
      status: (index === 0 ? 'running' : 'ordered') as 'running' | 'held' | 'ordered',
    }));

  const enteralNutrition = criticalBeds
    .filter((b) => b.patientDisplayName)
    .slice(0, 2)
    .map((b) => ({
      patientDisplayName: b.patientDisplayName!,
      route: 'Sonda nasogástrica',
      rateMlH: 55,
      gastricResidualMl: 40,
    }));

  const brainDeathChecklists: {
    patientDisplayName: string;
    checklistComplete: boolean;
    legalWitness: string;
  }[] = [];

  const organProcurement: {
    patientDisplayName: string;
    organ: string;
    coordinatorNotified: boolean;
  }[] = [];

  const icuDiaryEntries = criticalBeds
    .filter((b) => b.patientDisplayName)
    .map((b) => ({
      patientDisplayName: b.patientDisplayName!,
      entrySummary: 'Familia informada · contención verbal efectiva',
      authorRole: 'Enfermería UCI',
    }));

  const deliriumScreenings = criticalBeds
    .filter((b) => b.patientDisplayName)
    .map((b, index) => ({
      patientDisplayName: b.patientDisplayName!,
      camIcuScore: (index === 1 ? 'positive' : 'negative') as 'negative' | 'positive',
      intervention: index === 1 ? 'Reorientación + movilización' : 'Sin intervención',
    }));

  const proneProtocols = ventPatient
    ? [
        {
          patientDisplayName: ventPatient.patientDisplayName!,
          sessionHours: 16,
          pao2Fio2Ratio: 142,
          status: 'active' as const,
        },
      ]
    : [];

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
    fluidBalance,
    ventilation,
    invasiveLines,
    neurological,
    severityScales,
    vasoactive,
    sedoanalgesia,
    spontaneousVentTrials,
    renalTherapies,
    parenteralNutrition,
    enteralNutrition,
    brainDeathChecklists,
    organProcurement,
    icuDiaryEntries,
    deliriumScreenings,
    proneProtocols,
    metrics: {
      occupied: criticalBeds.length,
      available: 1,
      onVentilator: criticalBeds.filter((b) => b.onVentilator).length,
      netFluidBalanceMl,
    },
  };
}
