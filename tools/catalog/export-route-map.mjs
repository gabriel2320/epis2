/**
 * MF-CATALOG-00 — exporta EPIS_CICA_SCREEN_REGISTRY → JSON + ROUTE_MAP.md
 *   node tools/catalog/export-route-map.mjs
 *   node tools/catalog/export-route-map.mjs --check
 */
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const registryPath = join(root, 'packages/epis2-ui/src/cica/EPIS_CICA_SCREEN_REGISTRY.ts');
const jsonPath = join(root, 'tools/catalog/route-map.generated.json');
const mdPath = join(root, 'docs/product/EPIS2_ROUTE_MAP.md');
const checkMode = process.argv.includes('--check');

/** @param {string} ts */
export function parseCicaScreenRegistry(ts) {
  const start = ts.indexOf('EPIS_CICA_SCREEN_REGISTRY');
  if (start < 0) throw new Error('EPIS_CICA_SCREEN_REGISTRY no encontrado');
  const body = ts.slice(start);
  const screens = [];
  for (const chunk of body.split(/\n {2}\{\n/).slice(1)) {
    const screenId = chunk.match(/id: '([^']+)'/)?.[1];
    const route = chunk.match(/route: '([^']+)'/)?.[1];
    const intent = chunk.match(/intent: '([^']+)'/)?.[1];
    const layoutProfile = chunk.match(/layoutProfile: '([^']+)'/)?.[1];
    if (!screenId || !route || !intent || !layoutProfile) continue;
    const navVisible = !chunk.includes('navVisible: false');
    const blueprintSectionId = chunk.match(/blueprintSectionId: '([^']+)'/)?.[1];
    /** @type {Record<string, unknown>} */
    const row = {
      screenId,
      route,
      intent,
      layoutProfile,
      navVisible,
      status: navVisible ? 'KEEP_CANONICAL' : 'HIDE_STUB',
    };
    if (blueprintSectionId) row.blueprintSectionId = blueprintSectionId;
    screens.push(row);
  }
  return screens;
}

/** @param {ReturnType<typeof parseCicaScreenRegistry>} screens */
function buildArtifact(screens) {
  return {
    version: '1.0.0',
    source: 'packages/epis2-ui/src/cica/EPIS_CICA_SCREEN_REGISTRY.ts',
    generatedAt: new Date().toISOString(),
    screenCount: screens.length,
    screens,
    fallback: {
      status: 'KEEP_FALLBACK',
      prefix: '/espacio/*',
      note: 'VITE_ENABLE_CICA_UI=false — no es home operativo',
    },
  };
}

/** @param {ReturnType<typeof buildArtifact>} artifact */
function buildMarkdown(artifact) {
  const rows = artifact.screens
    .map(
      (s) =>
        `| ${s.route} | ${s.screenId} | ${s.status} | ${s.navVisible ? 'sí' : 'no'} | ${s.layoutProfile} | ${s.intent.replace(/\|/g, '\\|')} |`,
    )
    .join('\n');

  return `# EPIS2 — Mapa de rutas CICA

**Versión:** 1.0 · **Programa:** PROG-PRODUCT-MAP · **SoT técnico:** \`EPIS_CICA_SCREEN_REGISTRY.ts\`

> Generado por \`node tools/catalog/export-route-map.mjs\`. No editar la tabla manualmente.

## Entrada operativa

| Rol | Ruta / prefijo |
|-----|----------------|
| Entrada activa CICA | \`/app/buscar\` |
| Fallback legacy | \`/espacio/*\` (\`VITE_ENABLE_CICA_UI=false\`) |

## Regla de visibilidad

\`\`\`txt
KEEP_CANONICAL — navVisible !== false (sidebar CICA)
HIDE_STUB      — navVisible === false (ruta viva, sin nav)
KEEP_FALLBACK  — legacy /espacio/*
\`\`\`

<!-- EPIS2_ROUTE_MAP:BEGIN -->
| Ruta | screenId | Estado | Nav | layoutProfile | Intención |
|------|----------|--------|-----|---------------|-----------|
${rows}
<!-- EPIS2_ROUTE_MAP:END -->

**Pantallas:** ${artifact.screenCount} · **Checksum JSON:** \`${artifact.checksum}\`
`;
}

function stableJson(obj) {
  return JSON.stringify(obj, null, 2) + '\n';
}

function run() {
  const ts = readFileSync(registryPath, 'utf8');
  const screens = parseCicaScreenRegistry(ts);
  if (screens.length === 0) {
    console.error('export-route-map: registry vacío');
    process.exit(1);
  }

  const artifact = buildArtifact(screens);
  const checksum = createHash('sha256').update(stableJson({ screens: artifact.screens })).digest('hex').slice(0, 12);
  artifact.checksum = checksum;

  const jsonOut = stableJson(artifact);
  const mdOut = buildMarkdown(artifact);

  if (checkMode) {
    if (!existsSync(jsonPath)) {
      console.error('export-route-map --check: falta route-map.generated.json — ejecutar sin --check');
      process.exit(1);
    }
    const onDisk = JSON.parse(readFileSync(jsonPath, 'utf8'));
    const expected = JSON.parse(jsonOut);
    const sameScreens =
      stableJson({ screens: onDisk.screens }) === stableJson({ screens: expected.screens });
    if (!sameScreens || onDisk.screenCount !== expected.screenCount) {
      console.error('export-route-map --check: JSON desincronizado del registry');
      process.exit(1);
    }
    const md = readFileSync(mdPath, 'utf8');
    if (!md.includes('<!-- EPIS2_ROUTE_MAP:BEGIN -->') || !md.includes(checksum)) {
      console.error('export-route-map --check: EPIS2_ROUTE_MAP.md desincronizado');
      process.exit(1);
    }
    console.log(`export-route-map --check OK — screens=${screens.length} checksum=${checksum}`);
    return;
  }

  writeFileSync(jsonPath, jsonOut);
  writeFileSync(mdPath, mdOut);
  console.log(`export-route-map OK — screens=${screens.length} checksum=${checksum}`);
}

run();
