#!/usr/bin/env node
/**
 * Importa exportación Material Theme Builder a packages/epis2-ui/src/theme/source/.
 *
 * Uso:
 *   node scripts/theme/import-material-theme.mjs <archivo.json> <theme-id>
 *
 * Ejemplo:
 *   node scripts/theme/import-material-theme.mjs ./clinical-blue-export.json clinical-blue
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { THEME_SOURCE_DIR } from './lib/paths.mjs';
import { normalizeScheme } from './lib/m3-roles.mjs';

async function main() {
  const [inputPath, themeId] = process.argv.slice(2);
  if (!inputPath || !themeId) {
    console.error('Uso: import-material-theme.mjs <archivo.json> <theme-id>');
    process.exit(1);
  }

  const raw = JSON.parse(await fs.readFile(path.resolve(inputPath), 'utf8'));
  const seed = raw.metadata?.sourceColor ?? raw.seed ?? raw.coreColors?.primary ?? '#000000';

  const normalized = {
    description: raw.description ?? `TYPE: CUSTOM — EPIS2 ${themeId}`,
    metadata: {
      id: themeId,
      label: raw.metadata?.label ?? themeId,
      sourceColor: seed,
      importedAt: new Date().toISOString().slice(0, 10),
      source: 'material-theme-builder',
      version: raw.metadata?.version ?? '1.0',
    },
    schemes: {
      light: normalizeScheme(raw.schemes?.light ?? {}),
      dark: normalizeScheme(raw.schemes?.dark ?? {}),
    },
  };

  await fs.mkdir(THEME_SOURCE_DIR, { recursive: true });
  const dest = path.join(THEME_SOURCE_DIR, `${themeId}.material-theme.json`);
  await fs.writeFile(dest, `${JSON.stringify(normalized, null, 2)}\n`, 'utf8');
  console.log(`import-material-theme OK → ${dest}`);
  console.log('Ejecute: npm run theme:generate');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
