import { z } from 'zod';

const traditionalSectionNavIdSchema = z.enum([
  'navSummary',
  'navAdmin',
  'navAnamnesis',
  'navAntecedents',
  'navAllergies',
  'navPhysicalExam',
  'navDiagnoses',
  'navOrders',
  'navMeds',
  'navEvolution',
  'navLabs',
  'navImaging',
  'navConsults',
  'navDocuments',
  'navEpicrisis',
  'navProcedures',
  'navAudit',
]);

export const commandActiveContextSchema = z.object({
  pendingDraftCount: z.number().int().min(0).optional(),
  activeAlertCount: z.number().int().min(0).optional(),
  workspace: z.enum(['command_center', 'patient_chart', 'clinical_form']).optional(),
  chartMode: z.enum(['traditional', 'paper']).optional(),
  paperSurface: z.enum(['document', 'planner']).optional(),
  plannerView: z.enum(['day', 'week', 'month']).optional(),
  traditionalSection: traditionalSectionNavIdSchema.optional(),
  assistBlueprintId: z.string().min(1).max(64).optional(),
});

export const commandSlotsSchema = z.object({
  patientHint: z.string().optional(),
  medicationHint: z.string().optional(),
  studyHint: z.string().optional(),
  specialtyHint: z.string().optional(),
  bodySiteHint: z.string().optional(),
  urgencyHint: z.enum(['routine', 'urgent', 'stat']).optional(),
  clinicalReasonHint: z.string().optional(),
  noteHint: z.string().optional(),
});

export const commandResolveRequestSchema = z.object({
  text: z.string().max(2000),
  patientId: z.string().uuid().optional(),
  context: commandActiveContextSchema.optional(),
  confirmed: z.boolean().optional(),
});

export const commandResolveResponseSchema = z.discriminatedUnion('status', [
  z.object({
    status: z.literal('resolved'),
    intent: z.string(),
    labelEs: z.string(),
    routePath: z.string(),
    slots: commandSlotsSchema,
  }),
  z.object({
    status: z.literal('needs_clarification'),
    message: z.string(),
    candidates: z.array(
      z.object({
        intent: z.string(),
        labelEs: z.string(),
      }),
    ),
  }),
  z.object({
    status: z.literal('needs_patient'),
    message: z.string(),
    intent: z.string(),
    labelEs: z.string(),
  }),
  z.object({
    status: z.literal('needs_confirmation'),
    message: z.string(),
    intent: z.string(),
    labelEs: z.string(),
    routePath: z.string(),
    safetyLevel: z.string(),
    slots: commandSlotsSchema,
  }),
  z.object({
    status: z.literal('forbidden'),
    message: z.string(),
    permission: z.string(),
  }),
  z.object({
    status: z.literal('empty'),
    message: z.string(),
  }),
]);

export type CommandResolveRequest = z.infer<typeof commandResolveRequestSchema>;
export type CommandResolveResponse = z.infer<typeof commandResolveResponseSchema>;

export const commandSuggestRequestSchema = z.object({
  text: z.string().max(2000),
});

export const commandSuggestResponseSchema = z.object({
  readOnly: z.literal(true),
  suggestions: z.array(
    z.object({
      intent: z.string(),
      labelEs: z.string(),
      score: z.number(),
      sampleEs: z.string().optional(),
    }),
  ),
});

export type CommandSuggestRequest = z.infer<typeof commandSuggestRequestSchema>;
export type CommandSuggestResponse = z.infer<typeof commandSuggestResponseSchema>;
