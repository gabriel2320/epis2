import fs from 'node:fs/promises';
import path from 'node:path';
import { THEME_SOURCE_DIR } from './paths.mjs';
import { normalizeScheme } from './m3-roles.mjs';

export async function listMaterialThemeSourceFiles() {
  const entries = await fs.readdir(THEME_SOURCE_DIR);
  return entries
    .filter((f) => f.endsWith('.material-theme.json'))
    .map((f) => path.join(THEME_SOURCE_DIR, f));
}

export async function loadMaterialThemeSource(filePath) {
  const raw = JSON.parse(await fs.readFile(filePath, 'utf8'));
  const metadata = raw.metadata ?? {};
  const schemes = raw.schemes ?? {};
  return {
    filePath,
    metadata,
    schemes: {
      light: normalizeScheme(schemes.light ?? {}),
      dark: normalizeScheme(schemes.dark ?? {}),
    },
  };
}

export async function loadAllMaterialThemeSources() {
  const files = await listMaterialThemeSourceFiles();
  return Promise.all(files.map(loadMaterialThemeSource));
}
