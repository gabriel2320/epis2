#!/usr/bin/env node
/** MF-CLASSIC-MD3-AI — barra Google-like en /comando + acceso modo clásico. */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];
const comando = readFileSync(join(root, 'apps/web/src/pages/CommandCenterPage.tsx'), 'utf8');
const googleBar = join(
  root,
  'apps/web/src/components/command-center/EpisCommandCenterGoogleBar.tsx',
);
const classicAccess = join(
  root,
  'apps/web/src/components/command-center/CommandCenterClassicAccess.tsx',
);

if (!existsSync(googleBar)) errors.push('Falta EpisCommandCenterGoogleBar.tsx');
if (!existsSync(classicAccess)) errors.push('Falta CommandCenterClassicAccess.tsx');
if (!comando.includes('EpisCommandCenterGoogleBar')) {
  errors.push('CommandCenterPage debe usar EpisCommandCenterGoogleBar');
}
const barSrc = existsSync(googleBar) ? readFileSync(googleBar, 'utf8') : '';
if (!barSrc.includes('CommandCenterClassicAccess')) {
  errors.push('/comando debe exponer acceso modo clásico');
}
if (comando.includes('EpisBentoGrid') || comando.includes('DashboardModeContent')) {
  errors.push('/comando no debe embeber dashboard');
}
if (barSrc.includes('Firmar') || barSrc.includes('Aprobar')) {
  errors.push('Google bar no debe contener firmar/aprobar');
}
if (errors.length) {
  console.error(
    'command-center-googlebar-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'),
  );
  process.exit(1);
}
console.log('command-center-googlebar-gate OK');
