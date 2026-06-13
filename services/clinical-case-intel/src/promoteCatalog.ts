import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { ClinicalCaseRecord } from '@epis2/contracts';
import { SIM_CLINICAL_CASES } from '@epis2/test-fixtures';
import { readCatalogEntryCount } from './catalogCanon.js';
import { loadRecords } from './load.js';
import {
  approveStagingCases,
  countSimPatientsInDb,
  promoteApprovedFromStaging,
  promoteRecords,
} from './promoteBatch.js';
import { buildRecordsFromCatalog } from './sources/catalog.js';
import { readSnapshot } from './snapshot.js';
import { filterValidRecords } from './validate.js';

export function expectedSimCatalogSize(fixturesDir: string): number {
  return readCatalogEntryCount(fixturesDir);
}

/** @deprecated use expectedSimCatalogSize — mantiene compat tests */
export const EXPECTED_SIM_CATALOG_SIZE = readCatalogEntryCount();

export type PromoteCatalogOptions = {
  repoRoot: string;
  fixturesDir: string;
  databaseUrl: string;
  inputPath?: string;
  devApprove: boolean;
  useStaging: boolean;
  actorId?: string;
};

export type PromoteCatalogResult = {
  recordCount: number;
  loaded?: { inserted: number; updated: number; unchanged: number };
  approved?: number;
  promote?: { promoted: number; skipped: number };
  simPatientsInDb: number;
  caseCodes: string[];
};

export async function resolveCatalogRecords(
  options: PromoteCatalogOptions,
): Promise<ClinicalCaseRecord[]> {
  if (options.inputPath) {
    const snapshot = await readSnapshot(options.inputPath);
    const { valid } = filterValidRecords(snapshot.records);
    return valid;
  }
  const { records } = await buildRecordsFromCatalog(options.fixturesDir, {
    scrapedAt: new Date().toISOString(),
  });
  const { valid } = filterValidRecords(records);
  return valid;
}

export async function runPromoteCatalog(
  options: PromoteCatalogOptions,
): Promise<PromoteCatalogResult> {
  const records = await resolveCatalogRecords(options);
  const expected = expectedSimCatalogSize(options.fixturesDir);
  if (records.length < expected) {
    throw new Error(`Catálogo incompleto para promote: ${records.length}/${expected}`);
  }

  const caseCodes = records.map((r) => r.caseCode);
  const fixtureCodes = new Set(SIM_CLINICAL_CASES.map((c) => c.demoCaseCode));
  for (const code of caseCodes) {
    if (!fixtureCodes.has(code)) {
      throw new Error(`caseCode ${code} no está en SIM_CLINICAL_CASES (export-fixtures pendiente)`);
    }
  }

  let loaded: PromoteCatalogResult['loaded'];
  let approved: number | undefined;
  let promote: PromoteCatalogResult['promote'];

  if (options.useStaging) {
    if (!options.devApprove) {
      throw new Error(
        'Promote vía staging requiere --dev-approve (revisión humana explícita en dev)',
      );
    }
    loaded = await loadRecords(options.databaseUrl, records);
    approved = await approveStagingCases(options.databaseUrl, caseCodes, options.actorId);
    promote = await promoteApprovedFromStaging(options.databaseUrl, options.actorId);
  } else {
    promote = await promoteRecords(options.databaseUrl, records, options.actorId);
  }

  const simPatientsInDb = await countSimPatientsInDb(options.databaseUrl);
  const result: PromoteCatalogResult = {
    recordCount: records.length,
    ...(loaded ? { loaded } : {}),
    ...(approved !== undefined ? { approved } : {}),
    promote,
    simPatientsInDb,
    caseCodes,
  };

  await writeFile(
    join(options.repoRoot, 'reports', 'clinical-case-promote-catalog.json'),
    JSON.stringify({ ranAt: new Date().toISOString(), ...result }, null, 2),
    'utf8',
  );

  if (simPatientsInDb < expected) {
    throw new Error(`SoT incompleto tras promote: ${simPatientsInDb}/${expected} EPIS2-SIM`);
  }

  return result;
}
