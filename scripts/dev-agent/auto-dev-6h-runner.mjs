#!/usr/bin/env node
/**
 * PROG-AUTO-DEV-6H — runner autodesarrollo IA asistido.
 *
 *   EPIS2_AUTO_DEV_AUTHORIZED=1 npm run dev:auto:6h -- --commit --push
 *   npm run dev:auto:6h -- --tramo 1 --dry-run
 *   npm run dev:auto:6h -- --ollama-auto
 */
import { appendFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const doCommit = args.includes('--commit');
const doPush = args.includes('--push');
const withOllamaAuto = args.includes('--ollama-auto');
const ollamaApply = args.includes('--apply');
const tramoArg = args.includes('--tramo') ? Number(args[args.indexOf('--tramo') + 1]) : undefined;

const ledgerPath = join(root, 'docs/quality/auto-dev-6h-ledger.json');
const logPath = join(root, 'reports/auto-dev-6h-log.jsonl');

function log(event, detail = {}) {
  mkdirSync(join(root, 'reports'), { recursive: true });
  appendFileSync(
    logPath,
    `${JSON.stringify({ at: new Date().toISOString(), event, ...detail })}\n`,
    'utf8',
  );
}

function runNpm(script, extraArgs = []) {
  if (dryRun) {
    log('dry-run', { script, extraArgs });
    return { ok: true, skipped: true };
  }
  const r = spawnSync('npm', ['run', script, ...extraArgs], {
    cwd: root,
    stdio: 'inherit',
    shell: true,
    env: process.env,
  });
  return { ok: r.status === 0, status: r.status ?? 1 };
}

function runGit(argsGit) {
  if (dryRun) {
    log('dry-run-git', { args: argsGit });
    return { ok: true };
  }
  const r = spawnSync('git', argsGit, { cwd: root, stdio: 'inherit', shell: true });
  return { ok: r.status === 0 };
}

function loadLedger() {
  return JSON.parse(readFileSync(ledgerPath, 'utf8'));
}

function saveLedger(ledger) {
  writeFileSync(ledgerPath, `${JSON.stringify(ledger, null, 2)}\n`, 'utf8');
}

function archiveBranchesReport() {
  const r = spawnSync('git', ['branch', '-a', '--format=%(refname:short)|%(committerdate:iso8601)|%(upstream:track)'], {
    cwd: root,
    encoding: 'utf8',
    shell: true,
  });
  const lines = (r.stdout ?? '').split('\n').filter(Boolean);
  const reportPath = join(root, 'reports/epis2-branch-archive-2026-06-10.md');
  const body = [
    '# EPIS2 — Archivo ramas (auto-dev 6h)',
    '',
    `**Generado:** ${new Date().toISOString()}`,
    '',
    '| Rama | Último commit | Tracking |',
    '|------|---------------|----------|',
    ...lines.map((line) => {
      const [name, date, track] = line.split('|');
      return `| ${name} | ${date ?? '—'} | ${track ?? '—'} |`;
    }),
    '',
    '**Política:** no se eliminan ramas remotas automáticamente. Candidatas truncas: ramas locales sin upstream y sin commits recientes (>90 días) — revisión humana.',
    '',
  ].join('\n');
  if (!dryRun) writeFileSync(reportPath, body, 'utf8');
  log('branch-archive', { count: lines.length, reportPath });
}

const TRAMO_STEPS = {
  0: () => {
    const steps = [
      () => runNpm('stack:dev'),
      () => runNpm('ollama:probe'),
      () => runNpm('dev:session'),
    ];
    if (withOllamaAuto) steps.push(() => runNpm('dev:agent:ollama-auto', ollamaApply ? ['--', '--apply'] : []));
    return steps;
  },
  1: () => [
    () => {
      if (dryRun) return { ok: true, skipped: true };
      const r = spawnSync(
        'npx',
        ['vitest', 'run', 'packages/command-registry/src/clinical-command-dictionary.test.ts'],
        { cwd: root, stdio: 'inherit', shell: true },
      );
      return { ok: r.status === 0 };
    },
  ],
  2: () => [() => runNpm('quality:dual-chart-gate'), () => runNpm('test:unit:chart')],
  3: () => [
    () => runNpm('quality:dual-chart-legacy-freeze-gate'),
    () => runNpm('quality:three-modes-gate'),
  ],
  4: () => [() => runNpm('check')],
  5: () => {
    archiveBranchesReport();
    return [() => runNpm('quality:auto-dev-6h-gate')];
  },
  6: () => [
    () => runNpm('quality:dual-chart-ledger'),
    () => runNpm('dev:agent:close'),
  ],
};

function runTramo(order, ledger) {
  const tramo = ledger.tramos.find((t) => t.order === order);
  if (!tramo) return true;
  console.log(`\n▶ Tramo ${order} — ${tramo.id}: ${tramo.name}\n`);
  log('tramo-start', { id: tramo.id, order });
  tramo.state = 'RUNNING';
  saveLedger(ledger);

  const factories = TRAMO_STEPS[order]?.() ?? [];
  const steps = Array.isArray(factories) ? factories : factories;
  for (const step of steps) {
    const result = step();
    if (!result.ok) {
      tramo.state = 'FAILED';
      saveLedger(ledger);
      log('tramo-failed', { id: tramo.id, order });
      return false;
    }
  }

  if (tramo.gate && !dryRun) {
    const r = runNpm(tramo.gate);
    if (!r.ok) {
      tramo.state = 'FAILED';
      saveLedger(ledger);
      return false;
    }
  }

  tramo.state = 'DONE';
  saveLedger(ledger);
  log('tramo-done', { id: tramo.id, order });

  if (doCommit && process.env.EPIS2_AUTO_DEV_AUTHORIZED === '1' && !dryRun) {
    runGit(['add', '-A']);
    runGit(['commit', '-m', `chore(auto-dev): tramo ${order} ${tramo.id} — ${tramo.name}`]);
  }
  return true;
}

function main() {
  console.log('EPIS2 dev:auto:6h — PROG-AUTO-DEV-6H\n');
  if ((doCommit || doPush) && process.env.EPIS2_AUTO_DEV_AUTHORIZED !== '1') {
    console.error('Set EPIS2_AUTO_DEV_AUTHORIZED=1 for automated commit/push');
    process.exit(1);
  }

  const ledger = loadLedger();
  const orders =
    tramoArg != null && !Number.isNaN(tramoArg)
      ? [tramoArg]
      : ledger.tramos.map((t) => t.order).sort((a, b) => a - b);

  for (const order of orders) {
    if (!runTramo(order, ledger)) {
      console.error(`\ndev:auto:6h FAILED at tramo ${order}`);
      process.exit(1);
    }
  }

  if (doPush && process.env.EPIS2_AUTO_DEV_AUTHORIZED === '1' && !dryRun) {
    if (!runGit(['push', 'origin', 'master']).ok) process.exit(1);
  }

  const closePath = join(root, 'reports/epis2-auto-dev-6h-close-2026-06-10.md');
  if (!dryRun) {
    writeFileSync(
      closePath,
      `# Cierre PROG-AUTO-DEV-6H\n\n**Fecha:** ${new Date().toISOString()}\n\nTramos: ${orders.join(', ')}\n\nLog: reports/auto-dev-6h-log.jsonl\n`,
      'utf8',
    );
  }

  console.log('\ndev:auto:6h OK');
  log('complete', { orders });
}

main();
