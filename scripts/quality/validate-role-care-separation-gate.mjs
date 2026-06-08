#!/usr/bin/env node
/** Roles clínicos y ámbitos asistenciales — separación canónica. */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const matrix = readFileSync(join(root, 'apps/web/src/navigation/clinicalRoleCareMatrix.ts'), 'utf8');
const roles = readFileSync(join(root, 'packages/clinical-domain/src/roles.ts'), 'utf8');
const auth = readFileSync(join(root, 'packages/contracts/src/auth.ts'), 'utf8');
const copy = readFileSync(join(root, 'packages/design-system/src/copy/es.ts'), 'utf8');

for (const role of ['paramedic', 'kinesiologist']) {
  if (!roles.includes(`'${role}'`)) errors.push(`clinical-domain sin rol ${role}`);
  if (!auth.includes(`'${role}'`)) errors.push(`contracts auth sin rol ${role}`);
  if (!copy.includes(`${role}:`)) errors.push(`copy.roles sin ${role}`);
  if (!matrix.includes(`${role}:`)) errors.push(`matriz sin perfil ${role}`);
}

for (const ws of ['inpatient_ward', 'intermediate_care', 'pharmacy_clinical']) {
  if (!matrix.includes(`'${ws}'`)) errors.push(`matriz sin workspace ${ws}`);
}

if (!matrix.includes('EPIS_ACTION_WINDOWS')) {
  errors.push('matriz sin ventanas de acción');
}

if (errors.length) {
  console.error('role-care-separation-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('role-care-separation-gate OK — roles y ámbitos clínicos separados');
