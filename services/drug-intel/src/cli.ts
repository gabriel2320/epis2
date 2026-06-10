import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { DrugIntelRecord } from '@epis2/contracts';
import { correlateRecord } from './correlate.js';
import { filterClinicalCandidates } from './exclusions.js';
import { createHttpClient } from './http.js';
import { loadRecords } from './load.js';
import { buildRecord } from './normalize.js';
import { fetchIspData } from './sources/isp.js';
import { fetchOpenFdaLabel } from './sources/openfda.js';
import { fetchPriceData } from './sources/prices.js';
import { fetchRetailPrices } from './sources/retail.js';
import { fetchRxNormData } from './sources/rxnorm.js';
import {
  latestSnapshotPath,
  readSnapshot,
  summarizeRecords,
  writeSnapshot,
  type Snapshot,
} from './snapshot.js';

/**
 * CLI drug-intel: scrape → correlate → load → report.
 * Cada etapa deja snapshot auditable en `data/drug-intel/` antes de tocar PG.
 */

const moduleDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(moduleDir, '..', '..', '..');
const dataDir = join(repoRoot, 'data', 'drug-intel');
const cacheDir = join(moduleDir, '..', '.cache');

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
    // sin .env: se usan solo variables de entorno.
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

async function commandScrape(args: string[]): Promise<void> {
  const limit = Number(getArg(args, 'limit') ?? '25');
  const query = getArg(args, 'query');
  const http = createHttpClient({ cacheDir });
  const fetchedAt = new Date().toISOString();
  const failures: string[] = [];

  console.log('drug-intel scrape — fuentes públicas Chile + internacional');
  const datasetUrl = process.env.DRUG_INTEL_ISP_DATASET_URL;
  const isp = await fetchIspData(http, datasetUrl ? { datasetUrl } : {});
  failures.push(...isp.failures);
  console.log(`ISP: ${isp.products.length} producto(s), ${isp.alerts.length} alerta(s)`);

  let candidates = isp.products;
  if (query) {
    const needle = query.toLowerCase();
    candidates = candidates.filter(
      (p) =>
        p.name.toLowerCase().includes(needle) || p.activeIngredient?.toLowerCase().includes(needle),
    );
  }

  const { included, excluded } = filterClinicalCandidates(candidates);
  console.log(
    `Exclusiones: ${excluded.length} descartado(s) (homeopáticos/suplementos/cosméticos/no clínicos)`,
  );
  const selected = included.slice(0, limit);

  const records: DrugIntelRecord[] = [];
  for (const product of selected) {
    const sources = [...isp.sources];

    const prices = await fetchPriceData(http, {
      query: product.activeIngredient ?? product.name,
      ...(process.env.DRUG_INTEL_CENABAST_DATASET_URL
        ? { cenabastDatasetUrl: process.env.DRUG_INTEL_CENABAST_DATASET_URL }
        : {}),
    });
    failures.push(...prices.failures);
    sources.push(...prices.sources);

    // Cadenas retail (Salcobrand/Cruz Verde/Ahumada): DRUG_INTEL_RETAIL=0 desactiva.
    let retailEntries: typeof prices.entries = [];
    if (process.env.DRUG_INTEL_RETAIL !== '0') {
      const retail = await fetchRetailPrices(http, {
        query: product.activeIngredient ?? product.name,
      });
      failures.push(...retail.failures);
      sources.push(...retail.sources);
      retailEntries = retail.entries;
    }

    let openFda;
    let rxNorm;
    if (product.activeIngredient) {
      const fdaResult = await fetchOpenFdaLabel(http, product.activeIngredient);
      if (fdaResult.failure) failures.push(fdaResult.failure);
      if (fdaResult.label) {
        openFda = fdaResult.label;
        sources.push(fdaResult.label.sourceUrl);
      }
      rxNorm = await fetchRxNormData(http, product.activeIngredient);
      failures.push(...rxNorm.failures);
      sources.push(...rxNorm.sources);
    }

    records.push(
      buildRecord({
        isp: product,
        ispAlerts: isp.alerts,
        prices: [...prices.entries, ...retailEntries],
        openFda,
        rxNorm,
        sources,
        fetchedAt,
      }),
    );
    console.log(`  + ${product.name} (${product.registryId})`);
  }

  const snapshot: Snapshot = {
    createdAt: fetchedAt,
    stage: 'scraped',
    records,
    excluded: excluded.map((e) => ({
      name: e.candidate.name,
      reason: e.result.reason,
      matched: e.result.matched,
    })),
    failures: [...new Set(failures)],
  };
  const path = await writeSnapshot(dataDir, snapshot);
  console.log(`Snapshot: ${path}`);
  if (snapshot.failures.length > 0) {
    console.warn(`Fuentes con fallo (${snapshot.failures.length}):`);
    for (const failure of snapshot.failures) console.warn(`  - ${failure}`);
  }
}

async function commandCorrelate(args: string[]): Promise<void> {
  const input = getArg(args, 'input') ?? (await latestSnapshotPath(dataDir, 'scraped'));
  if (!input) {
    throw new Error('No hay snapshot scraped; ejecute primero drug-intel:scrape');
  }
  const snapshot = await readSnapshot(input);
  const ollamaBaseUrl = process.env.OLLAMA_BASE_URL ?? 'http://127.0.0.1:11434';
  const options = {
    ollamaBaseUrl,
    ...(process.env.DRUG_INTEL_OLLAMA_MODEL
      ? { ollamaModel: process.env.DRUG_INTEL_OLLAMA_MODEL }
      : {}),
  };

  console.log(`drug-intel correlate — ${snapshot.records.length} registro(s) desde ${input}`);
  const correlated: DrugIntelRecord[] = [];
  for (const record of snapshot.records) {
    const result = await correlateRecord(record, options);
    correlated.push(result);
    const ai = result.correlation.aiModel ? ` [IA: ${result.correlation.aiModel}]` : ' [sin IA]';
    console.log(
      `  ${result.productName}: ${result.correlation.status}, ${result.correlation.discrepancies.length} discrepancia(s)${ai}`,
    );
  }

  const path = await writeSnapshot(dataDir, {
    createdAt: new Date().toISOString(),
    stage: 'correlated',
    records: correlated,
    excluded: snapshot.excluded,
    failures: snapshot.failures,
  });
  console.log(`Snapshot: ${path}`);
}

async function commandLoad(args: string[]): Promise<void> {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL no definida; staging requiere PostgreSQL (npm run stack:dev)');
  }
  const input = getArg(args, 'input') ?? (await latestSnapshotPath(dataDir, 'correlated'));
  if (!input) {
    throw new Error('No hay snapshot correlated; ejecute primero drug-intel:correlate');
  }
  const snapshot = await readSnapshot(input);
  console.log(`drug-intel load — ${snapshot.records.length} registro(s) → drug_intel_staging`);
  const summary = await loadRecords(databaseUrl, snapshot.records);
  console.log(
    `Carga: ${summary.inserted} nuevo(s), ${summary.updated} actualizado(s), ${summary.unchanged} sin cambios`,
  );
  console.log('Revisión humana: GET /api/admin/drug-intel (la promoción es manual y auditada)');
}

async function commandReport(): Promise<void> {
  const input =
    (await latestSnapshotPath(dataDir, 'correlated')) ??
    (await latestSnapshotPath(dataDir, 'scraped'));
  if (!input) {
    throw new Error('No hay snapshots en data/drug-intel');
  }
  const snapshot = await readSnapshot(input);
  const summary = summarizeRecords(snapshot.records);
  console.log(`drug-intel report — ${input}`);
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
    case 'correlate':
      return commandCorrelate(args);
    case 'load':
      return commandLoad(args);
    case 'report':
      return commandReport();
    default:
      console.log(
        'Uso: drug-intel <scrape|correlate|load|report> [--limit N] [--query X] [--input path]',
      );
      process.exitCode = 1;
      return;
  }
}

main().catch((err) => {
  console.error('drug-intel FAILED:', err instanceof Error ? err.message : err);
  process.exit(1);
});
