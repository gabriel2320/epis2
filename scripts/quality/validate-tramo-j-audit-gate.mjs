#!/usr/bin/env node
/** Auditoría Tramo J — conciliación navigation tree vs IDC farmacia 161–170. */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const tree = readFileSync(join(root, 'apps/web/src/navigation/epis2NavigationTree.ts'), 'utf8');

const pharmacyMatch = tree.match(/id: 'dashboard-pharmacy'[\s\S]*?idcRefs: \[([^\]]+)\]/);
if (!pharmacyMatch) {
  errors.push('navigation tree sin dashboard-pharmacy idcRefs');
} else {
  for (const id of [161, 162, 163, 164, 165, 166, 167, 168, 169, 170]) {
    if (!pharmacyMatch[1].includes(String(id))) {
      errors.push(`dashboard-pharmacy idcRefs sin IDC ${id}`);
    }
  }
}

const plan = readFileSync(join(root, 'docs/product/EPIS2_TRAMO_J_PLAN.md'), 'utf8');
if (!plan.includes('MF-TRAMO-J-CLOSURE')) errors.push('plan Tramo J sin MF-TRAMO-J-CLOSURE');

if (errors.length) {
  console.error('tramo-j-audit-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('tramo-j-audit-gate OK — navigation tree conciliado con IDC 161–170');
