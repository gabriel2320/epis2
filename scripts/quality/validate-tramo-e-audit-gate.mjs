#!/usr/bin/env node
/** Auditoría Tramo E — conciliación navigation tree vs IDC activos. */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const tree = readFileSync(join(root, 'apps/web/src/navigation/epis2NavigationTree.ts'), 'utf8');

const icuMatch = tree.match(/id: 'dashboard-icu'[\s\S]*?idcRefs: \[([^\]]+)\]/);
if (!icuMatch) {
  errors.push('navigation tree sin dashboard-icu idcRefs');
} else {
  for (const id of [46, 47, 48, 49]) {
    if (!icuMatch[1].includes(String(id))) {
      errors.push(`dashboard-icu idcRefs sin IDC ${id} (Tramo D-009..012)`);
    }
  }
}

const orMatch = tree.match(/id: 'dashboard-or'[\s\S]*?idcRefs: \[([^\]]+)\]/);
if (!orMatch) {
  errors.push('navigation tree sin dashboard-or idcRefs');
} else {
  for (const id of [151, 152, 153]) {
    if (!orMatch[1].includes(String(id))) {
      errors.push(`dashboard-or idcRefs sin IDC ${id}`);
    }
  }
}

const plan = readFileSync(join(root, 'docs/product/EPIS2_TRAMO_E_PLAN.md'), 'utf8');
if (!plan.includes('MF-TRAMO-E-003')) errors.push('plan Tramo E sin MF-TRAMO-E-003');

if (errors.length) {
  console.error('tramo-e-audit-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('tramo-e-audit-gate OK — navigation tree conciliado con IDC activos');
