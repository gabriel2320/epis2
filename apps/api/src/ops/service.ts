import { sql, count, gte, isNull } from 'drizzle-orm';
import type { Database } from '../db/client.js';
import {
  aiRuns,
  auditEvents,
  clinicalCriticalResults,
  clinicalDrafts,
  clinicalNotes,
  patients,
} from '../db/schema.js';
import { FHIR_BOUNDARY } from '../fhir/service.js';
import { parseRlsMode, RLS_PROTECTED_TABLES } from '../db/rls.js';
import type { AppConfig } from '../config.js';

const PROMPT_CATALOG_VERSION = 'epis2-prompts-v1.1';

const OPEN_DRAFT = new Set(['draft', 'editing', 'ready_for_review']);

export async function getOpsStatus(
  db: Database,
  config?: Pick<AppConfig, 'RLS_MODE' | 'NODE_ENV' | 'AUTH_MODE'>,
) {
  const schemaRows = await db.execute(sql`SELECT version FROM epis2_schema_meta WHERE id = 1`);
  const schemaVersion = (schemaRows as unknown as { version: string }[])[0]?.version;

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const [patientRows, draftRows, noteRows, auditRows, aiRows] = await Promise.all([
    db.select({ n: count() }).from(patients),
    db.select({ status: clinicalDrafts.status }).from(clinicalDrafts),
    db.select({ n: count() }).from(clinicalNotes),
    db
      .select({ n: count() })
      .from(auditEvents)
      .where(gte(auditEvents.at, since)),
    db.select({ n: count() }).from(aiRuns),
  ]);

  const openDrafts = draftRows.filter((d) => OPEN_DRAFT.has(d.status)).length;

  return {
    readOnly: true as const,
    schemaVersion,
    counts: {
      patients: Number(patientRows[0]?.n ?? 0),
      openDrafts,
      approvedNotes: Number(noteRows[0]?.n ?? 0),
      auditEvents24h: Number(auditRows[0]?.n ?? 0),
    },
    fhir: {
      exportEnabled: FHIR_BOUNDARY.exportEnabled,
      importEnabled: FHIR_BOUNDARY.importEnabled,
    },
    aiRunsTotal: Number(aiRows[0]?.n ?? 0),
    hardening: {
      rlsMode: parseRlsMode(config?.RLS_MODE),
      rlsProtectedTables: [...RLS_PROTECTED_TABLES],
      rateLimitLogin: config?.NODE_ENV !== 'test',
      rateLimitAi: config?.NODE_ENV !== 'test',
      rateLimitCommands: config?.NODE_ENV !== 'test',
      promptCatalogVersion: PROMPT_CATALOG_VERSION,
      backupCommand: 'npm run db:backup',
      authMode: config?.AUTH_MODE ?? 'demo',
      rlsTransactions: parseRlsMode(config?.RLS_MODE) === 'enforce',
    },
  };
}

export async function countUnackedCriticals(db: Database) {
  const [row] = await db
    .select({ n: count() })
    .from(clinicalCriticalResults)
    .where(isNull(clinicalCriticalResults.acknowledgedAt));
  return Number(row?.n ?? 0);
}
