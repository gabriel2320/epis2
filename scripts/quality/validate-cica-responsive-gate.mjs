#!/usr/bin/env node
/** CICA Clean Room — grilla responsiva 8px + shell sin overflow horizontal. */
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const cicaResponsivePath = join(root, 'packages/epis2-ui/src/cica/cicaResponsive.ts');
if (!existsSync(cicaResponsivePath)) {
  errors.push('Falta packages/epis2-ui/src/cica/cicaResponsive.ts');
} else {
  const responsive = readFileSync(cicaResponsivePath, 'utf8');
  if (!responsive.includes('cicaResponsiveGrid')) {
    errors.push('cicaResponsive.ts sin cicaResponsiveGrid');
  }
  if (!responsive.includes('cicaFormGrid')) {
    errors.push('cicaResponsive.ts sin cicaFormGrid');
  }
}

const gridPath = join(root, 'packages/epis2-ui/src/cica/CicaResponsiveGrid.tsx');
if (!existsSync(gridPath)) {
  errors.push('Falta packages/epis2-ui/src/cica/CicaResponsiveGrid.tsx');
}

const formGridPath = join(root, 'packages/epis2-ui/src/cica/CicaFormGrid.tsx');
if (!existsSync(formGridPath)) {
  errors.push('Falta packages/epis2-ui/src/cica/CicaFormGrid.tsx');
}

const tokensPath = join(root, 'packages/epis2-ui/src/cica/cicaTokens.ts');
const tokens = readFileSync(tokensPath, 'utf8');
if (!tokens.includes('quality:cica-responsive-gate')) {
  errors.push('cicaTokens.ts sin comentario gate alineación 8px (quality:cica-responsive-gate)');
}

const shellPath = join(root, 'packages/epis2-ui/src/cica/CicaAppShell.tsx');
const shell = readFileSync(shellPath, 'utf8');
if (!shell.includes("'100dvh'") && !shell.includes('"100dvh"')) {
  errors.push('CicaAppShell debe usar height: 100dvh');
}
if (/overflowX\s*:\s*['"]?(auto|scroll|visible)/.test(shell)) {
  errors.push('CicaAppShell no debe declarar overflow-x auto/scroll/visible');
}

const cicaIndex = readFileSync(join(root, 'packages/epis2-ui/src/cica/index.ts'), 'utf8');
for (const exportToken of ['CicaResponsiveGrid', 'CicaFormGrid', 'cicaResponsiveGrid']) {
  if (!cicaIndex.includes(exportToken)) {
    errors.push(`packages/epis2-ui/src/cica/index.ts sin export ${exportToken}`);
  }
}

if (errors.length) {
  console.error('cica-responsive-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('cica-responsive-gate OK — grilla 8px + shell responsivo');
