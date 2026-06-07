#!/usr/bin/env node
/** Semana 2 — Canon scaffold 1 IDC = 1 panel = 1 testid = 1 MF. */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const canon = join(root, 'docs/product/EPIS2_TRAMO_SCAFFOLD_CANON.md');
if (!existsSync(canon)) errors.push('falta EPIS2_TRAMO_SCAFFOLD_CANON.md');

const rule = join(root, '.cursor/rules/80-tramo-scaffold.mdc');
if (!existsSync(rule)) errors.push('falta .cursor/rules/80-tramo-scaffold.mdc');

const text = existsSync(canon) ? readFileSync(canon, 'utf8') : '';
if (!text.includes('1 IDC = 1 panel UI = 1 data-testid = 1 MF-TRAMO-X-00N')) {
  errors.push('canon sin fórmula IDC/panel/testid/MF');
}
if (!text.includes('epis2-pharmacy-idc-161')) {
  errors.push('canon sin ejemplo Tramo J');
}

if (errors.length) {
  console.error('tramo-scaffold-canon-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('tramo-scaffold-canon-gate OK — fórmula scaffold tramos documentada');
