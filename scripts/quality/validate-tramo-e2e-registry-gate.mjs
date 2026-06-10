#!/usr/bin/env node
/** Semana 2 — Registro E2E tramos B–J (spec + npm script). */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const registry = [
  ['B', 'e2e/tramo-b-reception.spec.ts', 'test:e2e:tramo-b'],
  ['C', 'e2e/tramo-c-emergency.spec.ts', 'test:e2e:tramo-c'],
  ['D', 'e2e/tramo-d-icu.spec.ts', 'test:e2e:tramo-d'],
  ['E', 'e2e/tramo-e-or.spec.ts', 'test:e2e:tramo-e'],
  ['F', 'e2e/tramo-f-aps.spec.ts', 'test:e2e:tramo-f'],
  ['G', 'e2e/tramo-g-icu.spec.ts', 'test:e2e:tramo-g'],
  ['H', 'e2e/tramo-h-iaas.spec.ts', 'test:e2e:tramo-h'],
  ['I', 'e2e/tramo-i-specialty.spec.ts', 'test:e2e:tramo-i'],
  ['J', 'e2e/tramo-j-pharmacy.spec.ts', 'test:e2e:tramo-j'],
  ['K', 'e2e/tramo-k-quality.spec.ts', 'test:e2e:tramo-k'],
];

const pkg = readFileSync(join(root, 'package.json'), 'utf8');

for (const [tramo, spec, npmScript] of registry) {
  if (!existsSync(join(root, spec))) errors.push(`Tramo ${tramo} sin ${spec}`);
  if (!pkg.includes(`"${npmScript}"`)) errors.push(`package.json sin ${npmScript}`);
}

const jScaffold = readFileSync(
  join(root, 'scripts/quality/validate-tramo-j-scaffold-gate.mjs'),
  'utf8',
);
if (!jScaffold.includes('epis2-pharmacy-stockout')) {
  errors.push('scaffold gate J sin panel IDC 170');
}

if (errors.length) {
  console.error('tramo-e2e-registry-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('tramo-e2e-registry-gate OK — E2E B–K registrados');
