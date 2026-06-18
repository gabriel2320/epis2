#!/usr/bin/env node
/** MF-CATALOG-01 — bloque mínimo EPIS2_PRODUCT_CATALOG.md verificado. */
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const catalogPath = join(root, 'docs/product/EPIS2_PRODUCT_CATALOG.md');
const routeMapPath = join(root, 'tools/catalog/route-map.generated.json');
const errors = [];

const REQUIRED_OBJECTS = [
  'PATIENT_SEARCH',
  'CENSUS',
  'PATIENT_CHART',
  'EVOLUTION_NOTE',
  'PRESCRIPTION',
  'EPICRISIS',
  'EXAMS',
  'PAPER_MODE',
  'AI_ASSIST',
  'DRAFT_APPROVAL',
];

const md = readFileSync(catalogPath, 'utf8');
const begin = '<!-- EPIS2_PRODUCT_OBJECTS:BEGIN -->';
const end = '<!-- EPIS2_PRODUCT_OBJECTS:END -->';
const i0 = md.indexOf(begin);
const i1 = md.indexOf(end);
if (i0 < 0 || i1 < 0 || i1 <= i0) {
  errors.push('falta bloque EPIS2_PRODUCT_OBJECTS BEGIN/END');
} else {
  const block = md.slice(i0 + begin.length, i1);
  for (const id of REQUIRED_OBJECTS) {
    if (!block.includes(`| ${id} |`)) {
      errors.push(`falta objectId ${id} en bloque PRODUCT_OBJECTS`);
    }
  }
  if (!block.includes('draft-assist') || !block.includes('humanoAprueba')) {
    errors.push('bloque debe documentar IA draft-assist y humanoAprueba');
  }
  const draftRows = block.split('\n').filter((l) => l.includes('draft-assist') && l.startsWith('|'));
  for (const row of draftRows) {
    if (!/draft-assist[^|]*\|[^|]*s[ií]/i.test(row)) {
      errors.push(`fila con draft-assist debe declarar humanoAprueba=sí: ${row.slice(0, 80)}…`);
    }
  }
}

const routeMap = JSON.parse(readFileSync(routeMapPath, 'utf8'));
const routes = new Set(routeMap.screens.map((s) => s.route));

for (const [objectId, route, screenId] of [
  ['PATIENT_SEARCH', '/app/buscar', 'patient-search'],
  ['CENSUS', '/app/censo', 'census'],
  ['EVOLUTION_NOTE', '/app/pacientes/:patientId/evoluciones/nueva', 'new-evolution'],
  ['PRESCRIPTION', '/app/pacientes/:patientId/indicaciones/nueva', 'new-prescription'],
  ['EPICRISIS', '/app/pacientes/:patientId/epicrisis/nueva', 'new-epicrisis'],
]) {
  if (!routes.has(route)) errors.push(`${objectId}: ruta ${route} ausente en route-map`);
  const screen = routeMap.screens.find((s) => s.screenId === screenId);
  if (!screen || screen.route !== route) {
    errors.push(`${objectId}: screenId ${screenId} no coincide con route-map`);
  }
}

const blueprintDir = join(root, 'packages/clinical-forms/src/blueprints');
const blueprintSources = readdirSync(blueprintDir)
  .filter((f) => f.endsWith('.ts') && !f.endsWith('.test.ts'))
  .map((f) => readFileSync(join(blueprintDir, f), 'utf8'))
  .join('\n');
for (const bp of [
  'evolution_note',
  'prescription',
  'discharge_summary',
  'patient_search',
  'patient_summary',
  'medical_certificate',
  'lab_request',
]) {
  if (!blueprintSources.includes(`blueprintId: '${bp}'`)) {
    errors.push(`blueprint ${bp} no encontrado en clinical-forms/blueprints`);
  }
}

if (errors.length) {
  console.error('product-catalog-minimum-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log(`product-catalog-minimum-gate OK — objects=${REQUIRED_OBJECTS.length}+`);
