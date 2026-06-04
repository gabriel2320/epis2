import type { Database } from '../db/client.js';
import { listRecentAuditEvents } from '../audit/store.js';
import { listInteropStagingBatches } from '../interop/staging.js';
import { countUnackedCriticals, getOpsStatus } from '../ops/service.js';

export async function getQualityDashboardSummary(db: Database) {
  const [recentAudit, stagingBatches, ops, criticalUnacked] = await Promise.all([
    listRecentAuditEvents(db, 30),
    listInteropStagingBatches(db),
    getOpsStatus(db),
    countUnackedCriticals(db),
  ]);

  const { aiRunsTotal, ...opsBody } = ops;

  return {
    readOnly: true as const,
    recentAudit,
    stagingBatches,
    metrics: {
      openDrafts: opsBody.counts.openDrafts,
      approvedNotes: opsBody.counts.approvedNotes,
      aiRuns: aiRunsTotal,
      criticalUnacked,
    },
    ops: opsBody,
  };
}
