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

export function clearMemoryAiRuns(): void {
  memoryRuns.length = 0;
}
