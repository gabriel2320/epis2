import { randomUUID } from 'node:crypto';
import type { AuditEvent } from '@epis2/contracts';

/** Auditoría append-only en memoria — EPIS2-04 persistirá en PostgreSQL. */
const events: AuditEvent[] = [];

export function appendAuditEvent(
  input: Omit<AuditEvent, 'id' | 'at'> & { at?: string },
): AuditEvent {
  const event: AuditEvent = {
    id: randomUUID(),
    at: input.at ?? new Date().toISOString(),
    type: input.type,
    username: input.username,
    userId: input.userId,
    message: input.message,
  };
  events.push(event);
  return event;
}

export function listAuditEvents(limit = 100): readonly AuditEvent[] {
  return events.slice(-limit);
}

export function clearAuditEvents(): void {
  events.length = 0;
}
