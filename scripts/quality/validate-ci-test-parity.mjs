#!/usr/bin/env node
/**
 * MF-153 — Con DATABASE_URL, ningún test de integración debe quedar skipped.
 * En CI: validar el reporte JSON del `npm run test` previo (--from-report).
 * Local: re-ejecuta vitest si no se pasa reporte.
 */
import { loadEnvFile } from '../load-env.mjs';
import { spawnSync } from 'node:child_process';
import { readFileSync, unlinkSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const DEFAULT_OUT = join(ROOT, 'reports/.vitest-ci-parity-temp.json');

function parseFromReportArg() {
  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith('--from-report=')) {
      return arg.slice('--from-report='.length);
    }
    if (arg === '--from-report') {
      return DEFAULT_OUT;
    }
  }
  return null;
}

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

function collectProblemTests(report, status) {
  const problems = [];
  for (const file of report.testResults ?? []) {
    for (const test of file.assertionResults ?? []) {
      if (test.status === status) {
        problems.push(`${file.name} > ${test.fullName ?? test.title}`);
      }
    }
  }
  return problems;
}

function printProblemTests(label, tests) {
  if (tests.length === 0) {
    return;
  }
  console.error(`${label}:`);
  for (const name of tests.slice(0, 20)) {
    console.error(`  - ${name}`);
  }
  if (tests.length > 20) {
    console.error(`  … y ${tests.length - 20} más`);
  }
}

function validateReport(report) {
  const skipped = report.numSkippedTests ?? countSkippedFromJson(report);
  const failed = report.numFailedTests ?? collectProblemTests(report, 'failed').length;

  if (failed > 0) {
    console.error(`quality:ci-parity FAILED: ${failed} test(s) fallidos`);
    printProblemTests('Fallidos', collectProblemTests(report, 'failed'));
    process.exit(1);
  }

  if (skipped > 0) {
    console.error(
      `quality:ci-parity FAILED: ${skipped} test(s) skipped con DATABASE_URL — paridad CI rota`,
    );
    printProblemTests('Omitidos', collectProblemTests(report, 'skipped'));
    console.error('Ejecutar npm run db:migrate y revisar docs/quality/INTEGRATION_DATABASE.md');
    process.exit(1);
  }

  const passed = report.numPassedTests ?? report.numTotalTests ?? '?';
  console.log(`[OK] Paridad CI — ${passed} tests passed, 0 skipped`);
  process.exit(0);
}

function runVitestJsonReport(outPath) {
  if (existsSync(outPath)) {
    unlinkSync(outPath);
  }

  const run = spawnSync(`npx vitest run --reporter=json --outputFile="${outPath}"`, {
    cwd: ROOT,
    env: process.env,
    stdio: ['inherit', 'pipe', 'inherit'],
    encoding: 'utf8',
    shell: true,
  });

  if (!existsSync(outPath)) {
    console.error('quality:ci-parity FAILED: vitest no generó reporte JSON');
    process.exit(run.status ?? 1);
  }

  const report = JSON.parse(readFileSync(outPath, 'utf8'));
  unlinkSync(outPath);
  return report;
}

function main() {
  loadEnvFile();

  const fromReport = parseFromReportArg();
  const needsDatabaseUrl = !fromReport;

  if (needsDatabaseUrl && !process.env.DATABASE_URL?.trim()) {
    console.error('quality:ci-parity FAILED: DATABASE_URL no definida');
    console.error('Ver docs/quality/INTEGRATION_DATABASE.md');
    process.exit(1);
  }

  console.log('EPIS2 quality:ci-parity\n');
  if (process.env.DATABASE_URL?.trim()) {
    console.log(`DATABASE_URL: ${process.env.DATABASE_URL.replace(/:[^:@/]+@/, ':***@')}\n`);
  }

  if (fromReport) {
    const reportPath = join(ROOT, fromReport.replace(/^\//, ''));
    if (!existsSync(reportPath)) {
      console.error(`quality:ci-parity FAILED: reporte no encontrado (${fromReport})`);
      process.exit(1);
    }
    validateReport(JSON.parse(readFileSync(reportPath, 'utf8')));
    return;
  }

  validateReport(runVitestJsonReport(DEFAULT_OUT));
}

main();
