#!/usr/bin/env node
/** Auditoría Tramo K — conciliación navigation tree vs IDC calidad 171–180. */
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
  for (const id of [171, 172, 173, 174, 175, 176, 177, 178, 179, 180]) {
    if (!qualityMatch[1].includes(String(id))) {
      errors.push(`dashboard-quality idcRefs sin IDC ${id}`);
    }
  }
}

const plan = readFileSync(join(root, 'docs/product/EPIS2_TRAMO_K_PLAN.md'), 'utf8');
if (!plan.includes('MF-TRAMO-K-CLOSURE')) errors.push('plan Tramo K sin MF-TRAMO-K-CLOSURE');

if (errors.length) {
  console.error('tramo-k-audit-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('tramo-k-audit-gate OK — navigation tree conciliado con IDC 171–180');
