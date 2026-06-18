#!/usr/bin/env node
/** MF-LX-05 — reglas clinicas demo blocking/critical. */
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const pkgDir = join(root, 'packages/clinical-rules');
if (!existsSync(join(pkgDir, 'src/index.ts'))) {
  errors.push('Falta packages/clinical-rules');
}

const rulesSrc = readFileSync(join(pkgDir, 'src/rulesDemo.ts'), 'utf8');
for (const ruleId of [
  'prescription_missing_dose',
  'allergy_beta_lactam_prescription',
  'critical_potassium_unacknowledged',
  'discharge_summary_missing_dx_alta',
  'evolution_missing_analysis_plan',
]) {
  if (!rulesSrc.includes(`id: '${ruleId}'`)) {
    errors.push(`rulesDemo falta ${ruleId}`);
  }
}

const indexSrc = readFileSync(join(pkgDir, 'src/index.ts'), 'utf8');
for (const token of [
  'evaluateClinicalRules',
  'CLINICAL_RULES_DEMO',
  'assertClinicalRulesInvariants',
]) {
  if (!indexSrc.includes(token)) {
    errors.push(`clinical-rules/index.ts falta ${token}`);
  }
}

const vitest = spawnSync(
  'npx',
  ['vitest', 'run', 'packages/clinical-rules/src/clinical-rules.test.ts'],
  { cwd: root, encoding: 'utf8', shell: true },
);
if (vitest.status !== 0) {
  errors.push('clinical-rules tests fallaron');
  if (vitest.stdout) process.stdout.write(vitest.stdout);
  if (vitest.stderr) process.stderr.write(vitest.stderr);
}

if (errors.length) {
  console.error('clinical-rules-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('clinical-rules-gate OK — reglas clinicas MF-LX-05');
