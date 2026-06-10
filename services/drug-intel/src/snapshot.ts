import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { z } from 'zod';
import { drugIntelRecordSchema, type DrugIntelRecord } from '@epis2/contracts';

/**
 * Snapshots versionados del pipeline en `data/drug-intel/`. Cada corrida
 * produce un archivo auditable antes de tocar PostgreSQL.
 */

const snapshotSchema = z.object({
  createdAt: z.string(),
  stage: z.enum(['scraped', 'correlated']),
  records: z.array(drugIntelRecordSchema),
  excluded: z.array(
    z.object({
      name: z.string(),
      reason: z.string(),
      matched: z.string(),
    }),
  ),
  failures: z.array(z.string()),
});

export type Snapshot = z.infer<typeof snapshotSchema>;

export async function writeSnapshot(dir: string, snapshot: Snapshot): Promise<string> {
  await mkdir(dir, { recursive: true });
  const stamp = snapshot.createdAt.replace(/[:.]/g, '-');
  const path = join(dir, `${snapshot.stage}-${stamp}.json`);
  await writeFile(path, JSON.stringify(snapshotSchema.parse(snapshot), null, 2), 'utf8');
  return path;
}

export async function readSnapshot(path: string): Promise<Snapshot> {
  const raw = await readFile(path, 'utf8');
  return snapshotSchema.parse(JSON.parse(raw));
}

/** Último snapshot de una etapa, por nombre de archivo (timestamp ISO ordena). */
export async function latestSnapshotPath(
  dir: string,
  stage: Snapshot['stage'],
): Promise<string | null> {
  let files: string[];
  try {
    files = await readdir(dir);
  } catch {
    return null;
  }
  const candidates = files.filter((f) => f.startsWith(`${stage}-`) && f.endsWith('.json')).sort();
  const latest = candidates.at(-1);
  return latest ? join(dir, latest) : null;
}

export function summarizeRecords(records: DrugIntelRecord[]): {
  total: number;
  requiresHumanReview: number;
  withIspAlerts: number;
  withPrices: number;
  withInternationalLabel: number;
} {
  return {
    total: records.length,
    requiresHumanReview: records.filter((r) => r.correlation.requiresHumanReview).length,
    withIspAlerts: records.filter((r) => r.ispAlerts.length > 0).length,
    withPrices: records.filter((r) => r.prices.length > 0).length,
    withInternationalLabel: records.filter(
      (r) => r.warnings.length > 0 || r.adverseReactions.length > 0,
    ).length,
  };
}
