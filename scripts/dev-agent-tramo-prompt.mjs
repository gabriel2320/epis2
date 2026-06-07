#!/usr/bin/env node
/**
 * Genera prompt Cursor Agent / SDK para implementar tramo (Semana 4).
 * Uso: node scripts/dev-agent-tramo-prompt.mjs K
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const tramo = (process.argv[2] ?? process.env.EPIS2_DEV_AGENT_TRAMO ?? 'K').toUpperCase();
const mf = process.env.EPIS2_DEV_AGENT_MF ?? `MF-TRAMO-${tramo}-002`;

const planRel = `docs/product/EPIS2_TRAMO_${tramo}_PLAN.md`;
const planPath = join(root, planRel);
if (!existsSync(planPath)) {
  console.error(`dev-agent-tramo-prompt FAILED: falta ${planRel}`);
  process.exit(1);
}

const plan = readFileSync(planPath, 'utf8');
const inventoryRel = `docs/product/EPIS2_TRAMO_${tramo}_QUALITY_INVENTORY.md`;
const inventoryNote = existsSync(join(root, inventoryRel))
  ? inventoryRel
  : `docs/product/EPIS2_TRAMO_${tramo}_PHARMACY_INVENTORY.md`;

const prompt = `# EPIS2 — Prompt agente Tramo ${tramo}

Alcance: ${mf} · solo archivos del tramo ${tramo}
Canon: docs/PRODUCT_CANON.md · docs/product/PRODUCT_INVARIANTS.md
Home: Centro de Comando (/comando) — nunca dashboard como home
Patrón: docs/product/EPIS2_TRAMO_SCAFFOLD_CANON.md (1 IDC = 1 panel = 1 testid = 1 MF)

## Plan tramo

${plan.split('\n').slice(0, 45).join('\n')}

## Inventario

Leer: ${inventoryNote}

## Cierre obligatorio

1. node scripts/product/generate-idc-matrix.mjs
2. npm run quality:tramo-${tramo.toLowerCase()}-*-gate (cuando existan)
3. npm run quality:tramos-hygiene-gate
4. npm run check && npm run test && npm run db:validate
5. npm run quality:golden-journey
6. reports/epis2-tramo-${tramo.toLowerCase()}-*.md
7. No commit salvo orden explícita

## Evals IA (con dev:ai)

npm run ai:evals:tramo-${tramo.toLowerCase()}
npm run ai:evals:closure
`;

const outPath = join(root, `reports/dev-agent-prompt-tramo-${tramo}.md`);
writeFileSync(outPath, prompt, 'utf8');
console.log(`dev-agent-tramo-prompt OK → ${outPath}`);
