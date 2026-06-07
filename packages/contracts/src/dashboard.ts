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

export const orDashboardResponseSchema = z.object({
  readOnly: z.literal(true),
  roleView: z.enum(['physician', 'nurse', 'admin']),
  idcPanels: z.array(orIdcPanelSchema),
  surgicalSchedule: z.array(orSurgicalScheduleRowSchema),
  whoSafetyChecklist: z.array(orWhoChecklistRowSchema),
  preanesthesiaEvaluations: z.array(orPreanesthesiaRowSchema),
  metrics: z.object({
    operatingRoomsInUse: z.number().int(),
    scheduledToday: z.number().int(),
    inProgress: z.number().int(),
  }),
});

export type OrDashboardResponse = z.infer<typeof orDashboardResponseSchema>;
