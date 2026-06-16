#!/usr/bin/env node
/** PROG-AGENT-TRUTH AT-05 — AGENTS v2 + tablero banner + archive histórico. */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const agentsPath = join(root, 'AGENTS.md');
const tableroPath = join(root, 'docs/product/EPIS2_TABLERO.md');
const archivePath = join(root, 'docs/archive/agent-playbooks/AGENTS_v1_historical.md');

const FORBIDDEN_IN_AGENTS = [
  'quality:week2-gate',
  'quality:week3-gate',
  'quality:week4-gate',
  'quality:three-modes-gate',
  'quality:microphase-next',
  'EPIS2_THREE_MODES_DEV_PLAN',
  'quality:tramo-k-inventory-gate',
  'EPIS2_WAVE_EXECUTION_CANON',
];

if (!existsSync(agentsPath)) {
  errors.push('Falta AGENTS.md');
} else {
  const agents = readFileSync(agentsPath, 'utf8');
  const lineCount = agents.split('\n').length;
  if (lineCount > 80) {
    errors.push(`AGENTS.md tiene ${lineCount} líneas (máx 80)`);
  }
  for (const needle of FORBIDDEN_IN_AGENTS) {
    if (agents.includes(needle)) {
      errors.push(`AGENTS.md menciona campaña histórica: ${needle}`);
    }
  }
  if (!/v2/i.test(agents)) {
    errors.push('AGENTS.md debe indicar versión v2');
  }
  if (!agents.includes('EPIS2_CURRENT_STATE.md')) {
    errors.push('AGENTS.md debe referenciar brújula EPIS2_CURRENT_STATE.md');
  }
  if (!agents.includes('docs/archive/agent-playbooks')) {
    errors.push('AGENTS.md debe referenciar docs/archive/agent-playbooks');
  }
  if (!agents.includes('PROG-UX-LAB')) {
    errors.push('AGENTS.md debe declarar programa activo PROG-UX-LAB');
  }
}

if (!existsSync(tableroPath)) {
  errors.push('Falta docs/product/EPIS2_TABLERO.md');
} else {
  const tablero = readFileSync(tableroPath, 'utf8');
  if (!tablero.includes('NO USAR PARA PLANIFICAR')) {
    errors.push('EPIS2_TABLERO.md falta banner NO USAR PARA PLANIFICAR');
  }
}

if (!existsSync(archivePath)) {
  errors.push('Falta docs/archive/agent-playbooks/AGENTS_v1_historical.md');
}

if (errors.length) {
  console.error('agent-truth-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('agent-truth-gate OK — AGENTS v2 + tablero banner + archive histórico');
