#!/usr/bin/env node
/**
 * Evolab — tareas complementarias SECUENCIALES (orquestador idle).
 * No compite con OpenClaw/PM-03 por Ollama ni sandbox.
 *
 *   npm run dev:evolab:complement
 */
import { appendFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { loadEnvFile } from '../load-env.mjs';
import { openClawSafetyEnv } from './openclaw-policy.mjs';

loadEnvFile();

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const logPath = join(root, 'reports/evolab-complement-log.jsonl');
const dryRun = process.argv.includes('--dry-run');

function log(event, detail = {}) {
  mkdirSync(join(root, 'reports'), { recursive: true });
  appendFileSync(logPath, `${JSON.stringify({ at: new Date().toISOString(), event, ...detail })}\n`, 'utf8');
}

function env() {
  return openClawSafetyEnv({
    ...process.env,
    EPIS2_ROOT: root,
    EPIS2_EVOLAB_PATCHING_ENABLED: 'false',
    EPIS2_EVOLAB_REQUIRE_HUMAN_APPROVAL: 'true',
    EPIS2_EVOLAB_LLM_CONCURRENCY: '1',
  });
}

function runNode(rel, nodeArgs = []) {
  if (dryRun) {
    log('dry-run', { rel, nodeArgs });
    return { ok: true };
  }
  const r = spawnSync(process.execPath, [join(root, rel), ...nodeArgs], {
    cwd: root,
    stdio: 'inherit',
    shell: false,
    env: env(),
  });
  return { ok: r.status === 0, status: r.status ?? 1 };
}

function runNpm(script, extraArgs = []) {
  if (dryRun) {
    log('dry-run-npm', { script, extraArgs });
    return { ok: true };
  }
  const r = spawnSync('npm', ['run', script, ...extraArgs], {
    cwd: root,
    stdio: 'inherit',
    shell: true,
    env: env(),
  });
  return { ok: r.status === 0, status: r.status ?? 1 };
}

function main() {
  console.log('\n▶ Evolab complement (secuencial, sin solapar orquestador)\n');
  log('complement-start', {});

  const steps = [
    { label: 'sync', fn: () => runNpm('dev:evolab:sync') },
    { label: 'queue', fn: () => runNode('scripts/dev-agent/evolab-bridge.mjs', ['queue', '--limit', '10']) },
    {
      label: 'evolve-short',
      fn: () =>
        runNode('scripts/dev-agent/evolab-bridge.mjs', [
          'evolve',
          '--generations',
          process.env.EPIS2_EVOLAB_COMPLEMENT_GENERATIONS ?? '1',
          '--budget-minutes',
          process.env.EPIS2_EVOLAB_COMPLEMENT_BUDGET_MINUTES ?? '45',
          '--json',
        ]),
    },
    { label: 'sync-close', fn: () => runNpm('dev:evolab:sync') },
  ];

  for (const step of steps) {
    console.log(`  · ${step.label}`);
    log('complement-step', { step: step.label });
    const r = step.fn();
    if (!r.ok && step.label !== 'evolve-short') {
      log('complement-failed', { step: step.label, status: r.status });
      process.exit(r.status ?? 1);
    }
    if (!r.ok) {
      console.warn(`  [WARN] ${step.label} falló — continúa complement`);
      log('complement-warn', { step: step.label, status: r.status });
    }
  }

  log('complement-ok', {});
  console.log('\ndev:evolab:complement OK\n');
}

main();
