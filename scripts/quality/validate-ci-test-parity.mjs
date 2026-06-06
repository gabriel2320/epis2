#!/usr/bin/env node
/**
 * MF-153 — Con DATABASE_URL, ningún test de integración debe quedar skipped.
 * Replica la expectativa de CI tras db:migrate.
 */
import { loadEnvFile } from '../load-env.mjs';
import { spawnSync } from 'node:child_process';
import { readFileSync, unlinkSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const OUT = join(ROOT, 'reports/.vitest-ci-parity-temp.json');

function countSkippedFromJson(report) {
  if (typeof report.numSkippedTests === 'number') {
    return report.numSkippedTests;
  }
  if (Array.isArray(report.testResults)) {
    let skipped = 0;
    for (const file of report.testResults) {
      for (const test of file.assertionResults ?? []) {
        if (test.status === 'skipped' || test.status === 'pending') {
          skipped += 1;
        }
      }
    }
    return skipped;
  }
  return report.numPendingTests ?? 0;
}

function main() {
  loadEnvFile();

  if (!process.env.DATABASE_URL?.trim()) {
    console.error('quality:ci-parity FAILED: DATABASE_URL no definida');
    console.error('Ver docs/quality/INTEGRATION_DATABASE.md');
    process.exit(1);
  }

  console.log('EPIS2 quality:ci-parity\n');
  console.log(`DATABASE_URL: ${process.env.DATABASE_URL.replace(/:[^:@/]+@/, ':***@')}\n`);

  if (existsSync(OUT)) {
    unlinkSync(OUT);
  }

  const run = spawnSync(
    process.platform === 'win32' ? 'npx.cmd' : 'npx',
    ['vitest', 'run', '--reporter=json', `--outputFile=${OUT}`],
    { cwd: ROOT, env: process.env, stdio: ['inherit', 'pipe', 'inherit'], encoding: 'utf8' },
  );

  if (!existsSync(OUT)) {
    console.error('quality:ci-parity FAILED: vitest no generó reporte JSON');
    process.exit(run.status ?? 1);
  }

  const report = JSON.parse(readFileSync(OUT, 'utf8'));
  unlinkSync(OUT);

  const skipped = countSkippedFromJson(report);
  const failed = report.numFailedTests ?? 0;

  if (run.status !== 0 || failed > 0) {
    console.error(`quality:ci-parity FAILED: ${failed} test(s) fallidos`);
    process.exit(run.status ?? 1);
  }

  if (skipped > 0) {
    console.error(
      `quality:ci-parity FAILED: ${skipped} test(s) skipped con DATABASE_URL — paridad CI rota`,
    );
    console.error('Ejecutar npm run db:migrate y revisar docs/quality/INTEGRATION_DATABASE.md');
    process.exit(1);
  }

  const passed = report.numPassedTests ?? report.numTotalTests ?? '?';
  console.log(`[OK] Paridad CI — ${passed} tests passed, 0 skipped`);
  process.exit(0);
}

main();
