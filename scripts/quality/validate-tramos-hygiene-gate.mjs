#!/usr/bin/env node
/**
 * Higiene transversal Tramos A–K — conciliación docs, gates y plan maestro.
 * No sustituye ejecutar cada closure-gate; valida estructura y coherencia canon.
 */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const TRAMOS = [
  {
    id: 'A',
    closure: 'docs/product/EPIS2_TRAMO_A_CLOSURE.md',
    mf: 'MF-TRAMO-A-CLOSURE',
    gateScript: 'validate-tramo-a-closure-gate.mjs',
    npmGate: 'quality:tramo-a-closure-gate',
  },
  {
    id: 'B',
    closure: 'docs/product/EPIS2_TRAMO_B_CLOSURE.md',
    mf: 'MF-TRAMO-B-CLOSURE',
    gateScript: 'validate-tramo-b-closure-gate.mjs',
    npmGate: 'quality:tramo-b-closure-gate',
  },
  {
    id: 'C',
    closure: 'docs/product/EPIS2_TRAMO_C_CLOSURE.md',
    mf: 'MF-TRAMO-C-CLOSURE',
    gateScript: 'validate-tramo-c-closure-gate.mjs',
    npmGate: 'quality:tramo-c-closure-gate',
  },
  {
    id: 'D',
    closure: 'docs/product/EPIS2_TRAMO_D_CLOSURE.md',
    mf: 'MF-TRAMO-D-CLOSURE',
    gateScript: 'validate-tramo-d-closure-gate.mjs',
    npmGate: 'quality:tramo-d-closure-gate',
  },
  {
    id: 'E',
    closure: 'docs/product/EPIS2_TRAMO_E_CLOSURE.md',
    mf: 'MF-TRAMO-E-CLOSURE',
    gateScript: 'validate-tramo-e-closure-gate.mjs',
    npmGate: 'quality:tramo-e-closure-gate',
  },
  {
    id: 'F',
    closure: 'docs/product/EPIS2_TRAMO_F_CLOSURE.md',
    mf: 'MF-TRAMO-F-CLOSURE',
    gateScript: 'validate-tramo-f-closure-gate.mjs',
    npmGate: 'quality:tramo-f-closure-gate',
  },
  {
    id: 'G',
    closure: 'docs/product/EPIS2_TRAMO_G_CLOSURE.md',
    mf: 'MF-TRAMO-G-CLOSURE',
    gateScript: 'validate-tramo-g-closure-gate.mjs',
    npmGate: 'quality:tramo-g-closure-gate',
  },
  {
    id: 'H',
    closure: 'docs/product/EPIS2_TRAMO_H_CLOSURE.md',
    mf: 'MF-TRAMO-H-CLOSURE',
    gateScript: 'validate-tramo-h-closure-gate.mjs',
    npmGate: 'quality:tramo-h-closure-gate',
  },
  {
    id: 'I',
    closure: 'docs/product/EPIS2_TRAMO_I_CLOSURE.md',
    mf: 'MF-TRAMO-I-CLOSURE',
    gateScript: 'validate-tramo-i-closure-gate.mjs',
    npmGate: 'quality:tramo-i-closure-gate',
  },
  {
    id: 'J',
    closure: 'docs/product/EPIS2_TRAMO_J_CLOSURE.md',
    mf: 'MF-TRAMO-J-CLOSURE',
    gateScript: 'validate-tramo-j-closure-gate.mjs',
    npmGate: 'quality:tramo-j-closure-gate',
  },
  {
    id: 'K',
    closure: 'docs/product/EPIS2_TRAMO_K_CLOSURE.md',
    mf: 'MF-TRAMO-K-CLOSURE',
    gateScript: 'validate-tramo-k-closure-gate.mjs',
    npmGate: 'quality:tramo-k-closure-gate',
  },
];

const hygieneDoc = join(root, 'docs/product/EPIS2_TRAMOS_HYGIENE.md');
if (!existsSync(hygieneDoc)) errors.push('falta EPIS2_TRAMOS_HYGIENE.md');

const master = readFileSync(join(root, 'docs/product/EPIS2_TRAMOS_EXECUTION_MASTER.md'), 'utf8');
for (const tramo of TRAMOS) {
  const closurePath = join(root, tramo.closure);
  if (!existsSync(closurePath)) {
    errors.push(`falta ${tramo.closure}`);
    continue;
  }
  const text = readFileSync(closurePath, 'utf8');
  if (!text.includes(tramo.mf)) errors.push(`${tramo.closure} sin ${tramo.mf}`);
  if (!text.includes('Cerrado técnicamente') && !text.includes('UI demo')) {
    errors.push(`${tramo.closure} sin estado de cierre declarado`);
  }
  if (!text.includes('Signoff clínico')) {
    errors.push(`${tramo.closure} sin nota signoff clínico`);
  }
  const base = tramo.closure.split('/').pop();
  if (!master.includes(base.replace('.md', ''))) {
    errors.push(`plan maestro sin referencia a ${base}`);
  }
  const gatePath = join(root, 'scripts/quality', tramo.gateScript);
  if (!existsSync(gatePath)) errors.push(`falta ${tramo.gateScript}`);
}

const pkg = readFileSync(join(root, 'package.json'), 'utf8');
for (const tramo of TRAMOS) {
  if (!pkg.includes(`"${tramo.npmGate}"`)) {
    errors.push(`package.json sin ${tramo.npmGate}`);
  }
}
if (!pkg.includes('"quality:tramos-hygiene-gate"')) {
  errors.push('package.json sin quality:tramos-hygiene-gate');
}

for (const stale of [
  'reports/archive/2026-06/epis2-audit-2026-06-07.md',
  'reports/archive/2026-06/epis2-audit-reconcile-2026-06-07.md',
]) {
  const path = join(root, stale);
  if (existsSync(path)) {
    const text = readFileSync(path, 'utf8');
    if (!text.includes('SUPERSEDED') && !text.includes('supersedido')) {
      errors.push(`${stale} sin banner de superseded — ejecutar higiene docs`);
    }
  }
}

const forbiddenHome = readFileSync(
  join(root, 'docs/product/EPIS2_TRAMOS_EXECUTION_MASTER.md'),
  'utf8',
);
if (forbiddenHome.match(/\bdashboard\b.*\bhome\b/i)) {
  errors.push('plan maestro sugiere dashboard como home');
}

if (errors.length) {
  console.error('tramos-hygiene-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('tramos-hygiene-gate OK — Tramos A–K conciliados (docs · gates · plan maestro)');
