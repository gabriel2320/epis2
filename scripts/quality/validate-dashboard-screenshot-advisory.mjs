#!/usr/bin/env node
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const dir = join(root, 'reports/screenshots/dashboard-md3');
if (!existsSync(dir)) {
  console.error('dashboard-screenshot-advisory FAILED: falta reports/screenshots/dashboard-md3/');
  process.exit(1);
}
console.log('dashboard-screenshot-advisory OK — advisory (captura manual o Playwright pendiente)');
