#!/usr/bin/env node
/**
 * Evals en vivo — Ollama + local-ai por blueprint (MF-DEV-AI-LIVE).
 *
 * Requiere: Ollama nativo + npm run dev:ai en otra terminal.
 *
 * EPIS2_AI_EVALS_TRAMO=J        — blueprints del tramo (Semana 3)
 * EPIS2_AI_EVALS_LIVE=all       — todos los blueprints assist
 * EPIS2_AI_EVALS_MAX_LATENCY_MS — umbral por blueprint (default 90000)
 * EPIS2_AI_EVALS_BLUEPRINTS      — lista csv (override subset)
 */
import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { aiAssistDraftResponseSchema } from '@epis2/contracts';
import { setTimeout as delay } from 'node:timers/promises';
import { computeEvalMetrics } from './ai-evals-metrics.mjs';
import { blueprintsForTramo } from './ai-tramo-blueprints.mjs';
import { loadEnvFile } from './load-env.mjs';

loadEnvFile();

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const LOCAL_AI_URL = process.env.LOCAL_AI_BASE_URL ?? 'http://127.0.0.1:3002';
const MAX_LATENCY_MS = Number(process.env.EPIS2_AI_EVALS_MAX_LATENCY_MS ?? 90_000);
const DEMO_PATIENT_ID = 'a0000001-0000-4000-8000-000000000005';

const DEFAULT_BLUEPRINTS = [
  'evolution_note',
  'pharmacy_validation',
  'medication_reconciliation',
  'nursing_note',
];

/** @returns {Promise<string[]>} */
async function resolveBlueprintIds() {
  if (process.env.EPIS2_AI_EVALS_BLUEPRINTS) {
    return process.env.EPIS2_AI_EVALS_BLUEPRINTS.split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }
  if (process.env.EPIS2_AI_EVALS_TRAMO) {
    const ids = blueprintsForTramo(process.env.EPIS2_AI_EVALS_TRAMO);
    if (!ids?.length) {
      throw new Error(`Tramo desconocido: ${process.env.EPIS2_AI_EVALS_TRAMO}`);
    }
    return [...ids];
  }
  if (process.env.EPIS2_AI_EVALS_LIVE === 'all') {
    const { listAssistBlueprints } = await import('../services/local-ai/dist/assistSchemas.js');
    return listAssistBlueprints().map((b) => b.id);
  }
  return DEFAULT_BLUEPRINTS;
}

async function probeReady() {
  try {
    const res = await fetch(`${LOCAL_AI_URL.replace(/\/$/, '')}/ready`, {
      signal: AbortSignal.timeout(8000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * @param {string} blueprintId
 * @param {number} [attempt]
 */
async function evalBlueprint(blueprintId, attempt = 1) {
  const started = Date.now();
  const res = await fetch(`${LOCAL_AI_URL.replace(/\/$/, '')}/assist/draft-suggestion`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      blueprintId,
      patientId: DEMO_PATIENT_ID,
      context: { eval: 'live', demoCase: 'DEMO-005' },
    }),
    signal: AbortSignal.timeout(MAX_LATENCY_MS + 5000),
  });

  const latencyMs = Date.now() - started;
  const body = await res.json().catch(() => ({}));

  if ((res.status === 503 || body?.status === 'unavailable') && attempt < 2) {
    await delay(3000);
    return evalBlueprint(blueprintId, attempt + 1);
  }

  const parsed = aiAssistDraftResponseSchema.safeParse(body);
  const contractValid = parsed.success;

  if (!parsed.success) {
    return {
      blueprintId,
      passed: false,
      contractValid,
      detail: `respuesta no parseable (${res.status})`,
      latencyMs,
    };
  }

  const data = parsed.data;

  if (data.status === 'unavailable') {
    return {
      blueprintId,
      passed: false,
      contractValid: true,
      detail: data.message,
      latencyMs,
    };
  }

  if (data.status === 'rejected') {
    return {
      blueprintId,
      passed: true,
      contractValid: true,
      detail: `rejected (política): ${data.message}`,
      latencyMs,
    };
  }

  if (data.requiresHumanReview !== true) {
    return {
      blueprintId,
      passed: false,
      contractValid: true,
      detail: 'requiresHumanReview !== true',
      latencyMs,
    };
  }

  if (latencyMs > MAX_LATENCY_MS) {
    return {
      blueprintId,
      passed: false,
      contractValid: true,
      detail: `latencia ${latencyMs}ms > ${MAX_LATENCY_MS}ms`,
      latencyMs,
    };
  }

  const fieldCount = Object.keys(data.suggestedFields ?? {}).length;
  return {
    blueprintId,
    passed: fieldCount > 0,
    contractValid: true,
    detail: fieldCount > 0 ? `${fieldCount} campos · ${latencyMs}ms` : 'sin suggestedFields',
    latencyMs,
  };
}

export async function runLiveEvals() {
  const blueprintIds = await resolveBlueprintIds();
  const tramo = process.env.EPIS2_AI_EVALS_TRAMO ?? null;

  console.log(
    `EPIS2 ai:evals:live — ${blueprintIds.length} blueprint(s)${tramo ? ` · tramo ${tramo}` : ''} · ${LOCAL_AI_URL}\n`,
  );

  const ready = await probeReady();
  if (!ready) {
    console.error('✗ local-ai no responde en /ready');
    console.error('  1) npm run stack:dev');
    console.error('  2) npm run dev:ai   (otra terminal)');
    process.exit(1);
  }

  /** @type {Array<{ blueprintId: string; passed: boolean; contractValid?: boolean; detail?: string; latencyMs: number }>} */
  const results = [];

  for (const blueprintId of blueprintIds) {
    process.stdout.write(`… ${blueprintId} `);
    try {
      const result = await evalBlueprint(blueprintId);
      results.push(result);
      console.log(result.passed ? `OK (${result.detail})` : `FAIL — ${result.detail}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      results.push({
        blueprintId,
        passed: false,
        contractValid: false,
        detail: message,
        latencyMs: 0,
      });
      console.log(`FAIL — ${message}`);
    }
  }

  const metrics = computeEvalMetrics(results);
  const failed = results.filter((r) => !r.passed);

  const report = {
    generatedAt: new Date().toISOString(),
    tramo,
    blueprints: blueprintIds,
    metrics,
    results,
  };

  const reportPath = join(root, 'reports/ai-evals-live-latest.json');
  writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');

  console.log(
    `\nResumen: ${results.length - failed.length}/${results.length} OK · ` +
      `p95 ${metrics.p95LatencyMs}ms · validJson ${(metrics.validJsonRate * 100).toFixed(0)}%`,
  );
  console.log(`Métricas: ${reportPath}`);

  if (failed.length) {
    console.error('\nai:evals:live FAILED');
    for (const f of failed) {
      console.error(`  - ${f.blueprintId}: ${f.detail ?? 'error'}`);
    }
    process.exit(1);
  }

  console.log('ai:evals:live OK');
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain) {
  runLiveEvals().catch((err) => {
    console.error('ai:evals:live FAILED:', err.message ?? err);
    process.exit(1);
  });
}
