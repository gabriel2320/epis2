import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { ClinicalCaseRecord } from '@epis2/contracts';
import { buildExportBundle, writeExportArtifacts } from './exportFixtures.js';
import {
  buildEvolabExportBundle,
  isEvolabPresent,
  resolveEvolabRoot,
  writeEvolabArtifacts,
} from './exportEvolab.js';
import { generateOllamaJson, pingOllama } from './ollama.js';
import { loadRecords } from './load.js';
import {
  approveStagingCases,
  countSimPatientsInDb,
  promoteApprovedFromStaging,
  promoteRecords,
} from './promoteBatch.js';
import { buildRecordsFromCatalog } from './sources/catalog.js';
import { readSnapshot, writeSnapshot } from './snapshot.js';
import { synthesizeRecord, type SynthesizeJsonClient } from './synthesize.js';
import { filterValidRecords } from './validate.js';

export type PipelineCatalogResult = {
  scrapedPath: string;
  validatedPath: string;
  synthesizedPath?: string;
  exportInputPath: string;
  recordCount: number;
  failures: string[];
  applied: boolean;
  synthesized: boolean;
  loaded?: { inserted: number; updated: number; unchanged: number };
  promoted?: { promoted: number; skipped: number };
  simPatientsInDb?: number;
};

export type PipelineCatalogOptions = {
  repoRoot: string;
  fixturesDir: string;
  dataDir: string;
  synthesize: boolean;
  apply: boolean;
  load: boolean;
  promote: boolean;
  devApprove: boolean;
  databaseUrl?: string;
  ollamaBaseUrl: string;
  ollamaModel: string;
};

async function synthesizeSnapshot(
  inputPath: string,
  options: PipelineCatalogOptions,
): Promise<{ path: string; failures: string[] }> {
  const snapshot = await readSnapshot(inputPath);
  const failures = [...snapshot.failures];
  const synthesized: ClinicalCaseRecord[] = [];
  const ollamaUp = await pingOllama(options.ollamaBaseUrl);

  const client: SynthesizeJsonClient | null = ollamaUp
    ? {
        async generate(prompt: string) {
          return generateOllamaJson(options.ollamaBaseUrl, prompt, options.ollamaModel);
        },
      }
    : null;

  if (!client) {
    failures.push('Ollama no disponible; registros sin enriquecimiento IA');
    synthesized.push(...snapshot.records);
  } else {
    for (const record of snapshot.records) {
      const result = await synthesizeRecord(record, client);
      synthesized.push(result.ok ? result.record : record);
      if (!result.ok) failures.push(`${record.caseCode}: ${result.reason}`);
    }
  }

  const { valid, invalid } = filterValidRecords(synthesized);
  for (const item of invalid) {
    failures.push(
      `${item.record.caseCode}: validación post-IA: ${item.issues.map((i) => i.message).join('; ')}`,
    );
  }

  const path = await writeSnapshot(options.dataDir, {
    createdAt: new Date().toISOString(),
    stage: 'synthesized',
    records: valid,
    excluded: [
      ...snapshot.excluded,
      ...invalid.map((item) => ({
        externalPatientId: item.record.provenance.externalPatientId,
        reason: item.issues.map((i) => i.message).join('; '),
      })),
    ],
    failures,
  });
  return { path, failures };
}

export async function runPipelineCatalog(
  options: PipelineCatalogOptions,
): Promise<PipelineCatalogResult> {
  const scrapedAt = new Date().toISOString();
  const failures: string[] = [];

  const { records, failures: catalogFailures } = await buildRecordsFromCatalog(
    options.fixturesDir,
    { scrapedAt },
  );
  failures.push(...catalogFailures);

  const { valid, invalid } = filterValidRecords(records);
  for (const item of invalid) {
    failures.push(
      `${item.record.caseCode}: ${item.issues.map((i) => i.message).join('; ')}`,
    );
  }

  const scrapedPath = await writeSnapshot(options.dataDir, {
    createdAt: scrapedAt,
    stage: 'scraped',
    records: valid,
    excluded: invalid.map((item) => ({
      externalPatientId: item.record.provenance.externalPatientId,
      reason: item.issues.map((i) => i.message).join('; '),
    })),
    failures,
  });

  const validatedPath = await writeSnapshot(options.dataDir, {
    createdAt: new Date().toISOString(),
    stage: 'validated',
    records: valid,
    excluded: invalid.map((item) => ({
      externalPatientId: item.record.provenance.externalPatientId,
      reason: item.issues.map((i) => i.message).join('; '),
    })),
    failures,
  });

  let exportInputPath = validatedPath;
  let synthesizedPath: string | undefined;

  if (options.synthesize) {
    const synth = await synthesizeSnapshot(validatedPath, options);
    synthesizedPath = synth.path;
    exportInputPath = synth.path;
    failures.push(...synth.failures);
  }

  if (options.apply) {
    const snapshot = await readSnapshot(exportInputPath);
    const { valid: exportValid } = filterValidRecords(snapshot.records);
    const bundle = buildExportBundle(exportValid);
    await writeExportArtifacts(options.repoRoot, bundle, true);
    const evolabRoot = resolveEvolabRoot(options.repoRoot);
    if (isEvolabPresent(evolabRoot)) {
      const evolabBundle = buildEvolabExportBundle(exportValid, evolabRoot);
      await writeEvolabArtifacts(options.repoRoot, evolabBundle, true);
    }
  }

  let loaded: PipelineCatalogResult['loaded'];
  let promoted: PipelineCatalogResult['promoted'];
  let simPatientsInDb: number | undefined;

  if (options.load || options.promote) {
    if (!options.databaseUrl) {
      throw new Error('DATABASE_URL requerida para --load / --promote');
    }
    if (options.load) {
      loaded = await loadRecords(options.databaseUrl, valid);
    }
    if (options.promote) {
      if (options.load && !options.devApprove) {
        throw new Error('Pipeline promote vía staging requiere --dev-approve');
      }
      const caseCodes = valid.map((r) => r.caseCode);
      if (options.load && options.devApprove) {
        await approveStagingCases(options.databaseUrl, caseCodes);
        promoted = await promoteApprovedFromStaging(options.databaseUrl);
      } else {
        promoted = await promoteRecords(options.databaseUrl, valid);
      }
      simPatientsInDb = await countSimPatientsInDb(options.databaseUrl);
      if (simPatientsInDb < valid.length) {
        failures.push(`SoT SIM incompleto: ${simPatientsInDb}/${valid.length}`);
      }
    }
  }

  const reportDir = join(options.repoRoot, 'reports');
  await mkdir(reportDir, { recursive: true });
  const report = {
    ranAt: new Date().toISOString(),
    scrapedPath,
    validatedPath,
    synthesizedPath,
    exportInputPath,
    recordCount: valid.length,
    failures,
    applied: options.apply,
    synthesized: options.synthesize,
    ...(loaded ? { loaded } : {}),
    ...(promoted ? { promoted } : {}),
    ...(simPatientsInDb !== undefined ? { simPatientsInDb } : {}),
  };
  await writeFile(
    join(reportDir, 'clinical-case-pipeline-catalog.json'),
    JSON.stringify(report, null, 2),
    'utf8',
  );

  return {
    scrapedPath,
    validatedPath,
    ...(synthesizedPath ? { synthesizedPath } : {}),
    exportInputPath,
    recordCount: valid.length,
    failures,
    applied: options.apply,
    synthesized: options.synthesize,
    ...(loaded ? { loaded } : {}),
    ...(promoted ? { promoted } : {}),
    ...(simPatientsInDb !== undefined ? { simPatientsInDb } : {}),
  };
}
