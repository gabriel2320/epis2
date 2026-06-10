#!/usr/bin/env node
/** MF-CLINICAL-PRODUCTIVITY — grillas vía wrapper ClinicalDataGrid. */
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const wrapper = join(root, 'packages/clinical-productivity/src/components/ClinicalDataGrid.tsx');
if (!existsSync(wrapper)) errors.push('Falta ClinicalDataGrid wrapper');

const wrapperSrc = readFileSync(wrapper, 'utf8');
if (!wrapperSrc.includes('EpisDataGrid')) {
  errors.push('ClinicalDataGrid debe delegar en EpisDataGrid');
}

const patientGrid = join(root, 'apps/web/src/components/PatientListGrid.tsx');
if (!existsSync(patientGrid)) errors.push('Falta PatientListGrid.tsx piloto');
else {
  const src = readFileSync(patientGrid, 'utf8');
  if (!src.includes('@epis2/clinical-productivity')) {
    errors.push(
      'PatientListGrid debe importar ClinicalDataGrid desde @epis2/clinical-productivity',
    );
  }
  if (src.includes('@mui/x-data-grid')) {
    errors.push('PatientListGrid no debe importar MUI X Data Grid directamente');
  }
}

if (errors.length) {
  console.error('clinical-grid-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('clinical-grid-gate OK — grillas clínicas compactas');
