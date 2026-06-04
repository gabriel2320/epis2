import { patientClinicalAlertsResponseSchema } from '@epis2/contracts';
import { roleHasPermission } from '@epis2/clinical-domain';
import { z } from 'zod';
import type { FastifyInstance } from 'fastify';
import type { Database } from '../db/client.js';
import {
  createAuthenticate,
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

const createDraftSchema = z.object({
  patientId: z.string().uuid(),
  encounterId: z.string().uuid().optional(),
  draftType: z.enum(['evolution_note', 'discharge_summary', 'prescription', 'lab_request', 'other']),
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
  config: Parameters<typeof createAuthenticate>[0],
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
      const q = (request.query as { q?: string }).q;
      const rows = await searchPatients(db, q);
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
      const query = request.query as { blueprintId?: string };
      const alertOpts: Parameters<typeof getDemoClinicalAlertsForPatient>[2] = {};
      if (query.blueprintId !== undefined) alertOpts.blueprintId = query.blueprintId;
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
      const patient = await getPatientById(db, patientId);
      if (!patient) {
        return reply.status(404).send({ error: 'Paciente no encontrado' });
      }
      const notes = await listApprovedNotes(db, patientId);
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
      const draft = await createDraft(
        db,
        { id: session.sub, username: session.username },
        draftInput,
      );
      return reply.status(201).send({ draft });
    },
  );

  app.get(
    '/api/drafts',
    { preHandler: createRequirePermission(config, 'draft.read') },
    async (request) => {
      const query = request.query as { patientId?: string; status?: string };
      const filter: { patientId?: string; status?: string } = {};
      if (query.patientId !== undefined) filter.patientId = query.patientId;
      if (query.status !== undefined) filter.status = query.status;
      const drafts = await listDrafts(db, filter);
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
      const detail = await getDraftDetail(db, draftId);
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
        const draft = await updateDraft(
          db,
          { id: session.sub, username: session.username },
          draftId,
          patch,
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
        const result = await approveDraft(
          db,
          { id: session.sub, username: session.username },
          draftId,
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
