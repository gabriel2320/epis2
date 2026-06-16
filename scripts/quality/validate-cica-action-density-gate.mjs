#!/usr/bin/env node
/** CICA Clean Room — densidad de acciones en pantallas /app. */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const cicaDir = join(root, 'apps/web/src/cica');
const errors = [];

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (p.endsWith('Page.tsx')) {
      const src = readFileSync(p, 'utf8');
      const contained = (src.match(/variant="contained"/g) ?? []).length;
      const filled = (src.match(/appearance="filled"/g) ?? []).length;
      const primary = contained + filled;
      if (primary > 1) {
        errors.push(`${p.replace(root + '/', '')} tiene ${primary} botones primarios (máx 1)`);
      }
      const outlined = (src.match(/variant="outlined"/g) ?? []).length;
      const tonal = (src.match(/appearance="tonal"/g) ?? []).length;
      const textBtn = (src.match(/appearance="text"/g) ?? []).length;
      const visibleActions = primary + outlined + Math.min(tonal, 2);
      if (visibleActions > 4 && !p.includes('Paper')) {
        errors.push(`${p.replace(root + '/', '')} posible exceso de acciones visibles (${visibleActions})`);
      }
    }
  }
}

walk(cicaDir);

const search = readFileSync(join(cicaDir, 'CicaPatientSearchPage.tsx'), 'utf8');
if (!search.includes('cica-patient-search-input')) {
  errors.push('CicaPatientSearchPage sin input único de búsqueda');
}
if ((search.match(/variant="contained"/g) ?? []).length !== 1) {
  errors.push('CicaPatientSearchPage debe tener exactamente 1 botón primario Buscar');
}

if (errors.length) {
  console.error(
    'cica-action-density-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'),
  );
  process.exit(1);
}

console.log('cica-action-density-gate OK — densidad acciones CICA');
