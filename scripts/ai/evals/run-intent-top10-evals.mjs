#!/usr/bin/env node
/**
 * MF-SH-02 — evals estáticas por intent top-10 (command-registry).
 * Sin Ollama. Complementa ai:evals:live (assist blueprints).
 */
import { spawnSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../../..');

function runBuild() {
  const build = spawnSync('npm', ['run', 'build', '-w', '@epis2/command-registry'], {
    cwd: root,
    shell: true,
    stdio: 'inherit',
  });
  if (build.status !== 0) process.exit(build.status ?? 1);
}

async function runTop10Metrics() {
  const { COMMAND_INTENT_TOP10, COMMAND_INTENT_TOP10_MIN_RESOLVE_RATIO } =
    await import('@epis2/command-registry');
  const { resolveCommand } = await import('@epis2/command-registry');
  const { requiresExplicitConfirmation } = await import('@epis2/command-registry');

  const DEMO_PATIENT_ID = '00000000-0000-4000-8000-000000000001';
  const byIntent = [];
  let ok = 0;
  let total = 0;

  for (const { intent, phrases } of COMMAND_INTENT_TOP10) {
    let intentOk = 0;
    for (const phrase of phrases) {
      total += 1;
      const input = {
        text: phrase,
        role: 'physician',
        ...(intent !== 'search_patient' ? { patientId: DEMO_PATIENT_ID } : {}),
        ...(requiresExplicitConfirmation(intent) ? { confirmed: true } : {}),
      };
      const result = resolveCommand(input);
      const pass =
        (result.status === 'resolved' && result.intent === intent) ||
        (requiresExplicitConfirmation(intent) &&
          result.status === 'needs_confirmation' &&
          result.intent === intent);
      if (pass) {
        ok += 1;
        intentOk += 1;
      }
    }
    byIntent.push({
      intent,
      phrases: phrases.length,
      resolved: intentOk,
      ratio: phrases.length ? intentOk / phrases.length : 0,
    });
  }

  const ratio = total ? ok / total : 0;
  const report = {
    generatedAt: new Date().toISOString(),
    microphase: 'MF-SH-02',
    intents: COMMAND_INTENT_TOP10.length,
    totalPhrases: total,
    resolved: ok,
    ratio,
    minRatio: COMMAND_INTENT_TOP10_MIN_RESOLVE_RATIO,
    passed: ratio >= COMMAND_INTENT_TOP10_MIN_RESOLVE_RATIO,
    byIntent,
  };

  const reportPath = join(root, 'reports/ai-evals-intent-top10-latest.json');
  writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');

  console.log(
    `INTENT_TOP10: ${ok}/${total} (${(ratio * 100).toFixed(1)}%) · min ${(COMMAND_INTENT_TOP10_MIN_RESOLVE_RATIO * 100).toFixed(0)}%`,
  );
  console.log(`Métricas: ${reportPath}`);

  if (!report.passed) {
    console.error('run-intent-top10-evals FAILED');
    process.exit(1);
  }
}

function runVitest() {
  const vitest = spawnSync(
    'npx',
    ['vitest', 'run', 'packages/command-registry/src/command-intent-top10.test.ts'],
    { cwd: root, shell: true, stdio: 'inherit' },
  );
  if (vitest.status !== 0) process.exit(vitest.status ?? 1);
}

async function main() {
  console.log('EPIS2 ai:evals:intent-top10 — MF-SH-02\n');
  runBuild();
  await runTop10Metrics();
  runVitest();
  console.log('\nai:evals:intent-top10 OK');
}

main().catch((err) => {
  console.error('ai:evals:intent-top10 FAILED:', err.message ?? err);
  process.exit(1);
});
