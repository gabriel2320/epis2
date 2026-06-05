#!/usr/bin/env node
import { loadAllMaterialThemeSources } from './lib/load-sources.mjs';

async function main() {
  const sources = await loadAllMaterialThemeSources();
  const errors = [];

  for (const source of sources) {
    const id = source.metadata.id;
    const lightKeys = Object.keys(source.schemes.light).sort();
    const darkKeys = Object.keys(source.schemes.dark).sort();
    if (JSON.stringify(lightKeys) !== JSON.stringify(darkKeys)) {
      errors.push(`${id}: roles light/dark no coinciden`);
    }
  }

  if (errors.length) {
    console.error('validate-light-dark-parity FAILED');
    for (const e of errors) console.error(`  - ${e}`);
    process.exit(1);
  }
  console.log('validate-light-dark-parity OK');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
