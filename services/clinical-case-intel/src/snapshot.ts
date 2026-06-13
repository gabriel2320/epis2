import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { z } from 'zod';
import { clinicalCaseRecordSchema, type ClinicalCaseRecord } from '@epis2/contracts';

const snapshotSchema = z.object({
  createdAt: z.string(),
  stage: z.enum(['scraped', 'validated', 'synthesized']),
  records: z.array(clinicalCaseRecordSchema),
  excluded: z.array(
    z.object({
      externalPatientId: z.string().optional(),
      reason: z.string(),
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

export function summarizeRecords(records: ClinicalCaseRecord[]): {
  total: number;
  requiresHumanReview: number;
  bySource: Record<string, number>;
  byRisk: Record<string, number>;
} {
  const bySource: Record<string, number> = {};
  const byRisk: Record<string, number> = {};
  for (const record of records) {
    const source = record.provenance.sourceName;
    bySource[source] = (bySource[source] ?? 0) + 1;
    const risk = record.evolabHints?.risk ?? 'unknown';
    byRisk[risk] = (byRisk[risk] ?? 0) + 1;
  }
  return {
    total: records.length,
    requiresHumanReview: records.filter((r) => r.generation.requiresHumanReview).length,
    bySource,
    byRisk,
  };
}
