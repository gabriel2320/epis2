#!/usr/bin/env node
/**
 * Pipeline automatización Ollama nativa (dev).
 *
 *   npm run dev:agent:ollama-auto
 *   npm run dev:agent:ollama-auto -- --apply
 *   npm run dev:agent:ollama-auto -- --skip-plan
 *   npm run dev:agent:ollama-auto -- --apply --skip-check
 *
 * Pasos: probe → plan sesión → documentación L0 (dry-run o --apply)
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { loadEnvFile } from '../load-env.mjs';
import { ensureOllamaReady, resolveAllOllamaRoutes } from '../ollama/native-client.mjs';

loadEnvFile();

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const args = process.argv.slice(2);
const apply = args.includes('--apply');
const skipPlan = args.includes('--skip-plan');
const skipWrite = args.includes('--skip-write');
const skipCheck = args.includes('--skip-check');

function runScript(relPath, extraArgs = []) {
  const script = join(root, relPath);
  return spawnSync(process.execPath, [script, ...extraArgs], {
    cwd: root,
    stdio: 'inherit',
    env: process.env,
  });
}

async function main() {
  const routes = await resolveAllOllamaRoutes(
    process.env.OLLAMA_BASE_URL ?? 'http://127.0.0.1:11434',
  );
  const planRoute = routes['dev-plan'];
  const writeRoute = routes['dev-write'];
  console.log('EPIS2 dev:agent:ollama-auto\n');
  console.log(`  Ollama ${planRoute.baseUrl}`);
  console.log(
    `  Estación tier ${planRoute.tier} · dev-plan → ${planRoute.model} · dev-write → ${writeRoute.model}`,
  );

  const ready = await ensureOllamaReady({ function: 'dev-plan' });
  if (!ready.ready) {
    console.error(`\nollama-auto FAILED [${ready.stage}]: ${ready.reason}`);
    console.error(`  ${ready.hint}`);
    process.exit(1);
  }
  console.log('  Probe OK\n');

  const steps = [];

  if (!skipPlan) {
    console.log('▶ Paso 1/2 — Plan sesión (ollama-assist)');
    const r = runScript('scripts/dev-agent/ollama-assist.mjs');
    steps.push({ step: 'plan', ok: r.status === 0 });
    if (r.status !== 0) {
      console.error('\nollama-auto FAILED en plan sesión');
      process.exit(1);
    }
  } else {
    steps.push({ step: 'plan', ok: true, skipped: true });
  }

  if (!skipWrite) {
    console.log(`\n▶ Paso 2/2 — Documentación bajo riesgo${apply ? ' (apply L0)' : ' (dry-run)'}`);
    const writeArgs = ['--document'];
    if (apply) writeArgs.push('--apply');
    if (skipCheck) writeArgs.push('--skip-check');
    const r = runScript('scripts/dev-agent/ollama-write.mjs', writeArgs);
    steps.push({ step: 'write', ok: r.status === 0, apply });
    if (r.status !== 0) {
      console.error('\nollama-auto FAILED en ollama-write');
      process.exit(1);
    }
  } else {
    steps.push({ step: 'write', ok: true, skipped: true });
  }

  mkdirSync(join(root, 'reports'), { recursive: true });
  const outPath = join(root, 'reports/dev-agent-ollama-automation.json');
  const summary = {
    generatedAt: new Date().toISOString(),
    baseUrl: planRoute.baseUrl,
    routes: {
      'dev-plan': { model: planRoute.model, tier: planRoute.tier, mode: planRoute.mode },
      'dev-write': { model: writeRoute.model, tier: writeRoute.tier, mode: writeRoute.mode },
    },
    workstation: planRoute.workstation,
    apply,
    steps,
    artifacts: {
      plan: 'reports/dev-agent-ollama-plan.json',
      writePlan: 'reports/dev-agent-ollama-write-plan.json',
    },
  };
  writeFileSync(outPath, JSON.stringify(summary, null, 2), 'utf8');

  console.log(`\nollama-auto OK → ${outPath}`);
  if (!apply) {
    console.log(
      '  Revisar planes. Aplicar L0: npm run dev:agent:ollama-auto -- --apply --skip-plan',
    );
  } else {
    console.log('  Revisar diff. Commit humano explícito.');
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
