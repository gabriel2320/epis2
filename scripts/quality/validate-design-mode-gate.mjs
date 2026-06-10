#!/usr/bin/env node
/** Modo diseño — flag dev sin impacto clínico en producción. */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const env = readFileSync(join(root, 'apps/web/src/design/designModeEnv.ts'), 'utf8');
const provider = readFileSync(join(root, 'apps/web/src/design/EpisDesignModeProvider.tsx'), 'utf8');
const appProvidersPath = join(root, 'apps/web/src/AppProviders.tsx');
const appProviders = existsSync(appProvidersPath) ? readFileSync(appProvidersPath, 'utf8') : '';
const router = readFileSync(join(root, 'apps/web/src/routes/router.tsx'), 'utf8');
const copy = readFileSync(join(root, 'packages/design-system/src/copy/es.ts'), 'utf8');

if (!env.includes('VITE_ENABLE_DESIGN_MODE')) {
  errors.push('designModeEnv sin flag VITE_ENABLE_DESIGN_MODE');
}

if (!env.includes('return false')) {
  errors.push('Modo diseño debe estar desactivado por defecto');
}

if (!provider.includes('EpisDesignModeOverlay')) {
  errors.push('Falta overlay de modo diseño');
}

const mountsDesignModeProvider =
  appProviders.includes('EpisDesignModeProvider') && router.includes('EpisAppProviders');
if (!mountsDesignModeProvider) {
  errors.push(
    'AppProviders.tsx debe montar EpisDesignModeProvider bajo RouterProvider (EpisAppProviders en router)',
  );
}

if (!copy.includes('designMode:')) {
  errors.push('copy.es sin sección designMode');
}

if (errors.length) {
  console.error('design-mode-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('design-mode-gate OK — modo diseño dev aislado');
