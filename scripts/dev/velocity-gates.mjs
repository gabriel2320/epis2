#!/usr/bin/env node
/**
 * Gates por rol/subagente — evita correr los 80+ quality:* en cada sesión.
 *
 *   npm run dev:velocity:gates
 *   npm run dev:velocity:gates -- --subagent golden-guardian
 *   npm run dev:velocity:gates -- --subagent tramo-implementer --tramo J
 *   npm run dev:velocity:gates -- --fast   # omite check (solo gates rol + db)
 */
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DEV_SUBAGENTS } from '../dev-agent/subagents.mjs';
import { buildGateCommands, resolveVelocityContext } from './velocity-lib.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const args = process.argv.slice(2);

function hasFlag(flag) {
  return args.includes(flag);
}

function argValue(flag) {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : undefined;
}

const fast = hasFlag('--fast');
const tramo = argValue('--tramo') ?? process.env.EPIS2_DEV_AGENT_TRAMO;
const subagentArg = argValue('--subagent');
const ctx = resolveVelocityContext(root, { tramo, subagent: subagentArg });
const subagent = subagentArg ?? ctx.subagent;

if (!DEV_SUBAGENTS[subagent]) {
  console.error(`Subagente desconocido: ${subagent}`);
  console.error(`Válidos: ${Object.keys(DEV_SUBAGENTS).join(', ')}`);
  process.exit(1);
}

const commands = buildGateCommands(root, subagent, { tramo, fast });

console.log(`EPIS2 dev:velocity:gates — ${subagent}${tramo ? ` · tramo ${tramo}` : ''}\n`);

const results = [];
for (const step of commands) {
  process.stdout.write(`▶ npm run ${step.npm} … `);
  const r = spawnSync('npm', ['run', step.npm], {
    cwd: root,
    stdio: 'pipe',
    encoding: 'utf8',
    shell: true,
  });
  const ok = r.status === 0;
  results.push({ ...step, ok });
  console.log(ok ? 'OK' : 'FAIL');
  if (!ok) {
    if (r.stdout) process.stdout.write(r.stdout);
    if (r.stderr) process.stderr.write(r.stderr);
    if (step.required) {
      console.error(`\n✗ Gate requerido falló: ${step.npm}`);
      process.exit(r.status ?? 1);
    }
    console.warn(`⚠ Gate opcional falló: ${step.npm}`);
  }
}

const failedOptional = results.filter((r) => !r.ok && !r.required);
console.log(
  failedOptional.length
    ? `\n(i) ${failedOptional.length} gate(s) opcional(es) fallaron — revisar antes de push`
    : '\n✓ dev:velocity:gates OK',
);
