#!/usr/bin/env node
/** MF-CICA-PR6-01 — mapa PR6 documentado + spec E2E dedicado. */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const spec = join(root, 'e2e/cica-pr6-legacy-redirects.spec.ts');
const closeReport = join(root, 'reports/epis2-mf-cica-pr6-redirects-close.md');
const redirectMap = join(root, 'apps/web/src/routes/cicaLegacyRedirects.ts');
const webPkg = join(root, 'apps/web/package.json');

const PR6_LEGACY_PATHS = [
  '/espacio/buscar-paciente',
  '/espacio/ficha',
  '/espacio/resumen',
  '/espacio/evolucion',
  '/espacio/receta',
  '/espacio/certificado',
  '/espacio/resultados',
  '/espacio/laboratorio',
  '/espacio/imagenologia',
  '/espacio/interconsulta',
  '/espacio/procedimiento',
  '/espacio/enfermeria',
  '/espacio/alergia',
  '/espacio/problema',
  '/espacio/ingreso',
  '/espacio/ambulatorio',
  '/espacio/farmacia',
  '/espacio/mar',
  '/espacio/conciliacion',
  '/espacio/traslado',
  '/espacio/informe-interconsulta',
  '/espacio/epicrisis',
];

if (!existsSync(spec)) errors.push('falta e2e/cica-pr6-legacy-redirects.spec.ts');
if (!existsSync(closeReport)) errors.push('falta reports/epis2-mf-cica-pr6-redirects-close.md');
if (!existsSync(redirectMap)) errors.push('falta apps/web/src/routes/cicaLegacyRedirects.ts');

const pkg = JSON.parse(readFileSync(webPkg, 'utf8'));
if (!pkg.scripts?.['test:e2e:cica-pr6-redirects']) {
  errors.push('apps/web sin script test:e2e:cica-pr6-redirects');
}

const mapSrc = readFileSync(redirectMap, 'utf8');
if (!mapSrc.includes('@legacy-runtime')) {
  errors.push('cicaLegacyRedirects.ts sin tag @legacy-runtime');
}

if (existsSync(spec)) {
  const specSrc = readFileSync(spec, 'utf8');
  for (const path of PR6_LEGACY_PATHS) {
    if (!specSrc.includes(path)) {
      errors.push(`spec PR6 sin cobertura de ${path}`);
    }
  }
}

if (errors.length) {
  console.error('cica-pr6-redirects-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('cica-pr6-redirects-gate OK — mapa PR6 + spec E2E');
