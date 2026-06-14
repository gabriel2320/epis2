#!/usr/bin/env node
/** Registry gate — ledgers consistentes, registry-status OK, scripts npm requeridos. */
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const requiredScripts = [
  'quality:rapid-gate',
  'quality:strengthen-next',
  'quality:strengthen-close-gate',
  'quality:interop-chile-gate',
  'quality:cds-hooks-gate',
  'quality:registry-status',
];

const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
for (const script of requiredScripts) {
  if (!pkg.scripts?.[script]) {
    errors.push(`package.json sin script ${script}`);
  }
}

if (!existsSync(join(root, 'scripts/quality/registry-status.mjs'))) {
  errors.push('Falta scripts/quality/registry-status.mjs');
}

const statusRun = spawnSync('node', ['scripts/quality/registry-status.mjs'], {
  cwd: root,
  encoding: 'utf8',
});

if (statusRun.status !== 0) {
  errors.push('registry-status falló al ejecutar');
  if (statusRun.stderr) process.stderr.write(statusRun.stderr);
} else {
  let status;
  try {
    status = JSON.parse(statusRun.stdout);
  } catch {
    errors.push('registry-status no devolvió JSON válido');
    status = null;
  }

  if (status) {
    const strengthen = status.programs?.['PROG-STRENGTHEN'];
    const di = status.programs?.['PROG-DI'];
    const ficha = status.programs?.['PROG-FICHA-FIRST'];

    if (!strengthen) {
      errors.push('registry-status sin PROG-STRENGTHEN');
    } else {
      const [doneStr, totalStr] = String(strengthen.progress ?? '').split('/');
      const done = Number(doneStr);
      const total = Number(totalStr);
      if (
        !Number.isFinite(done) ||
        !Number.isFinite(total) ||
        strengthen.doneCount !== done ||
        strengthen.totalCount !== total
      ) {
        errors.push(
          `PROG-STRENGTHEN progress inconsistente: progress=${strengthen.progress} doneCount=${strengthen.doneCount} totalCount=${strengthen.totalCount}`,
        );
      }
      if (strengthen.executionStatus === 'ACTIVE' && !strengthen.active) {
        errors.push('PROG-STRENGTHEN ACTIVE sin microfase activa');
      }
      if (strengthen.executionStatus === 'CLOSED') {
        if (strengthen.doneCount !== strengthen.totalCount) {
          errors.push(`PROG-STRENGTHEN CLOSED pero progress ${strengthen.progress}`);
        }
        if (!strengthen.closedSummary?.allPhasesDone) {
          errors.push('PROG-STRENGTHEN closedSummary.allPhasesDone es false');
        }
        if (!strengthen.closedSummary?.closeReport) {
          errors.push('PROG-STRENGTHEN CLOSED sin closeReport');
        }
      }
    }

    if (!di) {
      errors.push('registry-status sin PROG-DI');
    } else if (di.executionStatus === 'CLOSED') {
      if (di.doneCount !== di.totalCount) {
        errors.push(`PROG-DI CLOSED pero progress ${di.progress}`);
      }
      if (!di.closedSummary?.allPhasesDone) {
        errors.push('PROG-DI closedSummary.allPhasesDone es false');
      }
    }

    if (!ficha) {
      errors.push('registry-status sin PROG-FICHA-FIRST');
    } else if (ficha.executionStatus === 'ACTIVE' && ficha.ledgerValid === false) {
      errors.push('PROG-FICHA-FIRST ledger inválido');
    }

    if (status.iterationCommand !== 'npm run dev:rapid') {
      errors.push(`iterationCommand inesperado: ${status.iterationCommand}`);
    }
    const expectedNext = strengthen?.executionStatus === 'CLOSED'
      ? 'npm run quality:ficha-first-next'
      : 'npm run quality:strengthen-next';
    if (status.recommendedNext !== expectedNext) {
      errors.push(`recommendedNext inesperado: ${status.recommendedNext} (esperado ${expectedNext})`);
    }
  }
}

const strengthenLedger = JSON.parse(
  readFileSync(join(root, 'docs/quality/strengthen-ledger.json'), 'utf8'),
);
const ledgerDone = strengthenLedger.phases.filter((p) => p.state === 'DONE').length;
const ledgerTotal = strengthenLedger.phases.length;
if (ledgerDone + ledgerTotal === 0) {
  errors.push('strengthen-ledger.json sin fases');
}

if (errors.length) {
  console.error('registry-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('registry-gate OK — ledgers consolidados');
