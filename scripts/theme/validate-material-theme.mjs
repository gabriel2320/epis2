#!/usr/bin/env node
import { REQUIRED_M3_ROLES } from './lib/m3-roles.mjs';
import { isHexColor, meetsWcagAa } from './lib/contrast.mjs';
import { loadAllMaterialThemeSources } from './lib/load-sources.mjs';

const CONTRAST_PAIRS = [
  ['onPrimary', 'primary'],
  ['onPrimaryContainer', 'primaryContainer'],
  ['onSurface', 'surface'],
  ['onSurfaceVariant', 'surfaceContainer'],
  ['onError', 'error'],
];

export async function validateMaterialThemes() {
  const sources = await loadAllMaterialThemeSources();
  const errors = [];

  if (sources.length === 0) {
    errors.push('No hay archivos *.material-theme.json en source/');
    return { ok: false, errors, sources };
  }

  for (const source of sources) {
    const id = source.metadata.id ?? source.filePath;
    if (!source.metadata.sourceColor || !isHexColor(source.metadata.sourceColor)) {
      errors.push(`${id}: metadata.sourceColor inválido`);
    }
    if (source.metadata.source !== 'material-theme-builder') {
      errors.push(`${id}: metadata.source debe ser material-theme-builder`);
    }

    for (const mode of ['light', 'dark']) {
      const scheme = source.schemes[mode];
      for (const role of REQUIRED_M3_ROLES) {
        if (!scheme[role]) {
          errors.push(`${id} ${mode}: falta rol obligatorio ${role}`);
        } else if (!isHexColor(scheme[role])) {
          errors.push(`${id} ${mode}: ${role} no es hex válido (${scheme[role]})`);
        }
      }
      for (const [fg, bg] of CONTRAST_PAIRS) {
        if (scheme[fg] && scheme[bg] && !meetsWcagAa(scheme[fg], scheme[bg])) {
          errors.push(`${id} ${mode}: contraste insuficiente ${fg}/${bg}`);
        }
      }
    }
  }

  return { ok: errors.length === 0, errors, sources };
}

async function main() {
  const result = await validateMaterialThemes();
  if (!result.ok) {
    console.error('validate-material-theme FAILED\n');
    for (const e of result.errors) console.error(`  - ${e}`);
    process.exit(1);
  }
  console.log(`validate-material-theme OK — ${result.sources.length} tema(s)`);
}

if (import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}`) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
