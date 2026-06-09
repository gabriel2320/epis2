import { asc, eq } from 'drizzle-orm';
import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import type { AppConfig } from '../config.js';
import type { Database } from '../db/client.js';
import { createRequirePermission, type AuthenticatedRequest } from '../auth/authenticate.js';
import { appUsers, clinicalCatalogStaging } from '../db/schema.js';
import { appendAudit } from '../audit/store.js';

const catalogBodySchema = z.object({
  catalogCode: z.string().min(1),
  entryCode: z.string().min(1),
  label: z.string().min(1),
});

export async function registerAdminRoutes(
  app: FastifyInstance,
  config: AppConfig,
  db: Database | null,
) {
  const requireUsersRead = createRequirePermission(config, 'admin.users.read');
  const requireAuditRead = createRequirePermission(config, 'audit.read');
  const requireCatalogsWrite = createRequirePermission(config, 'admin.catalogs.write');

  app.get(
    '/api/admin/users',
    { preHandler: requireUsersRead },
    async (_request, reply) => {
      if (!db) {
        return reply.status(503).send({ error: 'Base de datos no disponible' });
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
    },
  );

  app.get(
    '/api/admin/catalogs',
    { preHandler: requireAuditRead },
    async (request, reply) => {
      if (!db) {
        return reply.status(503).send({ error: 'Base de datos no disponible' });
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
    },
  );

  app.post(
    '/api/admin/catalogs',
    { preHandler: requireCatalogsWrite },
    async (request, reply) => {
      if (!db) {
        return reply.status(503).send({ error: 'Base de datos no disponible' });
      }
      const parsed = catalogBodySchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.status(400).send({ error: 'Cuerpo inválido' });
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
    },
  );
}
