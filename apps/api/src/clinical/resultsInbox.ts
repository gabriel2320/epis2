import { and, desc, eq, inArray } from 'drizzle-orm';
import type { Database } from '../db/client.js';
import {
  clinicalCriticalResults,
  clinicalOrders,
  observations,
} from '../db/schema.js';
import { getPatientDemoCaseCode } from './service.js';

export async function getPatientResultsInbox(db: Database, patientId: string) {
  const demoCaseCode = await getPatientDemoCaseCode(db, patientId);

  const [obsRows, criticalRows, orderRows] = await Promise.all([
    db
      .select()
      .from(observations)
      .where(eq(observations.patientId, patientId))
      .orderBy(desc(observations.observedAt)),
    db
      .select()
      .from(clinicalCriticalResults)
      .where(eq(clinicalCriticalResults.patientId, patientId))
      .orderBy(desc(clinicalCriticalResults.observedAt)),
    db
      .select()
      .from(clinicalOrders)
      .where(
        and(
          eq(clinicalOrders.patientId, patientId),
          eq(clinicalOrders.status, 'active'),
          inArray(clinicalOrders.orderType, ['lab', 'imaging']),
        ),
      )
      .orderBy(desc(clinicalOrders.orderedAt)),
  ]);

  return {
    patientId,
    readOnly: true as const,
    demoCaseCode: demoCaseCode ?? undefined,
    observations: obsRows.map((o) => ({
      id: o.id,
      label: o.label,
      valueText: o.valueText,
      observedAt: o.observedAt.toISOString(),
    })),
    criticalResults: criticalRows.map((c) => ({
      id: c.id,
      label: c.label,
      valueText: c.valueText,
      severity: c.severity as 'high' | 'critical',
      observedAt: c.observedAt.toISOString(),
      acknowledged: c.acknowledgedAt != null,
      acknowledgedAt: c.acknowledgedAt?.toISOString() ?? null,
    })),
    pendingOrders: orderRows.map((o) => ({
      id: o.id,
      orderType: o.orderType,
      title: o.title,
      priority: o.priority,
      orderedAt: o.orderedAt.toISOString(),
    })),
  };
}
