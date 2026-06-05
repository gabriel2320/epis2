#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { validateMaterialThemes } from './validate-material-theme.mjs';
import { THEME_GENERATED_DIR } from './lib/paths.mjs';

function toCamelId(id) {
  return id.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

function schemeToTsObject(scheme, indent = 2) {
  const pad = ' '.repeat(indent);
  const lines = Object.entries(scheme).map(([k, v]) => `${pad}${k}: '${v}',`);
  return `{\n${lines.join('\n')}\n}`;
}

function generateThemeModule(source) {
  const id = source.metadata.id;
  const camel = toCamelId(id);
  const constPrefix = camel;
  return `/** GENERADO — no editar. Fuente: source/${id}.material-theme.json */
import type { Epis2MaterialColorScheme } from '../contracts/material-color-scheme.js';

export const ${constPrefix}LightScheme = ${schemeToTsObject(source.schemes.light)} as const satisfies Epis2MaterialColorScheme;

export const ${constPrefix}DarkScheme = ${schemeToTsObject(source.schemes.dark)} as const satisfies Epis2MaterialColorScheme;
`;
}

function generateMetadataModule(sources) {
  const entries = sources.map((s) => {
    const m = s.metadata;
    return `  {
    id: '${m.id}',
    label: '${m.label}',
    sourceColor: '${m.sourceColor}',
    importedAt: '${m.importedAt}',
    source: 'material-theme-builder',
    version: '${m.version}',
  }`;
  });
  return `/** GENERADO — metadata de Material Theme Builder */
import type { MaterialThemeSourceMetadata } from '../contracts/material-color-scheme.js';

export const MATERIAL_THEME_METADATA: readonly MaterialThemeSourceMetadata[] = [
${entries.join(',\n')},
] as const;

export type GeneratedThemeId = (typeof MATERIAL_THEME_METADATA)[number]['id'];
`;
}

function generateIndexModule(sources) {
  const imports = sources
    .map((s) => {
      const id = s.metadata.id;
      const camel = toCamelId(id);
      return `export { ${camel}LightScheme, ${camel}DarkScheme } from './${id}.js';`;
    })
    .join('\n');
  return `${imports}
export { MATERIAL_THEME_METADATA, type GeneratedThemeId } from './theme-metadata.js';
`;
}

async function main() {
  const validation = await validateMaterialThemes();
  if (!validation.ok) {
    console.error('generate-epis2-theme: validación falló — corrija source/ primero');
    process.exit(1);
  }

  await fs.mkdir(THEME_GENERATED_DIR, { recursive: true });

  for (const source of validation.sources) {
    const id = source.metadata.id;
    const outPath = path.join(THEME_GENERATED_DIR, `${id}.ts`);
    await fs.writeFile(outPath, generateThemeModule(source), 'utf8');
    console.log(`  wrote ${path.relative(process.cwd(), outPath)}`);
  }

  await fs.writeFile(
    path.join(THEME_GENERATED_DIR, 'theme-metadata.ts'),
    generateMetadataModule(validation.sources),
    'utf8',
  );
  await fs.writeFile(
    path.join(THEME_GENERATED_DIR, 'index.ts'),
    generateIndexModule(validation.sources),
    'utf8',
  );

  console.log('generate-epis2-theme OK');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
