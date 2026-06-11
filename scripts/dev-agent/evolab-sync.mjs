#!/usr/bin/env node
/**
 * Sincroniza hallazgos Evolab abiertos → reports/evolab-open-findings.json
 *
 *   npm run dev:evolab:sync
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { loadEnvFile } from '../load-env.mjs';
import { isEvolabPresent, resolveEvolabRoot } from './evolab-bridge.mjs';

loadEnvFile();

const epis2Root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const outPath = join(epis2Root, 'reports/evolab-open-findings.json');

function parseFindings(stdout) {
  const lines = stdout.split('\n');
  const findings = [];
  let count = 0;

  for (const line of lines) {
    const totalMatch = line.match(/^Total:\s*(\d+)\s*$/);
    if (totalMatch) {
      count = Number(totalMatch[1]);
      continue;
    }
    const itemMatch = line.match(
      /^\s+([0-9a-f-]{36})\s+\[(\w+)\]\s+(\S+)\s+(\S+)\s+run=(\S+)…\s+(\S+)/,
    );
    if (itemMatch) {
      findings.push({
        id: itemMatch[1],
        severity: itemMatch[2],
        fingerprint: itemMatch[3],
        scenarioId: itemMatch[4],
        runIdPrefix: itemMatch[5],
        reviewStatus: itemMatch[6],
      });
    }
  }

  return { count: count || findings.length, findings };
}

function main() {
  const evolabRoot = resolveEvolabRoot();
  const optional = process.env.EPIS2_EVOLAB_OPTIONAL === '1';

  if (!isEvolabPresent(evolabRoot)) {
    const msg = `Evolab no encontrado en ${evolabRoot}`;
    if (optional) {
      console.warn(`[WARN] ${msg} — sync omitido`);
      process.exit(0);
    }
    console.error(`[FAIL] ${msg}`);
    process.exit(1);
  }

  const r = spawnSync(
    'npm',
    ['run', 'evolab:findings', '--', '--status', 'open', '--limit', '200'],
    {
      cwd: evolabRoot,
      encoding: 'utf8',
      shell: true,
      env: { ...process.env, EPIS2_ROOT: epis2Root },
    },
  );

  if (r.status !== 0) {
    console.error('dev:evolab:sync — evolab:findings falló');
    process.exit(r.status ?? 1);
  }

  const parsed = parseFindings(r.stdout ?? '');
  const payload = {
    syncedAt: new Date().toISOString(),
    evolabRoot,
    count: parsed.count,
    findings: parsed.findings,
  };

  mkdirSync(join(epis2Root, 'reports'), { recursive: true });
  writeFileSync(outPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  console.log(`dev:evolab:sync OK — ${parsed.count} hallazgo(s) abiertos → ${outPath}`);
}

main();
