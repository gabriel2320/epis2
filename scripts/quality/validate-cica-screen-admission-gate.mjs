#!/usr/bin/env node
/** CICA — checklist admisión pantalla + canon documentado. */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const cicaPath = join(root, 'docs/design/EPIS2_CICA.md');
const cicaSgPath = join(root, 'docs/design/EPIS2_CICA_SCREEN_GOVERNOR.md');
const cicaSgTemplate = join(root, 'reports/cica-sg/_TEMPLATE.md');
let cica = '';
try {
  cica = readFileSync(cicaPath, 'utf8');
} catch {
  errors.push('Falta docs/design/EPIS2_CICA.md');
}

try {
  readFileSync(cicaSgPath, 'utf8');
} catch {
  errors.push('Falta docs/design/EPIS2_CICA_SCREEN_GOVERNOR.md (CICA-SG)');
}

try {
  readFileSync(cicaSgTemplate, 'utf8');
} catch {
  errors.push('Falta reports/cica-sg/_TEMPLATE.md (Screen Need Request)');
}

if (cica) {
  for (const token of [
    'Intención clínica progresiva',
    'Las 7 leyes',
    'Checklist',
    'auditCicaScreen',
    'Barra de comando transversal',
  ]) {
    if (!cica.includes(token)) {
      errors.push(`EPIS2_CICA.md sin sección: ${token}`);
    }
  }
}

const intent = readFileSync(join(root, 'apps/web/src/clinical/clinicalIntent.ts'), 'utf8');
if (!intent.includes('CICA_SCREEN_ADMISSION_CHECKLIST')) {
  errors.push('clinicalIntent.ts sin CICA_SCREEN_ADMISSION_CHECKLIST');
}

const engine = readFileSync(
  join(root, 'packages/epis2-ui/src/layout/clinical/clinicalLayoutEngine.ts'),
  'utf8',
);
if (!engine.includes('auditCicaScreen')) {
  errors.push('clinicalLayoutEngine sin auditCicaScreen');
}

if (errors.length) {
  console.error(
    'cica-screen-admission-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'),
  );
  process.exit(1);
}

console.log('cica-screen-admission-gate OK — CICA canon + checklist');
