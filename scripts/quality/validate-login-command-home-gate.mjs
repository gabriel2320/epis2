#!/usr/bin/env node
/** MF-THREE-MODES / MF-FF — login abre home clínico (censo-first); /comando es compat redirect. */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];
const loginPage = readFileSync(join(root, 'apps/web/src/pages/LoginPage.tsx'), 'utf8');
const router = readFileSync(join(root, 'apps/web/src/routes/router.tsx'), 'utf8');
const home = readFileSync(join(root, 'apps/web/src/routes/home.ts'), 'utf8');
const guards = readFileSync(join(root, 'apps/web/src/modes/episModeGuards.ts'), 'utf8');

const legacyHome = '/espacio/buscar-paciente';
const cicaHome = '/app/buscar';

if (!home.includes('resolveClinicalHome') || !home.includes('EPIS2_CICA_HOME')) {
  errors.push('home.ts debe resolver home clínico via resolveClinicalHome + EPIS2_CICA_HOME');
}
if (!home.includes(legacyHome)) {
  errors.push(`home.ts debe conservar EPIS2_LEGACY_CLINICAL_HOME (${legacyHome})`);
}
if (!loginPage.includes('EPIS2_CLINICAL_HOME')) {
  errors.push(`LoginPage debe redirigir a EPIS2_CLINICAL_HOME (CICA ${cicaHome} con producto GO)`);
}
if (!router.includes('throw redirect({ to: EPIS2_CLINICAL_HOME })')) {
  errors.push('Router login autenticado → EPIS2_CLINICAL_HOME');
}
if (!router.includes("path: '/comando'")) {
  errors.push('/comando debe existir como ruta compat (redirect)');
}
if (!guards.includes("return 'command'")) {
  errors.push('getDefaultModeAfterLogin debe devolver command');
}

if (errors.length) {
  console.error('login-command-home-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('login-command-home-gate OK');
