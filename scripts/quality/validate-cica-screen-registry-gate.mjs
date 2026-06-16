#!/usr/bin/env node
/** CICA Clean Room — registry + rutas /app declaradas. */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const registryPath = 'packages/epis2-ui/src/cica/EPIS_CICA_SCREEN_REGISTRY.ts';
const registry = readFileSync(join(root, registryPath), 'utf8');
const router = readFileSync(join(root, 'apps/web/src/routes/router.tsx'), 'utf8');

if (!registry.includes('EPIS_CICA_SCREEN_REGISTRY')) {
  errors.push('registry sin EPIS_CICA_SCREEN_REGISTRY');
}

const requiredRoutes = [
  '/app/buscar',
  '/app/censo',
  '/app/pacientes/:patientId/resumen',
  '/app/pacientes/:patientId/evoluciones',
  '/app/pacientes/:patientId/evoluciones/nueva',
  '/app/pacientes/:patientId/indicaciones',
  '/app/pacientes/:patientId/indicaciones/nueva',
  '/app/pacientes/:patientId/examenes',
  '/app/pacientes/:patientId/documentos',
  '/app/pacientes/:patientId/documentos/nuevo',
  '/app/pacientes/:patientId/papel/dia/:date',
];

for (const route of requiredRoutes) {
  if (!registry.includes(route)) {
    errors.push(`registry falta ruta ${route}`);
  }
  const routerPath = route.replace(/:patientId/g, '$patientId').replace(/:date/g, '$date');
  if (!router.includes(routerPath)) {
    errors.push(`router falta ruta ${routerPath}`);
  }
}

const cicaIndex = readFileSync(join(root, 'packages/epis2-ui/src/cica/index.ts'), 'utf8');
for (const token of [
  'CicaAppShell',
  'CicaScreenFrame',
  'CicaPatientScreenFrame',
  'buildCicaPath',
  'EPIS_CICA_SCREEN_REGISTRY',
  'CICA_CHART_TAB_REGISTRY',
]) {
  if (!cicaIndex.includes(token)) {
    errors.push(`cica/index.ts falta export ${token}`);
  }
}

const hooks = join(root, 'apps/web/src/cica/hooks/useCicaPatientPage.ts');
try {
  readFileSync(hooks, 'utf8');
} catch {
  errors.push('Falta useCicaPatientPage hook');
}

const nav = readFileSync(join(root, 'packages/epis2-ui/src/cica/CicaClinicalNav.tsx'), 'utf8');
if (!nav.includes('buildCicaPath')) {
  errors.push('CicaClinicalNav debe usar buildCicaPath');
}

/** PR6 — legacy /espacio/* debe redirigir a CICA cuando flag ON. */
const pr6LegacyRedirects = [
  { legacyPath: '/espacio/resumen', helper: 'redirectLegacyFormToCicaPatientIfEnabled' },
  { legacyPath: '/espacio/receta', helper: 'redirectLegacyPrescriptionToCicaIfEnabled' },
  { legacyPath: '/espacio/certificado', helper: 'redirectLegacyCertificateToCicaIfEnabled' },
  { legacyPath: '/espacio/resultados', helper: 'redirectLegacyFormToCicaPatientIfEnabled' },
  { legacyPath: '/espacio/evolucion', helper: 'redirectLegacyEvolutionToCicaIfEnabled' },
];

for (const { legacyPath, helper } of pr6LegacyRedirects) {
  const idx = router.indexOf(`path: '${legacyPath}'`);
  if (idx === -1) {
    errors.push(`router falta ruta legacy ${legacyPath}`);
    continue;
  }
  const chunk = router.slice(idx, idx + 500);
  if (!chunk.includes('beforeLoad') || !chunk.includes(helper)) {
    errors.push(`${legacyPath} sin redirect PR6 (${helper})`);
  }
}

const epicrisisIdx = router.indexOf("path: '/espacio/epicrisis'");
if (epicrisisIdx !== -1) {
  const epicrisisChunk = router.slice(epicrisisIdx, epicrisisIdx + 400);
  if (epicrisisChunk.includes('redirectLegacyClinicalFormToCicaIfEnabled')) {
    errors.push('/espacio/epicrisis no debe redirigir a CICA hasta pantalla dedicada');
  }
}

if (errors.length) {
  console.error(
    'cica-screen-registry-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'),
  );
  process.exit(1);
}

console.log('cica-screen-registry-gate OK — registry CICA + rutas /app');
