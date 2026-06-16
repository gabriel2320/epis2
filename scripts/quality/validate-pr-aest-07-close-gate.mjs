#!/usr/bin/env node
/** PR-AEST-07 — cierre loop CICA-L L-02…L-11 + reporte + ledgers. */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const CICA_L_LEDGERS = [
  '02-ficha-resumen.md',
  '03-evoluciones.md',
  '04-nueva-evolucion.md',
  '05-indicaciones.md',
  '06-examenes.md',
  '07-medicamentos.md',
  '08-documentos.md',
  '09-alta.md',
  '10-modo-papel.md',
  '11-auditoria.md',
];

const closeReport = join(root, 'reports/epis2-pr-aest-07-cica-l-close.md');
if (!existsSync(closeReport)) {
  errors.push('Falta reports/epis2-pr-aest-07-cica-l-close.md');
}

const loopClose = join(root, 'reports/cica-l/cica-l-loop-close.json');
if (!existsSync(loopClose)) {
  errors.push('Falta reports/cica-l/cica-l-loop-close.json');
} else {
  const meta = JSON.parse(readFileSync(loopClose, 'utf8'));
  if (meta.loopStatus !== 'closed') {
    errors.push('cica-l-loop-close.json debe declarar loopStatus=closed');
  }
  if (meta.prId !== 'PR-AEST-07') {
    errors.push('cica-l-loop-close.json debe declarar prId=PR-AEST-07');
  }
}

const screenshots = join(root, 'reports/cica-l/SCREENSHOTS.md');
if (!existsSync(screenshots)) {
  errors.push('Falta reports/cica-l/SCREENSHOTS.md (manifest capturas)');
}

for (const file of CICA_L_LEDGERS) {
  const path = join(root, 'reports/cica-l', file);
  if (!existsSync(path)) {
    errors.push(`Falta ledger reports/cica-l/${file}`);
    continue;
  }
  const ledger = readFileSync(path, 'utf8');
  for (const section of ['## Fase A — Inventario', '## Fase C — Wireframe', '## Fase F — CICA Screen Score']) {
    if (!ledger.includes(section)) {
      errors.push(`${file} sin ${section}`);
    }
  }
  if (!ledger.includes('aprobado')) {
    errors.push(`${file} sin wireframe aprobado (Fase C)`);
  }
  if (!/\*\*Score:\*\* 9[0-9]/.test(ledger) || !/\*\*Veredicto:\*\* GO/.test(ledger)) {
    errors.push(`${file} sin score ≥90 / veredicto GO en Fase F`);
  }
}

const cicaL = join(root, 'docs/design/EPIS2_CICA_L.md');
if (existsSync(cicaL)) {
  const doc = readFileSync(cicaL, 'utf8');
  if (!doc.includes('PR-AEST-07')) {
    errors.push('EPIS2_CICA_L.md sin referencia PR-AEST-07');
  }
  if (
    !doc.includes('Loop clásico **completo**') &&
    !doc.includes('loop clásico **completo**') &&
    !doc.includes('Loop clásico L-02') &&
    !doc.includes('cerrado')
  ) {
    errors.push('EPIS2_CICA_L.md debe marcar loop clásico completo/cerrado');
  }
}

const e2e = join(root, 'e2e/aesthetic-classic-mode.spec.ts');
if (existsSync(e2e)) {
  const src = readFileSync(e2e, 'utf8');
  if (!src.includes('epis2-paper-standalone-page')) {
    errors.push('E2E sin journey CICA-L-10 modo papel');
  }
}

if (errors.length) {
  console.error('pr-aest-07-close-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('pr-aest-07-close-gate OK — CICA-L L-02…L-11 + PR-AEST-07 artefactos');
