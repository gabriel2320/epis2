#!/usr/bin/env node
/** MF-PURGE-05 — perímetro legacy `/espacio/*` explícito en web. */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

function mustInclude(path, token, msg) {
  const full = join(root, path);
  if (!existsSync(full)) {
    errors.push(`falta ${path}`);
    return;
  }
  const src = readFileSync(full, 'utf8');
  if (!src.includes(token)) {
    errors.push(`${path}: ${msg}`);
  }
}

mustInclude(
  'apps/web/src/layouts/ClinicalShellLayout.tsx',
  '@legacy-runtime',
  'ClinicalShellLayout debe estar etiquetado @legacy-runtime',
);
mustInclude(
  'apps/web/src/pages/PatientWorkspacePage.tsx',
  '@legacy-runtime',
  'PatientWorkspacePage debe estar etiquetado @legacy-runtime',
);
mustInclude(
  'apps/web/src/routes/home.ts',
  '@legacy-runtime',
  'home.ts debe etiquetar EPIS2_LEGACY_CLINICAL_HOME',
);
mustInclude(
  'apps/web/src/routes/router.tsx',
  '@legacy-runtime',
  'router debe marcar clinicalLayoutRoute legacy',
);
mustInclude(
  'apps/web/src/routes/cicaLegacyRedirects.ts',
  '@legacy-runtime',
  'cicaLegacyRedirects.ts debe existir con tag @legacy-runtime',
);
mustInclude(
  'apps/web/src/routes/cicaLegacyRedirects.ts',
  'redirectLegacyPatientSearchToCicaIfEnabled',
  'helpers PR6 extraídos',
);
mustInclude(
  'apps/web/src/routes/router.tsx',
  './cicaLegacyRedirects.js',
  'router debe importar cicaLegacyRedirects',
);

const closeReport = join(root, 'reports/epis2-mf-purge-05-close.md');
if (!existsSync(closeReport)) {
  errors.push('falta reports/epis2-mf-purge-05-close.md');
}

if (errors.length) {
  console.error('purge-05-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('purge-05-gate OK — @legacy-runtime en /espacio/* + cicaLegacyRedirects');
