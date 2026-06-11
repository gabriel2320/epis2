#!/usr/bin/env node
/**
 * Ciclo de desarrollo EPIS2 — OpenClaw (orquesta) + Ollama (local) + Evolab (QA).
 *
 *   node openclaw-dev-cycle.mjs bootstrap
 *   node openclaw-dev-cycle.mjs tramo --tramo 2 [--commit] [--dry-run]
 *   node openclaw-dev-cycle.mjs close
 */
import { appendFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { loadEnvFile } from '../load-env.mjs';
import { AUTO_DEV_OPENCLAW_HANDOFF_TRAMOS } from './openclaw-lib.mjs';
import { openClawSafetyEnv } from './openclaw-policy.mjs';
import { isEvolabPresent, resolveEvolabRoot } from './evolab-bridge.mjs';

loadEnvFile();

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const logPath = join(root, 'reports/epis2-dev-cycle-log.jsonl');

export const EVOLAB_SMOKE_TRAMOS = new Set([2, 4]);
export const EVOLAB_VALIDATE_TRAMOS = new Set([6]);
export const TIER_X_TRAMOS = new Set([1, 2, 3, 4]);

function envFlags() {
  return {
    ollama: process.env.EPIS2_AUTO_DEV_OLLAMA !== '0',
    ollamaApply: process.env.EPIS2_AUTO_DEV_OLLAMA_APPLY === '1',
    evolab: process.env.EPIS2_AUTO_DEV_EVOLAB === '1',
    openclaw: process.env.EPIS2_AUTO_DEV_OPENCLAW === '1',
  };
}

function log(event, detail = {}) {
  mkdirSync(join(root, 'reports'), { recursive: true });
  appendFileSync(
    logPath,
    `${JSON.stringify({ at: new Date().toISOString(), event, ...detail })}\n`,
    'utf8',
  );
}

function runNode(rel, nodeArgs = [], { dryRun = false } = {}) {
  if (dryRun) {
    log('dry-run-node', { rel, nodeArgs });
    return { ok: true };
  }
  const r = spawnSync(process.execPath, [join(root, rel), ...nodeArgs], {
    cwd: root,
    stdio: 'inherit',
    shell: false,
    env: process.env,
  });
  return { ok: r.status === 0 };
}

function runNpm(script, extraArgs = [], { dryRun = false } = {}) {
  if (dryRun) {
    log('dry-run-npm', { script, extraArgs });
    return { ok: true };
  }
  const r = spawnSync('npm', ['run', script, ...extraArgs], {
    cwd: root,
    stdio: 'inherit',
    shell: true,
    env: process.env,
  });
  return { ok: r.status === 0 };
}

function loadLedger() {
  return JSON.parse(readFileSync(join(root, 'docs/quality/auto-dev-6h-ledger.json'), 'utf8'));
}

/** Arranque: stack, preconditions, OpenClaw, Evolab, Ollama probe, cycle sync. */
export function runCycleBootstrap({ dryRun = false } = {}) {
  const flags = envFlags();
  console.log('\n═══ EPIS2 dev-cycle BOOTSTRAP ═══\n');
  console.log(
    `  OpenClaw: ${flags.openclaw ? 'on' : 'off'} · Ollama: ${flags.ollama ? 'on' : 'off'} · Evolab: ${flags.evolab ? 'on' : 'off'}\n`,
  );
  log('cycle-bootstrap-start', flags);

  if (!dryRun) {
    if (!runNpm('stack:dev').ok) return { ok: false, stage: 'stack:dev' };
    if (!runNpm('ollama:probe').ok) return { ok: false, stage: 'ollama:probe' };
    if (!runNode('scripts/dev-agent/auto-dev-preconditions.mjs').ok) {
      return { ok: false, stage: 'preconditions' };
    }
  }

  if (flags.evolab) {
    console.log('\n▶ [Evolab] doctor\n');
    if (!runNpm('evolab:doctor', [], { dryRun }).ok) return { ok: false, stage: 'evolab:doctor' };
  }

  if (flags.openclaw) {
    console.log('\n▶ [OpenClaw] policy + brief global\n');
    if (!runNpm('openclaw:policy', [], { dryRun }).ok) return { ok: false, stage: 'openclaw:policy' };
    if (!runNpm('openclaw:brief', ['--', '--mf', 'H-AUTO-CYCLE', '--agents', 'auto'], { dryRun }).ok) {
      return { ok: false, stage: 'openclaw:brief' };
    }
  }

  if (flags.ollama && !dryRun) {
    console.log('\n▶ [Ollama] plan sesión (dev:agent:ollama)\n');
    runNpm('dev:agent:ollama');
  }

  runNode('scripts/dev-agent/dev-cycle-sync.mjs', [], { dryRun });
  if (flags.evolab) runNpm('dev:evolab:sync', [], { dryRun });
  if (flags.openclaw) runNpm('dev:openclaw:sync', [], { dryRun });

  log('cycle-bootstrap-ok', flags);
  console.log('\ndev-cycle bootstrap OK\n');
  return { ok: true };
}

/**
 * Un tramo completo: OpenClaw pre → Ollama/Cursor → runner → Evolab → OpenClaw post.
 */
export function runTramoCycle({
  order,
  dryRun = false,
  doCommit = false,
  ledger = loadLedger(),
} = {}) {
  const flags = envFlags();
  const tramo = ledger.tramos.find((t) => t.order === order);
  if (!tramo) return { ok: false, stage: 'tramo-not-found', order };

  process.env.EPIS2_DEV_AGENT_TRAMO = String(order);
  process.env.EPIS2_DEV_AGENT_MF = tramo.id;

  console.log(`\n═══ dev-cycle TRAMO ${order} — ${tramo.id}: ${tramo.name} ═══\n`);
  log('cycle-tramo-start', { order, id: tramo.id, flags });

  if (flags.openclaw) {
    console.log('\n▶ [OpenClaw] brief pre-tramo\n');
    if (!runNode('scripts/dev-agent/openclaw-tramo.mjs', ['--tramo', String(order), '--phase', 'brief'], { dryRun }).ok) {
      return { ok: false, stage: 'openclaw-brief', order };
    }
  }

  if (flags.ollama && TIER_X_TRAMOS.has(order) && !dryRun) {
    console.log('\n▶ [Ollama] plan tramo (assist)\n');
    runNpm('dev:agent:ollama');
  }

  if (TIER_X_TRAMOS.has(order)) {
    runNode('scripts/dev-agent/generate-auto-dev-cursor-prompt.mjs', ['--tramo', String(order)], { dryRun });
    runNode('scripts/dev-agent/cursor-sdk-tramo.mjs', ['--tramo', String(order)], { dryRun });
  }

  const runnerArgs = ['--', '--tramo', String(order)];
  if (doCommit) runnerArgs.push('--commit');
  if (flags.ollama && order === 0) {
    runnerArgs.push('--ollama-auto');
    if (flags.ollamaApply) runnerArgs.push('--apply');
  }

  console.log('\n▶ [PM-03] dev:auto:6h tramo\n');
  if (!runNpm('dev:auto:6h', runnerArgs, { dryRun }).ok) {
    log('cycle-tramo-failed', { order, stage: 'dev:auto:6h' });
    return { ok: false, stage: 'dev:auto:6h', order };
  }

  if (flags.ollama && order > 0) {
    console.log('\n▶ [Ollama] ollama-auto post-tramo\n');
    const ollamaArgs = ['--', '--skip-plan'];
    if (flags.ollamaApply) ollamaArgs.push('--apply');
    runNpm('dev:agent:ollama-auto', ollamaArgs, { dryRun });
  }

  if (flags.evolab && EVOLAB_SMOKE_TRAMOS.has(order)) {
    console.log('\n▶ [Evolab] smoke\n');
    if (!runNpm('evolab:smoke', [], { dryRun }).ok) {
      return { ok: false, stage: 'evolab:smoke', order };
    }
    runNpm('dev:evolab:sync', [], { dryRun });
  }

  if (flags.evolab && EVOLAB_VALIDATE_TRAMOS.has(order)) {
    console.log('\n▶ [Evolab] validate\n');
    if (!runNpm('evolab:validate', [], { dryRun }).ok) {
      return { ok: false, stage: 'evolab:validate', order };
    }
    runNpm('dev:evolab:sync', [], { dryRun });
  }

  if (flags.openclaw && AUTO_DEV_OPENCLAW_HANDOFF_TRAMOS.has(order)) {
    console.log('\n▶ [OpenClaw] handoff + post-tramo\n');
    runNode('scripts/dev-agent/openclaw-tramo.mjs', ['--tramo', String(order), '--phase', 'handoff'], { dryRun });
  }

  runNode('scripts/dev-agent/dev-cycle-sync.mjs', [], { dryRun });
  log('cycle-tramo-ok', { order, id: tramo.id });
  console.log(`\ndev-cycle tramo ${order} OK\n`);
  return { ok: true, order, id: tramo.id };
}

/** Cierre: Evolab validate final, OpenClaw handoff, reporte unificado. */
export function runCycleClose({ dryRun = false } = {}) {
  const flags = envFlags();
  console.log('\n═══ EPIS2 dev-cycle CLOSE ═══\n');
  log('cycle-close-start', flags);

  if (flags.evolab) {
    runNpm('evolab:validate', [], { dryRun });
    runNpm('dev:evolab:sync', [], { dryRun });
  }

  if (flags.openclaw) {
    runNpm('openclaw:handoff', ['--', '--mf', 'H-AUTO-CYCLE', '--agents', 'auto'], { dryRun });
    runNpm('dev:openclaw:sync', [], { dryRun });
  }

  runNode('scripts/dev-agent/dev-cycle-sync.mjs', [], { dryRun });

  if (!dryRun) {
    const closePath = join(root, `reports/epis2-dev-cycle-close-${new Date().toISOString().slice(0, 10)}.md`);
    const evolabRoot = resolveEvolabRoot();
    writeFileSync(
      closePath,
      `# Cierre ciclo dev OpenClaw+Ollama+Evolab

**Fin:** ${new Date().toISOString()}

## Tracks
- OpenClaw: ${flags.openclaw ? 'on' : 'off'}
- Ollama: ${flags.ollama ? 'on' : 'off'}
- Evolab: ${flags.evolab ? 'on' : 'off'} (${isEvolabPresent(evolabRoot) ? evolabRoot : 'no clone'})

## Artefactos
- \`reports/epis2-dev-cycle-status.json\`
- \`reports/openclaw-latest-handoff.md\`
- \`reports/evolab-open-findings.json\`
- Log: \`reports/epis2-dev-cycle-log.jsonl\`
`,
      'utf8',
    );
    console.log(`\nReporte cierre → ${closePath}`);
  }

  log('cycle-close-ok', flags);
  return { ok: true };
}

/** Env unificado para spawn PM-03 / parallel. */
export function applyDevCycleEnv(baseEnv = process.env) {
  const out = openClawSafetyEnv({
    ...baseEnv,
    EPIS2_AUTO_DEV_OPENCLAW: baseEnv.EPIS2_AUTO_DEV_OPENCLAW ?? '1',
    EPIS2_AUTO_DEV_EVOLAB: baseEnv.EPIS2_AUTO_DEV_EVOLAB ?? '1',
    EPIS2_AUTO_DEV_OLLAMA: baseEnv.EPIS2_AUTO_DEV_OLLAMA ?? '1',
    EPIS2_OPENCLAW_MAX_POWER: baseEnv.EPIS2_OPENCLAW_MAX_POWER ?? '1',
  });
  return out;
}

function main() {
  process.env = applyDevCycleEnv(process.env);
  const cmd = process.argv[2];
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const doCommit = args.includes('--commit');
  const tramoIdx = args.includes('--tramo') ? Number(args[args.indexOf('--tramo') + 1]) : NaN;

  if (cmd === 'bootstrap') {
    const r = runCycleBootstrap({ dryRun });
    process.exit(r.ok ? 0 : 1);
  }
  if (cmd === 'tramo') {
    if (Number.isNaN(tramoIdx)) {
      console.error('Uso: openclaw-dev-cycle.mjs tramo --tramo <N>');
      process.exit(1);
    }
    const r = runTramoCycle({ order: tramoIdx, dryRun, doCommit });
    process.exit(r.ok ? 0 : 1);
  }
  if (cmd === 'close') {
    const r = runCycleClose({ dryRun });
    process.exit(r.ok ? 0 : 1);
  }
  console.error('Uso: openclaw-dev-cycle.mjs <bootstrap|tramo|close> [--tramo N] [--commit] [--dry-run]');
  process.exit(1);
}

if (process.argv[1]?.endsWith('openclaw-dev-cycle.mjs')) {
  main();
}
