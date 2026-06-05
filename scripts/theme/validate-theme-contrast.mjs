#!/usr/bin/env node
import { loadAllMaterialThemeSources } from './lib/load-sources.mjs';
import { meetsWcagAa } from './lib/contrast.mjs';

const PAIRS = [
  ['onPrimary', 'primary'],
  ['onPrimaryContainer', 'primaryContainer'],
  ['onSecondary', 'secondary'],
  ['onSurface', 'surface'],
  ['onSurfaceVariant', 'surfaceContainer'],
  ['onError', 'error'],
];

async function main() {
  const sources = await loadAllMaterialThemeSources();
  const errors = [];

  for (const source of sources) {
    for (const mode of ['light', 'dark']) {
      const scheme = source.schemes[mode];
      for (const [fg, bg] of PAIRS) {
        if (!meetsWcagAa(scheme[fg], scheme[bg])) {
          errors.push(`${source.metadata.id} ${mode}: ${fg}/${bg} < 4.5:1`);
        }
      }
    }
  }

  if (errors.length) {
    console.error('validate-theme-contrast FAILED');
    for (const e of errors) console.error(`  - ${e}`);
    process.exit(1);
  }
  console.log('validate-theme-contrast OK');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
