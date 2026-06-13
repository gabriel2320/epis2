#!/usr/bin/env node
/**
 * MF-CASE-10: evals assist live contra casos SIM (L0_synthetic).
 * Requiere: npm run stack:dev && npm run dev:ai
 *
 * Uso: npm run ai:evals:sim
 */
import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { aiAssistDraftResponseSchema } from '@epis2/contracts';
import { setTimeout as delay } from 'node:timers/promises';
import { computeEvalMetrics } from './ai-evals-metrics.mjs';
import { loadEnvFile } from './load-env.mjs';

loadEnvFile();

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const LOCAL_AI_URL = process.env.LOCAL_AI_BASE_URL ?? 'http://127.0.0.1:3002';
const MAX_LATENCY_MS = Number(process.env.EPIS2_AI_EVALS_MAX_LATENCY_MS ?? 90_000);

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
 * @param {{ caseCode: string; blueprintId: string; context: Record<string, string> }} entry
 * @param {string} patientId
 * @param {number} [attempt]
 */
async function evalSimEntry(entry, patientId, attempt = 1) {
  const label = `${entry.caseCode}·${entry.blueprintId}`;
  const started = Date.now();
  const res = await fetch(`${LOCAL_AI_URL.replace(/\/$/, '')}/assist/draft-suggestion`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      blueprintId: entry.blueprintId,
      patientId,
      context: { ...entry.context, demoCaseCode: entry.caseCode },
    }),
    signal: AbortSignal.timeout(MAX_LATENCY_MS + 5000),
  });

  const latencyMs = Date.now() - started;
  const body = await res.json().catch(() => ({}));

  if ((res.status === 503 || body?.status === 'unavailable') && attempt < 2) {
    await delay(3000);
    return evalSimEntry(entry, patientId, attempt + 1);
  }

  const parsed = aiAssistDraftResponseSchema.safeParse(body);
  if (!parsed.success) {
    return {
      id: label,
      passed: false,
      contractValid: false,
      detail: `respuesta no parseable (${res.status})`,
      latencyMs,
    };
  }

  const data = parsed.data;
  if (data.status === 'unavailable') {
    return { id: label, passed: false, contractValid: true, detail: data.message, latencyMs };
  }
  if (data.status === 'rejected') {
    return {
      id: label,
      passed: true,
      contractValid: true,
      detail: `rejected (política): ${data.message}`,
      latencyMs,
    };
  }
  if (data.requiresHumanReview !== true) {
    return {
      id: label,
      passed: false,
      contractValid: true,
      detail: 'requiresHumanReview !== true',
      latencyMs,
    };
  }
  if (latencyMs > MAX_LATENCY_MS) {
    return {
      id: label,
      passed: false,
      contractValid: true,
      detail: `latencia ${latencyMs}ms > ${MAX_LATENCY_MS}ms`,
      latencyMs,
    };
  }
  const fieldCount = Object.keys(data.suggestedFields ?? {}).length;
  return {
    id: label,
    passed: fieldCount > 0,
    contractValid: true,
    detail: fieldCount > 0 ? `${fieldCount} campos · ${latencyMs}ms` : 'sin suggestedFields',
    latencyMs,
  };
}

async function main() {
  const { SIM_ASSIST_EVAL_MATRIX, simAssistEvalPatientId } = await import(
    '../packages/test-fixtures/dist/simAssistEvals.js'
  );

  console.log(
    `EPIS2 ai:evals:sim — ${SIM_ASSIST_EVAL_MATRIX.length} entrada(s) SIM · ${LOCAL_AI_URL}\n`,
  );

  if (!(await probeReady())) {
    console.error('✗ local-ai no responde en /ready — npm run dev:ai');
    process.exit(1);
  }

  const results = [];
  for (const entry of SIM_ASSIST_EVAL_MATRIX) {
    const patientId = simAssistEvalPatientId(entry.caseCode);
    if (!patientId) {
      results.push({
        id: `${entry.caseCode}·${entry.blueprintId}`,
        passed: false,
        contractValid: false,
        detail: 'patientId no resuelto',
        latencyMs: 0,
      });
      continue;
    }
    process.stdout.write(`… ${entry.caseCode} / ${entry.blueprintId} `);
    try {
      const result = await evalSimEntry(entry, patientId);
      results.push(result);
      console.log(result.passed ? `OK (${result.detail})` : `FAIL — ${result.detail}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      results.push({
        id: `${entry.caseCode}·${entry.blueprintId}`,
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
  const reportPath = join(root, 'reports/ai-evals-sim-latest.json');
  writeFileSync(
    reportPath,
    `${JSON.stringify({ generatedAt: new Date().toISOString(), metrics, results }, null, 2)}\n`,
    'utf8',
  );

  console.log(
    `\nResumen SIM: ${results.length - failed.length}/${results.length} OK · p95 ${metrics.p95LatencyMs}ms`,
  );
  console.log(`Métricas: ${reportPath}`);

  if (failed.length) {
    console.error('\nai:evals:sim FAILED');
    for (const f of failed) console.error(`  - ${f.id}: ${f.detail ?? 'error'}`);
    process.exit(1);
  }
  console.log('ai:evals:sim OK');
}

main().catch((err) => {
  console.error('ai:evals:sim FAILED:', err.message ?? err);
  process.exit(1);
});
