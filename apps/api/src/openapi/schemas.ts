/**
 * MF-NORM-301 — schemas Zod v4 con metadata OpenAPI para rutas auth / drafts / search.
 * Usa `zod/v4` (incluido en zod 3.25+) para `.meta()` requerido por zod-openapi v5.
 * Espejan handlers existentes sin reescribir rutas Fastify.
 */
import 'zod-openapi';
import { z } from 'zod/v4';

export const loginRequestOpenApiSchema = z
  .object({
    username: z.string().min(3).max(64),
    demoAuthKey: z.string().min(8).max(64),
  })
  .meta({ id: 'LoginRequest' });

export const sessionResponseOpenApiSchema = z
  .object({
    user: z.object({
      id: z.string().min(8),
      username: z.string(),
      displayName: z.string(),
      role: z.enum([
        'physician',
        'nurse',
        'paramedic',
        'kinesiologist',
        'pharmacist',
        'admin',
        'auditor',
      ]),
    }),
    permissions: z.array(z.string()),
    expiresAt: z.string(),
  })
  .meta({ id: 'SessionResponse' });

export const draftsListQueryOpenApiSchema = z
  .object({
    patientId: z.string().optional(),
    status: z.string().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).default(50),
    offset: z.coerce.number().int().min(0).default(0),
  })
  .meta({ id: 'DraftsListQuery' });

export const apiErrorResponseSchema = z
  .object({
    code: z.enum([
      'VALIDATION',
      'UNAUTHORIZED',
      'FORBIDDEN',
      'NOT_FOUND',
      'CONFLICT',
      'RATE_LIMITED',
      'UNAVAILABLE',
      'INTERNAL',
    ]),
    message: z.string().min(1),
    correlationId: z.string().min(1),
    details: z
      .array(
        z.object({
          path: z.string(),
          message: z.string(),
        }),
      )
      .optional(),
  })
  .meta({ id: 'ApiError' });

export const draftTypeSchema = z.enum([
  'evolution_note',
  'discharge_summary',
  'prescription',
  'lab_request',
  'referral',
  'imaging_request',
  'nursing_note',
  'medication_administration',
  'pharmacy_validation',
  'admission_note',
  'allergy_entry',
  'clinical_problem_entry',
  'medication_reconciliation',
  'transfer_note',
  'outpatient_visit',
  'referral_report',
  'medical_certificate',
  'procedure_request',
  'other',
]);

export const createDraftRequestSchema = z
  .object({
    patientId: z.string(),
    encounterId: z.string().optional(),
    draftType: draftTypeSchema,
    title: z.string().min(1),
    body: z.record(z.string(), z.unknown()).default({}),
  })
  .meta({ id: 'CreateDraftRequest' });

export const updateDraftRequestSchema = z
  .object({
    title: z.string().min(1).optional(),
    body: z.record(z.string(), z.unknown()).optional(),
    status: z.enum(['draft', 'editing', 'ready_for_review', 'rejected', 'cancelled']).optional(),
  })
  .meta({ id: 'UpdateDraftRequest' });

export const draftSummarySchema = z
  .object({
    id: z.string(),
    patientId: z.string(),
    draftType: z.string(),
    status: z.string(),
    title: z.string(),
    updatedAt: z.string(),
  })
  .meta({ id: 'DraftSummary' });

export const draftsListResponseSchema = z
  .object({
    drafts: z.array(draftSummarySchema),
    limit: z.number().int(),
    offset: z.number().int(),
  })
  .meta({ id: 'DraftsListResponse' });

export const draftDetailResponseSchema = z
  .object({
    draft: z.record(z.string(), z.unknown()),
    versions: z.array(
      z.object({
        versionNo: z.number().int(),
        status: z.string(),
        title: z.string(),
        createdAt: z.string(),
        createdBy: z.string(),
      }),
    ),
  })
  .meta({ id: 'DraftDetailResponse' });

export const createDraftResponseSchema = z
  .object({
    draft: z.record(z.string(), z.unknown()),
  })
  .meta({ id: 'CreateDraftResponse' });

export const patientsSearchQuerySchema = z
  .object({
    q: z.string().optional().meta({ description: 'Texto libre de búsqueda' }),
  })
  .meta({ id: 'PatientsSearchQuery' });

export const patientListItemSchema = z
  .object({
    id: z.string(),
    displayName: z.string(),
    demoCaseCode: z.string().nullable().optional(),
  })
  .meta({ id: 'PatientListItem' });

export const patientsSearchResponseSchema = z
  .object({
    patients: z.array(patientListItemSchema),
  })
  .meta({ id: 'PatientsSearchResponse' });

export const documentSearchQuerySchema = z
  .object({
    q: z.string().optional().meta({ description: 'Consulta de búsqueda documental' }),
  })
  .meta({ id: 'DocumentSearchQuery' });

export const documentSearchResponseSchema = z
  .object({
    readOnly: z.literal(true),
    hits: z.array(z.record(z.string(), z.unknown())),
  })
  .meta({ id: 'DocumentSearchResponse' });

export const draftIdParamSchema = z.object({
  draftId: z.string().meta({ description: 'Identificador del borrador' }),
});

export const patientIdParamSchema = z.object({
  patientId: z.string().meta({ description: 'Identificador del paciente' }),
});

export const logoutOkSchema = z.object({ ok: z.literal(true) }).meta({ id: 'LogoutOk' });
