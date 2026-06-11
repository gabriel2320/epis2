#!/usr/bin/env node
/**
 * Evals estáticas de resolución de comandos (MF-CM-07).
 * Sin Ollama — importa @epis2/command-registry compilado.
 */
import { spawnSync } from 'node:child_process';
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

async function runPhraseSuiteEval() {
  const { COMMAND_PHRASE_SUITE, resolveCommand } = await import('@epis2/command-registry');
  const DEMO_PATIENT_ID = '00000000-0000-4000-8000-000000000001';

  let resolved = 0;
  let total = 0;
  const failures = [];

  for (const { phrase, intent } of COMMAND_PHRASE_SUITE) {
    total += 1;
    const input = {
      text: phrase,
      role: 'physician',
      ...(intent !== 'search_patient' ? { patientId: DEMO_PATIENT_ID } : {}),
    };
    const result = resolveCommand(input);
    if (result.status === 'resolved' && result.intent === intent) {
      resolved += 1;
    } else if (result.status === 'needs_patient' && result.intent === intent) {
      resolved += 1;
    } else if (result.status === 'needs_confirmation' && result.intent === intent) {
      resolved += 1;
    } else {
      failures.push({ phrase, expected: intent, got: result.status });
    }
  }

  const ratio = resolved / total;
  console.log(
    `COMMAND_PHRASE_SUITE: ${resolved}/${total} (${(ratio * 100).toFixed(1)}%) alineados al intent`,
  );
  if (failures.length > 0 && failures.length <= 8) {
    for (const f of failures) {
      console.log(`  FAIL "${f.phrase}" → ${f.got} (esperaba ${f.expected})`);
    }
  } else if (failures.length > 8) {
    console.log(`  ${failures.length} desalineaciones (mostrar ≤8 en log)`);
    for (const f of failures.slice(0, 8)) {
      console.log(`  FAIL "${f.phrase}" → ${f.got}`);
    }
  }

  const MIN_RATIO = 0.85;
  if (ratio < MIN_RATIO) {
    console.error(`COMMAND_PHRASE_SUITE por debajo de ${MIN_RATIO * 100}%`);
    process.exit(1);
  }
}

function runVitestSuites() {
  const vitest = spawnSync(
    'npx',
    [
      'vitest',
      'run',
      'packages/command-registry/src/clinical-phrase-suite-50.test.ts',
      'packages/command-registry/src/clinical-phrase-suite-colloquial.test.ts',
      'packages/command-registry/src/command-intent-top10.test.ts',
      'packages/command-registry/src/colloquial-rules.test.ts',
      'packages/command-registry/src/assist-route.test.ts',
    ],
    { cwd: root, shell: true, stdio: 'inherit' },
  );
  if (vitest.status !== 0) process.exit(vitest.status ?? 1);
}

async function main() {
  console.log('EPIS2 ai:evals:command — MF-CM-07\n');
  runBuild();
  await runPhraseSuiteEval();
  runVitestSuites();
  console.log('\nai:evals:command OK');
}

main().catch((err) => {
  console.error('ai:evals:command FAILED:', err.message ?? err);
  process.exit(1);
});
