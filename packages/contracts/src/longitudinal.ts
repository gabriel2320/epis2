import { z } from 'zod';

export const longitudinalProblemSchema = z.object({
  id: z.string().uuid(),
  description: z.string(),
  status: z.string(),
});

export const longitudinalAllergySchema = z.object({
  id: z.string().uuid(),
  substance: z.string(),
  severity: z.string(),
  status: z.string(),
});

export const longitudinalMedicationSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  doseText: z.string().nullable().optional(),
  route: z.string().nullable().optional(),
  status: z.string(),
});

export const longitudinalObservationSchema = z.object({
  id: z.string().uuid(),
  label: z.string(),
  valueText: z.string(),
  observedAt: z.string(),
});

export const longitudinalDocumentSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  documentType: z.string(),
  mimeType: z.string().nullable().optional(),
  storageRef: z.string(),
  indexedAt: z.string(),
});

export const longitudinalEncounterSchema = z.object({
  id: z.string().uuid(),
  status: z.string(),
  startedAt: z.string(),
  endedAt: z.string().nullable().optional(),
});

export const timelineEventSchema = z.object({
  id: z.string(),
  kind: z.enum([
    'encounter',
    'note',
    'observation',
    'document',
    'draft',
  ]),
  at: z.string(),
  title: z.string(),
  detail: z.string().optional(),
  entityId: z.string().optional(),
});

export const patientLongitudinalResponseSchema = z.object({
  patientId: z.string().uuid(),
  readOnly: z.literal(true),
  demoCaseCode: z.string().optional(),
  problems: z.array(longitudinalProblemSchema),
  allergies: z.array(longitudinalAllergySchema),
  medications: z.array(longitudinalMedicationSchema),
  observations: z.array(longitudinalObservationSchema),
  documents: z.array(longitudinalDocumentSchema),
  encounters: z.array(longitudinalEncounterSchema),
  timeline: z.array(timelineEventSchema),
});

export const patientDashboardResponseSchema = z.object({
  patientId: z.string().uuid(),
  readOnly: z.literal(true),
  displayName: z.string(),
  demoCaseCode: z.string().optional(),
  activeProblems: z.array(z.string()),
  allergies: z.array(longitudinalAllergySchema),
  medications: z.array(longitudinalMedicationSchema),
  recentObservations: z.array(longitudinalObservationSchema),
  pendingDrafts: z.array(
    z.object({
      id: z.string().uuid(),
      title: z.string(),
      status: z.string(),
      draftType: z.string(),
    }),
  ),
  recentDocuments: z.array(longitudinalDocumentSchema),
  timelinePreview: z.array(timelineEventSchema),
});

export type PatientLongitudinalResponse = z.infer<typeof patientLongitudinalResponseSchema>;
export type PatientDashboardResponse = z.infer<typeof patientDashboardResponseSchema>;
