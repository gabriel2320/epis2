#!/usr/bin/env node
/** CICA Clean Room — tema (modo/acento), tokens semánticos y transición de pantalla. */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const requiredFiles = [
  'packages/epis2-ui/src/cica/CicaThemeControls.tsx',
  'packages/epis2-ui/src/cica/CicaSidebarThemePanel.tsx',
  'packages/epis2-ui/src/cica/cicaEpis2gVisual.ts',
  'packages/epis2-ui/src/cica/useCicaThemeTokens.ts',
  'packages/epis2-ui/src/cica/CicaScreenTransition.tsx',
  'packages/epis2-ui/src/cica/cicaMotion.ts',
];

for (const rel of requiredFiles) {
  if (!existsSync(join(root, rel))) {
    errors.push(`Falta ${rel}`);
  }
}

const themeControls = readFileSync(
  join(root, 'packages/epis2-ui/src/cica/CicaThemeControls.tsx'),
  'utf8',
);
for (const token of [
  'EpisThemeModeToggle',
  'EpisAppearancePreferencesLink',
  'cica-accent-',
  'QUICK_ACCENTS',
]) {
  if (!themeControls.includes(token)) {
    errors.push(`CicaThemeControls.tsx sin ${token}`);
  }
}

const themeTokens = readFileSync(
  join(root, 'packages/epis2-ui/src/cica/useCicaThemeTokens.ts'),
  'utf8',
);
if (!themeTokens.includes('useCicaThemeTokens')) {
  errors.push('useCicaThemeTokens.ts sin hook exportado');
}
if (!themeTokens.includes('resolveEffectiveThemeMode')) {
  errors.push('useCicaThemeTokens.ts sin resolveEffectiveThemeMode');
}

const transition = readFileSync(
  join(root, 'packages/epis2-ui/src/cica/CicaScreenTransition.tsx'),
  'utf8',
);
if (!transition.includes('cicaFadeInUpSx')) {
  errors.push('CicaScreenTransition.tsx sin cicaFadeInUpSx');
}
if (!transition.includes('shouldAnimate')) {
  errors.push('CicaScreenTransition.tsx sin shouldAnimate');
}

const topBar = readFileSync(join(root, 'packages/epis2-ui/src/cica/CicaTopBar.tsx'), 'utf8');
if (!topBar.includes('data-cica-top-bar')) {
  errors.push('CicaTopBar.tsx debe exponer chrome epis2g (data-cica-top-bar)');
}

const sidebar = readFileSync(join(root, 'packages/epis2-ui/src/cica/CicaSidebar.tsx'), 'utf8');
if (!sidebar.includes('CicaSidebarThemePanel')) {
  errors.push('CicaSidebar.tsx debe integrar CicaSidebarThemePanel');
}
if (!sidebar.includes('cica-dual-sidebar-shell')) {
  errors.push('CicaSidebar.tsx debe usar shell dual epis2g');
}

const appLayout = readFileSync(join(root, 'apps/web/src/cica/CicaAppLayout.tsx'), 'utf8');
if (!appLayout.includes('CicaScreenTransition')) {
  errors.push('CicaAppLayout.tsx sin CicaScreenTransition');
}
if (!appLayout.includes('CicaSidebar')) {
  errors.push('CicaAppLayout.tsx sin CicaSidebar dual');
}

const cicaIndex = readFileSync(join(root, 'packages/epis2-ui/src/cica/index.ts'), 'utf8');
for (const exportToken of [
  'CicaThemeControls',
  'CicaSidebarThemePanel',
  'cicaEpis2gVisual',
  'useCicaThemeTokens',
  'CicaScreenTransition',
]) {
  if (!cicaIndex.includes(exportToken)) {
    errors.push(`packages/epis2-ui/src/cica/index.ts sin export ${exportToken}`);
  }
}

if (errors.length) {
  console.error('cica-theme-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('cica-theme-gate OK — controles tema + tokens + transición CICA');
