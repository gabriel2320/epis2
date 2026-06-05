#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { loadAllMaterialThemeSources } from './lib/load-sources.mjs';
import { THEME_SNAPSHOTS_DIR } from './lib/paths.mjs';

async function main() {
  await fs.mkdir(THEME_SNAPSHOTS_DIR, { recursive: true });
  const sources = await loadAllMaterialThemeSources();
  const snapshot = sources.map((s) => ({
    id: s.metadata.id,
    sourceColor: s.metadata.sourceColor,
    light: s.schemes.light,
    dark: s.schemes.dark,
  }));

  const outPath = path.join(THEME_SNAPSHOTS_DIR, 'material-themes.snapshot.json');
  const next = `${JSON.stringify(snapshot, null, 2)}\n`;

  let previous = null;
  try {
    previous = await fs.readFile(outPath, 'utf8');
  } catch {
    await fs.writeFile(outPath, next, 'utf8');
    console.log('compare-theme-snapshots OK — snapshot inicial creado');
    return;
  }

  if (previous.trim() !== next.trim()) {
    console.error('compare-theme-snapshots FAILED — esquemas difieren del snapshot');
    console.error(`  Actualice con: node scripts/theme/compare-theme-snapshots.mjs --write`);
    if (process.argv.includes('--write')) {
      await fs.writeFile(outPath, next, 'utf8');
      console.log('  snapshot actualizado');
      return;
    }
    process.exit(1);
  }
  console.log('compare-theme-snapshots OK');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
