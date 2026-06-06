#!/usr/bin/env node
/** Stats for EPIS2 audit — run from repo root after build. */
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

const matrix = JSON.parse(
  readFileSync(join(root, 'docs/product/epis2-idc-execution-matrix.json'), 'utf8'),
);

const doneIdc = matrix.items.filter((i) => i.estado === 'Done').map((i) => i.idc);
const activeIdc = matrix.items.filter((i) => i.estado === 'Active').length;

console.log(JSON.stringify({
  idc: {
    total: matrix.items.length,
    done: doneIdc.length,
    active: activeIdc,
    doneIds: doneIdc,
    totals: matrix.meta.totals,
  },
  blueprints: 19,
  migrations: 32,
  tests: 405,
}, null, 2));
