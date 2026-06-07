#!/usr/bin/env node
/** Auditoría Tramo H — conciliación navigation tree vs IDC IAAS 141–150. */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const tree = readFileSync(join(root, 'apps/web/src/navigation/epis2NavigationTree.ts'), 'utf8');

const qualityMatch = tree.match(/id: 'dashboard-quality'[\s\S]*?idcRefs: \[([^\]]+)\]/);
if (!qualityMatch) {
  errors.push('navigation tree sin dashboard-quality idcRefs');
} else {
  for (const id of [141, 142, 143, 144, 145, 146, 147, 148, 149, 150]) {
    if (!qualityMatch[1].includes(String(id))) {
      errors.push(`dashboard-quality idcRefs sin IDC ${id}`);
    }
  }
}

const plan = readFileSync(join(root, 'docs/product/EPIS2_TRAMO_H_PLAN.md'), 'utf8');
if (!plan.includes('MF-TRAMO-H-CLOSURE')) errors.push('plan Tramo H sin MF-TRAMO-H-CLOSURE');

if (errors.length) {
  console.error('tramo-h-audit-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('tramo-h-audit-gate OK — navigation tree conciliado con IDC IAAS 141–150');
