#!/usr/bin/env node
/**
 * Captura screenshots advisory para MF-CLASSIC-MD3-AI (requiere dev server).
 * No bloquea CI si falla — usar quality:classic-screenshot-advisory para carpeta mínima.
 */
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const outDir = join(root, 'reports/screenshots/classic-md3');
mkdirSync(outDir, { recursive: true });

console.log(
  'classic-screenshot-capture: ejecutar Playwright manualmente cuando dev:web esté activo.',
);
console.log('Destino:', outDir);
process.exit(0);
