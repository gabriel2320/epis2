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

const clinicalHome = '/espacio/buscar-paciente';

if (!home.includes(`EPIS2_CLINICAL_HOME = '${clinicalHome}'`)) {
  errors.push(`home.ts debe definir EPIS2_CLINICAL_HOME = ${clinicalHome}`);
}
if (!loginPage.includes(clinicalHome) && !loginPage.includes('EPIS2_CLINICAL_HOME')) {
  errors.push(`LoginPage debe redirigir a ${clinicalHome} (EPIS2_CLINICAL_HOME)`);
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
