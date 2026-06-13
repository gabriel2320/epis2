import { asc, desc, eq } from 'drizzle-orm';
import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import {
  clinicalCaseRecordSchema,
  clinicalCaseReviewRequestSchema,
  clinicalCaseReviewStatusSchema,
  drugIntelRecordSchema,
  drugIntelReviewRequestSchema,
  drugIntelReviewStatusSchema,
} from '@epis2/contracts';
import type { AppConfig } from '../config.js';
import { sendApiError } from '../errors.js';
import type { Database } from '../db/client.js';
import { createRequirePermission, type AuthenticatedRequest } from '../auth/authenticate.js';
import {
  appUsers,
  clinicalCaseStaging,
  clinicalCatalogStaging,
  drugIntelStaging,
} from '../db/schema.js';
import { appendAudit } from '../audit/store.js';
import { promoteClinicalCaseRecord } from './clinicalCasePromote.js';

const catalogBodySchema = z.object({
  catalogCode: z.string().min(1),
  entryCode: z.string().min(1),
  label: z.string().min(1),
});

type DrugIntelStagingRow = typeof drugIntelStaging.$inferSelect;
type ClinicalCaseStagingRow = typeof clinicalCaseStaging.$inferSelect;

function toDrugIntelEntry(row: DrugIntelStagingRow) {
  return {
    id: row.id,
    recordKey: row.recordKey,
    productName: row.productName,
    activeIngredient: row.activeIngredient,
    atcCode: row.atcCode,
    reviewStatus: row.reviewStatus,
    requiresHumanReview: row.requiresHumanReview,
    record: drugIntelRecordSchema.parse(row.payload),
    fetchedAt: row.fetchedAt.toISOString(),
    reviewedBy: row.reviewedBy,
    reviewedAt: row.reviewedAt ? row.reviewedAt.toISOString() : null,
  };
}

function toClinicalCaseEntry(row: ClinicalCaseStagingRow) {
  return {
    id: row.id,
    caseCode: row.caseCode,
    scenario: row.scenario,
    reviewStatus: row.reviewStatus,
    requiresHumanReview: row.requiresHumanReview,
    record: clinicalCaseRecordSchema.parse(row.payload),
    sourceHash: row.sourceHash,
    fetchedAt: row.fetchedAt.toISOString(),
    reviewedBy: row.reviewedBy,
    reviewedAt: row.reviewedAt ? row.reviewedAt.toISOString() : null,
  };
}

export async function registerAdminRoutes(
  app: FastifyInstance,
  config: AppConfig,
  db: Database | null,
) {
  const requireUsersRead = createRequirePermission(config, 'admin.users.read');
  const requireAuditRead = createRequirePermission(config, 'audit.read');
  const requireCatalogsWrite = createRequirePermission(config, 'admin.catalogs.write');

  app.get('/api/admin/users', { preHandler: requireUsersRead }, async (_request, reply) => {
    if (!db) {
      return sendApiError(reply, 503, 'Base de datos no disponible');
    }
    const rows = await db
      .select({
        id: appUsers.id,
        username: appUsers.username,
        displayName: appUsers.displayName,
        role: appUsers.role,
        isSynthetic: appUsers.isSynthetic,
      })
      .from(appUsers)
      .orderBy(asc(appUsers.username));
    return { readOnly: true as const, users: rows };
  });

  app.get('/api/admin/catalogs', { preHandler: requireAuditRead }, async (request, reply) => {
    if (!db) {
      return sendApiError(reply, 503, 'Base de datos no disponible');
    }
    const catalogCode = (request.query as { catalogCode?: string }).catalogCode?.trim();
    const rows = catalogCode
      ? await db
          .select()
          .from(clinicalCatalogStaging)
          .where(eq(clinicalCatalogStaging.catalogCode, catalogCode))
          .orderBy(asc(clinicalCatalogStaging.entryCode))
      : await db
          .select()
          .from(clinicalCatalogStaging)
          .orderBy(asc(clinicalCatalogStaging.catalogCode), asc(clinicalCatalogStaging.entryCode));
    return {
      readOnly: false as const,
      entries: rows.map((r) => ({
        id: r.id,
        catalogCode: r.catalogCode,
        entryCode: r.entryCode,
        label: r.label,
        status: r.status,
        createdAt: r.createdAt.toISOString(),
      })),
    };
  });

  app.post('/api/admin/catalogs', { preHandler: requireCatalogsWrite }, async (request, reply) => {
    if (!db) {
      return sendApiError(reply, 503, 'Base de datos no disponible');
    }
    const parsed = catalogBodySchema.safeParse(request.body);
    if (!parsed.success) {
      return sendApiError(reply, 400, 'Cuerpo inválido');
    }
    const actor = (request as AuthenticatedRequest).session;
    const [row] = await db
      .insert(clinicalCatalogStaging)
      .values({
        catalogCode: parsed.data.catalogCode,
        entryCode: parsed.data.entryCode,
        label: parsed.data.label,
        createdBy: actor.sub,
      })
      .returning();
    await appendAudit(db, {
      eventType: 'admin.catalog.created',
      actorId: actor.sub,
      username: actor.username,
      entityType: 'clinical_catalog_staging',
      entityId: row!.id,
      message: `${parsed.data.catalogCode}/${parsed.data.entryCode}`,
    });
    return reply.status(201).send({ entry: row });
  });

  // --- Drug-Intel (MF-183): revisión humana del staging de fármacos ---

  app.get('/api/admin/drug-intel', { preHandler: requireAuditRead }, async (request, reply) => {
    if (!db) {
      return sendApiError(reply, 503, 'Base de datos no disponible');
    }
    const rawStatus = (request.query as { status?: string }).status?.trim();
    const status = rawStatus ? drugIntelReviewStatusSchema.safeParse(rawStatus) : null;
    if (status && !status.success) {
      return sendApiError(reply, 400, 'status inválido (pending|approved|rejected)');
    }
    const rows = status?.success
      ? await db
          .select()
          .from(drugIntelStaging)
          .where(eq(drugIntelStaging.reviewStatus, status.data))
          .orderBy(desc(drugIntelStaging.fetchedAt), asc(drugIntelStaging.productName))
      : await db
          .select()
          .from(drugIntelStaging)
          .orderBy(desc(drugIntelStaging.fetchedAt), asc(drugIntelStaging.productName));
    return { readOnly: false as const, entries: rows.map(toDrugIntelEntry) };
  });

  app.post(
    '/api/admin/drug-intel/:id/review',
    { preHandler: requireCatalogsWrite },
    async (request, reply) => {
      if (!db) {
        return sendApiError(reply, 503, 'Base de datos no disponible');
      }
      const parsed = drugIntelReviewRequestSchema.safeParse(request.body);
      if (!parsed.success) {
        return sendApiError(reply, 400, 'Cuerpo inválido');
      }
      const id = (request.params as { id: string }).id;
      const actor = (request as AuthenticatedRequest).session;
      const [row] = await db
        .update(drugIntelStaging)
        .set({
          reviewStatus: parsed.data.decision,
          reviewedBy: actor.sub,
          reviewedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(drugIntelStaging.id, id))
        .returning();
      if (!row) {
        return sendApiError(reply, 404, 'Registro drug-intel no encontrado');
      }
      await appendAudit(db, {
        eventType: 'admin.drug_intel.reviewed',
        actorId: actor.sub,
        username: actor.username,
        entityType: 'drug_intel_staging',
        entityId: row.id,
        message: `${row.recordKey}: ${parsed.data.decision}${parsed.data.note ? ` — ${parsed.data.note}` : ''}`,
      });
      return { entry: toDrugIntelEntry(row) };
    },
  );

  app.post(
    '/api/admin/drug-intel/promote',
    { preHandler: requireCatalogsWrite },
    async (_request, reply) => {
      if (!db) {
        return sendApiError(reply, 503, 'Base de datos no disponible');
      }
      const actor = (_request as AuthenticatedRequest).session;
      const approved = await db
        .select()
        .from(drugIntelStaging)
        .where(eq(drugIntelStaging.reviewStatus, 'approved'))
        .orderBy(asc(drugIntelStaging.productName));

      let promoted = 0;
      for (const row of approved) {
        const inserted = await db
          .insert(clinicalCatalogStaging)
          .values({
            catalogCode: 'medication',
            entryCode: row.recordKey,
            label: row.productName,
            createdBy: actor.sub,
          })
          .onConflictDoNothing()
          .returning();
        if (inserted.length > 0) promoted += 1;
      }

      await appendAudit(db, {
        eventType: 'admin.drug_intel.promoted',
        actorId: actor.sub,
        username: actor.username,
        entityType: 'clinical_catalog_staging',
        entityId: 'medication',
        message: `${promoted} fármaco(s) promovido(s) al catálogo medication (${approved.length - promoted} ya existente(s))`,
      });

      return {
        promoted,
        skipped: approved.length - promoted,
        catalogCode: 'medication' as const,
      };
    },
  );

  // --- Clinical-Case-Intel (MF-CASE-03): revisión humana y promote a SoT sintético ---

  app.get('/api/admin/clinical-cases', { preHandler: requireAuditRead }, async (request, reply) => {
    if (!db) {
      return sendApiError(reply, 503, 'Base de datos no disponible');
    }
    const rawStatus = (request.query as { status?: string }).status?.trim();
    const status = rawStatus ? clinicalCaseReviewStatusSchema.safeParse(rawStatus) : null;
    if (status && !status.success) {
      return sendApiError(reply, 400, 'status inválido (pending|approved|rejected)');
    }
    const rows = status?.success
      ? await db
          .select()
          .from(clinicalCaseStaging)
          .where(eq(clinicalCaseStaging.reviewStatus, status.data))
          .orderBy(desc(clinicalCaseStaging.fetchedAt), asc(clinicalCaseStaging.caseCode))
      : await db
          .select()
          .from(clinicalCaseStaging)
          .orderBy(desc(clinicalCaseStaging.fetchedAt), asc(clinicalCaseStaging.caseCode));
    return { readOnly: false as const, entries: rows.map(toClinicalCaseEntry) };
  });

  app.post(
    '/api/admin/clinical-cases/:id/review',
    { preHandler: requireCatalogsWrite },
    async (request, reply) => {
      if (!db) {
        return sendApiError(reply, 503, 'Base de datos no disponible');
      }
      const parsed = clinicalCaseReviewRequestSchema.safeParse(request.body);
      if (!parsed.success) {
        return sendApiError(reply, 400, 'Cuerpo inválido');
      }
      const id = (request.params as { id: string }).id;
      const actor = (request as AuthenticatedRequest).session;
      const [row] = await db
        .update(clinicalCaseStaging)
        .set({
          reviewStatus: parsed.data.decision,
          reviewedBy: actor.sub,
          reviewedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(clinicalCaseStaging.id, id))
        .returning();
      if (!row) {
        return sendApiError(reply, 404, 'Registro clinical-case no encontrado');
      }
      await appendAudit(db, {
        eventType: 'admin.clinical_case.reviewed',
        actorId: actor.sub,
        username: actor.username,
        entityType: 'clinical_case_staging',
        entityId: row.id,
        message: `${row.caseCode}: ${parsed.data.decision}${parsed.data.note ? ` — ${parsed.data.note}` : ''}`,
      });
      return { entry: toClinicalCaseEntry(row) };
    },
  );

  app.post(
    '/api/admin/clinical-cases/promote',
    { preHandler: requireCatalogsWrite },
    async (_request, reply) => {
      if (!db) {
        return sendApiError(reply, 503, 'Base de datos no disponible');
      }
      const actor = (_request as AuthenticatedRequest).session;
      const approved = await db
        .select()
        .from(clinicalCaseStaging)
        .where(eq(clinicalCaseStaging.reviewStatus, 'approved'))
        .orderBy(asc(clinicalCaseStaging.caseCode));

      let promoted = 0;
      let skipped = 0;
      for (const row of approved) {
        const record = clinicalCaseRecordSchema.parse(row.payload);
        const outcome = await promoteClinicalCaseRecord(db, record, actor.sub);
        if (outcome === 'promoted') promoted += 1;
        else skipped += 1;
      }

      await appendAudit(db, {
        eventType: 'admin.clinical_case.promoted',
        actorId: actor.sub,
        username: actor.username,
        entityType: 'patients',
        entityId: 'synthetic-sim',
        message: `${promoted} caso(s) SIM promovido(s); ${skipped} omitido(s) (ya existían)`,
      });

      return { promoted, skipped };
    },
  );
}
