import { randomUUID } from 'node:crypto';
import { desc, like } from 'drizzle-orm';
import type { Database } from '../db/client.js';
import { auditEvents } from '../db/schema.js';

export type AuditInput = {
  eventType: string;
  actorId?: string;
  username?: string;
  entityType?: string;
  entityId?: string;
  message?: string;
  payload?: Record<string, unknown>;
};

const memoryEvents: Array<{
  id: string;
  eventType: string;
  at: string;
  actorId?: string;
  username?: string;
  entityType?: string;
  entityId?: string;
  message?: string;
}> = [];

export async function appendAudit(db: Database | null, input: AuditInput) {
  const at = new Date();
  if (db) {
    const [row] = await db
      .insert(auditEvents)
      .values({
        eventType: input.eventType,
        at,
        actorId: input.actorId,
        username: input.username,
        entityType: input.entityType,
        entityId: input.entityId,
        message: input.message,
        payload: input.payload ?? null,
      })
      .returning();
    return row;
  }

  const event: (typeof memoryEvents)[number] = {
    id: randomUUID(),
    eventType: input.eventType,
    at: at.toISOString(),
  };
  if (input.actorId !== undefined) event.actorId = input.actorId;
  if (input.username !== undefined) event.username = input.username;
  if (input.entityType !== undefined) event.entityType = input.entityType;
  if (input.entityId !== undefined) event.entityId = input.entityId;
  if (input.message !== undefined) event.message = input.message;
  memoryEvents.push(event);
  return event;
}

export async function listAuthAuditEvents(db: Database | null, limit = 200) {
  if (db) {
    return db
      .select()
      .from(auditEvents)
      .where(like(auditEvents.eventType, 'auth.%'))
      .orderBy(desc(auditEvents.at))
      .limit(limit);
  }
  return memoryEvents
    .filter((e) => e.eventType.startsWith('auth.'))
    .slice(-limit);
}

export function clearMemoryAudit(): void {
  memoryEvents.length = 0;
}
