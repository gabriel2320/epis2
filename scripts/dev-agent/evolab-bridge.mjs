#!/usr/bin/env node
/**
 * EPIS2 ↔ Evolab bridge — observa el repo hermano sin importar código.
 *
 *   node scripts/dev-agent/evolab-bridge.mjs <doctor|smoke|validate|findings|queue|plan|evolve|stack> [args...]
 *
 * Env:
 *   EPIS2_EVOLAB_ROOT   — ruta al clone epis2-evolab (default: ../epis2-evolab)
 *   EPIS2_ROOT          — inyectado al spawn (EPIS2 repo)
 *   EPIS2_EVOLAB_OPTIONAL=1 — skip con aviso si Evolab no existe (exit 0)
 */
import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { loadEnvFile } from '../load-env.mjs';

loadEnvFile();

const epis2Root = join(dirname(fileURLToPath(import.meta.url)), '../..');

const COMMAND_MAP = {
  doctor: 'evolab:doctor',
  smoke: 'evolab:smoke',
  validate: 'evolab:validate',
  findings: 'evolab:findings',
  queue: 'evolab:queue',
  plan: 'evolab:plan',
  evolve: 'evolab:evolve',
  stack: 'evolab:stack',
};

export function resolveEvolabRoot() {
  if (process.env.EPIS2_EVOLAB_ROOT?.trim()) {
    return resolve(process.env.EPIS2_EVOLAB_ROOT.trim());
  }
  return resolve(epis2Root, '..', 'epis2-evolab');
}

export function isEvolabPresent(evolabRoot = resolveEvolabRoot()) {
  return existsSync(join(evolabRoot, 'package.json'));
}

function usage() {
  console.error(`Uso: node evolab-bridge.mjs <${Object.keys(COMMAND_MAP).join('|')}> [args...]`);
  process.exit(1);
}

function main() {
  const command = process.argv[2];
  if (!command || !COMMAND_MAP[command]) usage();

  const evolabRoot = resolveEvolabRoot();
  const optional = process.env.EPIS2_EVOLAB_OPTIONAL === '1';

  if (!isEvolabPresent(evolabRoot)) {
    const msg = `Evolab no encontrado en ${evolabRoot} — clone epis2-evolab o define EPIS2_EVOLAB_ROOT`;
    if (optional) {
      console.warn(`[WARN] ${msg} (EPIS2_EVOLAB_OPTIONAL=1 — skip)`);
      process.exit(0);
    }
    console.error(`[FAIL] ${msg}`);
    process.exit(1);
  }

  const npmScript = COMMAND_MAP[command];
  const extraArgs = process.argv.slice(3);
  const npmArgs = ['run', npmScript];
  if (extraArgs.length > 0) npmArgs.push('--', ...extraArgs);

  console.log(`evolab-bridge: ${command} → npm ${npmScript} (cwd: ${evolabRoot})\n`);

  const r = spawnSync('npm', npmArgs, {
    cwd: evolabRoot,
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, EPIS2_ROOT: epis2Root },
  });
  process.exit(r.status ?? 1);
}

if (process.argv[1]?.endsWith('evolab-bridge.mjs')) {
  main();
}
