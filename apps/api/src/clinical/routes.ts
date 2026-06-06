import {
  documentIntakeRequestSchema,
  documentIntakeResponseSchema,
  documentOcrResponseSchema,
  documentSearchResponseSchema,
  patientClinicalAlertsResponseSchema,
  patientLongitudinalResponseSchema,
  patientResultsInboxResponseSchema,
} from '@epis2/contracts';
import { roleHasPermission } from '@epis2/clinical-domain';
import { z } from 'zod';
import type { FastifyInstance } from 'fastify';
import type { Database } from '../db/client.js';
import { runWithRlsContext } from '../db/rlsContext.js';
import {
  createRequirePermission,
  type AuthenticatedRequest,
} from '../auth/authenticate.js';
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
import { processDocumentOcr } from './documentOcr.js';
import { intakePatientDocument } from './documentIntake.js';
import { searchPatientDocuments } from './documents.js';
import { getPatientLongitudinal } from './longitudinal.js';
import { getPatientResultsInbox } from './resultsInbox.js';
import { buildPatientSummaryExport } from './summaryExport.js';

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
    'other',
  ]),
  title: z.string().min(1),
  body: z.record(z.unknown()).default({}),
});

const updateDraftSchema = z.object({
  title: z.string().min(1).optional(),
  body: z.record(z.unknown()).optional(),
  status: z
    .enum(['draft', 'editing', 'ready_for_review', 'rejected', 'cancelled'])
    .optional(),
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

  app.get(
    '/api/patients',
    { preHandler: requirePatientRead },
    async (request) => {
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
    },
  );

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
        return reply.status(404).send({ error: 'Paciente no encontrado' });
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
        return reply.status(404).send({ error: 'Paciente no encontrado' });
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
        return reply.status(404).send({ error: 'Paciente no encontrado' });
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
        return reply.status(400).send({ error: 'Intake de documento inválido' });
      }
      const patient = await getPatientById(db, patientId);
      if (!patient) {
        return reply.status(404).send({ error: 'Paciente no encontrado' });
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
        return reply.status(404).send({ error: 'Documento no encontrado' });
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
        return reply.status(404).send({ error: 'Paciente no encontrado' });
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
        return reply.status(404).send({ error: 'Paciente no encontrado' });
      }
      const data = await getPatientLongitudinal(db, patientId);
      return patientLongitudinalResponseSchema.parse(data);
    },
  );

  app.get(
    '/api/patients/:patientId/results-inbox',
    { preHandler: requirePatientRead },
    async (request, reply) => {
      const { patientId } = request.params as { patientId: string };
      const patient = await getPatientById(db, patientId);
      if (!patient) {
        return reply.status(404).send({ error: 'Paciente no encontrado' });
      }
      const data = await getPatientResultsInbox(db, patientId);
      return patientResultsInboxResponseSchema.parse(data);
    },
  );

  app.post(
    '/api/drafts',
    { preHandler: requireDraftWrite },
    async (request, reply) => {
      const parsed = createDraftSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.status(400).send({ error: 'Datos de borrador inválidos' });
      }
      const session = (request as AuthenticatedRequest).session;
      if (!roleHasPermission(session.role, 'draft.write')) {
        return reply.status(403).send({ error: 'Sin permiso draft.write' });
      }
      const { patientId, draftType, title, body, encounterId } = parsed.data;
      const draftInput: Parameters<typeof createDraft>[2] = {
        patientId,
        draftType,
        title,
        body,
      };
      if (encounterId !== undefined) draftInput.encounterId = encounterId;
      const draft = await runWithRlsContext(db, config, session, (tx) =>
        createDraft(tx, { id: session.sub, username: session.username }, draftInput),
      );
      return reply.status(201).send({ draft });
    },
  );

  app.get(
    '/api/drafts',
    { preHandler: createRequirePermission(config, 'draft.read') },
    async (request) => {
      const session = (request as AuthenticatedRequest).session;
      const query = request.query as { patientId?: string; status?: string };
      const filter: { patientId?: string; status?: string } = {};
      if (query.patientId !== undefined) filter.patientId = query.patientId;
      if (query.status !== undefined) filter.status = query.status;
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
        return reply.status(404).send({ error: 'Borrador no encontrado' });
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

  app.patch(
    '/api/drafts/:draftId',
    { preHandler: requireDraftWrite },
    async (request, reply) => {
      const { draftId } = request.params as { draftId: string };
      const parsed = updateDraftSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.status(400).send({ error: 'Actualización inválida' });
      }
      const session = (request as AuthenticatedRequest).session;
      try {
        const patch: Parameters<typeof updateDraft>[3] = {};
        if (parsed.data.title !== undefined) patch.title = parsed.data.title;
        if (parsed.data.body !== undefined) patch.body = parsed.data.body;
        if (parsed.data.status !== undefined) patch.status = parsed.data.status;
        const draft = await runWithRlsContext(db, config, session, (tx) =>
          updateDraft(tx, { id: session.sub, username: session.username }, draftId, patch),
        );
        if (!draft) {
          return reply.status(404).send({ error: 'Borrador no encontrado' });
        }
        return { draft };
      } catch (e) {
        return reply.status(409).send({
          error: e instanceof Error ? e.message : 'Conflicto al actualizar',
        });
      }
    },
  );

  app.post(
    '/api/drafts/:draftId/approve',
    { preHandler: requireDraftApprove },
    async (request, reply) => {
      const { draftId } = request.params as { draftId: string };
      const session = (request as AuthenticatedRequest).session;
      try {
        const result = await runWithRlsContext(db, config, session, (tx) =>
          approveDraft(tx, { id: session.sub, username: session.username }, draftId),
        );
        if (!result) {
          return reply.status(404).send({ error: 'Borrador no encontrado' });
        }
        return { draft: result.draft, note: result.note };
      } catch (e) {
        return reply.status(409).send({
          error: e instanceof Error ? e.message : 'No se pudo aprobar',
        });
      }
    },
  );
}
