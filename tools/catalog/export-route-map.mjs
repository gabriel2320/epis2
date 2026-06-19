/**
 * MF-CATALOG-00 - exporta EPIS_CICA_SCREEN_REGISTRY -> JSON + ROUTE_MAP.md
 *   node tools/catalog/export-route-map.mjs
 *   node tools/catalog/export-route-map.mjs --check
 */
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const registryPath = join(root, 'packages/epis2-ui/src/cica/EPIS_CICA_SCREEN_REGISTRY.ts');
const jsonPath = join(root, 'tools/catalog/route-map.generated.json');
const mdPath = join(root, 'docs/product/EPIS2_ROUTE_MAP.md');
const checkMode = process.argv.includes('--check');

/** @param {{ id: string, layoutProfile: string, navVisible: boolean }} screen */
function classifyMode(screen) {
  if (!screen.navVisible) return 'stub';
  if (screen.layoutProfile === 'paper-mode') return 'paper';
  if (screen.layoutProfile === 'letter-document' || screen.layoutProfile === 'book-reader') {
    return 'letter';
  }
  return 'classic';
}

/** @param {{ id: string, layoutProfile: string, navVisible: boolean }} screen */
function classifyProduct(screen) {
  const mode = classifyMode(screen);
  if (mode === 'stub') return 'stub-review';
  if (mode === 'paper') return 'paper';
  if (screen.id.startsWith('new-')) return 'core-write';
  return 'core-read';
}

/** @param {string} raw */
function parseStringArray(raw) {
  return [...raw.matchAll(/'([^']+)'/g)].map((match) => match[1]);
}

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
    const primaryAction = chunk.match(/primaryAction: '([^']+)'/)?.[1];
    const layoutProfile = chunk.match(/layoutProfile: '([^']+)'/)?.[1];
    if (!screenId || !route || !intent || !layoutProfile) continue;

    const navVisible = !chunk.includes('navVisible: false');
    const blueprintSectionId = chunk.match(/blueprintSectionId: '([^']+)'/)?.[1];
    const requiredSignalsMatch = chunk.match(/requiredSignals:\s*\[([^\]]*)\]/s)?.[1];
    const classifierInput = { id: screenId, layoutProfile, navVisible };
    /** @type {Record<string, unknown>} */
    const row = {
      screenId,
      route,
      intent,
      layoutProfile,
      navVisible,
      status: navVisible ? 'KEEP_CANONICAL' : 'HIDE_STUB',
      screenMode: classifyMode(classifierInput),
      productClass: classifyProduct(classifierInput),
    };
    if (primaryAction) row.primaryAction = primaryAction;
    if (blueprintSectionId) row.blueprintSectionId = blueprintSectionId;
    if (requiredSignalsMatch) row.requiredSignals = parseStringArray(requiredSignalsMatch);
    screens.push(row);
  }
  return screens;
}

/** @param {ReturnType<typeof parseCicaScreenRegistry>} screens */
function buildArtifact(screens) {
  return {
    version: '1.1.0',
    source: 'packages/epis2-ui/src/cica/EPIS_CICA_SCREEN_REGISTRY.ts',
    generatedAt: new Date().toISOString(),
    screenCount: screens.length,
    screens,
    fallback: {
      status: 'KEEP_FALLBACK',
      prefix: '/espacio/*',
      note: 'VITE_ENABLE_CICA_UI=false - no es home operativo',
    },
  };
}

/** @param {unknown} value */
function markdownCell(value) {
  return String(value)
    .replace(/\\/g, '\\\\')
    .replace(/\|/g, '\\|')
    .replace(/\r?\n/g, ' ');
}

/** @param {ReturnType<typeof buildArtifact>} artifact */
function buildMarkdown(artifact) {
  const rows = artifact.screens
    .map(
      (s) =>
        `| ${markdownCell(s.route)} | ${markdownCell(s.screenId)} | ${markdownCell(s.status)} | ${markdownCell(s.productClass)} | ${markdownCell(s.screenMode)} | ${s.navVisible ? 'si' : 'no'} | ${markdownCell(s.layoutProfile)} | ${markdownCell(s.intent)} |`,
    )
    .join('\n');

  return `# EPIS2 - Mapa de rutas CICA

**Version:** 1.1 - **Programa:** PROG-PRODUCT-MAP - **SoT tecnico:** \`EPIS_CICA_SCREEN_REGISTRY.ts\`

> Generado por \`node tools/catalog/export-route-map.mjs\`. No editar la tabla manualmente.

## Entrada operativa

| Rol | Ruta / prefijo |
|-----|----------------|
| Entrada activa CICA | \`/app/buscar\` |
| Fallback legacy | \`/espacio/*\` (\`VITE_ENABLE_CICA_UI=false\`) |

## Regla de visibilidad y clasificacion

\`\`\`txt
KEEP_CANONICAL - navVisible !== false (sidebar CICA)
HIDE_STUB      - navVisible === false (ruta viva, sin nav)
KEEP_FALLBACK  - legacy /espacio/*

core-read     - pantalla clinica tradicional de lectura
core-write    - pantalla clinica de escritura/borrador
paper         - modo papel carta/libro
stub-review   - ruta viva sin nav; revisar antes de promover
\`\`\`

<!-- EPIS2_ROUTE_MAP:BEGIN -->
| Ruta | screenId | Estado | Clase | Modo | Nav | layoutProfile | Intencion |
|------|----------|--------|-------|------|-----|---------------|-----------|
${rows}
<!-- EPIS2_ROUTE_MAP:END -->

**Pantallas:** ${artifact.screenCount} - **Checksum JSON:** \`${artifact.checksum}\`
`;
}

function stableJson(obj) {
  return JSON.stringify(obj, null, 2) + '\n';
}

function run() {
  const ts = readFileSync(registryPath, 'utf8');
  const screens = parseCicaScreenRegistry(ts);
  if (screens.length === 0) {
    console.error('export-route-map: registry vacio');
    process.exit(1);
  }

  const artifact = buildArtifact(screens);
  const checksum = createHash('sha256')
    .update(stableJson({ screens: artifact.screens }))
    .digest('hex')
    .slice(0, 12);
  artifact.checksum = checksum;

  const jsonOut = stableJson(artifact);
  const mdOut = buildMarkdown(artifact);

  if (checkMode) {
    if (!existsSync(jsonPath)) {
      console.error('export-route-map --check: falta route-map.generated.json; ejecutar sin --check');
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
    console.log(`export-route-map --check OK - screens=${screens.length} checksum=${checksum}`);
    return;
  }

  writeFileSync(jsonPath, jsonOut);
  writeFileSync(mdPath, mdOut);
  console.log(`export-route-map OK - screens=${screens.length} checksum=${checksum}`);
}

const isCli = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isCli) run();
