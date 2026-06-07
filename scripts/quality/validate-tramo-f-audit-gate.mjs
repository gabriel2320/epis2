#!/usr/bin/env node
/** Auditoría Tramo F — conciliación navigation tree vs IDC APS activos. */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const tree = readFileSync(join(root, 'apps/web/src/navigation/epis2NavigationTree.ts'), 'utf8');

const apsMatch = tree.match(/id: 'dashboard-aps'[\s\S]*?idcRefs: \[([^\]]+)\]/);
if (!apsMatch) {
  errors.push('navigation tree sin dashboard-aps idcRefs');
} else {
  for (const id of [121, 122, 123, 124, 125, 126, 127, 128, 129, 130]) {
    if (!apsMatch[1].includes(String(id))) {
      errors.push(`dashboard-aps idcRefs sin IDC ${id}`);
    }
  }
}

const plan = readFileSync(join(root, 'docs/product/EPIS2_TRAMO_F_PLAN.md'), 'utf8');
if (!plan.includes('MF-TRAMO-F-CLOSURE')) errors.push('plan Tramo F sin MF-TRAMO-F-CLOSURE');

if (errors.length) {
  console.error('tramo-f-audit-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('tramo-f-audit-gate OK — navigation tree conciliado con IDC APS 121–130');
