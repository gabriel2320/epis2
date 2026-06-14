#!/usr/bin/env node
/** Invoca quality:* vía catalog (post PROG-CONSOLIDATE Fase 2). */
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * @param {string} gateName e.g. quality:case-intel-gate
 * @param {string} [root] repo root
 */
export function spawnQualityGate(gateName, root = join(dirname(fileURLToPath(import.meta.url)), '../..')) {
  return spawnSync('node', ['tools/gates/run-legacy.mjs', gateName], {
    cwd: root,
    stdio: 'pipe',
    encoding: 'utf8',
  });
}
