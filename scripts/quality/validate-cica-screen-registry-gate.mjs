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

for (const deferredId of ['recent-patients', 'my-work', 'agenda']) {
  const block = registry.split(`id: '${deferredId}'`)[1]?.slice(0, 280) ?? '';
  if (!block.includes('navVisible: false')) {
    errors.push(`registry ${deferredId} debe declarar navVisible: false (MF-PONY-02)`);
  }
}

const cicaIndex = readFileSync(join(root, 'packages/epis2-ui/src/cica/index.ts'), 'utf8');
if (!cicaIndex.includes('CLINICAL_CHART_TAB_REGISTRY')) {
  errors.push('cica/index.ts debe exportar CLINICAL_CHART_TAB_REGISTRY (MF-PONY-07)');
}
const sidebarNav = readFileSync(join(root, 'packages/epis2-ui/src/cica/cicaSidebarNav.ts'), 'utf8');
if (!sidebarNav.includes('navVisible !== false')) {
  errors.push('cicaSidebarNav debe filtrar pantallas con navVisible: false');
}
if (!sidebarNav.includes('CICA_PATIENT_PRIMARY_NAV')) {
  errors.push('cicaSidebarNav debe consumir CICA_PATIENT_PRIMARY_NAV (MF-PONY-07)');
}
if (!cicaIndex.includes('resolveTrivialCicaBlueprintFromRegistry')) {
  errors.push('cica/index.ts debe exportar resolveTrivialCicaBlueprintFromRegistry');
}
for (const screenId of [
  'patient-summary',
  'patient-orders',
  'patient-exams',
  'patient-documents',
  'patient-evolutions',
  'patient-timeline',
  'patient-medications',
  'patient-audit',
  'patient-discharge',
  'patient-interconsultas',
  'patient-procedures',
]) {
  const block = registry.split(`id: '${screenId}'`)[1]?.slice(0, 320) ?? '';
  if (!block.includes('blueprintSectionId:')) {
    errors.push(`registry ${screenId} debe declarar blueprintSectionId (MF-PONY-04)`);
  }
}
const patientBlueprints = readFileSync(
  join(root, 'apps/web/src/cica/blueprints/patientScreens.blueprint.ts'),
  'utf8',
);
if (!patientBlueprints.includes('withRegistryLayout')) {
  errors.push('patientScreens.blueprint.ts debe usar withRegistryLayout');
}

const buildRoutes = readFileSync(join(root, 'apps/web/src/cica/buildCicaRoutesFromRegistry.ts'), 'utf8');
if (!buildRoutes.includes('CICA_REGISTRY_ROUTE_WIRING')) {
  errors.push('buildCicaRoutesFromRegistry debe declarar CICA_REGISTRY_ROUTE_WIRING');
}
if (!buildRoutes.includes('EPIS_CICA_SCREEN_REGISTRY')) {
  errors.push('buildCicaRoutesFromRegistry debe referenciar EPIS_CICA_SCREEN_REGISTRY');
}
if (!router.includes('buildCicaRoutesFromRegistry')) {
  errors.push('router.tsx debe generar rutas CICA desde registry (MF-PONY-06)');
}
if (!cicaIndex.includes('registryRouteToTanstackPath')) {
  errors.push('cica/index.ts debe exportar registryRouteToTanstackPath');
}

const requiredRoutes = [
  '/app/buscar',
  '/app/censo',
  '/app/recientes',
  '/app/mi-trabajo',
  '/app/agenda',
  '/app/pacientes/:patientId/resumen',
  '/app/pacientes/:patientId/evoluciones',
  '/app/pacientes/:patientId/evoluciones/nueva',
  '/app/pacientes/:patientId/evoluciones/libro',
  '/app/pacientes/:patientId/evoluciones/:evolutionId',
  '/app/pacientes/:patientId/ingreso',
  '/app/pacientes/:patientId/indicaciones',
  '/app/pacientes/:patientId/indicaciones/nueva',
  '/app/pacientes/:patientId/examenes',
  '/app/pacientes/:patientId/medicamentos',
  '/app/pacientes/:patientId/interconsultas',
  '/app/pacientes/:patientId/procedimientos',
  '/app/pacientes/:patientId/alta',
  '/app/pacientes/:patientId/timeline',
  '/app/pacientes/:patientId/auditoria',
  '/app/pacientes/:patientId/papel/libro',
  '/app/pacientes/:patientId/documentos',
  '/app/pacientes/:patientId/documentos/nuevo',
  '/app/pacientes/:patientId/epicrisis/nueva',
  '/app/pacientes/:patientId/papel/dia/:date',
];

for (const route of requiredRoutes) {
  if (!registry.includes(route)) {
    errors.push(`registry falta ruta ${route}`);
  }
  const tanstackPath = route
    .replace(/:patientId/g, '$patientId')
    .replace(/:date/g, '$date')
    .replace(/:evolutionId/g, '$evolutionId');
  if (!buildRoutes.includes(tanstackPath)) {
    errors.push(`buildCicaRoutesFromRegistry falta ruta ${tanstackPath}`);
  }
}

for (const token of [
  'CicaAppShell',
  'CicaSidebar',
  'CicaScreenFrame',
  'CicaPatientScreenFrame',
  'buildCicaPath',
  'EPIS_CICA_SCREEN_REGISTRY',
  'CLINICAL_CHART_TAB_REGISTRY',
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
  console.error('cica-screen-registry-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('cica-screen-registry-gate OK — registry CICA + rutas /app');
