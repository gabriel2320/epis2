import { readFile } from 'node:fs/promises';
import { dirname, isAbsolute, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHttpClient } from './http.js';
import { loadRecords } from './load.js';
import { generateOllamaJson, pingOllama } from './ollama.js';
import {
  latestSnapshotPath,
  readSnapshot,
  summarizeRecords,
  writeSnapshot,
} from './snapshot.js';
import { buildRecordsFromCatalog } from './sources/catalog.js';
import { buildRecordsFromTeachingCase } from './sources/meded.js';
import {
  buildRecordsFromRemoteSources,
  resolveTeachingCaseJson,
} from './sources/mededRemote.js';
import { buildRecordsFromBundle } from './sources/synthea.js';
import { runPipelineCatalog } from './pipelineCatalog.js';
import { countSimPatientsInDb } from './promoteBatch.js';
import { runPromoteCatalog, EXPECTED_SIM_CATALOG_SIZE } from './promoteCatalog.js';
import { buildExportBundle, writeExportArtifacts } from './exportFixtures.js';
import {
  buildEvolabExportBundle,
  isEvolabPresent,
  resolveEvolabRoot,
  writeEvolabArtifacts,
} from './exportEvolab.js';
import { synthesizeRecord, type SynthesizeJsonClient } from './synthesize.js';
import { filterValidRecords } from './validate.js';

const moduleDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(moduleDir, '..', '..', '..');
const dataDir = join(repoRoot, 'data', 'clinical-cases');
const cacheDir = join(moduleDir, '..', '.cache');
const fixturesDir = join(moduleDir, '..', 'fixtures');
const defaultFixture = join(fixturesDir, 'synthea-hypertension.bundle.json');

async function loadDotEnv(): Promise<void> {
  try {
    const raw = await readFile(join(repoRoot, '.env'), 'utf8');
    for (const line of raw.split(/\r?\n/)) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (!match) continue;
      const [, key, value] = match;
      if (key && process.env[key] === undefined) {
        process.env[key] = value!.replace(/^['"]|['"]$/g, '');
      }
    }
  } catch {
    // sin .env
  }
}

function getArg(args: string[], name: string): string | undefined {
  const index = args.indexOf(`--${name}`);
  if (index >= 0 && args[index + 1] && !args[index + 1]!.startsWith('--')) {
    return args[index + 1];
  }
  const inline = args.find((a) => a.startsWith(`--${name}=`));
  return inline?.slice(name.length + 3);
}

async function readRecordsFromSource(
  args: string[],
  scrapedAt: string,
): Promise<{ records: Awaited<ReturnType<typeof buildRecordsFromBundle>>; failures: string[] }> {
  const failures: string[] = [];
  const file = getArg(args, 'file');
  const url = getArg(args, 'url');
  const source = getArg(args, 'source') ?? 'synthea';
  const limit = Number(getArg(args, 'limit') ?? '0');

  if (source === 'catalog') {
    const { records, failures: catalogFailures } = await buildRecordsFromCatalog(fixturesDir, {
      scrapedAt,
      ...(limit > 0 ? { limit } : {}),
    });
    failures.push(...catalogFailures);
    return { records, failures };
  }

  if (source === 'meded' || source === 'meded-remote' || source === 'pmc') {
    const http = createHttpClient({ cacheDir });
    if (source === 'meded-remote' || source === 'pmc') {
      const manifestPath = join(fixturesDir, 'meded-remote-sources.json');
      const { records, failures: remoteFailures } = await buildRecordsFromRemoteSources(
        manifestPath,
        {
          scrapedAt,
          fixturesDir,
          http,
          ...(limit > 0 ? { limit } : {}),
        },
      );
      failures.push(...remoteFailures);
      return { records, failures };
    }

    if (url) {
      const { payload, resolvedUrl } = await resolveTeachingCaseJson(url, fixturesDir, http);
      return {
        records: buildRecordsFromTeachingCase(payload, {
          scrapedAt,
          sourceUrl: resolvedUrl,
        }),
        failures,
      };
    }

    const teachingPath = file ?? join(fixturesDir, 'meded-asthma-teaching.json');
    const raw = await readFile(teachingPath, 'utf8');
    return {
      records: buildRecordsFromTeachingCase(JSON.parse(raw) as unknown, {
        scrapedAt,
        sourceUrl: teachingPath,
      }),
      failures,
    };
  }

  if (source !== 'synthea') {
    throw new Error(`Fuente no soportada: ${source} (synthea | catalog | meded | meded-remote | pmc)`);
  }

  let bundle: unknown;
  let sourceUrl: string | undefined;

  if (file) {
    const raw = await readFile(file, 'utf8');
    bundle = JSON.parse(raw) as unknown;
    sourceUrl = file;
  } else if (url) {
    const http = createHttpClient({ cacheDir });
    const result = await http.fetchText(url);
    if (!result.ok) {
      failures.push(result.reason);
      throw new Error(`No se pudo descargar bundle: ${result.reason}`);
    }
    bundle = JSON.parse(result.body) as unknown;
    sourceUrl = url;
  } else {
    const raw = await readFile(defaultFixture, 'utf8');
    bundle = JSON.parse(raw) as unknown;
    sourceUrl = defaultFixture;
  }

  const records = buildRecordsFromBundle(bundle, {
    scrapedAt,
    ...(sourceUrl ? { sourceUrl } : {}),
  });
  return { records, failures };
}

async function commandScrape(args: string[]): Promise<void> {
  const source = getArg(args, 'source') ?? 'synthea';
  const limitArg = getArg(args, 'limit');
  const limit = limitArg ? Number(limitArg) : source === 'catalog' ? 10 : 5;
  const scrapedAt = new Date().toISOString();
  const failures: string[] = [];

  const sourceLabel =
    source === 'catalog'
      ? 'catálogo piloto (Synthea + MedEd fixtures)'
      : source === 'meded-remote' || source === 'pmc'
        ? 'MedEd/PMC remoto (JSON TeachingCase curado)'
        : source === 'meded'
          ? 'MedEdPORTAL (fixture o URL JSON)'
          : 'Synthea (FHIR R4)';
  console.log(`clinical-case-intel scrape — fuente ${sourceLabel}`);

  const { records: scrapedRecords, failures: sourceFailures } = await readRecordsFromSource(
    args,
    scrapedAt,
  );
  failures.push(...sourceFailures);
  let records = scrapedRecords;

  if (source !== 'catalog' && records.length > limit) {
    records = records.slice(0, limit);
  }

  const { valid, invalid } = filterValidRecords(records);
  for (const item of invalid) {
    failures.push(
      `${item.record.caseCode}: ${item.issues.map((i) => i.message).join('; ')}`,
    );
  }

  const path = await writeSnapshot(dataDir, {
    createdAt: scrapedAt,
    stage: 'scraped',
    records: valid,
    excluded: invalid.map((item) => ({
      externalPatientId: item.record.provenance.externalPatientId,
      reason: item.issues.map((i) => i.message).join('; '),
    })),
    failures,
  });

  console.log(`Casos válidos: ${valid.length}; excluidos: ${invalid.length}`);
  for (const record of valid) {
    console.log(`  ${record.caseCode}: ${record.clinical.scenario}`);
  }
  console.log(`Snapshot: ${path}`);
  if (failures.length > 0) {
    console.warn(`Advertencias (${failures.length}):`);
    for (const failure of failures) console.warn(`  - ${failure}`);
  }
}

function resolveInputPath(path: string | undefined): string | undefined {
  if (!path) return undefined;
  return isAbsolute(path) ? path : join(repoRoot, path);
}

async function latestInputSnapshot(
  preferred: Array<'synthesized' | 'validated' | 'scraped'>,
): Promise<string | null> {
  for (const stage of preferred) {
    const path = await latestSnapshotPath(dataDir, stage);
    if (path) return path;
  }
  return null;
}

function createOllamaSynthesizeClient(baseUrl: string, model: string): SynthesizeJsonClient {
  return {
    async generate(prompt: string) {
      return generateOllamaJson(baseUrl, prompt, model);
    },
  };
}

async function commandSynthesize(args: string[]): Promise<void> {
  const input = resolveInputPath(getArg(args, 'input')) ?? (await latestInputSnapshot(['validated', 'scraped']));
  if (!input) {
    throw new Error('No hay snapshot scraped/validated; ejecute primero case-intel:scrape');
  }

  const ollamaBaseUrl = process.env.OLLAMA_BASE_URL ?? 'http://127.0.0.1:11434';
  const model = process.env.CASE_INTEL_OLLAMA_MODEL ?? 'qwen3:8b';
  const snapshot = await readSnapshot(input);
  const failures = [...snapshot.failures];
  const synthesized: typeof snapshot.records = [];

  const ollamaUp = await pingOllama(ollamaBaseUrl);
  if (!ollamaUp) {
    console.warn('Ollama no disponible — casos sin enriquecimiento IA (invariante 15)');
    failures.push('Ollama no disponible; registros sin cambios');
    for (const record of snapshot.records) {
      synthesized.push(record);
    }
  } else {
    const client = createOllamaSynthesizeClient(ollamaBaseUrl, model);
    console.log(
      `clinical-case-intel synthesize — ${snapshot.records.length} caso(s) con ${model} @ ${ollamaBaseUrl}`,
    );
    for (const record of snapshot.records) {
      const result = await synthesizeRecord(record, client);
      if (result.ok) {
        synthesized.push(result.record);
        console.log(`  ${record.caseCode}: enriquecido [${result.model}]`);
      } else {
        synthesized.push(record);
        failures.push(`${record.caseCode}: ${result.reason}`);
        console.warn(`  ${record.caseCode}: sin IA (${result.reason})`);
      }
    }
  }

  const { valid, invalid } = filterValidRecords(synthesized);
  for (const item of invalid) {
    failures.push(
      `${item.record.caseCode}: validación post-IA: ${item.issues.map((i) => i.message).join('; ')}`,
    );
  }

  const path = await writeSnapshot(dataDir, {
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

  console.log(`Snapshot: ${path}`);
  console.log(`Válidos: ${valid.length}; inválidos post-IA: ${invalid.length}`);
}

async function commandValidate(args: string[]): Promise<void> {
  const input =
    resolveInputPath(getArg(args, 'input')) ?? (await latestSnapshotPath(dataDir, 'scraped'));
  if (!input) {
    throw new Error('No hay snapshot scraped; ejecute primero case-intel:scrape');
  }
  const snapshot = await readSnapshot(input);
  const { valid, invalid } = filterValidRecords(snapshot.records);
  const path = await writeSnapshot(dataDir, {
    createdAt: new Date().toISOString(),
    stage: 'validated',
    records: valid,
    excluded: [
      ...snapshot.excluded,
      ...invalid.map((item) => ({
        externalPatientId: item.record.provenance.externalPatientId,
        reason: item.issues.map((i) => i.message).join('; '),
      })),
    ],
    failures: snapshot.failures,
  });
  console.log(`clinical-case-intel validate — ${valid.length} válido(s), ${invalid.length} inválido(s)`);
  console.log(`Snapshot: ${path}`);
}

async function commandLoad(args: string[]): Promise<void> {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL no definida; staging requiere PostgreSQL (npm run stack:dev)');
  }
  const input =
    resolveInputPath(getArg(args, 'input')) ??
    (await latestInputSnapshot(['synthesized', 'validated', 'scraped']));
  if (!input) {
    throw new Error('No hay snapshot; ejecute primero case-intel:scrape');
  }
  const snapshot = await readSnapshot(input);
  console.log(
    `clinical-case-intel load — ${snapshot.records.length} caso(s) → clinical_case_staging`,
  );
  const summary = await loadRecords(databaseUrl, snapshot.records);
  console.log(
    `Carga: ${summary.inserted} nuevo(s), ${summary.updated} actualizado(s), ${summary.unchanged} sin cambios`,
  );
  console.log('Revisión humana pendiente antes de promote a fixtures EPIS2/Evolab');
}

async function commandExportFixtures(args: string[]): Promise<void> {
  const apply = args.includes('--apply');
  const input =
    resolveInputPath(getArg(args, 'input')) ??
    (await latestInputSnapshot(['synthesized', 'validated', 'scraped']));
  if (!input) {
    throw new Error('No hay snapshot; ejecute primero case-intel:scrape');
  }
  const snapshot = await readSnapshot(input);
  const { valid } = filterValidRecords(snapshot.records);
  if (valid.length === 0) {
    throw new Error('Sin registros válidos para exportar');
  }

  const bundle = buildExportBundle(valid);
  const result = await writeExportArtifacts(repoRoot, bundle, apply);
  console.log(`clinical-case-intel export-fixtures — ${valid.length} caso(s)`);
  console.log(`Preview: ${result.previewPath}`);
  if (result.simCasesPath) {
    console.log(`Fixtures: ${result.simCasesPath}`);
    console.log(`Migración: ${result.migrationPath}`);
  } else {
    console.log('Dry-run — use --apply para escribir simCases.ts y 042_sim_clinical_cases_seed.sql');
  }
}

async function commandExportEvolab(args: string[]): Promise<void> {
  const apply = args.includes('--apply');
  const input =
    resolveInputPath(getArg(args, 'input')) ??
    (await latestInputSnapshot(['synthesized', 'validated', 'scraped']));
  if (!input) {
    throw new Error('No hay snapshot; ejecute primero case-intel:scrape');
  }
  const snapshot = await readSnapshot(input);
  const { valid } = filterValidRecords(snapshot.records);
  if (valid.length === 0) {
    throw new Error('Sin registros válidos para exportar a Evolab');
  }

  const evolabRoot = resolveEvolabRoot(repoRoot);
  const bundle = buildEvolabExportBundle(valid, evolabRoot);
  const result = await writeEvolabArtifacts(repoRoot, bundle, apply);

  console.log(`clinical-case-intel export-evolab — ${valid.length} escenario(s)`);
  console.log(`Evolab root: ${evolabRoot} (${isEvolabPresent(evolabRoot) ? 'presente' : 'ausente'})`);
  console.log(`Preview: ${result.previewPath}`);
  for (const scenario of bundle.scenarios) {
    console.log(`  ${scenario.id} ← ${scenario.caseCode}`);
  }
  if (result.scenariosWritten) {
    for (const path of result.scenariosWritten) {
      console.log(`YAML: ${path}`);
    }
  }
  if (result.fixturesSynced) {
    console.log('Fixtures sync: packages/demo-fixtures/src/simCases.ts + simCaseIds.ts');
    console.log('Manifiesto: reports/clinical-case-evolab-sync.json');
  }
  if (!apply) {
    console.log('Dry-run — use --apply para escribir en epis2-evolab');
  }
}

async function commandPipelineCatalog(args: string[]): Promise<void> {
  const synthesize = args.includes('--synthesize');
  const apply = args.includes('--apply');
  const load = args.includes('--load');
  const promote = args.includes('--promote');
  const devApprove = args.includes('--dev-approve');
  const ollamaBaseUrl = process.env.OLLAMA_BASE_URL ?? 'http://127.0.0.1:11434';
  const model = process.env.CASE_INTEL_OLLAMA_MODEL ?? 'qwen3:8b';

  console.log(
    `clinical-case-intel pipeline catalog — synthesize=${synthesize} apply=${apply} load=${load} promote=${promote}`,
  );

  const result = await runPipelineCatalog({
    repoRoot,
    fixturesDir,
    dataDir,
    synthesize,
    apply,
    load,
    promote,
    devApprove,
    ...(process.env.DATABASE_URL ? { databaseUrl: process.env.DATABASE_URL } : {}),
    ollamaBaseUrl,
    ollamaModel: model,
  });

  console.log(`Casos: ${result.recordCount}`);
  console.log(`Scraped: ${result.scrapedPath}`);
  console.log(`Validated: ${result.validatedPath}`);
  if (result.synthesizedPath) console.log(`Synthesized: ${result.synthesizedPath}`);
  console.log(`Export input: ${result.exportInputPath}`);
  if (result.loaded) {
    console.log(
      `Staging load: ${result.loaded.inserted} ins, ${result.loaded.updated} upd, ${result.loaded.unchanged} igual`,
    );
  }
  if (result.promoted) {
    console.log(`Promote: ${result.promoted.promoted} nuevo(s), ${result.promoted.skipped} omitido(s)`);
  }
  if (result.simPatientsInDb !== undefined) {
    console.log(`EPIS2-SIM en SoT: ${result.simPatientsInDb}`);
  }
  console.log('Reporte: reports/clinical-case-pipeline-catalog.json');
  if (result.failures.length > 0) {
    console.warn(`Advertencias (${result.failures.length}):`);
    for (const failure of result.failures) console.warn(`  - ${failure}`);
  }
  if (result.recordCount < 10) {
    throw new Error(`Catálogo incompleto: ${result.recordCount}/10 casos`);
  }
}

async function commandVerifySimSeed(): Promise<void> {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL no definida');
  }
  const count = await countSimPatientsInDb(databaseUrl);
  console.log(`clinical-case-intel verify-sim-seed — ${count} paciente(s) EPIS2-SIM`);
  if (count < EXPECTED_SIM_CATALOG_SIZE) {
    throw new Error(
      `SoT incompleto: ${count}/${EXPECTED_SIM_CATALOG_SIZE} — ejecute npm run db:migrate o case-intel:promote-catalog`,
    );
  }
}

async function commandPromoteCatalog(args: string[]): Promise<void> {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL no definida; requiere npm run stack:dev');
  }
  const devApprove = args.includes('--dev-approve');
  const useStaging = args.includes('--staging');
  const input = resolveInputPath(getArg(args, 'input'));

  console.log(
    `clinical-case-intel promote-catalog — staging=${useStaging} dev-approve=${devApprove}`,
  );

  const result = await runPromoteCatalog({
    repoRoot,
    fixturesDir,
    databaseUrl,
    ...(input ? { inputPath: input } : {}),
    devApprove,
    useStaging,
  });

  console.log(`Registros: ${result.recordCount}`);
  if (result.loaded) {
    console.log(
      `Staging: ${result.loaded.inserted} nuevo(s), ${result.loaded.updated} actualizado(s), ${result.loaded.unchanged} sin cambios`,
    );
  }
  if (result.approved !== undefined) {
    console.log(`Aprobados en staging: ${result.approved}`);
  }
  if (result.promote) {
    console.log(`Promote: ${result.promote.promoted} nuevo(s), ${result.promote.skipped} omitido(s)`);
  }
  console.log(`EPIS2-SIM en SoT: ${result.simPatientsInDb}`);
  console.log('Reporte: reports/clinical-case-promote-catalog.json');
}

async function commandReport(): Promise<void> {
  const input = await latestInputSnapshot(['synthesized', 'validated', 'scraped']);
  if (!input) {
    throw new Error('No hay snapshots en data/clinical-cases');
  }
  const snapshot = await readSnapshot(input);
  const summary = summarizeRecords(snapshot.records);
  console.log(`clinical-case-intel report — ${input}`);
  console.log(
    JSON.stringify(
      { ...summary, excluded: snapshot.excluded.length, failures: snapshot.failures },
      null,
      2,
    ),
  );
}

async function main(): Promise<void> {
  await loadDotEnv();
  const [command, ...args] = process.argv.slice(2);
  switch (command) {
    case 'scrape':
      return commandScrape(args);
    case 'synthesize':
      return commandSynthesize(args);
    case 'validate':
      return commandValidate(args);
    case 'load':
      return commandLoad(args);
    case 'export-fixtures':
      return commandExportFixtures(args);
    case 'export-evolab':
      return commandExportEvolab(args);
    case 'report':
      return commandReport();
    case 'verify-sim-seed':
      return commandVerifySimSeed();
    case 'promote-catalog':
      return commandPromoteCatalog(args);
    case 'pipeline':
      if (args[0] === 'catalog') return commandPipelineCatalog(args.slice(1));
      throw new Error('Subcomando pipeline desconocido (use: pipeline catalog)');
    default:
      console.log(
        'Uso: case-intel <scrape|synthesize|validate|load|export-fixtures|export-evolab|report|verify-sim-seed|promote-catalog|pipeline catalog> [--apply] [--staging] [--dev-approve] [--synthesize] [--source ...] [--input path]',
      );
      process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error('clinical-case-intel FAILED:', err instanceof Error ? err.message : err);
  process.exit(1);
});
