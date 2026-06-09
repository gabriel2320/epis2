#!/usr/bin/env node
/** Advisory — crea carpeta de screenshots; no falla si Playwright no corre. */
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const outDir = join(root, 'reports/screenshots/classic-md3');
mkdirSync(outDir, { recursive: true });

const readme = join(outDir, 'README.md');
if (!existsSync(readme)) {
  writeFileSync(
    readme,
    `# Screenshots modo clásico MD3 (advisory)

Generar con Playwright cuando el entorno dev esté disponible:

\`\`\`bash
npm run quality:classic-screenshot-capture
\`\`\`

Rutas objetivo:
- /comando
- /espacio/ficha?mode=classic
- /espacio/evolucion?mode=classic
- /epis2/dashboard?view=classic
`,
    'utf8',
  );
}

console.log('classic-screenshot-advisory OK —', outDir);
