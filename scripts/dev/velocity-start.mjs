#!/usr/bin/env node
/**
 * Arranque rápido EPIS2 — estado tablero + brief + subagente sugerido.
 *
 *   npm run dev:velocity
 *   npm run dev:velocity -- --refresh          # regenera brief (dev:session)
 *   npm run dev:velocity -- --tramo J
 */
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { formatVelocityBanner, resolveVelocityContext } from './velocity-lib.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const args = process.argv.slice(2);

function hasFlag(flag) {
  return args.includes(flag);
}

function argValue(flag) {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : undefined;
}

const tramo = argValue('--tramo') ?? process.env.EPIS2_DEV_AGENT_TRAMO;
const refresh = hasFlag('--refresh') || !resolveVelocityContext(root, { tramo }).brief.exists;

if (refresh) {
  const sessionArgs = ['run', 'dev:session'];
  if (tramo) sessionArgs.push('--', '--tramo', tramo);
  console.log('▶ Regenerando brief (dev:session)…\n');
  const r = spawnSync('npm', sessionArgs, { cwd: root, stdio: 'inherit', shell: true });
  if (r.status !== 0) process.exit(r.status ?? 1);
  console.log('');
}

const ctx = resolveVelocityContext(root, { tramo });
console.log(formatVelocityBanner(ctx));
console.log('\nLoop iteración (post-cambio):');
console.log('  npm run dev:rapid');
console.log('  npm run dev:rapid -- --skip-audit   # sin Ollama audit-diff');
console.log('\nGates sugeridos al cerrar:');
console.log(
  `  npm run dev:velocity:gates -- --subagent ${ctx.subagent}${tramo ? ` --tramo ${tramo}` : ''}`,
);
console.log('\nPre-PR (opcional):');
console.log('  EPIS2_LOCAL_CI_E2E=1 npm run quality:local-ci');
