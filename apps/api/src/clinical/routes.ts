import {
  documentIntakeRequestSchema,
  documentIntakeResponseSchema,
  documentOcrResponseSchema,
  documentSearchResponseSchema,
  draftsListQuerySchema,
  medicationCatalogSearchResponseSchema,
  patientClinicalAlertsResponseSchema,
  patientClinicalSummaryResponseSchema,
  clinicalContextDenseResponseSchema,
  patientLongitudinalResponseSchema,
  patientResultsInboxResponseSchema,
} from '@epis2/contracts';
import { roleHasPermission } from '@epis2/clinical-domain';
import { z } from 'zod';
import type { FastifyInstance } from 'fastify';
import type { Database } from '../db/client.js';
import { runWithRlsContext } from '../db/rlsContext.js';
import { searchRankedMedicationCatalog } from '../catalog/medicationRank.js';
import { createRequirePermission, type AuthenticatedRequest } from '../auth/authenticate.js';
import {
  approveDraft,
  createDraft,
  getDraftDetail,
  getPatientById,
  getDemoClinicalAlertsForPatient,
  getPatientClinicalContext,
  getPatientDemoCaseCode,
  listDrafts,
  patientDemoPresentation,
  listApprovedNotes,
  searchPatients,
  updateDraft,
} from './service.js';
import type { AppConfig } from '../config.js';
import { sendApiError, zodIssuesToDetails } from '../errors.js';
import { processDocumentOcr } from './documentOcr.js';
import { intakePatientDocument } from './documentIntake.js';
import { searchPatientDocuments } from './documents.js';
import { getPatientLongitudinal } from './longitudinal.js';
import { getPatientClinicalSummary } from './patientClinicalSummary.js';
import { getPatientContextDense } from './patientContextDense.js';
import { getPatientResultsInbox } from './resultsInbox.js';
import { buildPatientSummaryExport } from './summaryExport.js';
import { parseClinicalTextSpellcheckRequest, runClinicalTextSpellcheck } from './textSpellcheck.js';
import { validateDraftBodyEpis2Meta } from './draftBodyMeta.js';
import {
  getPaperChartState,
  patchPaperChartSection,
  upsertPaperChartDraft,
  approvePaperChartDraft,
  PaperChartSignBlockedError,
} from './paperChart.js';
import { parsePaperChartBody, parsePaperChartSectionPatch } from '@epis2/clinical-forms';

const createDraftSchema = z.object({
  patientId: z.string().uuid(),
  encounterId: z.string().uuid().optional(),
  draftType: z.enum([
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
    'paper_chart',
    'other',
  ]),
  title: z.string().min(1),
  body: z.record(z.unknown()).default({}),
  assistAiRunId: z.string().uuid().optional(),
});

const updateDraftSchema = z.object({
  title: z.string().min(1).optional(),
  body: z.record(z.unknown()).optional(),
  status: z.enum(['draft', 'editing', 'ready_for_review', 'rejected', 'cancelled']).optional(),
  assistAiRunId: z.string().uuid().optional(),
});

const approveDraftSchema = z.object({
  clinicalOverrideReason: z.string().min(10).max(2000).optional(),
});

export async function registerClinicalRoutes(
  app: FastifyInstance,
  config: AppConfig,
  db: Database | null,
) {
  if (!db) {
    app.get('/api/clinical/status', async () => ({
      enabled: false,
      message: 'PostgreSQL no configurado — definir DATABASE_URL',
    }));
    return;
  }

  const requirePatientRead = createRequirePermission(config, 'patient.read');
  const requireDraftWrite = createRequirePermission(config, 'draft.write');
  const requireDraftApprove = createRequirePermission(config, 'draft.approve');

  app.get('/api/clinical/status', async () => ({ enabled: true }));

  // MF-184: catálogo de medicamentos promovido (drug-intel → clinical_catalog_staging)
  // consultable por roles clínicos para autocomplete. Solo entryCode/label.
  app.get(
    '/api/clinical/catalogs/medication',
    { preHandler: requirePatientRead },
    async (request) => {
      const session = (request as AuthenticatedRequest).session;
      const query = request.query as { q?: string; limit?: string; frequent?: string };
      const q = query.q?.trim() ?? '';
      const limit = Math.min(Math.max(Number(query.limit) || 20, 1), 50);
      const entries = await searchRankedMedicationCatalog(db, config, session, {
        q,
        limit,
        frequentOnly: query.frequent === '1' || query.frequent === 'true',
      });
      return medicationCatalogSearchResponseSchema.parse({
        readOnly: true as const,
        catalogCode: 'medication' as const,
        entries,
      });
    },
  );

  app.post(
    '/api/clinical/text-spellcheck',
    { preHandler: requireDraftWrite },
    async (request, reply) => {
      const parsed = parseClinicalTextSpellcheckRequest(request.body);
      if (!parsed.success) {
        return sendApiError(reply, 400, 'Texto inválido para corrector clínico');
      }
      const result = await runClinicalTextSpellcheck(config, parsed.data.text);
      return reply.send(result);
    },
  );

  app.get('/api/patients', { preHandler: requirePatientRead }, async (request) => {
    const session = (request as AuthenticatedRequest).session;
    const q = (request.query as { q?: string }).q;
    const rows = await runWithRlsContext(db, config, session, (tx) => searchPatients(tx, q));
    const patients = await Promise.all(
      rows.map(async (p) => {
        const demoCaseCode = await getPatientDemoCaseCode(db, p.id);
        return {
          id: p.id,
          displayName: p.displayName,
          ...patientDemoPresentation(p),
          demoCaseCode,
        };
      }),
    );
    return { patients };
  });

  app.get(
    '/api/patients/:patientId/clinical-alerts',
    { preHandler: requirePatientRead },
    async (request, reply) => {
      const { patientId } = request.params as { patientId: string };
      const query = request.query as { blueprintId?: string; fields?: string };
      const alertOpts: Parameters<typeof getDemoClinicalAlertsForPatient>[2] = {};
      if (query.blueprintId !== undefined) alertOpts.blueprintId = query.blueprintId;
      if (query.fields) {
        try {
          const parsed = JSON.parse(query.fields) as Record<string, unknown>;
          const fields: Record<string, string> = {};
          for (const [key, value] of Object.entries(parsed)) {
            if (typeof value === 'string' && value.trim()) fields[key] = value.trim();
          }
          if (Object.keys(fields).length > 0) alertOpts.currentFields = fields;
        } catch {
          /* ignore malformed fields query */
        }
      }
      const evaluated = await getDemoClinicalAlertsForPatient(db, patientId, alertOpts);
      if (!evaluated) {
        return sendApiError(reply, 404, 'Paciente no encontrado');
      }
      return patientClinicalAlertsResponseSchema.parse({
        patientId,
        readOnly: true,
        evaluatedAt: evaluated.evaluatedAt,
        alerts: evaluated.alerts,
      });
    },
  );

  app.get(
    '/api/patients/:patientId',
    { preHandler: requirePatientRead },
    async (request, reply) => {
      const { patientId } = request.params as { patientId: string };
      const session = (request as AuthenticatedRequest).session;
      const patient = await runWithRlsContext(db, config, session, (tx) =>
        getPatientById(tx, patientId),
      );
      if (!patient) {
        return sendApiError(reply, 404, 'Paciente no encontrado');
      }
      const notes = await runWithRlsContext(db, config, session, (tx) =>
        listApprovedNotes(tx, patientId),
      );
      const clinicalContext = await getPatientClinicalContext(db, patientId);
      const demoCaseCode = await getPatientDemoCaseCode(db, patientId);
      return {
        patient: {
          id: patient.id,
          displayName: patient.displayName,
          ...patientDemoPresentation(patient),
          demoCaseCode,
        },
        clinicalContext,
        notes: notes.map((n) => ({
          id: n.id,
          noteType: n.noteType,
          title: n.title,
          createdAt: n.createdAt,
          createdBy: n.createdBy,
        })),
      };
    },
  );

  app.get(
    '/api/patients/:patientId/documents/search',
    { preHandler: requirePatientRead },
    async (request, reply) => {
      const { patientId } = request.params as { patientId: string };
      const q = (request.query as { q?: string }).q ?? '';
      const patient = await getPatientById(db, patientId);
      if (!patient) {
        return sendApiError(reply, 404, 'Paciente no encontrado');
      }
      const data = await searchPatientDocuments(db, patientId, q);
      return documentSearchResponseSchema.parse({ readOnly: true as const, ...data });
    },
  );

  app.post(
    '/api/patients/:patientId/documents/intake',
    { preHandler: requireDraftWrite },
    async (request, reply) => {
      const { patientId } = request.params as { patientId: string };
      const parsed = documentIntakeRequestSchema.safeParse(request.body);
      if (!parsed.success) {
        return sendApiError(reply, 400, 'Intake de documento inválido');
      }
      const patient = await getPatientById(db, patientId);
      if (!patient) {
        return sendApiError(reply, 404, 'Paciente no encontrado');
      }
      const session = (request as AuthenticatedRequest).session;
      const result = await intakePatientDocument(
        db,
        patientId,
        session.sub,
        parsed.data,
        config.OLLAMA_BASE_URL,
      );
      return reply.status(201).send(documentIntakeResponseSchema.parse(result));
    },
  );

  app.post(
    '/api/patients/:patientId/documents/:documentId/ocr',
    { preHandler: requireDraftWrite },
    async (request, reply) => {
      const { documentId } = request.params as { documentId: string };
      const result = await processDocumentOcr(db, documentId, config.OLLAMA_BASE_URL);
      if (!result) {
        return sendApiError(reply, 404, 'Documento no encontrado');
      }
      return documentOcrResponseSchema.parse({
        ...result,
        requiresHumanReview: true as const,
      });
    },
  );

  app.get(
    '/api/patients/:patientId/export/summary',
    { preHandler: requirePatientRead },
    async (request, reply) => {
      const { patientId } = request.params as { patientId: string };
      const format = (request.query as { format?: string }).format === 'pdf' ? 'pdf' : 'txt';
      const exported = await buildPatientSummaryExport(db, patientId, format);
      if (!exported) {
        return sendApiError(reply, 404, 'Paciente no encontrado');
      }
      return reply
        .header('Content-Type', exported.contentType)
        .header('Content-Disposition', `attachment; filename="${exported.filename}"`)
        .send(exported.body);
    },
  );

  app.get(
    '/api/patients/:patientId/longitudinal',
    { preHandler: requirePatientRead },
    async (request, reply) => {
      const { patientId } = request.params as { patientId: string };
      const patient = await getPatientById(db, patientId);
      if (!patient) {
        return sendApiError(reply, 404, 'Paciente no encontrado');
      }
      const data = await getPatientLongitudinal(db, patientId);
      return patientLongitudinalResponseSchema.parse(data);
    },
  );

  app.get(
    '/api/patients/:patientId/clinical-summary',
    { preHandler: requirePatientRead },
    async (request, reply) => {
      const { patientId } = request.params as { patientId: string };
      const summary = await getPatientClinicalSummary(db, patientId);
      if (!summary) {
        return sendApiError(reply, 404, 'Paciente no encontrado');
      }
      return patientClinicalSummaryResponseSchema.parse(summary);
    },
  );

  app.get(
    '/api/patients/:patientId/context-dense',
    { preHandler: requirePatientRead },
    async (request, reply) => {
      const { patientId } = request.params as { patientId: string };
      const patient = await getPatientById(db, patientId);
      if (!patient) {
        return sendApiError(reply, 404, 'Paciente no encontrado');
      }
      const dense = await getPatientContextDense(db, patientId);
      return clinicalContextDenseResponseSchema.parse(dense);
    },
  );

  app.get(
    '/api/patients/:patientId/results-inbox',
    { preHandler: requirePatientRead },
    async (request, reply) => {
      const { patientId } = request.params as { patientId: string };
      const patient = await getPatientById(db, patientId);
      if (!patient) {
        return sendApiError(reply, 404, 'Paciente no encontrado');
      }
      const data = await getPatientResultsInbox(db, patientId);
      return patientResultsInboxResponseSchema.parse(data);
    },
  );

  app.get(
    '/api/patients/:patientId/paper-chart',
    { preHandler: requirePatientRead },
    async (request, reply) => {
      const { patientId } = request.params as { patientId: string };
      const session = (request as AuthenticatedRequest).session;
      const patient = await getPatientById(db, patientId);
      if (!patient) {
        return sendApiError(reply, 404, 'Paciente no encontrado');
      }
      const state = await runWithRlsContext(db, config, session, (tx) =>
        getPaperChartState(tx, patientId),
      );
      return state;
    },
  );

  app.post(
    '/api/patients/:patientId/paper-chart/approve',
    { preHandler: requireDraftApprove },
    async (request, reply) => {
      const { patientId } = request.params as { patientId: string };
      const session = (request as AuthenticatedRequest).session;
      const patient = await getPatientById(db, patientId);
      if (!patient) {
        return sendApiError(reply, 404, 'Paciente no encontrado');
      }
      try {
        const result = await runWithRlsContext(db, config, session, (tx) =>
          approvePaperChartDraft(tx, { id: session.sub, username: session.username }, patientId),
        );
        return { patientId, ...result };
      } catch (err) {
        if (err instanceof PaperChartSignBlockedError) {
          return sendApiError(reply, 409, err.message, {
            details: err.blockers.map((message, index) => ({
              path: `blockers[${index}]`,
              message,
            })),
          });
        }
        return sendApiError(reply, 400, err instanceof Error ? err.message : 'No se pudo firmar');
      }
    },
  );

  app.put(
    '/api/patients/:patientId/paper-chart',
    { preHandler: requireDraftWrite },
    async (request, reply) => {
      const { patientId } = request.params as { patientId: string };
      const session = (request as AuthenticatedRequest).session;
      const patient = await getPatientById(db, patientId);
      if (!patient) {
        return sendApiError(reply, 404, 'Paciente no encontrado');
      }
      let sections;
      try {
        sections = parsePaperChartBody(request.body);
      } catch {
        return sendApiError(reply, 400, 'Cuerpo paper-chart inválido');
      }
      const draft = await runWithRlsContext(db, config, session, (tx) =>
        upsertPaperChartDraft(
          tx,
          { id: session.sub, username: session.username },
          patientId,
          sections,
        ),
      );
      return { patientId, sections, draftId: draft.id };
    },
  );

  app.patch(
    '/api/patients/:patientId/paper-chart',
    { preHandler: requireDraftWrite },
    async (request, reply) => {
      const { patientId } = request.params as { patientId: string };
      const session = (request as AuthenticatedRequest).session;
      let patch;
      try {
        patch = parsePaperChartSectionPatch(request.body);
      } catch {
        return sendApiError(reply, 400, 'Sección paper-chart inválida');
      }
      const patient = await getPatientById(db, patientId);
      if (!patient) {
        return sendApiError(reply, 404, 'Paciente no encontrado');
      }
      const result = await runWithRlsContext(db, config, session, (tx) =>
        patchPaperChartSection(
          tx,
          { id: session.sub, username: session.username },
          patientId,
          patch,
        ),
      );
      return {
        patientId,
        draftId: result.draft.id,
        sections: result.sections,
      };
    },
  );

  app.post('/api/drafts', { preHandler: requireDraftWrite }, async (request, reply) => {
    const parsed = createDraftSchema.safeParse(request.body);
    if (!parsed.success) {
      return sendApiError(reply, 400, 'Datos de borrador inválidos', {
        details: zodIssuesToDetails(parsed.error.issues),
      });
    }
    const session = (request as AuthenticatedRequest).session;
    if (!roleHasPermission(session.role, 'draft.write')) {
      return sendApiError(reply, 403, 'Sin permiso draft.write');
    }
    const { patientId, draftType, title, body, encounterId, assistAiRunId } = parsed.data;
    const metaCheck = validateDraftBodyEpis2Meta(body);
    if (!metaCheck.success) {
      return sendApiError(reply, 400, metaCheck.error);
    }
    const draftInput: Parameters<typeof createDraft>[2] = {
      patientId,
      draftType,
      title,
      body: metaCheck.body,
    };
    if (encounterId !== undefined) draftInput.encounterId = encounterId;
    if (assistAiRunId !== undefined) draftInput.assistAiRunId = assistAiRunId;
    const draft = await runWithRlsContext(db, config, session, (tx) =>
      createDraft(tx, { id: session.sub, username: session.username }, draftInput),
    );
    return reply.status(201).send({ draft });
  });

  app.get(
    '/api/drafts',
    { preHandler: createRequirePermission(config, 'draft.read') },
    async (request, reply) => {
      const session = (request as AuthenticatedRequest).session;
      const parsed = draftsListQuerySchema.safeParse(request.query);
      if (!parsed.success) {
        return sendApiError(reply, 400, 'Parámetros de paginación inválidos');
      }
      const { patientId, status, limit, offset } = parsed.data;
      const filter: Parameters<typeof listDrafts>[1] = { limit, offset };
      if (patientId !== undefined) filter.patientId = patientId;
      if (status !== undefined) filter.status = status;
      const drafts = await runWithRlsContext(db, config, session, (tx) => listDrafts(tx, filter));
      return {
        drafts: drafts.map((d) => ({
          id: d.id,
          patientId: d.patientId,
          draftType: d.draftType,
          status: d.status,
          title: d.title,
          updatedAt: d.updatedAt,
        })),
        limit,
        offset,
      };
    },
  );

  app.get(
    '/api/drafts/:draftId',
    { preHandler: createRequirePermission(config, 'draft.read') },
    async (request, reply) => {
      const { draftId } = request.params as { draftId: string };
      const session = (request as AuthenticatedRequest).session;
      const detail = await runWithRlsContext(db, config, session, (tx) =>
        getDraftDetail(tx, draftId),
      );
      if (!detail) {
        return sendApiError(reply, 404, 'Borrador no encontrado');
      }
      return {
        draft: detail.draft,
        versions: detail.versions.map((v) => ({
          versionNo: v.versionNo,
          status: v.status,
          title: v.title,
          createdAt: v.createdAt,
          createdBy: v.createdBy,
        })),
      };
    },
  );

  app.patch('/api/drafts/:draftId', { preHandler: requireDraftWrite }, async (request, reply) => {
    const { draftId } = request.params as { draftId: string };
    const parsed = updateDraftSchema.safeParse(request.body);
    if (!parsed.success) {
      return sendApiError(reply, 400, 'Actualización inválida', {
        details: zodIssuesToDetails(parsed.error.issues),
      });
    }
    const session = (request as AuthenticatedRequest).session;
    try {
      const patch: Parameters<typeof updateDraft>[3] = {};
      if (parsed.data.title !== undefined) patch.title = parsed.data.title;
      if (parsed.data.body !== undefined) {
        const metaCheck = validateDraftBodyEpis2Meta(parsed.data.body);
        if (!metaCheck.success) {
          return sendApiError(reply, 400, metaCheck.error);
        }
        patch.body = metaCheck.body;
      }
      if (parsed.data.status !== undefined) patch.status = parsed.data.status;
      if (parsed.data.assistAiRunId !== undefined) patch.assistAiRunId = parsed.data.assistAiRunId;
      const draft = await runWithRlsContext(db, config, session, (tx) =>
        updateDraft(tx, { id: session.sub, username: session.username }, draftId, patch),
      );
      if (!draft) {
        return sendApiError(reply, 404, 'Borrador no encontrado');
      }
      return { draft };
    } catch (e) {
      return sendApiError(reply, 409, e instanceof Error ? e.message : 'Conflicto al actualizar');
    }
  });

  app.post(
    '/api/drafts/:draftId/approve',
    { preHandler: requireDraftApprove },
    async (request, reply) => {
      const { draftId } = request.params as { draftId: string };
      const session = (request as AuthenticatedRequest).session;
      const bodyParsed = approveDraftSchema.safeParse(request.body ?? {});
      if (!bodyParsed.success) {
        return sendApiError(reply, 400, 'Payload de aprobación inválido', {
          details: zodIssuesToDetails(bodyParsed.error.issues),
        });
      }
      try {
        const approveOptions =
          bodyParsed.data.clinicalOverrideReason !== undefined
            ? { clinicalOverrideReason: bodyParsed.data.clinicalOverrideReason }
            : undefined;
        const result = await runWithRlsContext(db, config, session, (tx) =>
          approveDraft(
            tx,
            { id: session.sub, username: session.username },
            draftId,
            approveOptions,
          ),
        );
        if (!result) {
          return sendApiError(reply, 404, 'Borrador no encontrado');
        }
        return { draft: result.draft, note: result.note };
      } catch (e) {
        return sendApiError(reply, 409, e instanceof Error ? e.message : 'No se pudo aprobar');
      }
    },
  );
}
