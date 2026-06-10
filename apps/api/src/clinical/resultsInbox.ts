import { desc, eq } from 'drizzle-orm';
import type { Database } from '../db/client.js';
import { clinicalCriticalResults, clinicalOrders, observations } from '../db/schema.js';
import { getPatientDemoCaseCode } from './service.js';

function orderTitleById(orders: { id: string; title: string }[]): Map<string, string> {
  return new Map(orders.map((o) => [o.id, o.title]));
}

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
      .where(eq(clinicalOrders.patientId, patientId))
      .orderBy(desc(clinicalOrders.orderedAt)),
  ]);

  const orderTitles = orderTitleById(orderRows);
  const fulfilledOrderIds = new Set<string>();
  for (const o of obsRows) {
    if (o.clinicalOrderId) fulfilledOrderIds.add(o.clinicalOrderId);
  }
  for (const c of criticalRows) {
    if (c.clinicalOrderId) fulfilledOrderIds.add(c.clinicalOrderId);
  }

  const pendingOrders = orderRows.filter(
    (o) =>
      o.status === 'active' &&
      ['lab', 'imaging'].includes(o.orderType) &&
      !fulfilledOrderIds.has(o.id),
  );

  return {
    patientId,
    readOnly: true as const,
    demoCaseCode: demoCaseCode ?? undefined,
    observations: obsRows.map((o) => ({
      id: o.id,
      label: o.label,
      valueText: o.valueText,
      observedAt: o.observedAt.toISOString(),
      orderId: o.clinicalOrderId ?? undefined,
      orderTitle: o.clinicalOrderId ? orderTitles.get(o.clinicalOrderId) : undefined,
    })),
    criticalResults: criticalRows.map((c) => ({
      id: c.id,
      label: c.label,
      valueText: c.valueText,
      severity: c.severity as 'high' | 'critical',
      observedAt: c.observedAt.toISOString(),
      acknowledged: c.acknowledgedAt != null,
      acknowledgedAt: c.acknowledgedAt?.toISOString() ?? null,
      orderId: c.clinicalOrderId ?? undefined,
      orderTitle: c.clinicalOrderId ? orderTitles.get(c.clinicalOrderId) : undefined,
    })),
    pendingOrders: pendingOrders.map((o) => ({
      id: o.id,
      orderType: o.orderType,
      title: o.title,
      priority: o.priority,
      orderedAt: o.orderedAt.toISOString(),
    })),
  };
}
