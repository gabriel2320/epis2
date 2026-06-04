import { desc, eq } from 'drizzle-orm';
import type { Database } from '../db/client.js';
import { aiRuns } from '../db/schema.js';

export type AiRunRecord = {
  actorId?: string;
  blueprintId: string;
  patientId?: string;
  promptHash: string;
  model: string;
  latencyMs: number;
  status: 'success' | 'rejected' | 'unavailable';
  inputPayload?: Record<string, unknown>;
  outputPayload?: Record<string, unknown>;
  errorMessage?: string;
};

const memoryRuns: Array<{ id: string } & AiRunRecord> = [];

export async function recordAiRun(db: Database | null, input: AiRunRecord) {
  if (db) {
    const values: typeof aiRuns.$inferInsert = {
      blueprintId: input.blueprintId,
      promptHash: input.promptHash,
      model: input.model,
      latencyMs: input.latencyMs,
      status: input.status,
    };
    if (input.actorId !== undefined) values.actorId = input.actorId;
    if (input.patientId !== undefined) values.patientId = input.patientId;
    if (input.inputPayload !== undefined) values.inputPayload = input.inputPayload;
    if (input.outputPayload !== undefined) values.outputPayload = input.outputPayload;
    if (input.errorMessage !== undefined) values.errorMessage = input.errorMessage;

    const [row] = await db.insert(aiRuns).values(values).returning({ id: aiRuns.id });
    return row;
  }

  const id = crypto.randomUUID();
  memoryRuns.push({ id, ...input });
  return { id };
}

export async function listRecentAiRuns(
  db: Database | null,
  opts: { patientId?: string; limit?: number } = {},
) {
  const limit = opts.limit ?? 30;
  if (db) {
    const base = db.select().from(aiRuns);
    const rows = opts.patientId
      ? await base
          .where(eq(aiRuns.patientId, opts.patientId))
          .orderBy(desc(aiRuns.createdAt))
          .limit(limit)
      : await base.orderBy(desc(aiRuns.createdAt)).limit(limit);
    return rows.map((r) => ({
      id: r.id,
      blueprintId: r.blueprintId,
      patientId: r.patientId,
      model: r.model,
      status: r.status,
      latencyMs: r.latencyMs,
      createdAt: r.createdAt.toISOString(),
      errorMessage: r.errorMessage,
    }));
  }
  return memoryRuns.slice(-limit).map((r) => ({
    id: r.id,
    blueprintId: r.blueprintId,
    patientId: r.patientId,
    model: r.model,
    status: r.status,
    latencyMs: r.latencyMs,
    createdAt: new Date().toISOString(),
    errorMessage: r.errorMessage,
  }));
}

export function clearMemoryAiRuns(): void {
  memoryRuns.length = 0;
}
