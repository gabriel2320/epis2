#!/usr/bin/env node
/** Auditoría Tramo I — conciliación navigation tree vs IDC especialidades 181–190. */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const tree = readFileSync(join(root, 'apps/web/src/navigation/epis2NavigationTree.ts'), 'utf8');

const specialtyMatch = tree.match(/id: 'dashboard-specialty'[\s\S]*?idcRefs: \[([^\]]+)\]/);
if (!specialtyMatch) {
  errors.push('navigation tree sin dashboard-specialty idcRefs');
} else {
  for (const id of [181, 182, 183, 184, 185, 186, 187, 188, 189, 190]) {
    if (!specialtyMatch[1].includes(String(id))) {
      errors.push(`dashboard-specialty idcRefs sin IDC ${id}`);
    }
  }
}

const plan = readFileSync(join(root, 'docs/product/EPIS2_TRAMO_I_PLAN.md'), 'utf8');
if (!plan.includes('MF-TRAMO-I-CLOSURE')) errors.push('plan Tramo I sin MF-TRAMO-I-CLOSURE');

if (errors.length) {
  console.error('tramo-i-audit-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('tramo-i-audit-gate OK — navigation tree conciliado con IDC 181–190');
