#!/usr/bin/env node
/** Reescribe source/*.material-theme.json con esquemas normalizados (camelCase). */
import fs from 'node:fs/promises';
import path from 'node:path';
import { loadAllMaterialThemeSources } from './lib/load-sources.mjs';

async function main() {
  const sources = await loadAllMaterialThemeSources();
  for (const source of sources) {
    const id = source.metadata.id;
    const dest = path.join(path.dirname(source.filePath), `${id}.material-theme.json`);
    const payload = {
      description: `TYPE: CUSTOM — EPIS2 ${source.metadata.label ?? id}`,
      metadata: source.metadata,
      schemes: source.schemes,
    };
    await fs.writeFile(dest, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
    console.log(`  normalized ${path.basename(dest)}`);
  }
  console.log('normalize-material-theme OK');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
