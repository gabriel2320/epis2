#!/usr/bin/env node
/** Auditoría Tramo G — conciliación navigation tree vs IDC UCI especializada. */
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
  for (const id of [131, 132, 133, 134, 135, 136, 137, 138, 139, 140]) {
    if (!icuMatch[1].includes(String(id))) {
      errors.push(`dashboard-icu idcRefs sin IDC ${id}`);
    }
  }
}

const plan = readFileSync(join(root, 'docs/product/EPIS2_TRAMO_G_PLAN.md'), 'utf8');
if (!plan.includes('MF-TRAMO-G-CLOSURE')) errors.push('plan Tramo G sin MF-TRAMO-G-CLOSURE');

if (errors.length) {
  console.error('tramo-g-audit-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('tramo-g-audit-gate OK — navigation tree conciliado con IDC UCI 131–140');
