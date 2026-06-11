#!/usr/bin/env node
/** Imprime candados OpenClaw activos + validación. */
import { loadEnvFile } from '../load-env.mjs';
import {
  ALLOWLIST_COMMANDS,
  ALLOWLIST_PREFIXES_L4,
  CONDITIONAL_COMMANDS,
  MAX_POWER_LOCK_DEFAULTS,
  assertLocksForSafeRun,
  canUseSafePatch,
  resolveOpenClawLocks,
} from './openclaw-policy.mjs';

loadEnvFile();

const locks = resolveOpenClawLocks();
const violations = assertLocksForSafeRun(locks);

console.log('EPIS2 OpenClaw policy\n');
console.log(
  JSON.stringify(
    {
      locks,
      maxPowerDefaults: MAX_POWER_LOCK_DEFAULTS,
      capabilities: {
        safeRun: locks.safeRun,
        safePatch: canUseSafePatch(locks),
        conditional: locks.authorizeConditional,
        codePatch: locks.authorizeCode && locks.levelOrder >= 3,
        allowlistExact: ALLOWLIST_COMMANDS.length,
        conditionalCommands: CONDITIONAL_COMMANDS.length,
        L4Prefixes: ALLOWLIST_PREFIXES_L4.length,
      },
    },
    null,
    2,
  ),
);

if (violations.length) {
  console.error('\n[FAIL] Candados inválidos:\n' + violations.map((v) => `  - ${v}`).join('\n'));
  process.exit(1);
}

console.log(`\nopenclaw:policy OK — ${locks.maxPower ? 'MAX POWER' : locks.level} (${locks.mode})`);
