import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { ClinicalCaseRecord } from '@epis2/contracts';
import type { HttpClient } from '../http.js';
import { assertTeachingCaseSafe } from '../sanitize.js';
import {
  buildRecordsFromTeachingCase,
  parseTeachingCase,
  type TeachingCasePayload,
} from './meded.js';

export type RemoteSourceEntry = {
  id: string;
  sourceName: 'meded-portal' | 'pmc-teaching-case';
  /** `fixture:<file.json>` (offline) o URL https con JSON TeachingCase */
  url: string;
};

export type RemoteSourcesManifest = {
  version: number;
  description?: string;
  entries: RemoteSourceEntry[];
};

export async function loadRemoteSourcesManifest(
  manifestPath: string,
): Promise<RemoteSourcesManifest> {
  const raw = await readFile(manifestPath, 'utf8');
  const parsed = JSON.parse(raw) as RemoteSourcesManifest;
  if (!Array.isArray(parsed.entries) || parsed.entries.length === 0) {
    throw new Error('meded-remote-sources.json sin entries[]');
  }
  return parsed;
}

export async function resolveTeachingCaseJson(
  url: string,
  fixturesDir: string,
  http: HttpClient,
): Promise<{ payload: unknown; resolvedUrl: string; fromCache: boolean }> {
  if (url.startsWith('fixture:')) {
    const filePath = join(fixturesDir, url.slice('fixture:'.length));
    const body = await readFile(filePath, 'utf8');
    return { payload: JSON.parse(body) as unknown, resolvedUrl: filePath, fromCache: true };
  }

  const result = await http.fetchText(url, {
    headers: { Accept: 'application/json' },
  });
  if (!result.ok) {
    throw new Error(result.reason);
  }
  const trimmed = result.body.trim();
  if (trimmed.startsWith('<') || trimmed.startsWith('<!')) {
    throw new Error(
      'Respuesta HTML rechazada — solo JSON TeachingCase curado (sin scrape HTML PMC/MedEd)',
    );
  }
  return {
    payload: JSON.parse(result.body) as unknown,
    resolvedUrl: url,
    fromCache: result.fromCache,
  };
}

export type RemoteFetchOptions = {
  scrapedAt: string;
  fixturesDir: string;
  http: HttpClient;
  limit?: number;
};

export async function buildRecordsFromRemoteSources(
  manifestPath: string,
  options: RemoteFetchOptions,
): Promise<{ records: ClinicalCaseRecord[]; failures: string[] }> {
  const manifest = await loadRemoteSourcesManifest(manifestPath);
  const failures: string[] = [];
  const records: ClinicalCaseRecord[] = [];
  const entries = options.limit ? manifest.entries.slice(0, options.limit) : manifest.entries;

  for (const entry of entries) {
    try {
      const { payload, resolvedUrl } = await resolveTeachingCaseJson(
        entry.url,
        options.fixturesDir,
        options.http,
      );
      const teaching = parseTeachingCase(payload);
      assertTeachingCaseSafe(teaching);
      const withSource: TeachingCasePayload = {
        ...teaching,
        ...(entry.sourceName === 'pmc-teaching-case'
          ? {
              sourceUrl:
                teaching.sourceUrl ?? 'https://pmc.ncbi.nlm.nih.gov/teaching-case-synthetic',
            }
          : {}),
      };
      const built = buildRecordsFromTeachingCase(withSource, {
        scrapedAt: options.scrapedAt,
        sourceUrl: resolvedUrl,
      });
      for (const record of built) {
        records.push({
          ...record,
          provenance: {
            ...record.provenance,
            sourceName: entry.sourceName,
          },
        });
      }
    } catch (err) {
      failures.push(`${entry.id}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  return { records, failures };
}
