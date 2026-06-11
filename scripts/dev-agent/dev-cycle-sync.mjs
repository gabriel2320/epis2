#!/usr/bin/env node
/**
 * Estado unificado ciclo dev — OpenClaw + Ollama + Evolab.
 *   npm run dev:cycle:sync → reports/epis2-dev-cycle-status.json
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnvFile } from '../load-env.mjs';
import { resolveOpenClawLocks } from './openclaw-policy.mjs';
import { isEvolabPresent, resolveEvolabRoot } from './evolab-bridge.mjs';

loadEnvFile();

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const outPath = join(root, 'reports/epis2-dev-cycle-status.json');

function readJson(rel) {
  const p = join(root, rel);
  if (!existsSync(p)) return null;
  try {
    return JSON.parse(readFileSync(p, 'utf8'));
  } catch {
    return null;
  }
}

function main() {
  const openclaw = readJson('reports/openclaw-auto-dev-index.json');
  const evolab = readJson('reports/evolab-open-findings.json');
  const ollamaPlan = readJson('reports/dev-agent-ollama-plan.json');
  const ollamaAuto = readJson('reports/dev-agent-ollama-automation.json');
  const ledger = readJson('docs/quality/auto-dev-6h-ledger.json');
  const locks = resolveOpenClawLocks();

  const tramos = ledger?.tramos?.map((t) => ({ order: t.order, id: t.id, state: t.state })) ?? [];

  const payload = {
    syncedAt: new Date().toISOString(),
    cycle: {
      openclaw: process.env.EPIS2_AUTO_DEV_OPENCLAW === '1',
      ollama: process.env.EPIS2_AUTO_DEV_OLLAMA !== '0',
      evolab: process.env.EPIS2_AUTO_DEV_EVOLAB === '1',
    },
    openclaw: {
      level: locks.level,
      mode: locks.mode,
      maxPower: locks.maxPower,
      artifactCount: openclaw?.artifactCount ?? 0,
      latestBrief: openclaw?.latestBrief?.path ?? null,
      latestHandoff: openclaw?.latestHandoff?.path ?? null,
    },
    ollama: {
      planObjective: ollamaPlan?.plan?.objective ?? null,
      nextMicrophase: ollamaPlan?.plan?.nextMicrophase ?? null,
      automationOk: ollamaAuto?.ok ?? null,
      model: process.env.OLLAMA_DEV_MODEL ?? process.env.OLLAMA_MODEL ?? null,
    },
    evolab: {
      present: isEvolabPresent(resolveEvolabRoot()),
      root: resolveEvolabRoot(),
      openFindings: evolab?.count ?? 0,
      syncedAt: evolab?.syncedAt ?? null,
      topFindings: (evolab?.findings ?? []).slice(0, 5),
    },
    ledger: { tramos },
  };

  mkdirSync(join(root, 'reports'), { recursive: true });
  writeFileSync(outPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  console.log(
    `dev:cycle:sync OK — OpenClaw ${locks.level} · Ollama ${payload.ollama.planObjective ? 'plan✓' : '—'} · Evolab ${payload.evolab.openFindings} hallazgos`,
  );
  console.log(`→ ${outPath}`);
}

main();
