#!/usr/bin/env node
/** Compat: delega en orquestador de subagentes. */
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptsDir = dirname(fileURLToPath(import.meta.url));
const root = join(scriptsDir, '..');
const tramo = (process.argv[2] ?? process.env.EPIS2_DEV_AGENT_TRAMO ?? 'K').toUpperCase();

const r = spawnSync(
  process.execPath,
  [join(scriptsDir, 'dev-agent/orchestrate.mjs'), '--tramo', tramo],
  {
    cwd: root,
    stdio: 'inherit',
    env: {
      ...process.env,
      EPIS2_DEV_AGENT_TRAMO: tramo,
      EPIS2_DEV_AGENT_MF: process.env.EPIS2_DEV_AGENT_MF ?? `MF-TRAMO-${tramo}-002`,
    },
  },
);

process.exit(r.status ?? 1);
