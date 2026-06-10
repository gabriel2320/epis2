#!/usr/bin/env node
/** Signoff clínico A–K — checklist estructura (no aprobación humana). */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const checklist = join(root, 'docs/product/EPIS2_TRAMOS_CLINICAL_SIGNOFF_CHECKLIST.md');
if (!existsSync(checklist)) errors.push('falta EPIS2_TRAMOS_CLINICAL_SIGNOFF_CHECKLIST.md');

const text = existsSync(checklist) ? readFileSync(checklist, 'utf8') : '';
for (const tramo of ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K']) {
  if (!text.includes(`| ${tramo} |`)) errors.push(`checklist sin tramo ${tramo}`);
}
if (!text.includes('quality:golden-journey')) errors.push('checklist sin golden-journey');
if (!text.includes('ai:evals:closure')) errors.push('checklist sin ai:evals:closure');
if (!text.includes('quality:tramo-k-closure-gate'))
  errors.push('checklist sin tramo-k-closure-gate');
if (!text.includes('Tramos A–K')) errors.push('checklist sin alcance A–K');

const master = readFileSync(join(root, 'docs/product/EPIS2_TRAMOS_EXECUTION_MASTER.md'), 'utf8');
if (!master.includes('Signoff clínico institucional')) {
  errors.push('plan maestro sin nota signoff institucional');
}

const pkg = readFileSync(join(root, 'package.json'), 'utf8');
if (!pkg.includes('"quality:tramos-clinical-signoff-gate"')) {
  errors.push('package.json sin quality:tramos-clinical-signoff-gate');
}

if (errors.length) {
  console.error(
    'tramos-clinical-signoff-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'),
  );
  process.exit(1);
}
console.log('tramos-clinical-signoff-gate OK — checklist signoff A–K documentado');
