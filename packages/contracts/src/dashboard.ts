import { z } from 'zod';

export const dashboardDraftRowSchema = z.object({
  id: z.string().uuid(),
  patientId: z.string().uuid(),
  patientDisplayName: z.string(),
  draftType: z.string(),
  status: z.string(),
  title: z.string(),
  updatedAt: z.string(),
});

export const dashboardDemoTaskSchema = z.object({
  id: z.string(),
  label: z.string(),
  commandSample: z.string(),
  disabled: z.boolean().optional(),
});

export const dashboardWorkResponseSchema = z.object({
  readOnly: z.literal(true),
  roleView: z.enum(['physician', 'nurse', 'pharmacist', 'admin', 'auditor']).optional(),
  myOpenDrafts: z.array(dashboardDraftRowSchema),
  pendingReview: z.array(dashboardDraftRowSchema),
  demoTasks: z.array(dashboardDemoTaskSchema),
});

export type DashboardWorkResponse = z.infer<typeof dashboardWorkResponseSchema>;

export const marScheduledDoseRowSchema = z.object({
  id: z.string().uuid(),
  patientId: z.string().uuid(),
  patientDisplayName: z.string(),
  medication: z.string(),
  doseText: z.string(),
  route: z.string(),
  scheduledAt: z.string(),
  windowStart: z.string(),
  windowEnd: z.string(),
  requiresDoubleCheck: z.boolean(),
  status: z.enum(['scheduled', 'administered', 'missed', 'held']),
});

export const nursingDashboardResponseSchema = z.object({
  readOnly: z.literal(true),
  roleView: z.literal('nurse'),
  scheduledMar: z.array(marScheduledDoseRowSchema),
  nursingDrafts: z.array(dashboardDraftRowSchema),
  demoTasks: z.array(dashboardDemoTaskSchema),
});

export const pharmacyDashboardResponseSchema = z.object({
  readOnly: z.literal(true),
  roleView: z.literal('pharmacist'),
  pendingValidations: z.array(
    z.object({
      id: z.string().uuid(),
      patientId: z.string().uuid(),
      patientDisplayName: z.string(),
      title: z.string(),
      status: z.string(),
      updatedAt: z.string(),
    }),
  ),
  reconciliationCandidates: z.array(
    z.object({
      patientId: z.string().uuid(),
      patientDisplayName: z.string(),
      activeMedicationCount: z.number().int().positive(),
      medications: z.array(z.string()),
      reason: z.string(),
    }),
  ),
  demoTasks: z.array(dashboardDemoTaskSchema),
});

export type NursingDashboardResponse = z.infer<typeof nursingDashboardResponseSchema>;
export type PharmacyDashboardResponse = z.infer<typeof pharmacyDashboardResponseSchema>;

export const censusBedRowSchema = z.object({
  bedId: z.string().uuid(),
  bedLabel: z.string(),
  status: z.enum(['available', 'occupied', 'blocked']),
  admissionId: z.string().uuid().optional(),
  patientId: z.string().uuid().optional(),
  patientDisplayName: z.string().optional(),
  demoCaseCode: z.string().optional(),
});

export const criticalResultRowSchema = z.object({
  id: z.string().uuid(),
  patientId: z.string().uuid(),
  patientDisplayName: z.string(),
  label: z.string(),
  valueText: z.string(),
  severity: z.enum(['high', 'critical']),
  observedAt: z.string(),
});

export const probableDischargeRowSchema = z.object({
  patientId: z.string().uuid(),
  patientDisplayName: z.string(),
  bedLabel: z.string(),
  reason: z.string(),
});

export const clinicalOrderRowSchema = z.object({
  id: z.string().uuid(),
  patientId: z.string().uuid(),
  patientDisplayName: z.string(),
  orderType: z.string(),
  title: z.string(),
  priority: z.string(),
});

export const serviceDashboardResponseSchema = z.object({
  readOnly: z.literal(true),
  unitCode: z.string(),
  unitName: z.string(),
  census: z.array(censusBedRowSchema),
  activeOrders: z.array(clinicalOrderRowSchema),
  unacknowledgedCriticals: z.array(criticalResultRowSchema),
  probableDischarges: z.array(probableDischargeRowSchema),
  pendingWorkItems: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      patientId: z.string().uuid().optional(),
      commandSample: z.string().optional(),
    }),
  ),
});

export type ClinicalOrderRow = z.infer<typeof clinicalOrderRowSchema>;
export type CensusBedRow = z.infer<typeof censusBedRowSchema>;
export type CriticalResultRow = z.infer<typeof criticalResultRowSchema>;
export type ProbableDischargeRow = z.infer<typeof probableDischargeRowSchema>;
export type ServiceDashboardResponse = z.infer<typeof serviceDashboardResponseSchema>;

/** MF-TRAMO-B-002 — Tablero recepción (IDC 2–10). */
export const receptionAppointmentRowSchema = z.object({
  id: z.string(),
  patientDisplayName: z.string(),
  professionalName: z.string(),
  scheduledAt: z.string(),
  status: z.enum(['scheduled', 'checked_in', 'in_consultation', 'completed', 'no_show']),
  demoCaseCode: z.string().optional(),
});

export const receptionIdcPanelSchema = z.object({
  idc: z.number().int(),
  label: z.string(),
  status: z.enum(['active', 'planned']),
});

export const receptionDashboardResponseSchema = z.object({
  readOnly: z.literal(true),
  roleView: z.enum(['physician', 'nurse', 'admin']),
  idcPanels: z.array(receptionIdcPanelSchema),
  todayAppointments: z.array(receptionAppointmentRowSchema),
  waitingQueue: z.array(
    z.object({
      ticket: z.string(),
      patientDisplayName: z.string(),
      waitMinutes: z.number().int(),
    }),
  ),
  callPanel: z.object({
    lastCalled: z.string().optional(),
    ticketNumber: z.string().optional(),
  }),
  metrics: z.object({
    checkedIn: z.number().int(),
    waiting: z.number().int(),
    companions: z.number().int(),
    overbookingAlerts: z.number().int(),
  }),
});

export type ReceptionDashboardResponse = z.infer<typeof receptionDashboardResponseSchema>;

/** MF-TRAMO-C-002 — Tablero urgencias (IDC 101–110). */
export const emergencyTriageRowSchema = z.object({
  id: z.string(),
  patientId: z.string().uuid(),
  patientDisplayName: z.string(),
  chiefComplaint: z.string(),
  triageLevel: z.enum(['1', '2', '3', '4', '5']),
  arrivedAt: z.string(),
  status: z.enum(['waiting', 'observation', 'discharged', 'admitted']),
});

export const emergencyIdcPanelSchema = z.object({
  idc: z.number().int(),
  label: z.string(),
  status: z.enum(['active', 'planned']),
});

export const emergencyDashboardResponseSchema = z.object({
  readOnly: z.literal(true),
  roleView: z.enum(['physician', 'nurse', 'admin']),
  idcPanels: z.array(emergencyIdcPanelSchema),
  triageQueue: z.array(emergencyTriageRowSchema),
  observationBeds: z.number().int(),
  metrics: z.object({
    waiting: z.number().int(),
    inObservation: z.number().int(),
    dischargedToday: z.number().int(),
  }),
});

export type EmergencyDashboardResponse = z.infer<typeof emergencyDashboardResponseSchema>;

/** MF-TRAMO-D-002 — Tablero UCI (IDC 41–50, 131–140). */
export const icuIdcPanelSchema = z.object({
  idc: z.number().int(),
  label: z.string(),
  status: z.enum(['active', 'planned']),
});

export const icuCriticalBedRowSchema = z.object({
  bedId: z.string(),
  bedLabel: z.string(),
  patientId: z.string().uuid().optional(),
  patientDisplayName: z.string().optional(),
  demoCaseCode: z.string().optional(),
  onVentilator: z.boolean(),
});

export const icuFlowsheetHourRowSchema = z.object({
  hourLabel: z.string(),
  heartRate: z.number().int(),
  map: z.number().int(),
  spo2: z.number().int(),
});

export const icuHemodynamicsRowSchema = z.object({
  patientDisplayName: z.string(),
  map: z.number().int(),
  cvp: z.number().int(),
  lactate: z.number(),
});

export const icuFluidBalanceRowSchema = z.object({
  shiftLabel: z.string(),
  intakeMl: z.number().int(),
  outputMl: z.number().int(),
  balanceMl: z.number().int(),
});

export const icuVentilationRowSchema = z.object({
  patientDisplayName: z.string(),
  mode: z.string(),
  fio2Percent: z.number().int(),
  peep: z.number().int(),
  pip: z.number().int(),
});

export const icuInvasiveLineRowSchema = z.object({
  patientId: z.string().uuid(),
  patientDisplayName: z.string(),
  lineType: z.string(),
  site: z.string(),
  daysInPlace: z.number().int(),
});

export const icuNeurologicalRowSchema = z.object({
  patientDisplayName: z.string(),
  gcsTotal: z.number().int(),
  pupils: z.string(),
  motorResponse: z.string(),
});

export const icuSeverityScaleRowSchema = z.object({
  patientDisplayName: z.string(),
  scaleName: z.string(),
  score: z.number().int(),
  interpretation: z.string(),
});

export const icuVasoactiveRowSchema = z.object({
  patientDisplayName: z.string(),
  agent: z.string(),
  rateMcgKgMin: z.number(),
  mapTarget: z.number().int(),
});

export const icuSedoanalgesiaRowSchema = z.object({
  patientDisplayName: z.string(),
  sedative: z.string(),
  analgesic: z.string(),
  rassScore: z.number().int(),
});

/** MF-TRAMO-G-002 … G-011 — UCI especializada (IDC 131–140). */
export const icuSpontaneousVentTrialRowSchema = z.object({
  patientDisplayName: z.string(),
  trialType: z.string(),
  durationMin: z.number().int(),
  outcome: z.enum(['passed', 'failed', 'in_progress']),
});

export const icuRenalTherapyRowSchema = z.object({
  patientDisplayName: z.string(),
  modality: z.string(),
  ultrafiltrationMl: z.number().int(),
  anticoagulation: z.string(),
});

export const icuParenteralNutritionRowSchema = z.object({
  patientDisplayName: z.string(),
  caloriesKcal: z.number().int(),
  proteinG: z.number().int(),
  status: z.enum(['running', 'held', 'ordered']),
});

export const icuEnteralNutritionRowSchema = z.object({
  patientDisplayName: z.string(),
  route: z.string(),
  rateMlH: z.number().int(),
  gastricResidualMl: z.number().int(),
});

export const icuBrainDeathRowSchema = z.object({
  patientDisplayName: z.string(),
  checklistComplete: z.boolean(),
  legalWitness: z.string(),
});

export const icuOrganProcurementRowSchema = z.object({
  patientDisplayName: z.string(),
  organ: z.string(),
  coordinatorNotified: z.boolean(),
});

export const icuDiaryRowSchema = z.object({
  patientDisplayName: z.string(),
  entrySummary: z.string(),
  authorRole: z.string(),
});

export const icuDeliriumRowSchema = z.object({
  patientDisplayName: z.string(),
  camIcuScore: z.enum(['negative', 'positive']),
  intervention: z.string(),
});

export const icuProneProtocolRowSchema = z.object({
  patientDisplayName: z.string(),
  sessionHours: z.number().int(),
  pao2Fio2Ratio: z.number().int(),
  status: z.enum(['active', 'completed', 'planned']),
});

export const icuDashboardResponseSchema = z.object({
  readOnly: z.literal(true),
  roleView: z.enum(['physician', 'nurse', 'admin']),
  idcPanels: z.array(icuIdcPanelSchema),
  specializedPanels: z.array(icuIdcPanelSchema),
  criticalBeds: z.array(icuCriticalBedRowSchema),
  flowsheetHours: z.array(icuFlowsheetHourRowSchema),
  hemodynamics: z.array(icuHemodynamicsRowSchema),
  fluidBalance: z.array(icuFluidBalanceRowSchema),
  ventilation: z.array(icuVentilationRowSchema),
  invasiveLines: z.array(icuInvasiveLineRowSchema),
  neurological: z.array(icuNeurologicalRowSchema),
  severityScales: z.array(icuSeverityScaleRowSchema),
  vasoactive: z.array(icuVasoactiveRowSchema),
  sedoanalgesia: z.array(icuSedoanalgesiaRowSchema),
  spontaneousVentTrials: z.array(icuSpontaneousVentTrialRowSchema),
  renalTherapies: z.array(icuRenalTherapyRowSchema),
  parenteralNutrition: z.array(icuParenteralNutritionRowSchema),
  enteralNutrition: z.array(icuEnteralNutritionRowSchema),
  brainDeathChecklists: z.array(icuBrainDeathRowSchema),
  organProcurement: z.array(icuOrganProcurementRowSchema),
  icuDiaryEntries: z.array(icuDiaryRowSchema),
  deliriumScreenings: z.array(icuDeliriumRowSchema),
  proneProtocols: z.array(icuProneProtocolRowSchema),
  metrics: z.object({
    occupied: z.number().int(),
    available: z.number().int(),
    onVentilator: z.number().int(),
    netFluidBalanceMl: z.number().int(),
  }),
});

export type IcuDashboardResponse = z.infer<typeof icuDashboardResponseSchema>;

/** MF-TRAMO-E-002 — Tablero pabellón (IDC 151–160). */
export const orIdcPanelSchema = z.object({
  idc: z.number().int(),
  label: z.string(),
  status: z.enum(['active', 'planned']),
});

export const orSurgicalScheduleRowSchema = z.object({
  caseId: z.string(),
  patientId: z.string().uuid(),
  patientDisplayName: z.string(),
  procedureName: z.string(),
  operatingRoom: z.string(),
  scheduledStart: z.string(),
  estimatedDurationMin: z.number().int(),
  status: z.enum(['scheduled', 'preparing', 'in_progress', 'completed']),
  surgeonDisplayName: z.string(),
});

export const orWhoChecklistRowSchema = z.object({
  pauseId: z.string(),
  pauseLabel: z.string(),
  caseId: z.string(),
  patientDisplayName: z.string(),
  operatingRoom: z.string(),
  completedItems: z.number().int(),
  totalItems: z.number().int(),
  status: z.enum(['pending', 'in_progress', 'completed']),
});

export const orPreanesthesiaRowSchema = z.object({
  caseId: z.string(),
  patientId: z.string().uuid(),
  patientDisplayName: z.string(),
  operatingRoom: z.string(),
  asaClass: z.enum(['I', 'II', 'III', 'IV', 'V']),
  mallampati: z.enum(['I', 'II', 'III', 'IV']),
  allergyAlert: z.string().nullable(),
  evaluationStatus: z.enum(['pending', 'complete']),
});

export const orIntraopAnesthesiaRowSchema = z.object({
  caseId: z.string(),
  timeLabel: z.string(),
  heartRate: z.number().int(),
  map: z.number().int(),
  spo2: z.number().int(),
  agent: z.string(),
});

export const orOperativeProtocolRowSchema = z.object({
  caseId: z.string(),
  patientDisplayName: z.string(),
  operatingRoom: z.string(),
  procedureSummary: z.string(),
  documentedBy: z.string(),
});

export const orSpongeCountRowSchema = z.object({
  caseId: z.string(),
  operatingRoom: z.string(),
  initialCount: z.number().int(),
  finalCount: z.number().int(),
  verifiedBy: z.string(),
  status: z.enum(['pending', 'balanced']),
});

export const orIntraopBiopsyRowSchema = z.object({
  caseId: z.string(),
  specimenLabel: z.string(),
  urgency: z.string(),
  status: z.enum(['requested', 'sent']),
});

export const orUrpaRecoveryRowSchema = z.object({
  caseId: z.string(),
  patientDisplayName: z.string(),
  aldreteScore: z.number().int(),
  disposition: z.string(),
});

export const orBloodBankRowSchema = z.object({
  caseId: z.string(),
  product: z.string(),
  units: z.number().int(),
  status: z.enum(['reserved', 'transfused']),
});

export const orSterilizationRowSchema = z.object({
  instrumentSet: z.string(),
  lotNumber: z.string(),
  expiryDate: z.string(),
  operatingRoom: z.string(),
});

export const orDashboardResponseSchema = z.object({
  readOnly: z.literal(true),
  roleView: z.enum(['physician', 'nurse', 'admin']),
  idcPanels: z.array(orIdcPanelSchema),
  surgicalSchedule: z.array(orSurgicalScheduleRowSchema),
  whoSafetyChecklist: z.array(orWhoChecklistRowSchema),
  preanesthesiaEvaluations: z.array(orPreanesthesiaRowSchema),
  intraopAnesthesia: z.array(orIntraopAnesthesiaRowSchema),
  operativeProtocols: z.array(orOperativeProtocolRowSchema),
  spongeCounts: z.array(orSpongeCountRowSchema),
  intraopBiopsies: z.array(orIntraopBiopsyRowSchema),
  urpaRecovery: z.array(orUrpaRecoveryRowSchema),
  bloodBankOrders: z.array(orBloodBankRowSchema),
  sterilizationLots: z.array(orSterilizationRowSchema),
  metrics: z.object({
    operatingRoomsInUse: z.number().int(),
    scheduledToday: z.number().int(),
    inProgress: z.number().int(),
  }),
});

export type OrDashboardResponse = z.infer<typeof orDashboardResponseSchema>;

/** MF-TRAMO-F-002 — Tablero APS (IDC 121–130). */
export const apsIdcPanelSchema = z.object({
  idc: z.number().int(),
  label: z.string(),
  status: z.enum(['active', 'planned']),
});

export const apsCardiovascularRowSchema = z.object({
  patientId: z.string().uuid(),
  patientDisplayName: z.string(),
  hba1c: z.number().optional(),
  bloodPressure: z.string(),
  ldl: z.number().optional(),
  targetMet: z.boolean(),
});

export const apsFraminghamRowSchema = z.object({
  patientId: z.string().uuid(),
  patientDisplayName: z.string(),
  riskPercent10y: z.number(),
  riskCategory: z.enum(['low', 'moderate', 'high']),
});

export const apsPreventiveExamRowSchema = z.object({
  patientId: z.string().uuid(),
  patientDisplayName: z.string(),
  ageYears: z.number().int(),
  pendingItems: z.array(z.string()),
});

export const apsDiabeticFootRowSchema = z.object({
  patientId: z.string().uuid(),
  patientDisplayName: z.string(),
  monofilamentResult: z.enum(['normal', 'abnormal']),
  pulseStatus: z.string(),
});

export const apsMentalHealthRowSchema = z.object({
  patientId: z.string().uuid(),
  patientDisplayName: z.string(),
  phq9Score: z.number().int(),
  gad7Score: z.number().int(),
  referralSuggested: z.boolean(),
});

export const apsChildWellnessRowSchema = z.object({
  patientId: z.string().uuid(),
  patientDisplayName: z.string(),
  ageMonths: z.number().int(),
  growthPercentile: z.number().int(),
  nextControlDue: z.string(),
});

export const apsImmunizationRowSchema = z.object({
  patientId: z.string().uuid(),
  patientDisplayName: z.string(),
  vaccine: z.string(),
  dueDate: z.string(),
  status: z.enum(['due', 'overdue', 'complete']),
});

export const apsPrenatalRowSchema = z.object({
  patientId: z.string().uuid(),
  patientDisplayName: z.string(),
  gestationalWeeks: z.number().int(),
  fundalHeightCm: z.number().int(),
  fetalHeartRate: z.number().int(),
});

export const apsMinisterialReferralRowSchema = z.object({
  patientId: z.string().uuid(),
  patientDisplayName: z.string(),
  program: z.string(),
  status: z.enum(['eligible', 'enrolled', 'pending']),
});

export const apsHomeVisitRowSchema = z.object({
  visitId: z.string(),
  patientId: z.string().uuid(),
  patientDisplayName: z.string(),
  scheduledAt: z.string(),
  territory: z.string(),
  status: z.enum(['scheduled', 'in_progress', 'completed']),
});

export const apsDashboardResponseSchema = z.object({
  readOnly: z.literal(true),
  roleView: z.enum(['physician', 'nurse', 'admin']),
  idcPanels: z.array(apsIdcPanelSchema),
  cardiovascularControls: z.array(apsCardiovascularRowSchema),
  framinghamScores: z.array(apsFraminghamRowSchema),
  preventiveExams: z.array(apsPreventiveExamRowSchema),
  diabeticFootScreenings: z.array(apsDiabeticFootRowSchema),
  mentalHealthScreenings: z.array(apsMentalHealthRowSchema),
  childWellnessControls: z.array(apsChildWellnessRowSchema),
  immunizationSchedule: z.array(apsImmunizationRowSchema),
  prenatalControls: z.array(apsPrenatalRowSchema),
  ministerialReferrals: z.array(apsMinisterialReferralRowSchema),
  homeVisits: z.array(apsHomeVisitRowSchema),
  metrics: z.object({
    enrolledPrograms: z.number().int(),
    pendingScreenings: z.number().int(),
    homeVisitsToday: z.number().int(),
  }),
});

export type ApsDashboardResponse = z.infer<typeof apsDashboardResponseSchema>;

/** MF-TRAMO-I-002 — Tablero especialidades gráficas (IDC 181–190). */
export const specialtyIdcPanelSchema = z.object({
  idc: z.number().int(),
  label: z.string(),
  status: z.enum(['active', 'planned']),
});

export const specialtyPartogramRowSchema = z.object({
  patientDisplayName: z.string(),
  cervicalDilationCm: z.number(),
  fetalStation: z.string(),
  updatedAt: z.string(),
});

export const specialtyOncologyBoardRowSchema = z.object({
  patientDisplayName: z.string(),
  tumorType: z.string(),
  discussionDate: z.string(),
  recommendation: z.string(),
});

export const specialtyOdontogramRowSchema = z.object({
  patientDisplayName: z.string(),
  teethAffected: z.string(),
  conditionSummary: z.string(),
});

export const specialtyEndoscopyRowSchema = z.object({
  patientDisplayName: z.string(),
  procedure: z.string(),
  keyFinding: z.string(),
});

export const specialtyOphthalmologyRowSchema = z.object({
  patientDisplayName: z.string(),
  visualAcuity: z.string(),
  iopMmHg: z.number().int(),
});

export const specialtyHemodialysisRowSchema = z.object({
  patientDisplayName: z.string(),
  sessionHours: z.number(),
  ultrafiltrationMl: z.number().int(),
});

export const specialtyKinesiologyRowSchema = z.object({
  patientDisplayName: z.string(),
  joint: z.string(),
  romDegrees: z.number().int(),
});

export const specialtyNutritionRowSchema = z.object({
  patientDisplayName: z.string(),
  bmi: z.number(),
  planStatus: z.string(),
});

export const specialtyChemotherapyRowSchema = z.object({
  patientDisplayName: z.string(),
  protocol: z.string(),
  cycleDay: z.number().int(),
});

export const specialtyPsychiatryRowSchema = z.object({
  patientDisplayName: z.string(),
  scaleName: z.string(),
  score: z.number().int(),
});

export const specialtyDashboardResponseSchema = z.object({
  readOnly: z.literal(true),
  roleView: z.enum(['physician', 'nurse', 'admin']),
  idcPanels: z.array(specialtyIdcPanelSchema),
  partograms: z.array(specialtyPartogramRowSchema),
  oncologyBoardCases: z.array(specialtyOncologyBoardRowSchema),
  odontograms: z.array(specialtyOdontogramRowSchema),
  endoscopyReports: z.array(specialtyEndoscopyRowSchema),
  ophthalmologyEvaluations: z.array(specialtyOphthalmologyRowSchema),
  hemodialysisSessions: z.array(specialtyHemodialysisRowSchema),
  kinesiologyRecords: z.array(specialtyKinesiologyRowSchema),
  nutritionRecords: z.array(specialtyNutritionRowSchema),
  chemotherapyProtocols: z.array(specialtyChemotherapyRowSchema),
  psychiatryFollowups: z.array(specialtyPsychiatryRowSchema),
  metrics: z.object({
    activeSpecialtyModules: z.number().int(),
    pendingGraphicReviews: z.number().int(),
    scheduledBoards: z.number().int(),
  }),
});

export type SpecialtyDashboardResponse = z.infer<typeof specialtyDashboardResponseSchema>;
